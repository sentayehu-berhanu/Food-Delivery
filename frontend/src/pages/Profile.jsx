import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, MapPin, Plus, Trash2, Award } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserBadges from '../components/UserBadges';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const [addresses, setAddresses] = React.useState(() => {
    const saved = localStorage.getItem(`mockAddresses_${user.id}`);
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [isAddingAddress, setIsAddingAddress] = React.useState(false);
  const [newAddress, setNewAddress] = React.useState({ label: 'Home', fullAddress: '' });

  React.useEffect(() => {
    localStorage.setItem(`mockAddresses_${user.id}`, JSON.stringify(addresses));
  }, [addresses, user.id]);

  const [rewardPoints, setRewardPoints] = React.useState(() => {
    const saved = localStorage.getItem(`mockRewards_${user.id}`);
    return saved ? parseInt(saved, 10) : 150; // Give new users 150 points to start!
  });

  const handleAddAddress = () => {
    if (!newAddress.fullAddress) return;
    const newAddr = { ...newAddress, id: Date.now().toString() };
    setAddresses([...addresses, newAddr]);
    setNewAddress({ label: 'Home', fullAddress: '' });
    setIsAddingAddress(false);
    toast.success('Address added!');
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(a => a.id !== id));
    toast.success('Address removed.');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Profile</h1>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <User size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500 capitalize">{user.role?.toLowerCase() || 'Customer'} Account</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Email Address</p>
                <p className="font-bold text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Account Status</p>
                <p className="font-bold text-green-600">Active</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link 
              to="/orders" 
              className="flex-1 py-3 bg-primary text-white text-center font-bold rounded-xl hover:bg-primary-dark transition shadow-lg shadow-orange-500/30"
            >
              View My Orders
            </Link>
          </div>
        </div>

        {/* Loyalty & Rewards Section */}
        <div className="mt-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl shadow-sm border border-orange-200 p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-orange-500 shadow-md">
              <Award size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">FoodGo Rewards</h3>
              <p className="text-gray-600 font-medium">Earn 10 points for every $1 spent!</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Your Balance</p>
            <p className="text-4xl font-extrabold text-primary">{rewardPoints} <span className="text-xl">pts</span></p>
          </div>
        </div>

        {/* Gamification: Badges & Achievements */}
        <UserBadges />

        {/* Address Book Section */}
        <div className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="text-primary" /> Address Book
            </h3>
            {!isAddingAddress && (
              <button 
                onClick={() => setIsAddingAddress(true)}
                className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition"
              >
                <Plus size={16} /> Add New
              </button>
            )}
          </div>

          {isAddingAddress && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Label</label>
                  <select 
                    className="w-full border border-gray-200 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                    value={newAddress.label}
                    onChange={e => setNewAddress({...newAddress, label: e.target.value})}
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Address</label>
                  <input 
                    type="text"
                    placeholder="e.g. 123 Main St, Apt 4B"
                    className="w-full border border-gray-200 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                    value={newAddress.fullAddress}
                    onChange={e => setNewAddress({...newAddress, fullAddress: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setIsAddingAddress(false)}
                  className="px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddAddress}
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition"
                >
                  Save Address
                </button>
              </div>
            </div>
          )}

          {addresses.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-100 rounded-2xl">
              No saved addresses yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map(addr => (
                <div key={addr.id} className="p-4 border border-gray-100 rounded-2xl flex justify-between items-start hover:border-gray-200 transition bg-white">
                  <div>
                    <span className="inline-block px-2 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded mb-2">
                      {addr.label}
                    </span>
                    <p className="text-gray-900 font-medium">{addr.fullAddress}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Delete Address"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
