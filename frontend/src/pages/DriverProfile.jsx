import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Car, Star, Settings, LogOut, Bell, ChevronRight, Edit2 } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DriverProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    phone: '+251 911 234567',
    vehicleType: 'Motorcycle',
    vehicleModel: 'Honda CG125',
    licensePlate: 'AA-12345'
  });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSave = () => {
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <button 
          onClick={handleSave}
          className="text-primary font-bold text-sm bg-orange-50 px-4 py-2 rounded-xl"
        >
          Save
        </button>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 overflow-hidden border-4 border-white shadow-md">
            <User size={40} />
          </div>
          <button 
            className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-dark transition"
            onClick={() => setShowSettingsModal(true)}
          >
            <Edit2 size={14} />
          </button>
        </div>
        <h2 className="text-xl font-bold text-gray-900">{profileData.name}</h2>
        <p className="text-gray-500 text-sm mb-4">{user.email}</p>
        
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-bold">
          <Shield size={16} />
          Verified Driver
        </div>
      </div>

      {/* Driver Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <div className="w-10 h-10 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mb-2">
            <Star size={20} className="fill-yellow-500" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">4.9</p>
          <p className="text-xs text-gray-500 font-medium">Rating</p>
        </div>
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-2">
            <Car size={20} />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">142</p>
          <p className="text-xs text-gray-500 font-medium">Deliveries</p>
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Car size={18} className="text-primary" /> Vehicle Details
          </h3>
          <button 
            className="text-primary text-sm font-bold"
            onClick={() => setShowSettingsModal(true)}
          >
            Edit
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Vehicle Type</span>
            <span className="font-bold text-gray-900 text-sm">{profileData.vehicleType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Model</span>
            <span className="font-bold text-gray-900 text-sm">{profileData.vehicleModel}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">License Plate</span>
            <span className="font-bold text-gray-900 text-sm bg-gray-100 px-2 py-1 rounded">{profileData.licensePlate}</span>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <h3 className="font-bold text-gray-900 p-4 border-b border-gray-50">Settings</h3>
        
        <div className="divide-y divide-gray-50">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500">
                <Bell size={18} />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Push Notifications</p>
                <p className="text-xs text-gray-500">New orders, tips, messages</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <button 
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
            onClick={() => setShowSettingsModal(true)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500">
                <Settings size={18} />
              </div>
              <p className="font-medium text-gray-900 text-sm">Account Settings</p>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Logout */}
      <button 
        onClick={handleLogout}
        className="w-full bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center justify-center gap-2 text-red-500 font-bold hover:bg-red-50 transition"
      >
        <LogOut size={20} />
        Log Out
      </button>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Account Settings</h2>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                />
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Vehicle Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Vehicle Type</label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
                      value={profileData.vehicleType}
                      onChange={(e) => setProfileData({...profileData, vehicleType: e.target.value})}
                    >
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="Car">Car</option>
                      <option value="Bicycle">Bicycle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Vehicle Model</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
                      value={profileData.vehicleModel}
                      onChange={(e) => setProfileData({...profileData, vehicleModel: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">License Plate</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition uppercase"
                      value={profileData.licensePlate}
                      onChange={(e) => setProfileData({...profileData, licensePlate: e.target.value.toUpperCase()})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                className="flex-1 py-3 text-gray-500 font-bold bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                onClick={() => setShowSettingsModal(false)}
              >
                Cancel
              </button>
              <button 
                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:bg-primary-dark transition"
                onClick={() => {
                  setShowSettingsModal(false);
                  toast.success('Account settings saved!');
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DriverProfile;
