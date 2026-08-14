import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CheckoutForm from '../components/CheckoutForm';

// Initialize Stripe outside of component render to avoid recreating the Stripe object
// Make sure to replace this with your actual Stripe publishable key in a real environment
// e.g. const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const stripePromise = loadStripe('pk_test_placeholder');

const Checkout = () => {
  const { cartItems, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState('Bole, Addis Ababa');
  const [instructions, setInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Secure Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">
            
            {/* Delivery Address */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="text-primary" /> Delivery Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Instructions (Optional)</label>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition resize-none"
                    rows="2"
                    placeholder="E.g. Leave at the front door, ring doorbell..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Stripe Payment Form */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
              
              <Elements stripe={stripePromise}>
                <CheckoutForm 
                  address={address} 
                  instructions={instructions} 
                  total={total}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />
              </Elements>
              
              <div className="mt-4 flex items-center gap-2 justify-center text-sm text-gray-500">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5 opacity-50 grayscale" />
                Payments are secure and encrypted.
              </div>
            </div>

          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="mb-6 space-y-2 text-sm max-h-[30vh] overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.cartId} className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-600 truncate mr-2">{item.quantity}x {item.name}</span>
                    <span className="font-medium text-gray-900">${item.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <p className="text-gray-500 text-sm mb-1">Total to Pay</p>
                <p className="text-3xl font-extrabold text-gray-900">${total.toFixed(2)}</p>
              </div>

              {!user && (
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm">
                  <strong>Note:</strong> You are checking out as a guest. <br/>
                  <a href="/login" className="underline font-bold">Log in</a> to save this order to your account.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
