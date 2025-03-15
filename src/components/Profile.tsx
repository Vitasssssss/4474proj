import React, { useState, useEffect } from 'react';
import { ArrowLeft, History } from 'lucide-react';
import { updateUser, getTravelPlans } from '../lib/api';
import HistoricalPlans from './HistoricalPlans';

interface ProfileProps {
  user: any;
  onLogout: () => void;
  onBack: () => void;
}

function Profile({ user, onLogout, onBack }: ProfileProps) {
  const [formData, setFormData] = useState({
    uid: user?.uid || '',
    email: user?.email || '',
    fullname: user?.fullname || '',
    gender: user?.gender || '',
    travel_preferences: user?.travel_preferences || '',
    item_like: user?.item_like || ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showHistoricalPlans, setShowHistoricalPlans] = useState(false);
  const [historicalPlans, setHistoricalPlans] = useState([]);

  useEffect(() => {
    if (showHistoricalPlans) {
      loadHistoricalPlans();
    }
  }, [showHistoricalPlans]);

  const loadHistoricalPlans = async () => {
    try {
      const plans = await getTravelPlans(user.id);
      setHistoricalPlans(plans);
    } catch (err) {
      console.error('Failed to load historical plans:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const updatedUser = await updateUser(
          user.uid,  // 从 user 对象中获取 uid
          formData.email || undefined,
          formData.gender || undefined,
          formData.fullname || undefined,
          formData.travel_preferences || undefined,
          formData.item_like || undefined
      );

      if (updatedUser) {
        setSuccess('Profile updated successfully!');
      }
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.response?.data?.error || 'An error occurred while updating your profile. Please try again.');
    }
  };

  if (showHistoricalPlans) {
    return (
        <HistoricalPlans
            plans={historicalPlans}
            onBack={() => setShowHistoricalPlans(false)}
        />
    );
  }

  return (
      <div className="max-w-md mx-auto">
        <button
            onClick={onBack}
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Main Menu
        </button>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Profile Settings</h2>
          {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
          )}
          {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
              <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  value={user?.username}
                  disabled
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
              <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.fullname}
                  onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
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
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Travel Preferences</label>
              <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={formData.travel_preferences}
                  onChange={(e) => setFormData({ ...formData, travel_preferences: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Item Like (comma-separated)</label>
              <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.item_like}
                  onChange={(e) => setFormData({ ...formData, item_like: e.target.value })}
                  placeholder="e.g. hiking, biking, swimming"
              />
            </div>
            <div className="space-y-4">
              <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
              <button
                  type="button"
                  onClick={() => setShowHistoricalPlans(true)}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
              >
                <History className="mr-2" size={20} />
                View Historical Plans
              </button>
              <button
                  type="button"
                  onClick={onLogout}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Sign Out
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}

export default Profile;
