import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

const AdminRestaurants = () => {
  // Mock Restaurant Data (Persisted in localStorage for now)
  const [restaurants, setRestaurants] = useState(() => {
    const saved = localStorage.getItem('mockRestaurants');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'Pizza House', owner: 'John Manager', status: 'APPROVED', commission: '15%', sales: '$12,450' },
      { id: '2', name: 'Burger Joint', owner: 'Mike Owner', status: 'APPROVED', commission: '15%', sales: '$8,320' },
      { id: '3', name: 'Sushi Express', owner: 'Sarah Chef', status: 'PENDING_APPROVAL', commission: '12%', sales: '$0' },
      { id: '4', name: 'Taco Fiesta', owner: 'Carlos G', status: 'SUSPENDED', commission: '15%', sales: '$45,200' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('mockRestaurants', JSON.stringify(restaurants));
  }, [restaurants]);

  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Approved</span>;
      case 'PENDING_APPROVAL': return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">Pending Review</span>;
      case 'SUSPENDED': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">Suspended</span>;
      default: return null;
    }
  };

  const handleApprove = (id) => {
    setRestaurants(restaurants.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
  };

  const handleReject = (id) => {
    setRestaurants(restaurants.map(r => r.id === id ? { ...r, status: 'SUSPENDED' } : r));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      setRestaurants(restaurants.filter(r => r.id !== id));
    }
  };

  let filteredRestaurants = restaurants;
  
  if (searchQuery) {
    filteredRestaurants = filteredRestaurants.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.owner.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filterStatus !== 'ALL') {
    filteredRestaurants = filteredRestaurants.filter(r => r.status === filterStatus);
  }

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition text-sm"
            />
          </div>
          <button 
            onClick={() => {
              const statuses = ['ALL', 'APPROVED', 'PENDING_APPROVAL', 'SUSPENDED'];
              const nextIndex = (statuses.indexOf(filterStatus) + 1) % statuses.length;
              setFilterStatus(statuses[nextIndex]);
            }}
            title="Filter Status"
            className={`p-2 border border-gray-200 rounded-lg transition flex items-center gap-2 text-sm font-bold ${filterStatus !== 'ALL' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Filter size={18} />
            {filterStatus !== 'ALL' && <span className="hidden sm:inline">{getStatusBadge(filterStatus)}</span>}
          </button>
          <button 
            onClick={() => setEditingRestaurant({ name: '', owner: '', commission: '15%', isNew: true })}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold transition flex items-center gap-2 whitespace-nowrap"
          >
            + Add Restaurant
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
            {filteredRestaurants.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">No restaurants found.</td>
              </tr>
            ) : filteredRestaurants.map((restaurant) => (
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
                        <button onClick={() => handleApprove(restaurant.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Approve"><CheckCircle size={18} /></button>
                        <button onClick={() => handleReject(restaurant.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Reject"><XCircle size={18} /></button>
                      </>
                    )}
                    <button onClick={() => setEditingRestaurant(restaurant)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(restaurant.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Restaurant Modal */}
      {editingRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-gray-900">{editingRestaurant.isNew ? 'Add New Restaurant' : 'Edit Restaurant'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Restaurant Name</label>
                <input 
                  className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition" 
                  value={editingRestaurant.name} 
                  onChange={e => setEditingRestaurant({...editingRestaurant, name: e.target.value})} 
                  placeholder="e.g. Pasta Palace"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Owner Name</label>
                <input 
                  className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition" 
                  value={editingRestaurant.owner} 
                  onChange={e => setEditingRestaurant({...editingRestaurant, owner: e.target.value})} 
                  placeholder="e.g. Luigi Mario"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Commission Rate</label>
                <select 
                  className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition" 
                  value={editingRestaurant.commission} 
                  onChange={e => setEditingRestaurant({...editingRestaurant, commission: e.target.value})}
                >
                  <option value="10%">10%</option>
                  <option value="12%">12%</option>
                  <option value="15%">15%</option>
                  <option value="20%">20%</option>
                </select>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button 
                className="px-6 py-3 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition" 
                onClick={() => setEditingRestaurant(null)}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition shadow-lg shadow-orange-500/30" 
                onClick={() => {
                  if (!editingRestaurant.name || !editingRestaurant.owner) {
                    alert('Please fill out all fields.');
                    return;
                  }
                  
                  if (editingRestaurant.isNew) {
                    const saved = {
                      id: Date.now().toString(),
                      name: editingRestaurant.name,
                      owner: editingRestaurant.owner,
                      commission: editingRestaurant.commission,
                      status: 'PENDING_APPROVAL',
                      sales: '$0'
                    };
                    setRestaurants([saved, ...restaurants]);
                  } else {
                    setRestaurants(restaurants.map(r => r.id === editingRestaurant.id ? { ...r, name: editingRestaurant.name, owner: editingRestaurant.owner, commission: editingRestaurant.commission } : r));
                  }
                  setEditingRestaurant(null);
                  setSearchQuery('');
                  setFilterStatus('ALL');
                }}
              >
                {editingRestaurant.isNew ? 'Add Restaurant' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRestaurants;
