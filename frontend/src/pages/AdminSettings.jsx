import React, { useState } from 'react';
import { Settings, Shield, Bell, CreditCard, Save } from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    platformName: 'FoodGo',
    serviceFee: '10',
    deliveryRadius: '15',
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
    autoApproveRestaurants: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Platform Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Manage global configuration for the FoodGo platform.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold transition shadow-md disabled:opacity-70"
        >
          <Save size={20} /> {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 space-y-2">
          <button 
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'general' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Settings size={20} /> General
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Shield size={20} /> Security
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Bell size={20} /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab('billing')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'billing' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <CreditCard size={20} /> Billing & Fees
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">General Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Platform Name</label>
                  <input 
                    type="text" 
                    name="platformName"
                    value={settings.platformName}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Default Delivery Radius (km)</label>
                  <input 
                    type="number" 
                    name="deliveryRadius"
                    value={settings.deliveryRadius}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      name="maintenanceMode"
                      className="sr-only" 
                      checked={settings.maintenanceMode}
                      onChange={handleChange}
                    />
                    <div className={`block w-14 h-8 rounded-full transition-colors ${settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${settings.maintenanceMode ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Maintenance Mode</div>
                    <div className="text-sm text-gray-500">Temporarily disable customer access to the platform.</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Billing & Fees</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Platform Service Fee (%)</label>
                  <input 
                    type="number" 
                    name="serviceFee"
                    value={settings.serviceFee}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
                  />
                  <p className="text-xs text-gray-500 mt-2">The percentage cut taken from each restaurant order.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Security</h3>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      name="autoApproveRestaurants"
                      className="sr-only" 
                      checked={settings.autoApproveRestaurants}
                      onChange={handleChange}
                    />
                    <div className={`block w-14 h-8 rounded-full transition-colors ${settings.autoApproveRestaurants ? 'bg-primary' : 'bg-gray-200'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${settings.autoApproveRestaurants ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Auto-Approve Restaurants</div>
                    <div className="text-sm text-gray-500">Allow restaurants to go live immediately upon registration.</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Admin Notifications</h3>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary rounded focus:ring-primary border-gray-300"
                  />
                  <span className="font-bold text-gray-700">Email alerts for critical system errors</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="smsNotifications"
                    checked={settings.smsNotifications}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary rounded focus:ring-primary border-gray-300"
                  />
                  <span className="font-bold text-gray-700">SMS alerts for critical system errors</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
