import React from 'react';
import { DollarSign, TrendingUp, Calendar, ArrowRight } from 'lucide-react';

const DriverEarnings = () => {
  const dailyEarnings = 84.50;
  const weeklyEarnings = 425.20;
  const tripsCompleted = 12;

  const history = [
    { id: 1, date: 'Today, 2:30 PM', amount: 8.50, type: 'Delivery' },
    { id: 2, date: 'Today, 1:15 PM', amount: 6.20, type: 'Delivery' },
    { id: 3, date: 'Today, 12:45 PM', amount: 2.00, type: 'Tip' },
    { id: 4, date: 'Today, 11:30 AM', amount: 12.40, type: 'Delivery + Surge' },
  ];

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
        <button className="text-primary hover:text-primary-dark p-2">
          <ArrowRight />
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
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{item.type}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={12} /> {item.date}
                    </p>
                  </div>
                </div>
                <span className="font-extrabold text-green-600">+${item.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverEarnings;
