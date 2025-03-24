import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Download, Loader2, 
  Copy, Check, Trash2, Settings,
  Volume2, Languages, Clock, Pause
} from 'lucide-react';

const SpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [tempWords, setTempWords] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [recordingTime, setRecordingTime] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const recognitionRef = useRef(null);
  const textAreaRef = useRef(null);
  const timerRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis); 
  const [isSpeaking, setIsSpeaking] = useState(false); 

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'zh-CN', name: 'Chinese' },
  ];


  const handleListenToTranscript = () => {
    if (!transcript) return;

    const utterance = new SpeechSynthesisUtterance(transcript);
    utterance.lang = selectedLanguage; // Set the language for speech synthesis
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synthRef.current.speak(utterance); // Start speaking
  };

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = selectedLanguage;

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
          setTranscript(prev => prev + finalTranscript);
          setTempWords('');
        } else {
          interimTranscript += transcript;
          setTempWords(interimTranscript);
        }
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setIsPaused(false);
    };

    recognitionRef.current.onend = () => {
      if (isListening && !isPaused) {
        recognitionRef.current.start();
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isListening, isPaused, selectedLanguage]);

  useEffect(() => {
    if (isListening && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isListening, isPaused]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setIsPaused(false);
      setRecordingTime(0);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setRecordingTime(0);
    }
  };

  const togglePause = () => {
    if (isPaused) {
      recognitionRef.current.start();
      setIsPaused(false);
    } else {
      recognitionRef.current.stop();
      setIsPaused(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `speech-transcript-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setTempWords('');
    setRecordingTime(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Speech to Text</h1>
            <p className="text-gray-600">Convert your voice to text in real-time</p>
          </div>

          {/* Settings Button */}
          <div className="flex justify-end mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </motion.button>
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Languages className="w-5 h-5 mr-2" />
                    Select Language
                  </h3>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Transcript Area */}
            <div className="relative">
              <textarea
                ref={textAreaRef}
                className="w-full h-64 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                value={transcript + tempWords}
                readOnly
                placeholder="Your speech will appear here..."
              />
              
              {/* Floating Controls */}
              <div className="absolute bottom-2 right-2 p-2 space-x-2 flex">
                {transcript && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={copyToClipboard}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={downloadTranscript}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      title="Download transcript"
                    >
                      <Download className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={clearTranscript}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      title="Clear transcript"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleListenToTranscript}
                      className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                      title="Listen to transcript"
                    >
                      <Volume2 className="w-5 h-5" />
                    </motion.button>
                  </>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={toggleListening}
                  className={`p-6 rounded-full ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white transition-colors shadow-lg`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence mode="wait">
                    {isListening ? (
                      <motion.div
                        key="listening"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <MicOff className="w-8 h-8" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="not-listening"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Mic className="w-8 h-8" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {isListening && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={togglePause}
                    className={`p-4 rounded-full ${
                      isPaused ? 'bg-green-500' : 'bg-yellow-500'
                    } text-white shadow-lg`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isPaused ? <Volume2 className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                  </motion.button>
                )}
              </div>

              {/* Recording Status */}
              {isListening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="flex items-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-3 h-3 rounded-full bg-red-500 mr-2"
                    />
                    <span className="text-gray-600">
                      {isPaused ? 'Paused' : 'Recording'}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTime(recordingTime)}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechToText;