import React, { useState, useEffect, useRef } from "react";
import { Play, Settings, Volume2, Mic, Type, MicOff, Download, Loader2 } from "lucide-react";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
);

const CardHeader = ({ children }) => <div className="p-6 pb-2">{children}</div>;

const CardTitle = ({ children, className = "" }) => (
  <h2 className={`text-xl font-semibold text-slate-900 ${className}`}>{children}</h2>
);

const CardDescription = ({ children }) => (
  <p className="text-sm text-slate-600 mt-1">{children}</p>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const TextToSpeech = () => {
  const [text, setText] = useState("This is a test message");
  const [voiceList, setVoiceList] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const audioContext = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const isStopping = useRef(false);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.responsiveVoice.getVoices();
      setVoiceList(voices);
      if (voices.length > 0) {
        setSelectedVoice(voices[0].name);
      }
    };

    if (window.responsiveVoice) {
      loadVoices();
    } else {
      console.error("ResponsiveVoice script not loaded.");
    }

    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
  }, []);

  const handleConvert = async () => {
    if (!text.trim()) {
      alert("Please enter text to convert to speech.");
      return;
    }

    setIsConverting(true);
    setAudioBlob(null);

    try {
      const dest = audioContext.current.createMediaStreamDestination();
      mediaRecorder.current = new MediaRecorder(dest.stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/wav" });
        setAudioBlob(blob);
        setIsConverting(false);
      };

      mediaRecorder.current.start();

      window.responsiveVoice.speak(text, selectedVoice, {
        rate: speed,
        pitch: pitch,
        volume: volume,
        onend: () => {
          if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
            mediaRecorder.current.stop();
          }
        },
      });
    } catch (error) {
      console.error("Error generating audio:", error);
      setIsConverting(false);
      alert("Error generating audio file. Please try again.");
    }
  };

  const handleStop = () => {
    isStopping.current = true;
    setIsConverting(false);

    // Stop media recorder if recording
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }

    // Stop the speech synthesis
    window.responsiveVoice.cancel();
  };

  const handleDownload = () => {
    if (!audioBlob) return;

    const audioUrl = URL.createObjectURL(audioBlob);
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = "speech.wav";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startListening = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        setText(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Speech recognition is not supported in your browser.");
    }
  };

  const stopListening = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-2 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 flex items-center gap-2">
              <Mic className="w-8 h-8 text-blue-600" />
              Text to Speech Studio
            </h1>
            <p className="text-slate-600 mt-2 text-sm md:text-base">
              Professional voice synthesis with advanced controls
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConverting
                    ? "bg-yellow-500 animate-pulse"
                    : isPlaying
                    ? "bg-green-500 animate-pulse"
                    : "bg-slate-400"
                }`}
              />
              <span className="text-sm font-medium text-slate-700">
                {isConverting ? "Converting" : isPlaying ? "Speaking" : "Ready"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5 text-blue-600" />
                Input Text
              </CardTitle>
              <CardDescription>Enter the text you want to convert to speech</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your text here..."
                className="w-full h-40 md:h-64 p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Voice Settings
              </CardTitle>
            </CardHeader>
          <CardContent className="space-y-6">
  {/* Previous settings content... */}
  <div>
    <label className="text-sm font-medium text-slate-700 block mb-2">Voice Selection</label>
    <select
      value={selectedVoice}
      onChange={(e) => setSelectedVoice(e.target.value)}
      className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
    >
      {voiceList.map((voice, index) => (
        <option key={index} value={voice.name}>
          {voice.name}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label className="text-sm font-medium text-slate-700 block mb-2">Speed: {speed}x</label>
    <input
      type="range"
      min="0.5"
      max="2"
      step="0.1"
      value={speed}
      onChange={(e) => setSpeed(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
    />
  </div>

  <div>
    <label className="text-sm font-medium text-slate-700 block mb-2">Pitch: {pitch}</label>
    <input
      type="range"
      min="0.5"
      max="2"
      step="0.1"
      value={pitch}
      onChange={(e) => setPitch(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
    />
  </div>

  <div>
    <label className="text-sm font-medium text-slate-700 block mb-2">
      <div className="flex items-center gap-2">
        <Volume2 className="w-4 h-4 text-slate-600" />
        Volume: {volume}
      </div>
    </label>
    <input
      type="range"
      min="0"
      max="1"
      step="0.1"
      value={volume}
      onChange={(e) => setVolume(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
    />
  </div>
</CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleConvert}
                disabled={isConverting}
                className="w-full sm:w-auto flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isConverting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Play className="w-5 h-5 mr-2" />}
                Convert to Audio
              </button>

              {isConverting && (
                <button
                  onClick={handleStop}
                  className="w-full sm:w-auto flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Stop
                </button>
              )}

              {audioBlob && (
                <button
                  onClick={handleDownload}
                  className="w-full sm:w-auto flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Audio
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TextToSpeech;
