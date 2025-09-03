import React, { useState, useRef } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

// Interfaces for component props and form data
interface RegisterProps {
  onSwitchToLogin: () => void;
}

interface FormData {
  role: 'investor' | 'ideaholder';
  name: string;
  email: string;
  confirmEmail: string;
  password: string;
  primaryPhone: string;
  secondaryPhone: string;
  category: string;
  profileImage: File | null;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // State for form data
  const [formData, setFormData] = useState<FormData>({
    role: 'investor',
    name: '',
    email: '',
    confirmEmail: '',
    password: '',
    primaryPhone: '',
    secondaryPhone: '',
    category: '',
    profileImage: null,
  });

  // State for managing loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Array of categories for the select input
  const categories = [
    'IT & Technology',
    'Business & Finance',
    'Healthcare & Medicine',
    'Education & Training',
    'Real Estate',
    'Manufacturing',
    'Retail & E-commerce',
    'Entertainment & Media',
    'Food & Beverage',
    'Transportation & Logistics',
    'Energy & Environment',
    'Other'
  ];

  // Handles changes to form inputs, clearing errors as the user types
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear the specific error for this input
    if (errors[name as keyof FormData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
    // Clear any general API error
    setApiError(null);
  };

  // Handles changes to the file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      profileImage: file,
    });
  };

  // Validates the form fields before submission
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = 'Emails do not match';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.primaryPhone) {
      newErrors.primaryPhone = 'Primary phone is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handles form submission, including API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form before attempting submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError(null);

    // Prepare data for the API call
    const dataToSubmit = {
      role: formData.role,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      primaryPhone: formData.primaryPhone,
      secondaryPhone: formData.secondaryPhone,
      category: formData.category,
    };

    try {
      const response = await axiosInstance.post('/auth/Register', dataToSubmit);

      // Handle successful registration
      console.log('Registration successful!', response.data);
      
      // Check the user's role and redirect accordingly
      if (formData.role === 'investor') {
        // Redirect to the Login page for investors
        onSwitchToLogin();
      } else if (formData.role === 'ideaholder') {
        // Redirect to the Pricing page for idea holders
        navigate('/subscription');
      }

    } catch (error: any) {
      // Handle network errors or specific API errors
      if (error.response) {
        setApiError(error.response.data.message || 'Registration failed.');
      } else if (error.request) {
        setApiError('No response received from server. Please try again.');
      } else {
        setApiError(error.message);
      }
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Triggers the hidden file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-300">
            Join our platform as an Investor or Idea Holder
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General API error message */}
            {apiError && (
              <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-center">
                {apiError}
              </div>
            )}

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'investor' })}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  formData.role === 'investor'
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40'
                }`}
              >
                <div className="text-center">
                  <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <div className="font-medium">Investor</div>
                  <div className="text-sm opacity-75">Fund innovative ideas</div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'ideaholder' })}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  formData.role === 'ideaholder'
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40'
                }`}
              >
                <div className="text-center">
                  <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <div className="font-medium">Idea Holder</div>
                  <div className="text-sm opacity-75">Share your innovations</div>
                </div>
              </button>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.name ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-200 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.category ? 'border-red-500' : 'border-white/20'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category} className="bg-gray-800 text-white">
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category}</p>}
              </div>
            </div>

            {/* Email Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-200 mb-2">
                  Confirm Email *
                </label>
                <input
                  type="email"
                  id="confirmEmail"
                  name="confirmEmail"
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.confirmEmail ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="Confirm your email"
                />
                {errors.confirmEmail && <p className="mt-1 text-sm text-red-400">{errors.confirmEmail}</p>}
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  errors.password ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="Create a strong password"
              />
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
              <p className="mt-1 text-xs text-gray-400">Password must be at least 8 characters long</p>
            </div>

            {/* Phone Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="primaryPhone" className="block text-sm font-medium text-gray-200 mb-2">
                  Primary Phone *
                </label>
                <input
                  type="tel"
                  id="primaryPhone"
                  name="primaryPhone"
                  value={formData.primaryPhone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.primaryPhone ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="Enter primary phone"
                />
                {errors.primaryPhone && <p className="mt-1 text-sm text-red-400">{errors.primaryPhone}</p>}
              </div>

              <div>
                <label htmlFor="secondaryPhone" className="block text-sm font-medium text-gray-200 mb-2">
                  Secondary Phone
                </label>
                <input
                  type="tel"
                  id="secondaryPhone"
                  name="secondaryPhone"
                  value={formData.secondaryPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter secondary phone (optional)"
                />
              </div>
            </div>

            {/* Profile Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Profile Image
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white/10 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center">
                  {formData.profileImage ? (
                    <img
                      src={URL.createObjectURL(formData.profileImage)}
                      alt="Profile preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
                  >
                    Choose Image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG or GIF. Max 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-300">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;