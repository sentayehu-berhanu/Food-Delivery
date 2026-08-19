import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Gift, Sparkles, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const TIERS = [
  { id: 'basic', name: 'Basic Surprise', price: 15.00, desc: 'A quick, solid meal.' },
  { id: 'premium', name: 'Premium Box', price: 25.00, desc: 'High quality, larger portions.' },
  { id: 'feast', name: 'The Feast', price: 50.00, desc: 'A massive spread for big appetites.' }
];

const VIBES = [
  { id: 'comfort', name: 'Comfort Food', icon: '🍔' },
  { id: 'healthy', name: 'Healthy & Fresh', icon: '🥗' },
  { id: 'spicy', name: 'Spicy Surprise', icon: '🌶️' },
  { id: 'wildcard', name: 'Total Wildcard', icon: '🎲' }
];

const ALLERGIES = [
  'None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Nut-Free', 'Dairy-Free'
];

const MysteryBox = () => {
  const [selectedTier, setSelectedTier] = useState(TIERS[1]);
  const [selectedVibe, setSelectedVibe] = useState(VIBES[3]);
  const [selectedAllergy, setSelectedAllergy] = useState('None');
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(".fade-in", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  const handleReveal = () => {
    setIsAnimating(true);
    
    // Simulate thinking animation
    setTimeout(() => {
      const mysteryItem = {
        foodId: `mystery-${Date.now()}`,
        name: `${selectedTier.name} (${selectedVibe.name})`,
        price: selectedTier.price,
        basePrice: selectedTier.price,
        quantity: 1,
        totalPrice: selectedTier.price,
        restaurantName: '??? Mystery Kitchen ???',
        restaurantId: 'mystery-1',
        instructions: `Dietary: ${selectedAllergy}`,
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=60' // Gift box image
      };

      addToCart(mysteryItem);
      toast.success("Mystery Box added to your cart!");
      navigate('/cart');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-24 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-600/20 blur-[120px]"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-12 fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mb-6 shadow-2xl transform -rotate-6">
            <Gift size={40} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">The Mystery Box</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Can't decide what to eat? Let our local chefs surprise you based on your vibe and budget. You won't know what it is until it arrives!</p>
        </div>

        <div className="space-y-10 bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-2xl fade-in">
          
          {/* 1. Budget */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-400">
              <span className="bg-purple-900 text-purple-300 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> 
              Choose Your Budget
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TIERS.map(tier => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier)}
                  className={`p-4 rounded-2xl border-2 text-left transition ${
                    selectedTier.id === tier.id 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10' 
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <h3 className="font-bold text-lg">{tier.name}</h3>
                  <p className="text-2xl font-black text-purple-400 my-1">${tier.price}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{tier.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Vibe */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-pink-400">
              <span className="bg-pink-900 text-pink-300 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> 
              Select Your Vibe
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {VIBES.map(vibe => (
                <button
                  key={vibe.id}
                  onClick={() => setSelectedVibe(vibe)}
                  className={`p-4 rounded-2xl border-2 text-center transition ${
                    selectedVibe.id === vibe.id 
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-500/10' 
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-3xl mb-2">{vibe.icon}</div>
                  <h3 className="font-bold text-sm">{vibe.name}</h3>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Safety */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-400">
              <span className="bg-green-900 text-green-300 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span> 
              Dietary Restrictions
            </h2>
            <div className="flex flex-wrap gap-3">
              {ALLERGIES.map(allergy => (
                <button
                  key={allergy}
                  onClick={() => setSelectedAllergy(allergy)}
                  className={`px-4 py-2 rounded-full font-bold text-sm transition border-2 ${
                    selectedAllergy === allergy 
                      ? 'border-green-500 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' 
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {allergy}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleReveal}
              disabled={isAnimating}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black text-xl py-5 rounded-2xl transition shadow-lg shadow-purple-500/25 flex items-center justify-center gap-3"
            >
              {isAnimating ? (
                <>
                  <Sparkles className="animate-spin" /> Cooking up a surprise...
                </>
              ) : (
                <>
                  Add to Cart for ${selectedTier.price} <ArrowRight />
                </>
              )}
            </button>
            <p className="text-center text-gray-500 text-sm mt-4 flex items-center justify-center gap-2">
              <ShieldCheck size={16} /> 100% Satisfaction Guarantee. Don't like it? Get a refund.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MysteryBox;
