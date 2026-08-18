import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

const DashboardMenu = () => {
  const [restaurants, setRestaurants] = useState(() => {
    const saved = localStorage.getItem('mockRestaurants');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'Pizza House' },
      { id: '2', name: 'Burger Joint' },
      { id: '3', name: 'Sushi Express' }
    ];
  });
  const [activeRestaurantId, setActiveRestaurantId] = useState(restaurants[0]?.id || '1');

  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('mockMenuItems');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', restaurantId: '1', name: 'Classic Burger', category: 'Burgers', description: 'Beef patty, american cheese, lettuce, tomato, and our secret sauce.', price: 12.99, status: 'Available', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
      { id: '2', restaurantId: '1', name: 'Cheese Pizza', category: 'Pizza', description: 'Fresh tomato, mozzarella, and basil on a crispy thin crust.', price: 14.99, status: 'Available', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60' },
      { id: '3', restaurantId: '1', name: 'Spicy Wings', category: 'Appetizers', description: 'Crispy fried wings tossed in our signature spicy sauce.', price: 9.99, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1524114664604-cd8133cd67ad?w=500&auto=format&fit=crop&q=60' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('mockMenuItems', JSON.stringify(menuItems));
  }, [menuItems]);

  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMenuItems(menuItems.filter(item => item.id !== id));
    }
  };

  let filteredItems = menuItems.filter(item => !item.restaurantId || item.restaurantId === activeRestaurantId);
  if (searchQuery) {
    filteredItems = filteredItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase()));
  }
  if (filterStatus !== 'ALL') {
    filteredItems = filteredItems.filter(item => item.status === filterStatus);
  }

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">Menu Management</h2>
          <select 
            className="border border-gray-200 py-1.5 px-3 rounded-lg bg-gray-50 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-primary shadow-sm"
            value={activeRestaurantId}
            onChange={(e) => setActiveRestaurantId(e.target.value)}
          >
            {restaurants.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={() => setEditingItem({ name: '', category: 'Burgers', description: '', price: '', status: 'Available', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500', isNew: true })}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold transition shadow-md shadow-orange-500/20 w-full sm:w-auto justify-center"
        >
          <Plus size={20} /> Add New Item
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search menu items..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
            />
          </div>
          <button 
            onClick={() => {
              const statuses = ['ALL', 'Available', 'Out of Stock'];
              const nextIndex = (statuses.indexOf(filterStatus) + 1) % statuses.length;
              setFilterStatus(statuses[nextIndex]);
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition font-medium ${filterStatus !== 'ALL' ? 'bg-gray-900 border-gray-900 text-white' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            <Filter size={20} /> <span className="hidden sm:inline">{filterStatus === 'ALL' ? 'Filter' : filterStatus}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Item</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedItems.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500">No items found.</td></tr>
              ) : paginatedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <span className="font-bold text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.category}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingItem(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <span>Showing {paginatedItems.length} of {filteredItems.length} items</span>
          <div className="flex gap-1">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Prev
            </button>
            <button className="px-3 py-1 border border-gray-200 bg-gray-50 font-bold rounded-lg text-gray-900">{currentPage}</button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-gray-900">{editingItem.isNew ? 'Add New Item' : 'Edit Menu Item'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Item Name</label>
                <input 
                  className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition" 
                  value={editingItem.name} 
                  onChange={e => setEditingItem({...editingItem, name: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea 
                  className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition resize-none h-24" 
                  value={editingItem.description || ''} 
                  onChange={e => setEditingItem({...editingItem, description: e.target.value})} 
                  placeholder="Describe your item..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                  <select 
                    className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition" 
                    value={editingItem.category} 
                    onChange={e => setEditingItem({...editingItem, category: e.target.value})}
                  >
                    <option value="Burgers">Burgers</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Appetizers">Appetizers</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
                  <input 
                    type="number"
                    step="0.01"
                    className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition" 
                    value={editingItem.price} 
                    onChange={e => setEditingItem({...editingItem, price: e.target.value})} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                  <select 
                    className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition" 
                    value={editingItem.status} 
                    onChange={e => setEditingItem({...editingItem, status: e.target.value})}
                  >
                    <option value="Available">Available</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Item Image</label>
                  <div className="flex items-center gap-3">
                    {editingItem.image && editingItem.image.startsWith('data:') && (
                      <img src={editingItem.image} alt="Preview" className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                    )}
                    <input 
                      type="file"
                      accept="image/*"
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditingItem({...editingItem, image: reader.result});
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button 
                className="px-6 py-3 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition" 
                onClick={() => setEditingItem(null)}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition shadow-lg shadow-orange-500/30" 
                onClick={() => {
                  if (!editingItem.name || !editingItem.price) {
                    alert('Please provide a name and price.');
                    return;
                  }
                  
                  if (editingItem.isNew) {
                    const saved = {
                      id: Date.now().toString(),
                      restaurantId: activeRestaurantId,
                      name: editingItem.name,
                      description: editingItem.description,
                      category: editingItem.category,
                      price: parseFloat(editingItem.price),
                      status: editingItem.status,
                      image: editingItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300'
                    };
                    setMenuItems([saved, ...menuItems]);
                  } else {
                    setMenuItems(menuItems.map(i => i.id === editingItem.id ? { 
                      ...i, 
                      name: editingItem.name, 
                      category: editingItem.category, 
                      description: editingItem.description || '',
                      price: parseFloat(editingItem.price), 
                      status: editingItem.status 
                    } : i));
                  }
                  setEditingItem(null);
                  setSearchQuery('');
                  setFilterStatus('ALL');
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardMenu;
