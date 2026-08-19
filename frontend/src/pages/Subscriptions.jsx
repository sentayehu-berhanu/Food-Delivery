import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Calendar, CheckCircle2, Leaf, Dumbbell, Users } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';

const MEAL_PLANS = [
  {
    id: 'plan_weightloss',
    name: 'Lean & Green',
    icon: <Leaf className="w-8 h-8 text-green-500" />,
    description: 'Low-calorie, high-nutrient meals designed for healthy weight loss.',
    pricePerMeal: 11.50,
    dietary: 'Low Calorie',
    features: [
      'Under 500 calories per meal',
      'High protein, low carb',
      'Fresh organic ingredients'
    ]
  },
  {
    id: 'plan_muscle',
    name: 'Muscle Builder',
    icon: <Dumbbell className="w-8 h-8 text-indigo-500" />,
    description: 'Protein-packed meals to fuel your workouts and recovery.',
    pricePerMeal: 13.00,
    dietary: 'High Protein',
    features: [
      '40g+ protein per meal',
      'Complex carbs for sustained energy',
      'Generous portion sizes'
    ]
  },
  {
    id: 'plan_family',
    name: 'Family Dinners',
    icon: <Users className="w-8 h-8 text-orange-500" />,
    description: 'Crowd-pleasing classics perfect for the whole family.',
    pricePerMeal: 9.50,
    dietary: 'Classic',
    features: [
      'Kid-friendly options',
      'Large family-style portions',
      'Comfort food favorites'
    ]
  }
];

const Subscriptions = () => {
  const containerRef = useRef(null);
  const { activeSubscription, subscribe } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState(MEAL_PLANS[0]);
  const [mealsPerWeek, setMealsPerWeek] = useState(5);

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  const handleSubscribe = () => {
    if (!user) {
      navigate('/login', { state: { message: 'Please log in to subscribe to a meal plan.' } });
      return;
    }
    
    if (activeSubscription) {
      navigate('/profile'); // Go manage existing sub
      return;
    }

    subscribe({
      ...selectedPlan,
      mealsPerWeek
    });
    
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-24 pb-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto" ref={containerRef}>
        
        <div className="text-center mb-16">
          <span className="bg-orange-100 text-orange-700 font-bold px-4 py-1.5 rounded-full text-sm inline-block mb-4">
            FoodGo Subscriptions
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Weekly Meal Prep,<br/> Delivered Fresh.
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose a plan that fits your lifestyle. We cook and deliver chef-prepared meals to your door every week. Pause or cancel anytime.
          </p>
        </div>

        {activeSubscription && (
          <div className="bg-indigo-600 text-white rounded-3xl p-8 mb-12 text-center shadow-lg shadow-indigo-500/30">
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <CheckCircle2 /> You have an Active Subscription!
            </h2>
            <p className="mb-6 opacity-90">You are currently subscribed to the {activeSubscription.name} plan.</p>
            <button 
              onClick={() => navigate('/profile')}
              className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition"
            >
              Manage Subscription
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {MEAL_PLANS.map(plan => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`bg-white dark:bg-slate-800 rounded-3xl p-8 cursor-pointer transition-all border-2 relative overflow-hidden ${
                selectedPlan.id === plan.id 
                  ? 'border-primary shadow-xl shadow-orange-500/20 scale-105 z-10' 
                  : 'border-gray-100 dark:border-slate-700 shadow-sm hover:border-orange-200 dark:hover:border-orange-500/50 hover:shadow-md'
              }`}
            >
              {selectedPlan.id === plan.id && (
                <div className="absolute top-0 inset-x-0 h-1.5 bg-primary"></div>
              )}
              
              <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-slate-700/50 flex items-center justify-center mb-6">
                {plan.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 min-h-[48px]">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-3xl font-black text-gray-900 dark:text-white">${plan.pricePerMeal.toFixed(2)}</span>
                <span className="text-gray-500 dark:text-gray-400"> / meal</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className={`w-full py-3 rounded-xl font-bold text-center transition ${
                selectedPlan.id === plan.id 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
              }`}>
                {selectedPlan.id === plan.id ? 'Selected' : 'Select Plan'}
              </div>
            </div>
          ))}
        </div>

        {/* Configuration Section */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
              <Calendar className="text-primary w-8 h-8" /> Customize Your Plan
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              How many meals do you want delivered per week? You can pick your specific meals later.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[5, 10, 14, 21].map(num => (
                <button
                  key={num}
                  onClick={() => setMealsPerWeek(num)}
                  className={`py-4 rounded-xl font-bold text-lg transition border-2 ${
                    mealsPerWeek === num 
                      ? 'border-primary bg-orange-50 dark:bg-orange-900/20 text-primary' 
                      : 'border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {num} Meals
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-96 bg-gray-50 dark:bg-slate-700/30 rounded-3xl p-8 border border-gray-200 dark:border-slate-600">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Plan</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Meals per week</span>
                <span className="font-medium text-gray-900 dark:text-white">{mealsPerWeek}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Price per meal</span>
                <span className="font-medium text-gray-900 dark:text-white">${selectedPlan.pricePerMeal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-slate-600 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 dark:text-white">Weekly Total</span>
                <span className="text-2xl font-extrabold text-primary">
                  ${(selectedPlan.pricePerMeal * mealsPerWeek).toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-right">Free Delivery Included</p>
            </div>
            
            <button 
              onClick={handleSubscribe}
              disabled={!!activeSubscription}
              className={`w-full py-4 rounded-xl font-bold transition flex justify-center items-center gap-2 ${
                activeSubscription 
                  ? 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100 shadow-lg shadow-gray-900/30 dark:shadow-white/10'
              }`}
            >
              {activeSubscription ? 'Already Subscribed' : 'Subscribe Now'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Subscriptions;
