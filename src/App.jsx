import React from 'react';
import { TripSetup } from './components/TripSetup';
import { usePackingStore } from './store/packingStore';

function App() {
  const currentList = usePackingStore((state) => state.currentList);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Travel Packing List</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {!currentList ? (
          <TripSetup />
        ) : (
          <div>
            <p className="text-center text-gray-600">Trip planning interface coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;