import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeContext } from '../App';
import toast, { Toaster } from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (!nameRegex.test(formData.name)) {
      newErrors.name = 'Name must be 2-50 characters long and contain only letters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        localStorage.setItem('token', data.token);
        toast.success('Signup successful!');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        toast.error(data.message || 'Registration failed');
        setErrors({ submit: data.message || 'Registration failed' });
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' : 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100'}`}>
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-md w-full space-y-6 sm:space-y-8 p-6 sm:p-8 rounded-xl shadow-2xl backdrop-blur-sm ${theme === 'dark' ? 'bg-gray-800/30 hover:bg-gray-800/40' : 'bg-white/30 hover:bg-white/40'} transition-all duration-300 border ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'}`}
      >
        <div>
          <h2 className={`mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Create your account
          </h2>
        </div>
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-4 py-3 border ${errors.name ? 'border-red-300' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700/50 text-white' : 'bg-white/50 text-gray-900'} transition-all duration-300 hover:shadow-lg`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-4 py-3 border ${errors.email ? 'border-red-300' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700/50 text-white' : 'bg-white/50 text-gray-900'} transition-all duration-300 hover:shadow-lg`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-4 py-3 border ${errors.password ? 'border-red-300' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700/50 text-white' : 'bg-white/50 text-gray-900'} transition-all duration-300 hover:shadow-lg`}
                placeholder="Enter your password"
              />
              {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-300' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700/50 text-white' : 'bg-white/50 text-gray-900'} transition-all duration-300 hover:shadow-lg`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>}
            </div>
          </div>

          {errors.submit && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-500">{errors.submit}</p>
            </div>
          )}

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${theme === 'dark' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-xl backdrop-blur-sm`}
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </motion.button>
          </div>

          <div className="text-center">
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <motion.button
                whileHover={{ scale: 1.05 }}
                type="button"
                onClick={() => navigate('/login')}
                className={`font-medium ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'}`}
              >
                Sign in
              </motion.button>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;