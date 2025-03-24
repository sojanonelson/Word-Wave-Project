import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Compass } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Main Content Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-purple-500" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-100 rounded-full opacity-50" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-100 rounded-full opacity-50" />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Error Code */}
            <div className="flex justify-center mb-8">
              <div className="text-8xl md:text-9xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600">
                  404
                </span>
              </div>
            </div>

            {/* Main Message */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Page Not Found
              </h1>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                Oops! It seems you've ventured into uncharted territory. 
                The page you're looking for has gone exploring.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
              <Link 
                to="/"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all duration-200 group"
              >
                <Home className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-200" />
                <span>Return Home</span>
              </Link>
              <button 
                onClick={() => window.history.back()}
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-violet-600 text-violet-600 rounded-lg hover:bg-violet-50 transition-all duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span>Go Back</span>
              </button>
            </div>

           

            {/* Brand Footer */}
            <div className="mt-12 text-center">
              <div className="flex items-center justify-center gap-2">
                <Compass className="w-6 h-6 text-violet-600 animate-pulse" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600">
                  Word Wave
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;