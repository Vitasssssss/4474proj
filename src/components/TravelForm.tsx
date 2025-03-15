import React, { useState } from 'react';
import axios from "axios";
import DestinationSelect from './DestinationSelect.tsx';

interface TravelFormProps {
  user?: any;
}

function TravelForm({ user }: TravelFormProps) {
  const [formData, setFormData] = useState({
    tripName: '',
    destination: '',
    climate: 'Moderate',
    startDate: '',
    endDate: '',
    women: 0,
    men: 0,
    children: 0,
    climate_data: '',
    packing_list: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!user) return;
    try {
      // Existing axios call in handleSubmit remains correct:
      await axios.post('/api/create-packing-list', {
        username: user.id,
        trip_name: formData.tripName,
        destination: formData.destination,
        start_date: formData.startDate,
        end_date: formData.endDate,
        women: formData.women,
        men: formData.men,
        children: formData.children,
        climate_data: formData.climate  // ensure this matches backend expectations
      });
    } catch (err) {
      console.error('Failed to create packing list:', err);
      setError('Failed to generate packing list. Please try again.');
    }
  };

  const handleSelectDestination = (formatted: string) => {
    setFormData({ ...formData, destination: formatted });
  };

  return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Plan Your Trip</h2>
          {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
          )}
          {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tripName">
                Trip Name
              </label>
              <input
                  type="text"
                  id="tripName"
                  placeholder="New Trip"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.tripName}
                  onChange={(e) => setFormData({...formData, tripName: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="destination">
                  Destination
                </label>
                <DestinationSelect onSelectDestination={handleSelectDestination} />
              </div>


              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="climate">
                  Climate
                </label>
                <select
                    id="climate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.climate}
                    onChange={(e) => setFormData({...formData, climate: e.target.value})}
                >
                  <option value="Cold">Cold</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Hot">Hot</option>
                  <option value="Tropical">Tropical</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
                  Start Date
                </label>
                <input
                    type="date"
                    id="startDate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
                  End Date
                </label>
                <input
                    type="date"
                    id="endDate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Travelers</label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="women">
                    Women
                  </label>
                  <input
                      type="number"
                      id="women"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.women}
                      onChange={(e) => setFormData({...formData, women: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="men">
                    Men
                  </label>
                  <input
                      type="number"
                      id="men"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.men}
                      onChange={(e) => setFormData({...formData, men: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="children">
                    Children
                  </label>
                  <input
                      type="number"
                      id="children"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.children}
                      onChange={(e) => setFormData({...formData, children: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Packing List
            </button>
          </form>
        </div>
      </div>
  );
}

export default TravelForm;