import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const { user } = useAuth();
  
  // State
  const [balance, setBalance] = useState(0);
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [vouchers, setVouchers] = useState([]);

  // Load user data on login
  useEffect(() => {
    if (user) {
      const savedBalance = parseFloat(localStorage.getItem(`wallet_balance_${user.id}`)) || 0;
      const savedPoints = parseInt(localStorage.getItem(`wallet_points_${user.id}`)) || 150; // Give new users 150 points to start
      const savedTransactions = JSON.parse(localStorage.getItem(`wallet_txs_${user.id}`)) || [];
      const savedVouchers = JSON.parse(localStorage.getItem(`wallet_vouchers_${user.id}`)) || [];

      setBalance(savedBalance);
      setPoints(savedPoints);
      setTransactions(savedTransactions);
      setVouchers(savedVouchers);
    } else {
      setBalance(0);
      setPoints(0);
      setTransactions([]);
      setVouchers([]);
    }
  }, [user]);

  // Persist state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`wallet_balance_${user.id}`, balance.toString());
      localStorage.setItem(`wallet_points_${user.id}`, points.toString());
      localStorage.setItem(`wallet_txs_${user.id}`, JSON.stringify(transactions));
      localStorage.setItem(`wallet_vouchers_${user.id}`, JSON.stringify(vouchers));
    }
  }, [balance, points, transactions, vouchers, user]);

  const addTransaction = (type, amount, description) => {
    const newTx = {
      id: `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      type, // 'CREDIT' or 'DEBIT'
      amount,
      description,
      date: new Date().toISOString()
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const topUp = (amount) => {
    setBalance(prev => prev + amount);
    addTransaction('CREDIT', amount, `Wallet Top Up`);
    toast.success(`Successfully added $${amount.toFixed(2)} to your wallet!`);
  };

  const payWithWallet = (amount) => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      addTransaction('DEBIT', amount, `Order Payment`);
      return true;
    }
    return false;
  };

  const awardPoints = (amountSpent) => {
    const pointsEarned = Math.floor(amountSpent * 10);
    setPoints(prev => prev + pointsEarned);
    return pointsEarned;
  };

  const redeemPoints = (cost, discountValue) => {
    if (points >= cost) {
      setPoints(prev => prev - cost);
      
      const newVoucher = {
        code: `FOODGO${discountValue}OFF-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        value: discountValue,
        isUsed: false,
        dateEarned: new Date().toISOString()
      };
      
      setVouchers(prev => [newVoucher, ...prev]);
      toast.success(`Successfully redeemed ${cost} points for a $${discountValue} voucher!`);
      return newVoucher;
    }
    toast.error("Not enough points to redeem this reward.");
    return null;
  };

  const useVoucher = (code) => {
    const voucher = vouchers.find(v => v.code === code && !v.isUsed);
    if (voucher) {
      setVouchers(prev => prev.map(v => v.code === code ? { ...v, isUsed: true } : v));
      return voucher.value;
    }
    return 0;
  };

  return (
    <WalletContext.Provider value={{ 
      balance, 
      points, 
      transactions, 
      vouchers, 
      topUp, 
      payWithWallet, 
      awardPoints, 
      redeemPoints,
      useVoucher
    }}>
      {children}
    </WalletContext.Provider>
  );
};
