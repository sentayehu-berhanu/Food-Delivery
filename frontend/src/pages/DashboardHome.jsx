import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Clock, DollarSign } from 'lucide-react';
import RevenueChart from '../components/RevenueChart';
import TopItemsChart from '../components/TopItemsChart';

const DashboardHome = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch from /api/orders/analytics
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/orders/analytics', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('foodgo_token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStatsData(data);
        } else {
          throw new Error('Failed to fetch analytics');
        }
      } catch (error) {
        console.error(error);
        setStatsData({
          totalRevenue: 1245.00,
          totalOrders: 45,
          chartData: [
            { date: 'Mon', revenue: 400, orders: 12 },
            { date: 'Tue', revenue: 600, orders: 18 },
            { date: 'Wed', revenue: 300, orders: 9 },
            { date: 'Thu', revenue: 800, orders: 24 },
            { date: 'Fri', revenue: 500, orders: 15 },
            { date: 'Sat', revenue: 900, orders: 28 },
            { date: 'Sun', revenue: 700, orders: 20 },
          ],
          topItems: [
            { name: 'Spicy Burger', sales: 120 },
            { name: 'Cheese Pizza', sales: 98 },
            { name: 'Vegan Bowl', sales: 86 },
            { name: 'BBQ Wings', sales: 75 },
            { name: 'Curly Fries', sales: 65 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  const stats = [
    { title: "Today's Revenue", value: `$${statsData.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`, icon: <DollarSign size={24} />, color: 'bg-green-100 text-green-600', trend: '+14%' },
    { title: 'New Orders', value: statsData.totalOrders.toLocaleString(), icon: <ShoppingBag size={24} />, color: 'bg-orange-100 text-primary', trend: '+5%' },
    { title: 'Avg. Prep Time', value: '18 min', icon: <Clock size={24} />, color: 'bg-blue-100 text-blue-600', trend: '-2 min' },
    { title: 'Growth', value: '8.4%', icon: <TrendingUp size={24} />, color: 'bg-purple-100 text-purple-600', trend: '+1.2%' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-blue-500'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-gray-500 font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 text-lg">Revenue Overview</h3>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1">
            <RevenueChart data={statsData.chartData} />
          </div>
        </div>

        {/* Action Items / Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 text-lg mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[
              { text: 'New order #1024 received', time: '5 min ago', type: 'order' },
              { text: 'Order #1020 delivered', time: '15 min ago', type: 'success' },
              { text: 'Menu item "Spicy Burger" updated', time: '1 hour ago', type: 'system' },
              { text: 'Payout of $450.00 processed', time: '2 hours ago', type: 'finance' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div className="relative mt-1">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'order' ? 'bg-orange-500' :
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'finance' ? 'bg-purple-500' : 'bg-blue-500'
                  }`}></div>
                  {i !== 3 && <div className="absolute top-4 left-1.5 w-px h-10 bg-gray-200"></div>}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Top Items Row */}
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 text-lg">Top Selling Items</h3>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="flex-1">
            <TopItemsChart data={statsData.topItems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
