import React, { useState } from 'react';
import { UserCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import TravelForm from './components/TravelForm';
import Profile from './components/Profile';

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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('main'); // main, login, signup, profile
  const [user, setUser] = useState(null);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentView('main');
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentView('main');
  };

  // Page transition handler
  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Travel Packing List</h1>
            <div className="flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => handleViewChange('login')}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
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
                <button
                  onClick={() => handleViewChange('profile')}
                  className="text-gray-700 hover:text-gray-900"
                >
                  <UserCircle2 size={24} />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'main' && (
            <motion.div
              key="main"
              initial="initial"
              animate="in"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <TravelForm user={user} />
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
            >
              <LoginForm onLogin={handleLogin} onBack={() => handleViewChange('main')} />
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
            >
              <SignupForm onSignup={() => handleViewChange('login')} onBack={() => handleViewChange('main')} />
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
            >
              <Profile user={user} onLogout={handleLogout} onBack={() => handleViewChange('main')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;