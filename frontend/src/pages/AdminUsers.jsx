import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Edit2, Trash2, Shield } from 'lucide-react';

const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState('ALL');

  // Mock User Data
  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'CUSTOMER', status: 'ACTIVE', joined: '2023-10-15' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'CUSTOMER', status: 'ACTIVE', joined: '2023-11-02' },
    { id: '3', name: 'Mike Driver', email: 'mike@example.com', role: 'DRIVER', status: 'ACTIVE', joined: '2024-01-10' },
    { id: '4', name: 'Sarah Connor', email: 'sarah@example.com', role: 'ADMIN', status: 'ACTIVE', joined: '2023-01-01' },
    { id: '5', name: 'Banned User', email: 'bad@example.com', role: 'CUSTOMER', status: 'BANNED', joined: '2024-02-20' },
  ];

  const filteredUsers = activeTab === 'ALL' ? users : users.filter(u => u.role === activeTab);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN': return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold flex items-center w-fit gap-1"><Shield size={12}/> Admin</span>;
      case 'DRIVER': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold w-fit">Driver</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold w-fit">Customer</span>;
    }
  };

  const getStatusBadge = (status) => {
    return status === 'ACTIVE' 
      ? <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Active</span>
      : <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">Banned</span>;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      
      {/* Header Actions */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex gap-2">
          {['ALL', 'CUSTOMER', 'DRIVER', 'ADMIN'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                activeTab === tab ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'ALL' ? 'All Users' : tab + 'S'}
            </button>
          ))}
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition text-sm"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.joined}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit2 size={16} /></button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16} /></button>
                    <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"><MoreVertical size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
