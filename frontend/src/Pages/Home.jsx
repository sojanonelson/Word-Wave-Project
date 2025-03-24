import React, { useState, useEffect } from "react";

import { Mic, Volume2, ArrowRightLeft, Play, Users } from "lucide-react";
import Footer from "../Router/footer";
import { Link, useNavigate } from "react-router-dom";

import {  getUserResponse } from "../services/generalService";

const Home = () => {
  const [showFloatingScreen, setShowFloatingScreen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [name, setName] = useState();
  const navigate = useNavigate();

  const handleTryNowClick = () => {
    if(!isLoggedIn){
      alert('Please login to your account')
      navigate('/login')

    }else{
      navigate('/dashboard')

    }
    
  };

  const handleClose = () => {
    setShowFloatingScreen(false);
  };

  useEffect(() => {
    const check = () => {
      const user = getUserResponse();
      if (user) {
        setIsLoggedIn(true);
        setName(user.name);
        
      } else {
        setIsLoggedIn(false); // User is not logged in
      }
    };

    check(); // Run the check on component mount
  }, []);

  console.log("ADMIN",isLoggedIn)

  return (
    <div className="min-h-screen bg-gradient-to-br  poppins-regular from-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex justify-between items-center bg-white/70 backdrop-blur-sm">
        <div className="text-2xl font-bold text-indigo-600 poppins-bold">Word Wave</div>
        <div className="space-x-6">
          <button className="text-gray-600 hover:text-indigo-600">
            Features
          </button>

          <button className="text-gray-600 hover:text-indigo-600">Docs</button>
          {
  isLoggedIn  ? (
    <button className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800">
      {name}
    </button>
  ) : (
    <Link to="/login">
      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
        Sign In
      </button>
    </Link>
  )
}

        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-20 pb-16">
        <div className="text-center">
          <h1 className="lg:text-5xl text-3xl font-bold text-gray-900 mb-6">
            Transform Your Voice & Text with AI
          </h1>
          <p className="lg:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Advanced natural language processing tools for seamless conversion
            between speech and text, powered by cutting-edge AI technology.
          </p>
          <button
            onClick={handleTryNowClick}
            className="px-8 py-4 bg-indigo-600 text-white text-lg rounded-full 
            hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 
            shadow-lg hover:shadow-xl flex items-center mx-auto"
          >
            <Play className="mr-2" size={20} />
            Try Now for Free
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
          <FeatureCard
            icon={<Volume2 size={32} />}
            title="Text to Speech"
            description="Convert any text into natural-sounding speech with multiple voices and languages"
          />
          <FeatureCard
            icon={<Mic size={32} />}
            title="Speech to Text"
            description="Accurate real-time speech recognition with support for 50+ languages"
          />
          <FeatureCard
            icon={<ArrowRightLeft size={32} />}
            title="Translation"
            description="Seamlessly translate between languages while maintaining context and meaning"
          />
        </div>

        {/* Stats Section */}
        <div className="flex justify-center space-x-12 mt-20">
          <StatBox number="99.9%" label="Accuracy" />
          <StatBox number="50+" label="Languages" />
          <StatBox number="1M+" label="Users" />
        </div>

        {/* Contributors Section */}
        <div className="mt-24 mb-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Users className="text-indigo-600 w-8 h-8 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
            </div>
            <p className="text-gray-600 text-lg">
              Meet the talented developers behind Word Wave
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <ContributorCard name="Adithya JM" role="Developer" />
            <ContributorCard name="Blesy" role="Developer" />
            <ContributorCard name="Sabari Kumar" role="Developer" />
            <ContributorCard name="Babin Babu B" role="Developer" />
          </div>
        </div>
      </div>
      {showFloatingScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Choose an Option
            </h2>
            <div className="grid flex-row  gap-4">
              <Link to="/text-to-speech">
                <FeatureCard
                  icon={<Volume2 size={32} />}
                  title="Text to Speech"
                />
              </Link>
              <Link to="/speech-to-text">
                <FeatureCard icon={<Mic size={32} />} title="Speech to Text" />
              </Link>
              <Link to="/translation">
                <FeatureCard
                  icon={<ArrowRightLeft size={32} />}
                  title="Translation"
                />
              </Link>
            </div>
            <button
              onClick={handleClose}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StatBox = ({ number, label }) => (
  <div className="text-center">
    <div className="text-4xl font-bold text-indigo-600 mb-2">{number}</div>
    <div className="text-gray-600">{label}</div>
  </div>
);

const ContributorCard = ({ name, role }) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 text-center">
    <div className="w-20 h-20 bg-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
      <span className="text-2xl font-bold text-white">{name.charAt(0)}</span>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-1">{name}</h3>
    <p className="text-gray-600">{role}</p>
  </div>
);

export default Home;
