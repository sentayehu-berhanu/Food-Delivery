import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RestaurantDetails from './pages/RestaurantDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import RestaurantLayout from './components/RestaurantLayout';
import DashboardHome from './pages/DashboardHome';
import DashboardOrders from './pages/DashboardOrders';
import DashboardMenu from './pages/DashboardMenu';
import DashboardSettings from './pages/DashboardSettings';
import DriverLayout from './components/DriverLayout';
import DriverHome from './pages/DriverHome';
import DriverActiveOrder from './pages/DriverActiveOrder';
import DriverEarnings from './pages/DriverEarnings';
import AdminLayout from './components/AdminLayout';
import AdminHome from './pages/AdminHome';
import AdminUsers from './pages/AdminUsers';
import AdminRestaurants from './pages/AdminRestaurants';

function App() {
  return (
    <div className="font-sans">
      <Routes>
        {/* Customer Routes with Main Navbar */}
        <Route path="/" element={
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
              <Home />
            </main>
          </div>
        } />
        <Route path="/restaurant/:id" element={
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main><RestaurantDetails /></main>
          </div>
        } />
        <Route path="/login" element={<div className="min-h-screen bg-gray-50"><Navbar /><main><Login /></main></div>} />
        <Route path="/register" element={<div className="min-h-screen bg-gray-50"><Navbar /><main><Register /></main></div>} />
        <Route path="/cart" element={<div className="min-h-screen bg-gray-50"><Navbar /><main><Cart /></main></div>} />
        <Route path="/checkout" element={<div className="min-h-screen bg-gray-50"><Navbar /><main><Checkout /></main></div>} />
        <Route path="/orders" element={<div className="min-h-screen bg-gray-50"><Navbar /><main><Orders /></main></div>} />

        {/* Restaurant Dashboard Routes */}
        <Route path="/restaurant-dashboard" element={<RestaurantLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="orders" element={<DashboardOrders />} />
          <Route path="menu" element={<DashboardMenu />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>

        {/* Driver Dashboard Routes */}
        <Route path="/driver-dashboard" element={<DriverLayout />}>
          <Route index element={<DriverHome />} />
          <Route path="active" element={<DriverActiveOrder />} />
          <Route path="earnings" element={<DriverEarnings />} />
          <Route path="profile" element={<div className="p-6 text-center text-gray-500">Profile Settings Coming Soon</div>} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin-dashboard" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="restaurants" element={<AdminRestaurants />} />
          <Route path="settings" element={<div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">Platform Settings Coming Soon</div>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
