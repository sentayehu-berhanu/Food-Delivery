import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ListOrdered, MenuSquare, Settings, LogOut, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

const RestaurantLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/partner/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/restaurant-dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Live Orders', path: '/restaurant-dashboard/orders', icon: <ListOrdered size={20} /> },
    { name: 'Menu Management', path: '/restaurant-dashboard/menu', icon: <MenuSquare size={20} /> },
    { name: 'Promotions', path: '/restaurant-dashboard/promos', icon: <Tag size={20} /> },
    { name: 'Settings', path: '/restaurant-dashboard/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="text-3xl">🍽️</span> Partner
          </Link>
        </div>
        
        <div className="flex-1 py-6 flex flex-col gap-2 px-4">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                location.pathname === item.path 
                  ? 'bg-orange-50 text-primary' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100">
          <Link to="/restaurant-dashboard/settings" className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-primary font-bold">
              {user?.name?.charAt(0) || 'R'}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{user?.name || 'Restaurant Name'}</p>
              <p className="text-xs text-gray-500">Owner</p>
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-left rounded-lg text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-bold text-gray-800">
            {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Accepting Orders
            </span>
            <NotificationDropdown />
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-gray-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RestaurantLayout;
