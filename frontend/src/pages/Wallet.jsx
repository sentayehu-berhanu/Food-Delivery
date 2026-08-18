import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { CreditCard, Gift, History, Plus, ArrowRight, Zap, Coins } from 'lucide-react';

const Wallet = () => {
  const { user } = useAuth();
  const { balance, points, transactions, vouchers, topUp, redeemPoints } = useWallet();
  const [showTopUp, setShowTopUp] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-4 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-500 mb-6">You need to be logged in to view your FoodGo Wallet.</p>
          <Link to="/login" className="bg-primary text-white py-2 px-6 rounded-full font-bold hover:bg-primary-dark transition inline-block">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Calculate tier
  const getTier = () => {
    if (points >= 1000) return { name: 'Platinum', color: 'text-purple-600', bg: 'bg-purple-100', next: null };
    if (points >= 500) return { name: 'Gold', color: 'text-yellow-600', bg: 'bg-yellow-100', next: 1000, nextName: 'Platinum' };
    return { name: 'Silver', color: 'text-gray-600', bg: 'bg-gray-200', next: 500, nextName: 'Gold' };
  };
  const tier = getTier();

  const handleRedeem = (cost, value) => {
    if (window.confirm(`Are you sure you want to spend ${cost} points for a $${value} voucher?`)) {
      redeemPoints(cost, value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Wallet Balance Card */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white flex-1 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <p className="text-gray-400 font-medium mb-1">Total Balance</p>
                <h2 className="text-5xl font-black">${balance.toFixed(2)}</h2>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl">
                <CreditCard size={32} className="text-white" />
              </div>
            </div>
            
            <button 
              onClick={() => setShowTopUp(!showTopUp)}
              className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition flex justify-center items-center gap-2 active:scale-95"
            >
              <Plus size={20} />
              Top Up Wallet
            </button>

            {/* Top Up Options */}
            {showTopUp && (
              <div className="mt-4 grid grid-cols-3 gap-3 animate-fade-in">
                {[20, 50, 100].map(amount => (
                  <button 
                    key={amount}
                    onClick={() => { topUp(amount); setShowTopUp(false); }}
                    className="bg-white/10 hover:bg-white/20 py-3 rounded-xl font-bold transition flex items-center justify-center gap-1"
                  >
                    +${amount}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Loyalty Points Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 flex-1 shadow-lg relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-gray-500 font-medium mb-1">Loyalty Points</p>
                <div className="flex items-end gap-2">
                  <h2 className="text-4xl font-black text-gray-900">{points}</h2>
                  <span className="text-gray-400 font-medium mb-1">pts</span>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full font-bold text-sm ${tier.bg} ${tier.color} flex items-center gap-1`}>
                <Coins size={16} />
                {tier.name} Member
              </div>
            </div>

            {/* Progress to next tier */}
            {tier.next && (
              <div className="mb-6">
                <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                  <span>Current</span>
                  <span>{tier.next} pts to {tier.nextName}</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (points / tier.next) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Zap size={16} className="text-yellow-500 fill-yellow-500" />
              Earn 10 points for every $1 spent!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column: Rewards */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-100 p-2 rounded-xl text-primary">
                  <Gift size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Rewards Catalog</h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Reward Card 1 */}
                <div className="border-2 border-gray-100 hover:border-primary/50 p-5 rounded-2xl transition cursor-pointer group">
                  <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition">$5 Off Voucher</h4>
                  <p className="text-gray-500 text-sm mb-4">Valid on any order.</p>
                  <button 
                    onClick={() => handleRedeem(500, 5)}
                    disabled={points < 500}
                    className="w-full py-2 bg-gray-50 group-hover:bg-primary/10 text-gray-900 group-hover:text-primary font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Redeem for 500 pts
                  </button>
                </div>
                
                {/* Reward Card 2 */}
                <div className="border-2 border-gray-100 hover:border-primary/50 p-5 rounded-2xl transition cursor-pointer group">
                  <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition">$15 Off Voucher</h4>
                  <p className="text-gray-500 text-sm mb-4">Valid on orders over $30.</p>
                  <button 
                    onClick={() => handleRedeem(1000, 15)}
                    disabled={points < 1000}
                    className="w-full py-2 bg-gray-50 group-hover:bg-primary/10 text-gray-900 group-hover:text-primary font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Redeem for 1000 pts
                  </button>
                </div>
              </div>
            </div>

            {/* My Vouchers */}
            {vouchers.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">My Vouchers</h3>
                <div className="space-y-3">
                  {vouchers.map(v => (
                    <div key={v.code} className={`p-4 rounded-2xl border-2 flex justify-between items-center ${v.isUsed ? 'border-gray-100 bg-gray-50 opacity-60' : 'border-green-100 bg-green-50/50'}`}>
                      <div>
                        <p className="font-bold text-gray-900">${v.value} Off</p>
                        <p className="text-sm font-mono text-gray-500">{v.code}</p>
                      </div>
                      <div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${v.isUsed ? 'bg-gray-200 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                          {v.isUsed ? 'Used' : 'Available'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Transactions */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gray-100 p-2 rounded-xl text-gray-600">
                <History size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">History</h3>
            </div>
            
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No recent transactions.</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {transactions.map(tx => (
                  <div key={tx.id} className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-bold text-sm text-gray-900">{tx.description}</p>
                      <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                    <div className={`font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-gray-900'}`}>
                      {tx.type === 'CREDIT' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Wallet;
