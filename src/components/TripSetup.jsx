import React, { useState } from 'react';
import { Calendar, MapPin, Users, Thermometer } from 'lucide-react';
import { usePackingStore } from '../store/packingStore';

export function TripSetup() {
  const createNewList = usePackingStore((state) => state.createNewList);
  const [tripDetails, setTripDetails] = useState({
    name: '',
    destination: '',
    climate: 'moderate',
    startDate: '',
    endDate: '',
    travelers: {
      women: 0,
      men: 0,
      children: 0
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createNewList(tripDetails);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Plan Your Trip</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Trip Name</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={tripDetails.name}
            onChange={(e) => setTripDetails({ ...tripDetails, name: e.target.value })}
            placeholder="Summer Vacation 2025"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              <MapPin className="inline-block w-4 h-4 mr-2" />
              Destination
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={tripDetails.destination}
              onChange={(e) => setTripDetails({ ...tripDetails, destination: e.target.value })}
              placeholder="Paris, France"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              <Thermometer className="inline-block w-4 h-4 mr-2" />
              Climate
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={tripDetails.climate}
              onChange={(e) => setTripDetails({ ...tripDetails, climate: e.target.value })}
            >
              <option value="cold">Cold</option>
              <option value="moderate">Moderate</option>
              <option value="warm">Warm</option>
              <option value="hot">Hot</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              <Calendar className="inline-block w-4 h-4 mr-2" />
              Start Date
            </label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={tripDetails.startDate}
              onChange={(e) => setTripDetails({ ...tripDetails, startDate: e.target.value })}
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              <Calendar className="inline-block w-4 h-4 mr-2" />
              End Date
            </label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={tripDetails.endDate}
              onChange={(e) => setTripDetails({ ...tripDetails, endDate: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="inline-block w-4 h-4 mr-2" />
            Travelers
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500">Women</label>
              <input
                type="number"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={tripDetails.travelers.women}
                onChange={(e) => setTripDetails({
                  ...tripDetails,
                  travelers: { ...tripDetails.travelers, women: parseInt(e.target.value) }
                })}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Men</label>
              <input
                type="number"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={tripDetails.travelers.men}
                onChange={(e) => setTripDetails({
                  ...tripDetails,
                  travelers: { ...tripDetails.travelers, men: parseInt(e.target.value) }
                })}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Children</label>
              <input
                type="number"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={tripDetails.travelers.children}
                onChange={(e) => setTripDetails({
                  ...tripDetails,
                  travelers: { ...tripDetails.travelers, children: parseInt(e.target.value) }
                })}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Packing List
        </button>
      </form>
    </div>
  );
}