import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Volume2, Mic, BookOpen } from "lucide-react";

const OverviewScreen = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">
      {/* Header Section */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <h1 className="text-6xl font-extrabold text-gray-800 drop-shadow-lg">
          Welcome to Word Wave 🌊
        </h1>
        <p className="text-xl text-gray-600 mt-4">
          Unlock smarter learning with AI-powered tools.
        </p>
      </motion.div>

      {/* Features Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        {/* Text-to-Speech (TTS) */}
        <motion.div
          variants={cardVariants}
          className="bg-white/30 backdrop-blur-lg p-8 rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-300"
        >
          <div className="text-purple-700 mb-5 flex justify-center">
            <Volume2 className="h-16 w-16" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-3">
            Text-to-Speech
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Convert text into lifelike audio to learn on the go.
          </p>
          <Link to="/dashboard/tts">
            <button className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors">
              Try TTS
            </button>
          </Link>
        </motion.div>

        {/* Speech-to-Text (STT) */}
        <motion.div
          variants={cardVariants}
          className="bg-white/30 backdrop-blur-lg p-8 rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-300"
        >
          <div className="text-blue-700 mb-5 flex justify-center">
            <Mic className="h-16 w-16" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-3">
            Speech-to-Text
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Turn your speech into text for fast note-taking.
          </p>
          <Link to="/dashboard/stt">
            <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors">
              Try STT
            </button>
          </Link>
        </motion.div>

        {/* Study with AI */}
        <motion.div
          variants={cardVariants}
          className="bg-white/30 backdrop-blur-lg p-8 rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-300"
        >
          <div className="text-green-700 mb-5 flex justify-center">
            <BookOpen className="h-16 w-16" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-3">
            Study with AI
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Personalized study plans and explanations to help you ace exams.
          </p>
          <Link to="/dashboard/room">
            <button className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors">
              Start Learning
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OverviewScreen;
