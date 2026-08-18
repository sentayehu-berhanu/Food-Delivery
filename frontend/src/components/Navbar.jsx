import React, { useState } from 'react';
import { Search, ShoppingCart, User, MapPin, LogOut, Moon, Sun, Wallet, Calendar, History, Leaf, Compass, Building2 } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocationContext } from '../context/LocationContext';
import NotificationDropdown from './NotificationDropdown';
import LocationModal from './LocationModal';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { deliveryLocation } = useLocationContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(''); // optional: clear after search
    }
  };

  return (
    <nav className="fixed w-full z-50 glass dark:glass-dark shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-3xl font-bold flex items-center gap-2 group">
              <span className="text-4xl group-hover:scale-110 transition-transform">🍔</span> 
              <span className="gradient-text font-black tracking-tight dark:text-white dark:bg-none dark:[-webkit-text-fill-color:white]">FoodGo</span>
            </Link>
          </div>

          {/* Location Picker */}
          <div 
            onClick={() => setIsLocationModalOpen(true)}
            className="hidden md:flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-gray-100 dark:border-slate-700 shadow-sm cursor-pointer hover:bg-white dark:hover:bg-slate-700 hover:shadow-md hover:-translate-y-0.5 transition-all max-w-[280px]"
          >
            <MapPin size={20} className="text-primary flex-shrink-0" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
              Deliver to: <span className="font-bold text-gray-900 dark:text-white">{deliveryLocation}</span>
            </span>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-3 border-0 rounded-full leading-5 bg-gray-100/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary shadow-inner transition-all"
                placeholder="Search for restaurants or food..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-semibold transition-colors flex items-center gap-2">
                  <User size={22} />
                  <span className="hidden sm:inline">{user.name}</span>
                </Link>
                <NavLink to="/wallet" className={({isActive}) => isActive ? "text-primary font-bold transition flex items-center gap-2" : "text-gray-600 hover:text-primary transition font-bold flex items-center gap-2"}>
                  <Wallet size={18} /> Wallet
                </NavLink>
                <NavLink to="/orders" className={({isActive}) => isActive ? "text-primary font-bold transition flex items-center gap-2" : "text-gray-600 hover:text-primary transition font-bold flex items-center gap-2"}>
                  <History size={18} /> Orders
                </NavLink>
                <NavLink to="/subscriptions" className={({isActive}) => isActive ? "text-primary font-bold transition flex items-center gap-2" : "text-gray-600 hover:text-primary transition font-bold flex items-center gap-2"}>
                  <Calendar size={18} /> Meal Plans
                </NavLink>
                <NavLink to="/discover" className={({isActive}) => isActive ? "text-purple-600 font-bold transition flex items-center gap-2" : "text-gray-600 hover:text-purple-600 transition font-bold flex items-center gap-2"}>
                  <Compass size={18} /> FoodTok
                </NavLink>
                <NavLink to="/corporate" className={({isActive}) => isActive ? "text-blue-600 font-bold transition flex items-center gap-2" : "text-gray-600 hover:text-blue-600 transition font-bold flex items-center gap-2"}>
                  <Building2 size={18} /> Corporate
                </NavLink>
                <NavLink to="/rescue" className={({isActive}) => isActive ? "text-green-600 font-bold transition flex items-center gap-2" : "text-gray-600 hover:text-green-600 transition font-bold flex items-center gap-2"}>
                  <Leaf size={18} /> Zero Waste
                </NavLink>
                <button onClick={logout} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                  <LogOut size={22} />
                </button>
                <NotificationDropdown />
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary font-semibold transition-colors flex items-center gap-2">
                <User size={22} />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
            
            <button 
              onClick={toggleTheme} 
              className="text-gray-700 hover:text-primary transition-colors flex items-center justify-center dark:text-gray-300 dark:hover:text-primary"
            >
              {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            
            <Link to="/cart" className="relative p-2.5 text-gray-700 hover:text-primary transition-all bg-white rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 dark:bg-gray-800 dark:text-gray-300">
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full shadow-lg">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <LocationModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;
