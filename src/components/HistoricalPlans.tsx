import { ArrowLeft } from 'lucide-react';

interface HistoricalPlansProps {
  plans: any[];
  onBack: () => void;
}

function HistoricalPlans({ plans, onBack }: HistoricalPlansProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="mr-2" size={20} />
        Back to Profile
      </button>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Historical Travel Plans</h2>
        {plans.length === 0 ? (
          <p className="text-gray-600">No historical plans found.</p>
        ) : (
          <div className="space-y-6">
            {plans.map((plan, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2">{plan.tripName}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Destination</p>
                    <p className="font-medium">{plan.destination}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Climate</p>
                    <p className="font-medium">{plan.climate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Dates</p>
                    <p className="font-medium">
                      {plan.startDate} - {plan.endDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Travelers</p>
                    <p className="font-medium">
                      Women: {plan.women}, Men: {plan.men}, Children: {plan.children}
                    </p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-2">
                  Created: {new Date(plan.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoricalPlans;