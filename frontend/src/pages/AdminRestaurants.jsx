import React from 'react';
import { Search, Filter, MoreVertical, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

const AdminRestaurants = () => {
  // Mock Restaurant Data
  const restaurants = [
    { id: '1', name: 'Pizza House', owner: 'John Manager', status: 'APPROVED', commission: '15%', sales: '$12,450' },
    { id: '2', name: 'Burger Joint', owner: 'Mike Owner', status: 'APPROVED', commission: '15%', sales: '$8,320' },
    { id: '3', name: 'Sushi Express', owner: 'Sarah Chef', status: 'PENDING_APPROVAL', commission: '12%', sales: '$0' },
    { id: '4', name: 'Taco Fiesta', owner: 'Carlos G', status: 'SUSPENDED', commission: '15%', sales: '$45,200' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Approved</span>;
      case 'PENDING_APPROVAL': return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">Pending Review</span>;
      case 'SUSPENDED': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">Suspended</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      
      {/* Header Actions */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <h3 className="text-lg font-bold text-gray-900">Restaurant Partners</h3>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search restaurants..." 
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
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Restaurant</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Owner</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Commission</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total Sales</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {restaurants.map((restaurant) => (
              <tr key={restaurant.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                      {restaurant.name.charAt(0)}
                    </div>
                    <p className="font-bold text-gray-900">{restaurant.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{restaurant.owner}</td>
                <td className="px-6 py-4">{getStatusBadge(restaurant.status)}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{restaurant.commission}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{restaurant.sales}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {restaurant.status === 'PENDING_APPROVAL' && (
                      <>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Approve"><CheckCircle size={18} /></button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Reject"><XCircle size={18} /></button>
                      </>
                    )}
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit2 size={16} /></button>
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

export default AdminRestaurants;
