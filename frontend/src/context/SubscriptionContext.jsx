import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  
  // activeSubscription: null OR object with plan details
  const [activeSubscription, setActiveSubscription] = useState(null);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`foodgo_subscription_${user.id}`);
      if (saved) {
        setActiveSubscription(JSON.parse(saved));
      }
    } else {
      setActiveSubscription(null);
    }
  }, [user]);

  const subscribe = (plan) => {
    const newSub = {
      id: `SUB-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      planId: plan.id,
      name: plan.name,
      mealsPerWeek: plan.mealsPerWeek,
      pricePerMeal: plan.pricePerMeal,
      totalWeeklyCost: plan.mealsPerWeek * plan.pricePerMeal,
      status: 'Active',
      nextDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      dietary: plan.dietary || 'None',
    };
    setActiveSubscription(newSub);
    if (user) {
      localStorage.setItem(`foodgo_subscription_${user.id}`, JSON.stringify(newSub));
    }
    toast.success(`Successfully subscribed to the ${plan.name} plan!`);
  };

  const cancelSubscription = () => {
    setActiveSubscription(null);
    if (user) {
      localStorage.removeItem(`foodgo_subscription_${user.id}`);
    }
    toast.info("Your subscription has been cancelled.");
  };

  const pauseSubscription = () => {
    if (activeSubscription) {
      const updated = { ...activeSubscription, status: 'Paused' };
      setActiveSubscription(updated);
      if (user) {
        localStorage.setItem(`foodgo_subscription_${user.id}`, JSON.stringify(updated));
      }
      toast.info("Your subscription is now paused.");
    }
  };

  const resumeSubscription = () => {
    if (activeSubscription) {
      const updated = { ...activeSubscription, status: 'Active' };
      setActiveSubscription(updated);
      if (user) {
        localStorage.setItem(`foodgo_subscription_${user.id}`, JSON.stringify(updated));
      }
      toast.success("Your subscription has been resumed!");
    }
  };

  return (
    <SubscriptionContext.Provider value={{ 
      activeSubscription,
      subscribe,
      cancelSubscription,
      pauseSubscription,
      resumeSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
