import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RestaurantDetails from './pages/RestaurantDetails';
import Login from './pages/Login';
import PartnerLogin from './pages/PartnerLogin';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import Subscriptions from './pages/Subscriptions';
import RescueHub from './pages/RescueHub';
import Discover from './pages/Discover';
import CorporatePortal from './pages/CorporatePortal';
import RestaurantLayout from './components/RestaurantLayout';
import DashboardHome from './pages/DashboardHome';
import DashboardOrders from './pages/DashboardOrders';
import DashboardMenu from './pages/DashboardMenu';
import DashboardSettings from './pages/DashboardSettings';
import DriverLayout from './components/DriverLayout';
import DriverHome from './pages/DriverHome';
import DriverActiveOrder from './pages/DriverActiveOrder';
import DriverEarnings from './pages/DriverEarnings';
import DriverProfile from './pages/DriverProfile';
import AdminLayout from './components/AdminLayout';
import AdminHome from './pages/AdminHome';
import AdminUsers from './pages/AdminUsers';
import AdminRestaurants from './pages/AdminRestaurants';
import AdminSettings from './pages/AdminSettings';
import DashboardPromos from './pages/DashboardPromos';
import SupportChat from './components/SupportChat';

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
        <Route path="/partner/login" element={<div className="min-h-screen bg-gray-50"><main><PartnerLogin /></main></div>} />
        <Route path="/forgot-password" element={<div className="min-h-screen bg-gray-50"><Navbar /><main><ForgotPassword /></main></div>} />
        <Route path="/register" element={<div className="min-h-screen bg-gray-50"><Navbar /><main><Register /></main></div>} />
        <Route path="/cart" element={<div className="min-h-screen bg-gray-50"><Navbar /><main><Cart /></main></div>} />
        <Route path="/checkout" element={<div className="min-h-screen bg-gray-50"><Navbar /><main><Checkout /></main></div>} />
        <Route path="/orders" element={<div className="min-h-screen bg-gray-50"><Navbar /><main><Orders /></main></div>} />
        <Route path="/profile" element={<div className="min-h-screen bg-gray-50"><Navbar /><main><Profile /></main></div>} />
        <Route path="/wallet" element={<div className="min-h-screen bg-gray-50"><Navbar /><main><Wallet /></main></div>} />
        <Route path="/subscriptions" element={<div className="min-h-screen bg-gray-50"><Navbar /><main><Subscriptions /></main></div>} />
        <Route path="/rescue" element={<div className="min-h-screen bg-gray-50"><Navbar /><main><RescueHub /></main></div>} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/corporate" element={<CorporatePortal />} />

        <Route path="/restaurant-dashboard" element={<RestaurantLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="orders" element={<DashboardOrders />} />
          <Route path="menu" element={<DashboardMenu />} />
          <Route path="promos" element={<DashboardPromos />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>

        {/* Driver Dashboard Routes */}
        <Route path="/driver-dashboard" element={<DriverLayout />}>
          <Route index element={<DriverHome />} />
          <Route path="active" element={<DriverActiveOrder />} />
          <Route path="earnings" element={<DriverEarnings />} />
          <Route path="profile" element={<DriverProfile />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin-dashboard" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="restaurants" element={<AdminRestaurants />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
      <SupportChat />
      <ToastContainer 
        position="top-right" 
        autoClose={4000} 
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
