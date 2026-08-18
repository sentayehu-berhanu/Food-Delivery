import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Store, Settings, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/admin-dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Users & Drivers', path: '/admin-dashboard/users', icon: <Users size={20} /> },
    { name: 'Restaurants', path: '/admin-dashboard/restaurants', icon: <Store size={20} /> },
    { name: 'Settings', path: '/admin-dashboard/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-300 hidden md:flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-gray-800">
          <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-primary" size={28} /> Admin
          </Link>
        </div>
        
        <div className="flex-1 py-6 flex flex-col gap-2 px-4">
          <div className="mb-4 px-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Management</p>
          </div>
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                location.pathname === item.path 
                  ? 'bg-primary text-white shadow-md shadow-orange-500/20' 
                  : 'hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-950">
          <Link to="/admin-dashboard/settings" className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-500 mt-1">Super Admin</p>
            </div>
          </Link>
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 w-full text-left rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 shrink-0 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">
            {navItems.find(item => item.path === location.pathname)?.name || 'Admin Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">System Status: All Good</span>
            <NotificationDropdown />
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
