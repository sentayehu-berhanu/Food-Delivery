import React, { useState, useEffect, useRef } from 'react';
import { Phone, MessageSquare, MapPin, Navigation, CheckCircle, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DriverActiveOrder = () => {
  const navigate = useNavigate();
  const [orderState, setOrderState] = useState('HEADING_TO_RESTAURANT'); // HEADING_TO_RESTAURANT -> AT_RESTAURANT -> HEADING_TO_CUSTOMER -> DELIVERED
  const markerRef = useRef(null);

  const [mockOrder, setMockOrder] = useState(null);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('mockLiveOrders') || '[]');
    const active = savedOrders.find(o => o.status === 'PICKED_UP' || o.status === 'PREPARING'); // Just grab the first active one for mock
    
    if (active) {
      setMockOrder({
        id: active.id,
        restaurant: { name: active.restaurantEmail?.split('@')[0] || 'Local Restaurant', address: 'Bole Road, Building 4', phone: '+251 911 234567' },
        customer: { name: active.customerName, address: 'Gerji, Condominium Block 5, Apt 2B', phone: '+251 922 345678', instructions: 'Leave at the door and ring bell.' },
        items: `${active.items} items`,
        payout: parseFloat((active.total * 0.15).toFixed(2)) || 4.50,
        originalOrder: active
      });
    } else {
      // Fallback
      setMockOrder({
        id: 'ORD-1025',
        restaurant: { name: 'Pizza House', address: 'Bole Road, Building 4', phone: '+251 911 234567' },
        customer: { name: 'John Doe', address: 'Gerji, Condominium Block 5, Apt 2B', phone: '+251 922 345678', instructions: 'Leave at the door and ring bell.' },
        items: '1x Large Pizza, 2x Coke',
        payout: 4.50
      });
    }
  }, []);

  const advanceState = () => {
    if (orderState === 'HEADING_TO_RESTAURANT') setOrderState('AT_RESTAURANT');
    else if (orderState === 'AT_RESTAURANT') setOrderState('HEADING_TO_CUSTOMER');
    else if (orderState === 'HEADING_TO_CUSTOMER') {
      setOrderState('DELIVERED');
      
      // Update in localStorage
      if (mockOrder && mockOrder.originalOrder) {
        const savedOrders = JSON.parse(localStorage.getItem('mockLiveOrders') || '[]');
        const updated = savedOrders.map(o => {
          if (o.id === mockOrder.id) {
            return { ...o, status: 'DELIVERED', driverPayout: mockOrder.payout, deliveredAt: new Date().toISOString() };
          }
          return o;
        });
        localStorage.setItem('mockLiveOrders', JSON.stringify(updated));
      }
      
      setTimeout(() => navigate('/driver-dashboard'), 2000);
    }
  };

  if (!mockOrder) return null;

  if (orderState === 'DELIVERED') {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] px-6 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Delivered!</h2>
        <p className="text-gray-500 mb-6">Great job. You earned ${mockOrder.payout.toFixed(2)}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-130px)]">
      {/* Mock Interactive Map View */}
      <div className="h-64 bg-gray-200 relative w-full overflow-hidden shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=60" 
          alt="Map view" 
          className="w-full h-full object-cover opacity-60"
        />
        
        {/* Route SVG */}
        <svg className="absolute inset-0 w-full h-full z-0" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path 
            d="M 20,80 Q 40,50 50,50 T 80,20" 
            stroke="#3b82f6" 
            strokeWidth="2" 
            fill="none" 
            strokeDasharray="4 4"
          />
          {/* Restaurant Marker */}
          <circle cx="50" cy="50" r="3" fill="#f97316" />
          {/* Customer Marker */}
          <circle cx="80" cy="20" r="3" fill="#22c55e" />
        </svg>

        {/* Animated Driver Marker */}
        <div 
          ref={markerRef}
          className="absolute z-10 w-8 h-8 bg-primary rounded-full shadow-lg border-2 border-white flex items-center justify-center text-white transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out"
          style={{
            top: orderState === 'HEADING_TO_RESTAURANT' ? '80%' : orderState === 'AT_RESTAURANT' ? '50%' : '20%',
            left: orderState === 'HEADING_TO_RESTAURANT' ? '20%' : orderState === 'AT_RESTAURANT' ? '50%' : '80%',
          }}
        >
          <Car size={16} className={orderState === 'AT_RESTAURANT' ? 'animate-pulse' : ''} />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent z-0"></div>
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <Navigation className="text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">
              {orderState === 'HEADING_TO_CUSTOMER' ? '12 mins to Customer' : '5 mins to Restaurant'}
            </p>
            <p className="text-sm text-gray-600 truncate">
              {orderState === 'HEADING_TO_CUSTOMER' ? mockOrder.customer.address : mockOrder.restaurant.address}
            </p>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="flex-1 bg-white px-4 pt-6 pb-24 relative -mt-4 rounded-t-3xl z-10 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)]">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">{mockOrder.id}</h2>
          <span className="font-extrabold text-green-600 bg-green-50 px-3 py-1 rounded-lg">${mockOrder.payout.toFixed(2)}</span>
        </div>

        {/* Current Destination Details */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-2 rounded-full ${orderState === 'HEADING_TO_CUSTOMER' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
              <MapPin size={24} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 font-medium">
                {orderState === 'HEADING_TO_CUSTOMER' ? 'Drop-off at' : 'Pick up from'}
              </p>
              <h3 className="font-bold text-lg text-gray-900">
                {orderState === 'HEADING_TO_CUSTOMER' ? mockOrder.customer.name : mockOrder.restaurant.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {orderState === 'HEADING_TO_CUSTOMER' ? mockOrder.customer.address : mockOrder.restaurant.address}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50">
              <Phone size={16} /> Call
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50">
              <MessageSquare size={16} /> Chat
            </button>
          </div>
        </div>

        {orderState === 'HEADING_TO_CUSTOMER' && mockOrder.customer.instructions && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl mb-6">
            <p className="text-xs font-bold text-yellow-800 uppercase mb-1">Delivery Instructions</p>
            <p className="text-sm text-yellow-900">{mockOrder.customer.instructions}</p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-2">Order Items</h3>
          <p className="text-gray-600 text-sm">{mockOrder.items}</p>
        </div>
      </div>

      {/* Fixed Action Button */}
      <div className="fixed bottom-[4.5rem] left-0 w-full md:w-[28rem] md:left-1/2 md:-translate-x-1/2 bg-white border-t border-gray-100 p-4 pb-6 z-20">
        <button 
          onClick={advanceState}
          className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg transition-transform active:scale-95 ${
            orderState === 'HEADING_TO_RESTAURANT' ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/30' :
            orderState === 'AT_RESTAURANT' ? 'bg-primary hover:bg-primary-dark shadow-orange-500/30' :
            'bg-green-500 hover:bg-green-600 shadow-green-500/30'
          }`}
        >
          {orderState === 'HEADING_TO_RESTAURANT' ? 'Arrived at Restaurant' :
           orderState === 'AT_RESTAURANT' ? 'Confirm Pick Up' :
           'Swipe to Complete Delivery' /* Placeholder for actual swipe UI */}
        </button>
      </div>
    </div>
  );
};

export default DriverActiveOrder;
