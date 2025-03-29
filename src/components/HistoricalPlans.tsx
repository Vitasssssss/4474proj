import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Trash2 } from 'lucide-react';
import PackingList from './PackingList';

interface HistoricalPlan {
  id: string;
  tripName: string;
  destination: { label: string; value: string };
  startDate: string;
  endDate: string;
  items: any[];
  activities: any[];
  createdAt: string;
}

interface HistoricalPlansProps {
  onBack: () => void;
  userId: string;
}

function HistoricalPlans({ onBack, userId }: HistoricalPlansProps) {
  const [plans, setPlans] = useState<HistoricalPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<HistoricalPlan | null>(null);

  // Function to load plans from localStorage
  const loadPlans = () => {
    const savedPlans = localStorage.getItem(`plans_${userId}`);
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans));
    }
  };

  // Load plans on component mount
  useEffect(() => {
    loadPlans();
  }, [userId]);

  const handleDeletePlan = (planId: string) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      const updatedPlans = plans.filter(plan => plan.id !== planId);
      setPlans(updatedPlans);
      localStorage.setItem(`plans_${userId}`, JSON.stringify(updatedPlans));
    }
  };

  // Handle successful save
  const handleSaveSuccess = () => {
    loadPlans(); // Reload plans after successful save
    setSelectedPlan(null); // Close the editing view
  };

  if (selectedPlan) {
    return (
      <PackingList
        onBack={() => setSelectedPlan(null)}
        userId={userId}
        tripInfo={{
          tripName: selectedPlan.tripName,
          destination: selectedPlan.destination,
          startDate: selectedPlan.startDate,
          endDate: selectedPlan.endDate
        }}
        initialItems={selectedPlan.items}
        initialActivities={selectedPlan.activities}
        planId={selectedPlan.id}
        onSaveSuccess={handleSaveSuccess}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <button
          onClick={onBack}
          className="flex items-center text-white bg-slate-700 hover:bg-slate-800 px-4 py-2 rounded-md"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Historical Plans</h2>
        
        {plans.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No historical plans
          </div>
        ) : (
          <div className="grid gap-4">
            {plans.map(plan => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{plan.tripName}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Destination: </span>
                        {plan.destination.label}
                      </div>
                      <div>
                        <span className="font-medium">Dates: </span>
                        {plan.startDate} to {plan.endDate}
                      </div>
                      <div>
                        <span className="font-medium">Created: </span>
                        {new Date(plan.createdAt).toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Items: </span>
                        {plan.items.length}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedPlan(plan)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <Calendar size={18} className="mr-2" />
                      View
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center"
                    >
                      <Trash2 size={18} className="mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoricalPlans;