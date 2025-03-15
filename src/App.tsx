import React, { useState } from 'react';
import { UserCircle2 } from 'lucide-react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import TravelForm from './components/TravelForm';
import Profile from './components/Profile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('main'); // main, login, signup, profile
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentView('main');
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentView('main');
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
                    onClick={() => setCurrentView('login')}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setCurrentView('signup')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setCurrentView('profile')}
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
        {currentView === 'main' && <TravelForm user={user} />}
        {currentView === 'login' && (
          <LoginForm onLogin={handleLogin} onBack={() => setCurrentView('main')} />
        )}
        {currentView === 'signup' && (
          <SignupForm onSignup={() => setCurrentView('login')} onBack={() => setCurrentView('main')} />
        )}
        {currentView === 'profile' && (
          <Profile user={user} onLogout={handleLogout} onBack={() => setCurrentView('main')} />
        )}
      </main>
    </div>
  );
}

export default App;