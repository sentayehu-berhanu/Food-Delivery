import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Users, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useGroupOrder } from '../context/GroupOrderContext';
import CrossSellCarousel from '../components/CrossSellCarousel';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal, deliveryFee, serviceFee, tax, total } = useCart();
  const { isActive, isHost, isLocked, lockOrder, members } = useGroupOrder();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-md w-full" ref={containerRef}>
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="bg-primary text-white py-3 px-8 rounded-full font-bold hover:bg-primary-dark transition inline-block">
            Start Exploring
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto" ref={containerRef}>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  {isActive ? <><Users size={20} className="text-indigo-600" /> Group Order Summary</> : 'Order Summary'}
                </h2>
                <span className="text-gray-500">{cartItems.length} items</span>
              </div>
              
              <div className="divide-y divide-gray-100">
                {!isActive ? (
                  Object.entries(cartItems.reduce((acc, item) => {
                    const rName = item.restaurantName || 'FoodGo Delivery';
                    if (!acc[rName]) acc[rName] = [];
                    acc[rName].push(item);
                    return acc;
                  }, {})).map(([rName, items]) => (
                    <div key={rName} className="border-b border-gray-100 last:border-0 pb-4">
                      <div className="bg-orange-50/50 px-6 py-3 flex justify-between items-center border-y border-orange-100/50">
                        <span className="font-bold text-orange-900 flex items-center gap-2">
                          <ShoppingBag size={18} className="text-orange-600" />
                          {rName}
                        </span>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {items.map((item) => {
                          const displayPrice = item.totalPrice || item.price || item.basePrice || 0;
                          return (
                          <div key={item.cartId} className="px-6 py-4 flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                              <button 
                                onClick={() => removeFromCart(item.cartId)}
                                className="text-gray-400 hover:text-red-500 transition p-1"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            
                            <div className="text-sm text-gray-500 mb-4 space-y-1">
                              {item.size && <p>Size: {item.size.name}</p>}
                              {item.toppings && item.toppings.length > 0 && (
                                <p>Toppings: {item.toppings.map(t => t.name).join(', ')}</p>
                              )}
                              {item.sauce && <p>Sauce: {item.sauce.name}</p>}
                              {item.instructions && <p className="italic">"{item.instructions}"</p>}
                            </div>
                            
                            <div className="flex justify-between items-center mt-auto">
                              <div className="flex items-center bg-gray-50 rounded-full border border-gray-200">
                                <button 
                                  onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full transition"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full transition"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              <span className="font-bold text-lg text-gray-900">${displayPrice.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        );
                      })}
                      </div>
                    </div>
                  ))
                ) : (
                // GROUP ORDER CART
                <div>
                  {members.map(member => {
                    const memberItems = cartItems.filter(item => item.addedBy === member.id);
                    if (memberItems.length === 0) return null;
                    
                    const memberTotal = memberItems.reduce((acc, item) => acc + ((item.totalPrice || item.price || item.basePrice || 0) * item.quantity), 0);

                    return (
                      <div key={member.id} className="border-b border-gray-100 last:border-0 pb-4">
                        <div className="bg-indigo-50/50 px-6 py-3 flex justify-between items-center border-y border-indigo-100/50">
                          <span className="font-bold text-indigo-900 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center text-xs font-black text-indigo-700">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            {member.name}'s Items
                          </span>
                          <span className="font-bold text-indigo-600">${memberTotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="divide-y divide-gray-50">
                          {memberItems.map(item => {
                            const displayPrice = item.totalPrice || item.price || item.basePrice || 0;
                            return (
                              <div key={item.cartId} className="px-6 py-4 flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                                    {!isLocked && (
                                      <button 
                                        onClick={() => removeFromCart(item.cartId)}
                                        className="text-gray-400 hover:text-red-500 transition p-1"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    )}
                                  </div>
                                  <div className="flex justify-between items-center mt-2">
                                    {!isLocked ? (
                                      <div className="flex items-center bg-gray-50 rounded-full border border-gray-200">
                                        <button 
                                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full transition"
                                        >
                                          <Minus size={12} />
                                        </button>
                                        <span className="w-8 text-center font-bold text-xs">{item.quantity}</span>
                                        <button 
                                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full transition"
                                        >
                                          <Plus size={12} />
                                        </button>
                                      </div>
                                    ) : (
                                      <span className="text-sm font-medium text-gray-500">Qty: {item.quantity}</span>
                                    )}
                                    <span className="font-bold text-sm text-gray-900">${(displayPrice * item.quantity).toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              </div>
              <CrossSellCarousel />
            </div>
          </div>
          
          {/* Order Summary Checkout */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Summary</h3>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    Delivery Fee 
                    {useCart().uniqueRestaurants > 1 && <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold ml-1">Multi-Stop</span>}
                  </span>
                  <span className="font-medium text-gray-900">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee</span>
                  <span className="font-medium text-gray-900">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-extrabold text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
              
              {isActive ? (
                isHost ? (
                  !isLocked ? (
                    <button 
                      onClick={lockOrder}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30"
                    >
                      <Lock size={20} />
                      Lock Order & Continue
                    </button>
                  ) : (
                    <button 
                      onClick={() => navigate('/checkout')}
                      className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
                    >
                      Proceed to Checkout
                      <ArrowRight size={20} />
                    </button>
                  )
                ) : (
                  <div className="text-center p-4 bg-gray-100 rounded-xl text-gray-500 text-sm font-medium">
                    Waiting for Host to lock order and checkout...
                  </div>
                )
              ) : (
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
                >
                  Proceed to Checkout
                  <ArrowRight size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
