import React, { useState, useEffect } from 'react';
import { Users, Store, DollarSign, Activity, ArrowUpRight } from 'lucide-react';
import RevenueChart from '../components/RevenueChart';

const AdminHome = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllActivity, setShowAllActivity] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch from /api/admin/stats
    // For now, we mock the fetch to use our backend logic
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/stats', {
          headers: {
            // Mock auth token
            'Authorization': `Bearer ${localStorage.getItem('foodgo_token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStatsData(data);
        } else {
          // Fallback to mock data if backend isn't ready
          throw new Error('Failed to fetch');
        }
      } catch (error) {
        console.error(error);
        setStatsData({
          totalRevenue: 45231.89,
          totalUsers: 1204,
          activeRestaurants: 48,
          ordersToday: 156,
          chartData: [
            { date: '2023-10-01', revenue: 1500, orders: 45 },
            { date: '2023-10-02', revenue: 1800, orders: 52 },
            { date: '2023-10-03', revenue: 1200, orders: 38 },
            { date: '2023-10-04', revenue: 2100, orders: 61 },
            { date: '2023-10-05', revenue: 1900, orders: 55 },
            { date: '2023-10-06', revenue: 2400, orders: 70 },
            { date: '2023-10-07', revenue: 2800, orders: 85 },
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  const stats = [
    { name: 'Total Revenue', value: `$${statsData.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`, change: '+12.5%', icon: <DollarSign size={24} />, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Active Users', value: statsData.totalUsers.toLocaleString(), change: '+5.2%', icon: <Users size={24} />, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Restaurant Partners', value: statsData.activeRestaurants.toLocaleString(), change: '+2', icon: <Store size={24} />, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Orders Today', value: statsData.ordersToday.toLocaleString(), change: '+18.1%', icon: <Activity size={24} />, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.name}</p>
              <div className="flex items-end gap-2">
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <span className="text-sm font-bold text-green-500 mb-1 flex items-center">
                  <ArrowUpRight size={14} /> {stat.change}
                </span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Revenue Overview</h3>
            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm font-medium focus:outline-none">
              <option>Last 7 Days</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1">
            <RevenueChart data={statsData.chartData} />
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className={`space-y-6 ${showAllActivity ? 'max-h-[300px] overflow-y-auto pr-2' : ''}`}>
            {(showAllActivity ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : [1, 2, 3, 4, 5]).map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-900 font-medium">New order #102{i} placed</p>
                  <p className="text-xs text-gray-500">{i * 5} mins ago</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setShowAllActivity(!showAllActivity)}
            className="w-full mt-6 py-2 bg-gray-50 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-100 transition"
          >
            {showAllActivity ? 'Show Less' : 'View All Activity'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
