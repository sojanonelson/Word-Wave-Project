import React, { useState } from 'react';
import { Eye, EyeOff, Mic, Volume2, BrainCircuit, Waves, User, Upload } from 'lucide-react';
import { createAccount } from '../services/authService';
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      // Validate password match if you have confirm password
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
  
      const result = await createAccount(formData.email, formData.password, formData.name, profileImage);
      
      // Handle successful registration
      if (result) {
        // Optionally show success message
        toast.success('Account created successfully', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // Redirect to login
        navigate('/login');
      }
  
    } catch (err) {
      // Set error message for display
      setError(err.message || 'Failed to create account');
      toast.error(err.message || 'Failed to create account');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
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
        {/* Register Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <BrainCircuit className="w-10 h-10 text-indigo-600 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">Word Wave</h1>
            </div>
            <p className="text-gray-600">Create your account</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <label className="cursor-pointer flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-800">
                  <Upload size={16} />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Choose a name"
                  required
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transform hover:scale-[1.02] transition-all duration-200"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Sign in
              </a>
            </p>
          </div>

{/*          
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or register with</span>
            </div>
          </div> */}

          
          {/* <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="currentColor"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" fill="currentColor"/>
              </svg>
              Facebook
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Register;