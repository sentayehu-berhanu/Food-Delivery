import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import OrderTimeline from '../components/OrderTimeline';
import OrderRatingModal from '../components/OrderRatingModal';
import LiveMapTracking from '../components/LiveMapTracking';

const Orders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { replaceCart } = useCart();
  const [message, setMessage] = useState('');
  const [pastOrders, setPastOrders] = useState([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (location.state && location.state.message) {
      setMessage(location.state.message);
    }
  }, [location]);

  useEffect(() => {
    if (user) {
      const fetchOrders = () => {
        const allMockOrders = JSON.parse(localStorage.getItem('mockLiveOrders') || '[]');
        return allMockOrders.filter(o => o.customerName === user.name);
      };

      setPastOrders(fetchOrders());

      // Listen for cross-tab updates to simulate real-time push notifications
      const handleStorageChange = (e) => {
        if (e.key === 'mockLiveOrders') {
          const newOrders = fetchOrders();
          
          // Check if any order status changed
          setPastOrders(prev => {
            newOrders.forEach(newOrder => {
              const oldOrder = prev.find(o => o.id === newOrder.id);
              if (oldOrder && oldOrder.status !== newOrder.status) {
                toast.success(`Order ${newOrder.id} is now ${newOrder.status}!`, {
                  icon: '🔔',
                  style: { borderRadius: '12px', fontWeight: 'bold' }
                });
              }
            });
            return newOrders;
          });
        }
      };

      window.addEventListener('storage', handleStorageChange);
      
      // Also poll every 3 seconds for same-tab updates if they didn't use storage events
      // (Though React router navigate usually unmounts/remounts, polling guarantees updates)
      const interval = setInterval(() => {
        const newOrders = fetchOrders();
        setPastOrders(prev => {
          let hasChanges = false;
          newOrders.forEach(newOrder => {
            const oldOrder = prev.find(o => o.id === newOrder.id);
            if (oldOrder && oldOrder.status !== newOrder.status) {
              hasChanges = true;
              toast.success(`Update: Order ${newOrder.id} is now ${newOrder.status}!`, {
                icon: '🚀',
                style: { borderRadius: '12px', fontWeight: 'bold' }
              });
            }
          });
          return hasChanges ? newOrders : prev;
        });
      }, 3000);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    }
  }, [user]);

  const handleReorder = (order) => {
    if (order.originalCartItems && order.originalCartItems.length > 0) {
      replaceCart(order.originalCartItems);
      navigate('/checkout');
    } else {
      alert("Sorry, we can't recreate this older order format.");
    }
  };

  const handleReviewSubmit = (reviewData) => {
    const existingReviews = JSON.parse(localStorage.getItem('restaurantReviews') || '[]');
    const newReview = {
      ...reviewData,
      id: `REV-${Math.floor(Math.random() * 10000)}`,
      customerName: user.name,
      date: new Date().toISOString()
    };
    localStorage.setItem('restaurantReviews', JSON.stringify([newReview, ...existingReviews]));
    setMessage('Thank you for rating your food and driver!');
  };

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
        ) : pastOrders.length === 0 ? (
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
        ) : (
          <div className="space-y-6">
            {pastOrders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Clock size={14} /> {order.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-xl text-gray-900">${order.total.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="px-5 py-6 border-b border-gray-100 bg-white">
                  {(order.status === 'ON_THE_WAY' || order.status === 'DELIVERING' || order.status === 'PREPARING') && (
                    <div className="mb-8">
                      <LiveMapTracking status={order.status} />
                    </div>
                  )}
                  <OrderTimeline status={order.status} />
                </div>

                <div className="p-5 bg-gray-50">
                  <ul className="space-y-2 mb-6">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700"><span className="font-bold text-gray-900">{item.qty}x</span> {item.name}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end gap-3">
                    {(order.status === 'DELIVERED' || order.status === 'READY') && (
                      <button 
                        onClick={() => { setSelectedOrder(order); setReviewModalOpen(true); }}
                        className="px-6 py-2 bg-white text-primary border-2 border-primary font-bold rounded-xl hover:bg-primary hover:text-white transition flex items-center gap-2"
                      >
                        <Star size={18} />
                        Rate Order
                      </button>
                    )}
                    <button 
                      onClick={() => handleReorder(order)}
                      className="px-6 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition"
                    >
                      Reorder
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <OrderRatingModal 
        isOpen={reviewModalOpen}
        onClose={() => { setReviewModalOpen(false); setSelectedOrder(null); }}
        order={selectedOrder}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};

export default Orders;
