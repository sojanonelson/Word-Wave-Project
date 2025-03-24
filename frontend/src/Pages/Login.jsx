import React, { useState } from 'react';
import { Eye, EyeOff, Mic, Volume2, BrainCircuit, Waves } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {login} from '../services/authService'; // Import the authService
import { saveUserResponse } from '../services/generalService';
import { toast } from 'react-toastify';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(email, password);
      if (response) {
       
        saveUserResponse(response);
        toast.success('User logged in', {
                  position: 'top-right',
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
        localStorage.setItem('userID', response.userId);
        console.log('USERID:', response.userId);
       
        navigate('/dashboard');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-4">
      {/* Floating AI Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Mic className="absolute top-20 left-20 text-indigo-200 w-16 h-16 animate-pulse" />
        <Volume2 className="absolute bottom-20 right-20 text-purple-200 w-16 h-16 animate-pulse" />
        <BrainCircuit className="absolute top-1/3 right-32 text-indigo-200 w-12 h-12 animate-pulse" />
        <Waves className="absolute bottom-1/3 left-32 text-purple-200 w-12 h-12 animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <BrainCircuit className="w-10 h-10 text-indigo-600 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">Word Wave</h1>
            </div>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-2" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="forgot-password" className="text-indigo-600 hover:text-indigo-800">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transform hover:scale-[1.02] transition-all duration-200"
            >
              Sign in
            </button>
          </form>

          {/* Create Account Link */}
          <Link to='/create-account' className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <p  className="text-indigo-600 hover:text-indigo-800 font-medium">
                Create account
              </p>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
