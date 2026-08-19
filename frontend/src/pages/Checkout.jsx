import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Copy, Check, X } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { useGroupOrder } from '../context/GroupOrderContext';
import CheckoutForm from '../components/CheckoutForm';

// Initialize Stripe outside of component render to avoid recreating the Stripe object
// Make sure to replace this with your actual Stripe publishable key in a real environment
// e.g. const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const stripePromise = loadStripe('pk_test_placeholder');

const Checkout = () => {
  const { cartItems, subtotal, deliveryFee, serviceFee, tax, total, uniqueRestaurants } = useCart();
  const { user } = useAuth();
  const { isActive, isHost, members } = useGroupOrder();
  const navigate = useNavigate();

  const [address, setAddress] = useState('Bole, Addis Ababa');
  const [instructions, setInstructions] = useState('');
  const [deliveryType, setDeliveryType] = useState('ASAP');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'wallet'
  
  const [savedAddresses, setSavedAddresses] = useState([]);

  // Split Bill State
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [splitWays, setSplitWays] = useState(2);
  const [copiedLink, setCopiedLink] = useState(null);
  const [isBillSplit, setIsBillSplit] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`mockAddresses_${user.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSavedAddresses(parsed);
          if (parsed.length > 0 && address === 'Bole, Addis Ababa') {
            setAddress(parsed[0].fullAddress); // Default to first saved address
          }
        } catch(e) {}
      }
    }
  }, [user]);
  
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState({ text: '', type: '' });
  
  const { balance, points, vouchers, useVoucher } = useWallet();
  const [selectedVoucher, setSelectedVoucher] = useState('');
  
  const corporateAllowance = Number(localStorage.getItem('corporateAllowance')) || 0;

  const handleApplyPromo = () => {
    const saved = localStorage.getItem('mockPromos');
    let activePromos = [];
    if (saved) {
      activePromos = JSON.parse(saved).filter(p => p.status === 'Active');
    } else {
      activePromos = [
        { code: 'WELCOME20', type: 'percentage', value: 20 },
        { code: 'FREEDELIVERY', type: 'flat', value: 5.00 },
      ];
    }

    const inputCode = promoCode.toUpperCase().replace(/\s+/g, '');
    const matchedPromo = activePromos.find(p => p.code === inputCode);

    if (matchedPromo) {
      let discountAmount = 0;
      if (matchedPromo.type === 'percentage') {
        discountAmount = total * (matchedPromo.value / 100);
        setPromoMessage({ text: `${matchedPromo.value}% discount applied!`, type: 'success' });
      } else {
        discountAmount = matchedPromo.value;
        setPromoMessage({ text: `$${matchedPromo.value.toFixed(2)} discount applied!`, type: 'success' });
      }
      setPromoDiscount(discountAmount);
    } else {
      setPromoDiscount(0);
      setPromoMessage({ text: 'Invalid or inactive promo code', type: 'error' });
    }
  };

  const selectedVoucherObj = vouchers.find(v => v.code === selectedVoucher && !v.isUsed);
  const voucherDiscount = selectedVoucherObj ? selectedVoucherObj.value : 0;
  const totalDiscount = promoDiscount + voucherDiscount;

  const [tipPercentage, setTipPercentage] = useState(15); // default 15%
  const [customTip, setCustomTip] = useState('');

  const calculateTip = () => {
    if (tipPercentage === 'custom') {
      return parseFloat(customTip) || 0;
    }
    return (total * tipPercentage) / 100;
  };

  const tipAmount = calculateTip();
  const finalTotal = Math.max(0, total - totalDiscount + tipAmount);
  
  // Calculate Split Bill Shares
  const splitInCents = Math.round(finalTotal * 100);
  
  // Calculate dynamic share for Group Orders
  let groupOrderMyShare = 0;
  if (isActive && user) {
    const myItems = cartItems.filter(item => item.addedBy === user.id);
    const myItemsTotal = myItems.reduce((acc, item) => acc + ((item.totalPrice || item.price || item.basePrice || 0) * item.quantity), 0);
    // Proportion of finalTotal
    const ratio = total > 0 ? (myItemsTotal / total) : 0;
    groupOrderMyShare = finalTotal * ratio;
  }

  const myShare = isActive ? groupOrderMyShare : ((Math.floor(splitInCents / splitWays) + (splitInCents % splitWays)) / 100);
  const baseShare = Math.floor(splitInCents / splitWays) / 100;
  
  const amountToPay = (isBillSplit || isActive) ? myShare : finalTotal;

  useEffect(() => {
    if (cartItems.length === 0 && !isProcessing) {
      navigate('/cart');
    }
  }, [cartItems.length, navigate, isProcessing]);

  if (cartItems.length === 0 && !isProcessing) {
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
                
                {/* Delivery Type Selection */}
                <div className="flex gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('ASAP')}
                    className={`flex-1 py-3 rounded-xl font-bold transition border-2 ${
                      deliveryType === 'ASAP' 
                        ? 'border-primary bg-orange-50 text-primary' 
                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    ASAP
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('SCHEDULED')}
                    className={`flex-1 py-3 rounded-xl font-bold transition border-2 ${
                      deliveryType === 'SCHEDULED' 
                        ? 'border-primary bg-orange-50 text-primary' 
                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    Schedule
                  </button>
                </div>

                {deliveryType === 'SCHEDULED' && (
                  <div className="flex gap-4 p-4 bg-gray-50 rounded-xl mb-4 border border-gray-200">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-600 mb-1">Date</label>
                      <input 
                        type="date" 
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-600 mb-1">Time</label>
                      <input 
                        type="time" 
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                  </div>
                  
                  {savedAddresses.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {savedAddresses.map(addr => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => setAddress(addr.fullAddress)}
                          className={`px-3 py-1.5 text-sm font-bold rounded-lg transition border ${
                            address === addr.fullAddress 
                              ? 'bg-primary text-white border-primary shadow-sm' 
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {addr.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <input 
                    type="text" 
                    placeholder="Enter your full address"
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

            {/* Payment Method Selection */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-3 rounded-xl font-bold transition border-2 ${
                    paymentMethod === 'card' 
                      ? 'border-primary bg-orange-50 text-primary' 
                      : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                  }`}
                >
                  Credit Card
                </button>
                <button
                  onClick={() => setPaymentMethod('wallet')}
                  className={`flex-1 py-3 rounded-xl font-bold transition border-2 flex flex-col items-center justify-center ${
                    paymentMethod === 'wallet' 
                      ? 'border-primary bg-orange-50 text-primary' 
                      : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                  }`}
                >
                  <span>FoodGo Wallet</span>
                  <span className="text-xs font-normal">Balance: ${balance.toFixed(2)}</span>
                </button>
                {corporateAllowance > 0 && (
                  <button
                    onClick={() => setPaymentMethod('corporate')}
                    className={`flex-1 py-3 rounded-xl font-bold transition border-2 flex flex-col items-center justify-center ${
                      paymentMethod === 'corporate' 
                        ? 'border-blue-600 bg-blue-50 text-blue-600' 
                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    <span>Company Allowance</span>
                    <span className="text-xs font-normal">Remaining: ${corporateAllowance.toFixed(2)}</span>
                  </button>
                )}
              </div>

              {paymentMethod === 'card' ? (
                <>
                  <Elements stripe={stripePromise}>
                    <CheckoutForm 
                      address={address} 
                      instructions={instructions} 
                      total={amountToPay}
                      deliveryType={deliveryType}
                      scheduledDate={scheduledDate}
                      scheduledTime={scheduledTime}
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}
                      paymentMethod="card"
                    />
                  </Elements>
                  <div className="mt-4 flex items-center gap-2 justify-center text-sm text-gray-500">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5 opacity-50 grayscale" />
                    Payments are secure and encrypted.
                  </div>
                </>
              ) : paymentMethod === 'wallet' ? (
                <div className="pt-2">
                  {balance >= amountToPay ? (
                    <Elements stripe={stripePromise}>
                      <CheckoutForm 
                        address={address} 
                        instructions={instructions} 
                        total={amountToPay}
                        deliveryType={deliveryType}
                        scheduledDate={scheduledDate}
                        scheduledTime={scheduledTime}
                        isProcessing={isProcessing}
                        setIsProcessing={setIsProcessing}
                        paymentMethod="wallet"
                      />
                    </Elements>
                  ) : (
                    <div className="text-center p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 mb-4">
                      <p className="font-bold">Insufficient Wallet Balance</p>
                      <p className="text-sm">Please top up your wallet or use a credit card.</p>
                      <button 
                        onClick={() => navigate('/wallet')}
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold"
                      >
                        Go to Wallet
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="pt-2">
                  {corporateAllowance >= amountToPay ? (
                    <Elements stripe={stripePromise}>
                      <CheckoutForm 
                        address={address} 
                        instructions={instructions} 
                        total={amountToPay}
                        deliveryType={deliveryType}
                        scheduledDate={scheduledDate}
                        scheduledTime={scheduledTime}
                        isProcessing={isProcessing}
                        setIsProcessing={setIsProcessing}
                        paymentMethod="corporate"
                      />
                    </Elements>
                  ) : (
                    <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 mb-4">
                      <p className="font-bold">Order Exceeds Daily Allowance</p>
                      <p className="text-sm">Your order is ${amountToPay.toFixed(2)}, but you only have ${corporateAllowance.toFixed(2)} remaining. Please use your personal credit card.</p>
                      <button 
                        onClick={() => setPaymentMethod('card')}
                        className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-bold"
                      >
                        Switch to Credit Card
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="mb-6 space-y-4 text-sm max-h-[40vh] overflow-y-auto pr-2">
                {Object.entries(cartItems.reduce((acc, item) => {
                  const rName = item.restaurantName || 'FoodGo Delivery';
                  if (!acc[rName]) acc[rName] = [];
                  acc[rName].push(item);
                  return acc;
                }, {})).map(([rName, items]) => (
                  <div key={rName} className="mb-4">
                    <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-1 mb-2">{rName}</h4>
                    {items.map(item => (
                      <div key={item.cartId} className="flex justify-between pb-1 text-gray-600">
                        <span className="truncate mr-2">{item.quantity}x {item.name}</span>
                        <span className="font-medium">${(item.totalPrice || item.price || item.basePrice || 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    placeholder="Promo Code" 
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button 
                    onClick={handleApplyPromo}
                    className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage.text && (
                  <p className={`text-sm mb-4 font-bold ${promoMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                    {promoMessage.text}
                  </p>
                )}
                
                <div className="flex justify-between text-gray-500 text-sm mb-1">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm mb-1">
                  <span>Delivery Fee {uniqueRestaurants > 1 ? `(Multi-Stop: ${uniqueRestaurants})` : ''}</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm mb-1">
                  <span>Service Fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm mb-1">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-green-600 text-sm mb-2 font-bold">
                    <span>Discount</span>
                    <span>-${totalDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                {vouchers.filter(v => !v.isUsed).length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Apply Voucher</label>
                    <select 
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      value={selectedVoucher}
                      onChange={(e) => setSelectedVoucher(e.target.value)}
                    >
                      <option value="">-- Select a voucher --</option>
                      {vouchers.filter(v => !v.isUsed).map(v => (
                        <option key={v.code} value={v.code}>${v.value} Off - {v.code}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="mb-4 pt-2">
                  <span className="text-sm font-bold text-gray-900 block mb-2">Driver Tip</span>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[10, 15, 20, 'custom'].map(tip => (
                      <button
                        key={tip}
                        onClick={() => setTipPercentage(tip)}
                        className={`py-1.5 text-sm font-bold rounded-lg border transition ${
                          tipPercentage === tip 
                            ? 'bg-primary border-primary text-white' 
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {tip === 'custom' ? 'Other' : `${tip}%`}
                      </button>
                    ))}
                  </div>
                  {tipPercentage === 'custom' && (
                    <input 
                      type="number"
                      min="0"
                      step="0.50"
                      placeholder="Enter tip amount ($)"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      value={customTip}
                      onChange={(e) => setCustomTip(e.target.value)}
                    />
                  )}
                  <div className="flex justify-between text-gray-500 text-sm mt-2">
                    <span>Tip Amount</span>
                    <span>${tipAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mt-2 pt-2 border-t border-gray-100">
                  <p className="text-gray-900 font-bold">{(isBillSplit || isActive) ? 'Your Share' : 'Total to Pay'}</p>
                  <p className="text-3xl font-extrabold text-gray-900">${amountToPay.toFixed(2)}</p>
                </div>
                {(isBillSplit || isActive) && (
                  <div className="flex flex-col mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-sm">
                    <div className="flex justify-between items-center font-bold text-indigo-900 mb-2">
                      <span>Total Bill:</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                    {isActive ? (
                      <>
                        <div className="text-indigo-700 text-xs mb-2">
                          Automatically split based on items ordered.
                        </div>
                        {members.filter(m => m.id !== user?.id).map(m => {
                          const mItems = cartItems.filter(item => item.addedBy === m.id);
                          const mTotal = mItems.reduce((acc, item) => acc + ((item.totalPrice || item.price || item.basePrice || 0) * item.quantity), 0);
                          const mRatio = total > 0 ? (mTotal / total) : 0;
                          const mShare = finalTotal * mRatio;
                          
                          if (mShare > 0) {
                            return (
                              <div key={m.id} className="flex justify-between text-indigo-600 mb-1">
                                <span>{m.name}'s Share:</span>
                                <span>${mShare.toFixed(2)}</span>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </>
                    ) : (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-indigo-600">Splitting {splitWays} ways</span>
                        <button onClick={() => setIsBillSplit(false)} className="text-indigo-800 font-bold hover:underline">Cancel Split</button>
                      </div>
                    )}
                  </div>
                )}
                
                {!isActive && (
                  <button 
                    onClick={() => setShowSplitModal(true)}
                    className="w-full mt-4 py-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold rounded-xl transition flex items-center justify-center gap-2 border border-indigo-200"
                  >
                    <Users size={18} /> Split this Bill
                  </button>
                )}
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

      {/* Split Bill Modal */}
      {showSplitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="text-indigo-600" /> Split the Bill
              </h2>
              <button onClick={() => setShowSplitModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">Splitting <strong className="text-gray-900">${finalTotal.toFixed(2)}</strong>. How many ways?</p>
            
            <div className="flex justify-between gap-4 mb-8">
              {[2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => setSplitWays(num)}
                  className={`flex-1 py-3 text-lg font-bold rounded-xl border-2 transition ${
                    splitWays === num 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-200 text-gray-500 hover:border-indigo-300'
                  }`}
                >
                  {num} ways
                </button>
              ))}
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <span className="text-gray-600 font-medium">You Pay</span>
                <span className="text-2xl font-extrabold text-indigo-600">
                  ${((Math.floor(Math.round(finalTotal * 100) / splitWays) + (Math.round(finalTotal * 100) % splitWays)) / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">{splitWays - 1} Friend{splitWays - 1 > 1 ? 's' : ''} Pay</span>
                <span className="text-xl font-bold text-gray-900">
                  ${(Math.floor(Math.round(finalTotal * 100) / splitWays) / 100).toFixed(2)} each
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-bold text-gray-900 text-sm">Send these payment links to your friends:</p>
              {Array.from({ length: splitWays - 1 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2 pl-4">
                  <span className="text-sm text-gray-500 flex-1 truncate">foodgo.com/pay/req_{Math.floor(Math.random()*10000)}</span>
                  <button 
                    onClick={() => {
                      setCopiedLink(idx);
                      setTimeout(() => setCopiedLink(null), 2000);
                    }}
                    className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition text-gray-700"
                  >
                    {copiedLink === idx ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                setIsBillSplit(true);
                setShowSplitModal(false);
              }}
              className="w-full mt-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
