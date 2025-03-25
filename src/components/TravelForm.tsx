import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Plus, AlertCircle } from 'lucide-react';
import PackingList from './PackingList';
import DestinationSelect from './DestinationSelect';

interface TravelFormProps {
  user: any;
}

function TravelForm({ user }: TravelFormProps) {
  const [showPackingList, setShowPackingList] = useState(false);
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState<{ label: string; value: string } | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState<{
    tripName?: string;
    destination?: string;
    startDate?: string;
    endDate?: string;
  }>({});
  
  // 为表单控制动画
  const formAnimation = useAnimation();

  // 震动动画变体
  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, -5, 5, -2, 2, 0],
      transition: { duration: 0.6 }
    }
  };

  // Page animation config
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    in: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -20,
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors: {
      tripName?: string;
      destination?: string;
      startDate?: string;
      endDate?: string;
    } = {};
    
    // Validate trip name
    if (!tripName.trim()) {
      newErrors.tripName = 'Trip name is required';
    }
    
    // Validate destination
    if (!destination) {
      newErrors.destination = 'Destination is required';
    }
    
    // Validate start date
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    } else {
      const today = getTodayDate();
      if (startDate < today) {
        newErrors.startDate = 'Start date cannot be earlier than today';
      }
    }
    
    // Validate end date
    if (!endDate) {
      newErrors.endDate = 'End date is required';
    } else if (startDate && endDate < startDate) {
      newErrors.endDate = 'End date cannot be earlier than start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreatePackingList = () => {
    if (validateForm()) {
      setShowPackingList(true);
    } else {
      // 如果验证失败，触发震动动画
      formAnimation.start('shake');
    }
  };

  if (showPackingList && destination) {
    // 直接返回PackingList，不包含在任何限制宽度的容器中
    return (
      <div className="fixed top-0 left-0 w-screen h-screen flex justify-center" style={{ paddingTop: '70px' }}>
        <PackingList 
          onBack={() => setShowPackingList(false)} 
          userId={user?.id}
          tripInfo={{
            tripName,
            destination,
            startDate,
            endDate
          }}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-md"
        animate={formAnimation}
        variants={shakeVariants}
      >
        <h2 className="text-xl font-bold mb-4 text-center">Travel Planning</h2>
        
        {!user && (
          <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 text-sm">
            <p className="font-medium">Tip: Sign in to save your packing lists</p>
          </div>
        )}
        
        <div className="space-y-4">
          {/* Trip Name Field */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Trip Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 border ${errors.tripName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              placeholder="e.g. Summer Vacation 2023"
            />
            {errors.tripName && (
              <p className="mt-1 text-red-500 text-sm flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.tripName}
              </p>
            )}
          </div>
          
          {/* Destination Field */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Destination <span className="text-red-500">*</span>
            </label>
            <DestinationSelect 
              value={destination}
              onChange={(option) => setDestination(option)}
            />
            {errors.destination && (
              <p className="mt-1 text-red-500 text-sm flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.destination}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Start Date Field */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={`w-full px-3 py-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={getTodayDate()}
              />
              {errors.startDate && (
                <p className="mt-1 text-red-500 text-sm flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.startDate}
                </p>
              )}
            </div>
            
            {/* End Date Field */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={`w-full px-3 py-2 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || getTodayDate()}
              />
              {errors.endDate && (
                <p className="mt-1 text-red-500 text-sm flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>
          
          <button
            onClick={handleCreatePackingList}
            className="w-full flex items-center justify-center bg-blue-600 text-white p-2.5 rounded-md hover:bg-blue-700 transition-colors mt-2"
          >
            <Plus className="mr-2" size={18} />
            Create Packing List
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default TravelForm;