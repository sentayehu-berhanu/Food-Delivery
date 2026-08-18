import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const DriverEarnings = () => {
  const [history, setHistory] = useState([]);
  const [dailyEarnings, setDailyEarnings] = useState(0);
  const [tripsCompleted, setTripsCompleted] = useState(0);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [accountDetail, setAccountDetail] = useState('');
  
  // Static weekly for mock purposes, base it slightly off daily
  const weeklyEarnings = hasCashedOut ? 0 : (dailyEarnings > 0 ? dailyEarnings + 340.20 : 425.20);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('mockLiveOrders') || '[]');
    
    // Find all delivered orders that have a driverPayout
    const delivered = savedOrders.filter(o => o.status === 'DELIVERED' && o.driverPayout);
    
    // Sort by most recent
    delivered.sort((a, b) => new Date(b.deliveredAt || 0) - new Date(a.deliveredAt || 0));

    let total = 0;
    const formattedHistory = delivered.map(o => {
      total += o.driverPayout;
      return {
        id: o.id,
        date: o.deliveredAt ? new Date(o.deliveredAt).toLocaleString([], {hour: '2-digit', minute:'2-digit', month: 'short', day: 'numeric'}) : 'Recently',
        amount: o.driverPayout,
        type: 'Delivery'
      };
    });

    // Add some mock history so it's never completely empty
    if (formattedHistory.length === 0) {
      formattedHistory.push(
        { id: 'm1', date: 'Yesterday, 2:30 PM', amount: 8.50, type: 'Delivery' },
        { id: 'm2', date: 'Yesterday, 1:15 PM', amount: 6.20, type: 'Delivery' }
      );
      total = 14.70;
    }

    setHistory(formattedHistory);
    setDailyEarnings(total);
    setTripsCompleted(delivered.length > 0 ? delivered.length : 2); // mock 2 if empty
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>

      <div className="bg-primary rounded-3xl p-6 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none"></div>
        <p className="text-orange-100 font-medium mb-1">Today's Earnings</p>
        <h2 className="text-5xl font-extrabold mb-6">${dailyEarnings.toFixed(2)}</h2>
        
        <div className="flex gap-4">
          <div className="bg-black/10 px-4 py-2 rounded-xl flex-1 backdrop-blur-sm">
            <p className="text-xs text-orange-100 uppercase tracking-wider mb-1 font-bold">Trips</p>
            <p className="font-bold text-xl">{tripsCompleted}</p>
          </div>
          <div className="bg-black/10 px-4 py-2 rounded-xl flex-1 backdrop-blur-sm">
            <p className="text-xs text-orange-100 uppercase tracking-wider mb-1 font-bold">Time</p>
            <p className="font-bold text-xl">4h 20m</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
            <DollarSign />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">This Week</p>
            <p className="font-bold text-lg text-gray-900">${weeklyEarnings.toFixed(2)}</p>
          </div>
        </div>
        <button 
          className="text-primary hover:text-primary-dark p-2 font-bold flex items-center gap-2 border-2 border-primary px-4 py-1.5 rounded-lg"
          onClick={() => {
            if (dailyEarnings > 0 || weeklyEarnings > 0) {
              setShowModal(true);
            } else {
              toast.error("No funds available to cash out.");
            }
          }}
        >
          Cash Out <ArrowRight size={16} />
        </button>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">Recent Activity</h3>
          <button className="text-sm text-primary font-bold">See All</button>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {history.map((item) => (
              <div key={item.id} className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${item.type === 'Cash Out' ? 'bg-red-50 text-red-400' : 'bg-gray-50 text-gray-400'} rounded-full flex items-center justify-center`}>
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{item.type}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={12} /> {item.date}
                    </p>
                  </div>
                </div>
                <span className={`font-extrabold ${item.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {item.amount < 0 ? '' : '+'}${Math.abs(item.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cash Out Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Select Transfer Method</h2>
            
            <div className="space-y-3 mb-6">
              {['Bank Transfer', 'Mobile Money', 'PayPal'].map(method => (
                <label key={method} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${selectedMethod === method ? 'border-primary bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}>
                  <input 
                    type="radio" 
                    name="cashOutMethod"
                    value={method}
                    className="w-4 h-4 text-primary focus:ring-primary"
                    checked={selectedMethod === method}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                  />
                  <span className="font-bold text-gray-700">{method}</span>
                </label>
              ))}
            </div>

            {selectedMethod && (
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  {selectedMethod === 'Bank Transfer' && 'Bank Account Number'}
                  {selectedMethod === 'Mobile Money' && 'Mobile Phone Number'}
                  {selectedMethod === 'PayPal' && 'PayPal Email Address'}
                </label>
                <input 
                  type="text" 
                  placeholder={
                    selectedMethod === 'Bank Transfer' ? 'e.g. 1000123456789' :
                    selectedMethod === 'Mobile Money' ? 'e.g. +251 911 234567' :
                    'e.g. driver@example.com'
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
                  value={accountDetail}
                  onChange={(e) => setAccountDetail(e.target.value)}
                />
              </div>
            )}

            <div className="flex gap-3">
              <button 
                className="flex-1 py-3 text-gray-500 font-bold bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                onClick={() => {
                  setShowModal(false);
                  setSelectedMethod('');
                  setAccountDetail('');
                }}
              >
                Cancel
              </button>
              <button 
                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:bg-primary-dark transition disabled:opacity-50 disabled:shadow-none"
                disabled={!selectedMethod || !accountDetail.trim()}
                onClick={() => {
                  setHasCashedOut(true);
                  setDailyEarnings(0);
                  setHistory([
                    { id: 'cashout', date: 'Just now', amount: -(dailyEarnings + weeklyEarnings), type: `Cash Out (${selectedMethod})` },
                    ...history
                  ]);
                  toast.success(`Funds sent to ${accountDetail}!`);
                  setShowModal(false);
                  setSelectedMethod('');
                  setAccountDetail('');
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DriverEarnings;
