import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { ArrowRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CheckoutForm = ({ address, instructions, total, isProcessing, setIsProcessing }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart, cartItems } = useCart();
  const [error, setError] = useState(null);
  const [isCardEmpty, setIsCardEmpty] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe.js has not loaded yet
    }

    setIsProcessing(true);
    setError(null);

    try {
      // For this mock phase, we just want to ensure they typed *something*
      // without forcing them to know the exact Stripe test cards.
      if (isCardEmpty) {
        setError('Please enter your card details.');
        setIsProcessing(false);
        return;
      }

      // 1. Fetch PaymentIntent from backend
      // In a real app, you would make this fetch call. Since we are mocking without real keys,
      // I've commented out the actual fetch and simulated a success flow for the UI.
      
      /*
      const response = await fetch('http://localhost:5000/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });
      const { clientSecret } = await response.json();

      // 2. Confirm Card Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        setError(result.error.message);
        setIsProcessing(false);
        return;
      }
      */

      // 3. Save order to backend (Simulated)
      setTimeout(() => {
        navigate('/orders', { state: { message: `Payment successful! You paid $${total.toFixed(2)}.` } });
        setTimeout(() => {
          clearCart();
        }, 100);
      }, 2000);

    } catch (err) {
      setError('An error occurred during payment.');
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#374151',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        '::placeholder': {
          color: '#9CA3AF',
        },
        padding: '12px',
      },
      invalid: {
        color: '#EF4444',
        iconColor: '#EF4444',
      },
    },
    hidePostalCode: true,
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700">
          <Lock size={16} className="text-gray-400" />
          Secure Card Payment
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <CardElement 
            options={cardElementOptions} 
            onChange={(e) => {
              setIsCardEmpty(e.empty);
              if (error) setError(null);
            }} 
          />
        </div>
        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
      </div>

      <button 
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 text-white ${isProcessing || !stripe ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark shadow-lg shadow-orange-500/30'}`}
      >
        {isProcessing ? 'Processing Payment...' : `Pay $${total.toFixed(2)}`}
        {!isProcessing && <ArrowRight size={20} />}
      </button>
    </form>
  );
};

export default CheckoutForm;
