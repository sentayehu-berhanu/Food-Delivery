import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Clock, Banknote } from 'lucide-react';

const DriverHome = () => {
  const { isOnline } = useOutletContext();
  const navigate = useNavigate();

  // Mock available orders
  const [availableOrders, setAvailableOrders] = useState([
    {
      id: 'ORD-1025',
      restaurant: { name: 'Pizza House', address: 'Bole Road' },
      customer: { address: 'Gerji, Addis Ababa' },
      distance: '2.5 km',
      timeEstimate: '15 min',
      payout: 4.50
    },
    {
      id: 'ORD-1026',
      restaurant: { name: 'Burger Joint', address: 'Kazanchis' },
      customer: { address: 'CMC, Addis Ababa' },
      distance: '5.2 km',
      timeEstimate: '25 min',
      payout: 7.20
    }
  ]);

  const acceptOrder = (id) => {
    // In Phase 5 mock logic, we'll navigate to active order on accept
    navigate('/driver-dashboard/active');
  };

  if (!isOnline) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-6 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Navigation size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">You are Offline</h2>
        <p className="text-gray-500 mb-8">Go online to start receiving delivery requests in your area.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-3">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
        </div>
        <span className="font-bold text-orange-800">Finding orders near you...</span>
      </div>

      {availableOrders.length === 0 ? (
        <div className="text-center py-10 text-gray-500 font-medium">
          No available orders right now.
        </div>
      ) : (
        <div className="space-y-4">
          {availableOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-green-100 text-green-700 font-extrabold text-xl px-4 py-2 rounded-xl flex items-center gap-1">
                  <Banknote size={20} /> ${order.payout.toFixed(2)}
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{order.distance}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1"><Clock size={12}/> {order.timeEstimate}</p>
                </div>
              </div>

              <div className="relative pl-6 space-y-4 mb-6">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
                
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
                  <p className="font-bold text-gray-900 text-sm">Pickup</p>
                  <p className="text-gray-600">{order.restaurant.name}</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                  <p className="font-bold text-gray-900 text-sm">Drop-off</p>
                  <p className="text-gray-600">{order.customer.address}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setAvailableOrders(prev => prev.filter(o => o.id !== order.id))}
                  className="w-1/3 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition"
                >
                  Decline
                </button>
                <button 
                  onClick={() => acceptOrder(order.id)}
                  className="w-2/3 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark shadow-md shadow-orange-500/20 transition"
                >
                  Accept Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverHome;
