import React, { useState, useEffect } from 'react';
import { UserCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import TravelForm from './components/TravelForm';
import Profile from './components/Profile';
import HistoricalPlans from './components/HistoricalPlans';
import './styles/AnimatedBackground.css';

// Define page transition animations
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

interface User {
  id: string;
  email: string;
  name: string;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('main'); // main, login, signup, profile, historical
  const [user, setUser] = useState<User | null>(null);

  // Check for saved user on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData: any) => {
    // Ensure userData has an id
    if (!userData.id) {
      userData.id = Date.now().toString(); // Generate a unique ID if not provided
    }
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentView('main');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setIsLoggedIn(false);
    setCurrentView('main');
  };

  // Page transition handler
  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen">
      {/* Dynamic background layers */}
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      
      {/* Navigation bar - stays above background */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Travel Packing List</h1>
            <div className="flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => handleViewChange('login')}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium border border-black"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleViewChange('signup')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleViewChange('historical')}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Historical Plans
                  </button>
                  <button
                    onClick={() => handleViewChange('profile')}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    <UserCircle2 size={24} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full relative z-1">
        <AnimatePresence mode="wait">
          {currentView === 'main' && (
            <motion.div
              key="main"
              initial="initial"
              animate="in"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
              className="centered-container"
            >
              <div className="max-w-sm w-full">
                <TravelForm user={user} />
              </div>
            </motion.div>
          )}
          {currentView === 'login' && (
            <motion.div
              key="login"
              initial="initial"
              animate="in"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
              className="centered-container"
            >
              <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mt-8">
                <LoginForm onLogin={handleLogin} onBack={() => handleViewChange('main')} />
              </div>
            </motion.div>
          )}
          {currentView === 'signup' && (
            <motion.div
              key="signup"
              initial="initial"
              animate="in"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
              className="centered-container"
            >
              <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mt-8">
                <SignupForm onSignup={() => handleViewChange('login')} onBack={() => handleViewChange('main')} />
              </div>
            </motion.div>
          )}
          {currentView === 'profile' && (
            <motion.div
              key="profile"
              initial="initial"
              animate="in"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
              className="centered-container"
            >
              <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mt-8">
                <Profile user={user} onLogout={handleLogout} onBack={() => handleViewChange('main')} />
              </div>
            </motion.div>
          )}
          {currentView === 'historical' && user && (
            <motion.div
              key="historical"
              initial="initial"
              animate="in"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
              className="centered-container"
            >
              <div className="w-full">
                <HistoricalPlans userId={user.id} onBack={() => handleViewChange('main')} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;