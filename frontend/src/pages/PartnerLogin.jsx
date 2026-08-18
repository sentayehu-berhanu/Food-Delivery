import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const PartnerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.message) {
      setMessage(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.role !== 'RESTAURANT' && data.role !== 'ADMIN') {
          setError('Access Denied: This portal is only for restaurant partners.');
          return;
        }

        login(data.token, {
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role
        });
        
        toast.success(`Welcome back ${data.name}!`);
        navigate('/restaurant-dashboard');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to connect to the server. Please check your connection.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-800 p-10 rounded-3xl shadow-2xl border border-slate-700 relative overflow-hidden">
        
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-emerald-500 opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 rounded-full bg-blue-500 opacity-10 pointer-events-none"></div>
        
        <div className="text-center relative z-10">
          <Link to="/" className="inline-block text-4xl font-bold text-white mb-6">🍽️ Partner Portal</Link>
          <h2 className="text-3xl font-extrabold text-white">Restaurant Login</h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to manage your menu, track orders, and view earnings.
          </p>
        </div>
        
        <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
          {message && (
            <div className="bg-blue-900/50 border border-blue-800 text-blue-300 p-3 rounded-lg text-sm text-center mb-4 font-medium">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-900/50 border border-red-800 text-red-300 p-3 rounded-lg text-sm text-center mb-4">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition"
                  placeholder="partner@restaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">Forgot password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-emerald-500 shadow-lg shadow-emerald-500/20 transition-all"
            >
              Sign in
              <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                <ArrowRight className="h-5 w-5 text-white group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </form>
        
        <div className="text-center text-sm text-slate-400 relative z-10 pt-4 mt-6">
          <div className="mb-4">
            Don't have a partner account?{' '}
            <Link to="/register" className="font-bold text-emerald-400 hover:text-emerald-300 transition">
              Sign up
            </Link>
          </div>
          <div className="border-t border-slate-700 pt-4">
             Looking for the Customer Portal?{' '}
            <Link to="/login" className="font-bold text-white hover:text-emerald-400 transition underline">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerLogin;
