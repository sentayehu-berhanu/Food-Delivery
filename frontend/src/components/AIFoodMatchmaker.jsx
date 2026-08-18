import React, { useState } from 'react';
import { Sparkles, Brain, ArrowRight, X, Heart, Frown, Coffee, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import FoodCard from './FoodCard';

const AIFoodMatchmaker = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState('select-mood'); // 'select-mood', 'thinking', 'result'
  const [selectedMood, setSelectedMood] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const moods = [
    { id: 'hangry', name: 'Hangry', icon: <Frown size={24} />, color: 'bg-red-100 text-red-600' },
    { id: 'comfort', name: 'Comfort', icon: <Heart size={24} />, color: 'bg-pink-100 text-pink-600' },
    { id: 'tired', name: 'Tired', icon: <Coffee size={24} />, color: 'bg-blue-100 text-blue-600' },
    { id: 'energized', name: 'Energized', icon: <Zap size={24} />, color: 'bg-yellow-100 text-yellow-600' }
  ];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setStep('thinking');
    
    // Simulate AI thinking
    setTimeout(() => {
      // Provide a mock recommendation based on mood
      let foodItem = {
        id: `ai-${Date.now()}`,
        restaurantId: '1',
        name: 'The Ultimate AI Burger',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
        calories: '🔥 850 kcal',
        dietary: [],
        description: 'Selected just for you by our AI based on your mood!',
        status: 'Available'
      };

      if (mood.id === 'comfort') {
        foodItem.name = 'Truffle Mac & Cheese';
        foodItem.image = 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=500&auto=format&fit=crop&q=60';
      } else if (mood.id === 'tired') {
        foodItem.name = 'Double Espresso & Pastry';
        foodItem.image = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60';
      } else if (mood.id === 'energized') {
        foodItem.name = 'Superfood Power Bowl';
        foodItem.image = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60';
      }

      setRecommendation(foodItem);
      setStep('result');
    }, 2500);
  };

  const handleAddToCart = (food) => {
    const cartItem = {
      foodId: food.id,
      name: food.name,
      basePrice: food.price,
      size: null,
      toppings: [],
      sauce: null,
      instructions: '',
      quantity: 1,
      totalPrice: food.price,
      restaurantEmail: 'ai@foodgo.com' // Mock email for AI items
    };
    addToCart(cartItem);
    setIsModalOpen(false);
    navigate('/cart');
  };

  return (
    <>
      {/* Banner */}
      <div 
        onClick={() => { setIsModalOpen(true); setStep('select-mood'); }}
        className="mb-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-6 sm:p-8 cursor-pointer transform hover:scale-[1.01] transition-transform shadow-xl shadow-purple-500/20 relative overflow-hidden group"
      >
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity"></div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
              <Sparkles className="text-white" size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-white mb-1">AI Food Matchmaker</h3>
              <p className="text-white/90">Don't know what to eat? Let AI decide for you.</p>
            </div>
          </div>
          <button className="bg-white text-purple-600 font-bold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-gray-50 transition shadow-lg shrink-0">
            Find My Match <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md relative shadow-2xl overflow-hidden">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full p-2 transition z-20"
            >
              <X size={20} />
            </button>

            {step === 'select-mood' && (
              <div className="animate-fade-in-up">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="text-indigo-600" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">How are you feeling?</h2>
                  <p className="text-gray-500 text-sm">Select your current mood and we'll find the perfect meal for you.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {moods.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood)}
                      className="border border-gray-100 hover:border-purple-200 bg-gray-50 hover:bg-purple-50 p-4 rounded-2xl transition flex flex-col items-center gap-3"
                    >
                      <div className={`p-3 rounded-xl ${mood.color}`}>
                        {mood.icon}
                      </div>
                      <span className="font-bold text-gray-700">{mood.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'thinking' && (
              <div className="py-12 text-center animate-pulse">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-50 animate-spin-slow"></div>
                  <div className="relative bg-white w-24 h-24 rounded-full flex items-center justify-center border-4 border-purple-100">
                    <Sparkles className="text-purple-600 animate-bounce" size={40} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI is thinking...</h3>
                <p className="text-gray-500 text-sm">Analyzing millions of flavor profiles.</p>
              </div>
            )}

            {step === 'result' && recommendation && (
              <div className="animate-fade-in-up">
                <div className="text-center mb-6">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                    99% Match
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900">We found it!</h2>
                  <p className="text-gray-500 text-sm">This perfectly matches your {selectedMood?.name} mood.</p>
                </div>
                
                <div className="mb-6 pointer-events-none">
                  {/* Reuse FoodCard but disable clicking to view details */}
                  <FoodCard food={recommendation} onClick={() => {}} />
                </div>
                
                <button 
                  onClick={() => handleAddToCart(recommendation)}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 text-lg"
                >
                  <Sparkles size={20} /> Add to Cart - ${recommendation.price.toFixed(2)}
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};

export default AIFoodMatchmaker;
