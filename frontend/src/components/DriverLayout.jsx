import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Radar, Navigation, DollarSign, User, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DriverLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(true);

  const tabs = [
    { name: 'Available', path: '/driver-dashboard', icon: <Radar size={24} /> },
    { name: 'Active', path: '/driver-dashboard/active', icon: <Navigation size={24} /> },
    { name: 'Earnings', path: '/driver-dashboard/earnings', icon: <DollarSign size={24} /> },
    { name: 'Profile', path: '/driver-dashboard/profile', icon: <User size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:max-w-md mx-auto md:border-x md:border-gray-200 md:shadow-2xl relative">
      
      {/* Top Status Bar */}
      <header className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-2">
          <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <span>🛵</span> Driver
          </Link>
          
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
              isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
            {isOnline ? 'Online' : 'Offline'}
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium bg-gray-50 px-3 py-2 rounded-xl">
          <MapPin size={16} className="text-primary" />
          <span>Current: Bole, Addis Ababa</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet context={{ isOnline }} />
      </main>

      {/* Bottom Tab Navigation */}
      <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full md:w-[28rem] z-50">
        <div className="flex justify-around items-center h-16 pb-safe">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.name}
                to={tab.path}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.icon}
                <span className="text-[10px] font-bold">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default DriverLayout;
