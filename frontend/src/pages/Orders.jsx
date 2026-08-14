import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (location.state && location.state.message) {
      setMessage(location.state.message);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl mb-8 flex items-center gap-3">
            <CheckCircle className="text-green-500" />
            <span className="font-bold">{message}</span>
          </div>
        )}

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Orders</h1>

        {!user ? (
          <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Please log in</h2>
            <p className="text-gray-500 mb-6">You need to be logged in to view your order history.</p>
            <Link to="/login" className="bg-primary text-white py-2 px-6 rounded-full font-bold hover:bg-primary-dark transition inline-block">
              Go to Login
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-gray-400" size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Past Orders</h2>
            <p className="text-gray-500 mb-6">When you place orders, they will appear here.</p>
            <Link to="/" className="bg-primary text-white py-2 px-6 rounded-full font-bold hover:bg-primary-dark transition inline-block">
              Order Food Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
