import React from 'react';
import { Users, Store, DollarSign, Activity, ArrowUpRight } from 'lucide-react';

const AdminHome = () => {
  // Mock Platform Analytics
  const stats = [
    { name: 'Total Revenue', value: '$45,231.89', change: '+12.5%', icon: <DollarSign size={24} />, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Active Users', value: '1,204', change: '+5.2%', icon: <Users size={24} />, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Restaurant Partners', value: '48', change: '+2', icon: <Store size={24} />, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Orders Today', value: '156', change: '+18.1%', icon: <Activity size={24} />, color: 'text-purple-600', bg: 'bg-purple-100' },
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
        {/* Placeholder for Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Revenue Overview</h3>
            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm font-medium focus:outline-none">
              <option>Last 7 Days</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">Revenue Chart Placeholder (Chart.js / Recharts)</p>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-900 font-medium">New order #102{i} placed</p>
                  <p className="text-xs text-gray-500">{i * 5} mins ago</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 bg-gray-50 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-100 transition">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
