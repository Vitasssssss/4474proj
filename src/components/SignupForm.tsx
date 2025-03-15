import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { createUser } from '../lib/api';

interface SignupFormProps {
  onSignup: () => void;
  onBack: () => void;
}

function SignupForm({ onSignup, onBack }: SignupFormProps) {
  // State for form data
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    gender: '',
    fullname: '',
    travel_preferences: '',
    item_like: ''
  });
  // State for error messages
  const [error, setError] = useState('');
  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Handle form submission for signing up
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await createUser(
          formData.username,
          formData.password,
          formData.email || undefined,
          formData.gender || undefined,
          formData.fullname || undefined,
          formData.travel_preferences || undefined,
          formData.item_like || undefined
      );
      onSignup();
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.response?.data?.error || 'An error occurred during registration. Please try again.');
    }
  };

  return (
      <div className="max-w-md mx-auto">
        {/* Back to main menu button */}
        <button
            onClick={onBack}
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Main Menu
        </button>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
          {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
          )}
          <form onSubmit={handleSubmit}>
            {/* Username field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
              />
            </div>
            {/* Password field with show/hide toggle */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
              />
              {/* Toggle button for password visibility */}
              <div className="mt-1 text-right">
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {showPassword ? 'Hide Password' : 'Show Password'}
                </button>
              </div>
            </div>
            {/* Email field (optional) */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email (optional)
              </label>
              <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            {/* Full Name field (optional) */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Full Name (optional)
              </label>
              <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.fullname}
                  onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
              />
            </div>
            {/* Gender selection (optional) */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Gender (optional)
              </label>
              <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            {/* Travel Preferences field (optional) */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Travel Preferences (optional)
              </label>
              <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={formData.travel_preferences}
                  onChange={(e) => setFormData({ ...formData, travel_preferences: e.target.value })}
                  placeholder="Enter your travel preferences..."
              />
            </div>
            {/* Private items field */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Private Items (optional)
              </label>
              <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please input your private items like sunglasses, umbrella..."
                  value={formData.item_like}
                  onChange={(e) => setFormData({ ...formData, item_like: e.target.value })}
              />
            </div>
            {/* Submit button */}
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
  );
}

export default SignupForm;
