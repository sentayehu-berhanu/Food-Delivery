import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Leaf, Clock, MapPin, Info, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const RESCUE_BAGS = [
  {
    id: 'rescue_1',
    restaurantId: 'rest_1',
    restaurantName: 'Burger Joint',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    type: 'Surprise Bag',
    description: 'A mix of unsold premium burgers and sides from today\'s service.',
    originalValue: 18.00,
    price: 4.99,
    pickupWindow: '9:30 PM - 10:30 PM',
    distance: '0.8 miles',
    quantityLeft: 3,
  },
  {
    id: 'rescue_2',
    restaurantId: 'rest_3',
    restaurantName: 'Green Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    type: 'Fresh Produce Bag',
    description: 'Perfectly good salads and fresh veggies that didn\'t sell today.',
    originalValue: 15.00,
    price: 3.99,
    pickupWindow: '8:00 PM - 9:00 PM',
    distance: '1.2 miles',
    quantityLeft: 1, // Almost gone!
  },
  {
    id: 'rescue_3',
    restaurantId: 'rest_5',
    restaurantName: 'The Sweet Tooth',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    type: 'Baked Goods Bag',
    description: 'Assorted pastries, donuts, and bread baked fresh this morning.',
    originalValue: 24.00,
    price: 6.99,
    pickupWindow: '7:30 PM - 8:30 PM',
    distance: '2.5 miles',
    quantityLeft: 5,
  }
];

const RescueHub = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedBag, setSelectedBag] = useState(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  const handlePurchase = (bag) => {
    // Add to cart as a special item
    const cartItem = {
      cartId: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      id: bag.id,
      name: `${bag.restaurantName} - ${bag.type}`,
      price: bag.price,
      restaurantId: bag.restaurantId,
      image: bag.image,
      quantity: 1,
      isRescue: true,
      pickupWindow: bag.pickupWindow,
      instructions: 'Rescue Bag (Pickup Only)'
    };
    
    addToCart(cartItem);
    setSelectedBag(null);
    toast.success("Surprise Bag added to your cart!");
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-[#F7F9F6] pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto" ref={containerRef}>
        
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Food Rescue
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Save perfectly good food from going to waste. Pick up a "Surprise Bag" at the end of the day for a fraction of the price!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {RESCUE_BAGS.map(bag => (
            <div key={bag.id} className="bg-white rounded-3xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden flex flex-col">
              <div className="h-48 relative">
                <img src={bag.image} alt={bag.type} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 flex items-center gap-1 shadow-sm">
                  <MapPin size={12} className="text-green-600" /> {bag.distance}
                </div>
                {bag.quantityLeft <= 2 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm animate-pulse">
                    Only {bag.quantityLeft} left!
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-sm font-bold text-gray-500 mb-1">{bag.restaurantName}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{bag.type}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{bag.description}</p>
                
                <div className="mt-auto">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
                    <Clock size={16} className="text-gray-400" />
                    <span>Pickup: <strong>{bag.pickupWindow}</strong></span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <div className="text-2xl font-black text-green-600">${bag.price.toFixed(2)}</div>
                      <div className="text-xs text-gray-400 line-through">Value: ${bag.originalValue.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedBag(bag)}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={18} /> Reserve Bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Confirmation */}
        {selectedBag && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
              <button 
                onClick={() => setSelectedBag(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition"
              >
                ✕
              </button>
              
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Reserve Surprise Bag</h2>
              <p className="text-gray-600 mb-6">
                You are reserving a Surprise Bag from <strong>{selectedBag.restaurantName}</strong>. 
                Please note that this item is <strong>Pickup Only</strong> and must be picked up between <strong>{selectedBag.pickupWindow}</strong>.
              </p>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Total Price</span>
                  <span className="font-bold text-gray-900">${selectedBag.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-green-600 font-bold">
                  <span>You save</span>
                  <span>${(selectedBag.originalValue - selectedBag.price).toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={() => handlePurchase(selectedBag)}
                className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RescueHub;
