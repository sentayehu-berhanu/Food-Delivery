import React, { useState, useEffect } from 'react';
import { Save, Store, Clock, MapPin, Phone, Mail, DollarSign, Timer } from 'lucide-react';

const DashboardSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('partnerSettings');
    if (saved) return JSON.parse(saved);
    return {
      restaurantName: 'Burger Joint',
      description: 'The best burgers in town. 100% grass-fed beef.',
      cuisineType: 'American, Fast Food',
      email: 'owner@burgerjoint.com',
      phone: '+1 234 567 8900',
      address: '123 Main St, New York, NY',
      preparationTime: '15',
      minimumOrder: '10',
      isOpen: true,
      hours: {
        monday: { open: '09:00', close: '22:00', closed: false },
        tuesday: { open: '09:00', close: '22:00', closed: false },
        wednesday: { open: '09:00', close: '22:00', closed: false },
        thursday: { open: '09:00', close: '22:00', closed: false },
        friday: { open: '09:00', close: '23:00', closed: false },
        saturday: { open: '10:00', close: '23:00', closed: false },
        sunday: { open: '10:00', close: '21:00', closed: false },
      }
    };
  });

  const handleSave = () => {
    localStorage.setItem('partnerSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const handleHourChange = (day, field, value) => {
    setSettings({
      ...settings,
      hours: {
        ...settings.hours,
        [day]: { ...settings.hours[day], [field]: value }
      }
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Restaurant Settings</h2>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-bold transition shadow-md shadow-orange-500/20 w-full sm:w-auto justify-center"
        >
          <Save size={20} /> Save Changes
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-4 shrink-0">
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'profile' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Store size={18} /> Profile Info
            </button>
            <button 
              onClick={() => setActiveTab('hours')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'hours' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Clock size={18} /> Operating Hours
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'orders' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Timer size={18} /> Order Settings
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 lg:p-8">
          
          {activeTab === 'profile' && (
            <div className="space-y-6 animation-fade-in">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Restaurant Name</label>
                  <input 
                    type="text" 
                    value={settings.restaurantName}
                    onChange={e => setSettings({...settings, restaurantName: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Cuisine Types</label>
                  <input 
                    type="text" 
                    value={settings.cuisineType}
                    onChange={e => setSettings({...settings, cuisineType: e.target.value})}
                    placeholder="e.g. Italian, Fast Food"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700">Description</label>
                  <textarea 
                    value={settings.description}
                    onChange={e => setSettings({...settings, description: e.target.value})}
                    rows="3"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition resize-none"
                  ></textarea>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mt-8">Contact & Location</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Phone size={14}/> Phone Number</label>
                  <input 
                    type="text" 
                    value={settings.phone}
                    onChange={e => setSettings({...settings, phone: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Mail size={14}/> Email Address</label>
                  <input 
                    type="email" 
                    value={settings.email}
                    onChange={e => setSettings({...settings, email: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><MapPin size={14}/> Physical Address</label>
                  <input 
                    type="text" 
                    value={settings.address}
                    onChange={e => setSettings({...settings, address: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hours' && (
            <div className="space-y-6 animation-fade-in">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900">Operating Hours</h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600">Currently Accepting Orders</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.isOpen} onChange={e => setSettings({...settings, isOpen: e.target.checked})} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(settings.hours).map(([day, times]) => (
                  <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-4 w-1/3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={!times.closed} onChange={e => handleHourChange(day, 'closed', !e.target.checked)} />
                        <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                      <span className="font-bold text-gray-700 capitalize">{day}</span>
                    </div>
                    
                    {!times.closed ? (
                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <input 
                          type="time" 
                          value={times.open}
                          onChange={e => handleHourChange(day, 'open', e.target.value)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                        />
                        <span className="text-gray-400 font-bold">to</span>
                        <input 
                          type="time" 
                          value={times.close}
                          onChange={e => handleHourChange(day, 'close', e.target.value)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                        />
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-lg">Closed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6 animation-fade-in">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Order Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 border border-gray-200 rounded-2xl bg-gray-50 flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-blue-500 shrink-0">
                    <Timer size={24} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="font-bold text-gray-900 block">Est. Prep Time (mins)</label>
                    <p className="text-xs text-gray-500">Average time to prepare an order</p>
                    <input 
                      type="number" 
                      value={settings.preparationTime}
                      onChange={e => setSettings({...settings, preparationTime: e.target.value})}
                      className="w-24 p-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition text-center font-bold"
                    />
                  </div>
                </div>

                <div className="p-5 border border-gray-200 rounded-2xl bg-gray-50 flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-green-500 shrink-0">
                    <DollarSign size={24} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="font-bold text-gray-900 block">Minimum Order</label>
                    <p className="text-xs text-gray-500">Minimum amount for delivery</p>
                    <div className="relative w-32">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">$</span>
                      <input 
                        type="number" 
                        value={settings.minimumOrder}
                        onChange={e => setSettings({...settings, minimumOrder: e.target.value})}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
