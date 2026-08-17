import React, { useState } from 'react';
import { Search, ShoppingCart, User, MapPin, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocationContext } from '../context/LocationContext';
import NotificationDropdown from './NotificationDropdown';
import LocationModal from './LocationModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { deliveryLocation } = useLocationContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(''); // optional: clear after search
    }
  };

  return (
    <nav className="fixed w-full z-50 glass border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-3xl font-bold text-primary flex items-center gap-2">
              <span className="text-4xl">🍔</span> FoodGo
            </Link>
          </div>

          {/* Location Picker */}
          <div 
            onClick={() => setIsLocationModalOpen(true)}
            className="hidden md:flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-100 transition max-w-[250px]"
          >
            <MapPin size={18} className="text-primary flex-shrink-0" />
            <span className="text-sm font-medium text-gray-700 truncate">
              Deliver to: <span className="font-bold">{deliveryLocation}</span>
            </span>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all"
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
                <Link to="/profile" className="text-gray-700 hover:text-primary font-medium transition flex items-center gap-2">
                  <User size={20} />
                  <span className="hidden sm:inline">{user.name}</span>
                </Link>
                <button onClick={logout} className="text-gray-500 hover:text-red-500 transition">
                  <LogOut size={20} />
                </button>
                <NotificationDropdown />
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-primary font-medium transition flex items-center gap-2">
                <User size={20} />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
            
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary transition bg-gray-50 rounded-full hover:bg-orange-50">
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full">
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
