import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardPromos = () => {
  const { user } = useAuth();
  const [promos, setPromos] = useState([]);
  const [editingPromo, setEditingPromo] = useState(null);

  useEffect(() => {
    // Load promos from localStorage, or set some defaults if empty
    const saved = localStorage.getItem('mockPromos');
    if (saved) {
      setPromos(JSON.parse(saved));
    } else {
      const defaultPromos = [
        { id: '1', code: 'WELCOME20', type: 'percentage', value: 20, status: 'Active' },
        { id: '2', code: 'FREEDELIVERY', type: 'flat', value: 5.00, status: 'Active' },
      ];
      setPromos(defaultPromos);
      localStorage.setItem('mockPromos', JSON.stringify(defaultPromos));
    }
  }, []);

  const handleSave = () => {
    if (!editingPromo.code || !editingPromo.value) {
      alert('Please provide a promo code and discount value.');
      return;
    }

    let updatedPromos;
    if (editingPromo.isNew) {
      const newPromo = {
        id: Date.now().toString(),
        code: editingPromo.code.toUpperCase().replace(/\s+/g, ''),
        type: editingPromo.type,
        value: parseFloat(editingPromo.value),
        status: editingPromo.status
      };
      updatedPromos = [newPromo, ...promos];
    } else {
      updatedPromos = promos.map(p => p.id === editingPromo.id ? {
        ...editingPromo,
        code: editingPromo.code.toUpperCase().replace(/\s+/g, ''),
        value: parseFloat(editingPromo.value)
      } : p);
    }

    setPromos(updatedPromos);
    localStorage.setItem('mockPromos', JSON.stringify(updatedPromos));
    setEditingPromo(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this promo code?')) {
      const updated = promos.filter(p => p.id !== id);
      setPromos(updated);
      localStorage.setItem('mockPromos', JSON.stringify(updated));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
          <p className="text-gray-500 mt-1">Manage discount codes for your customers.</p>
        </div>
        <button 
          onClick={() => setEditingPromo({ isNew: true, code: '', type: 'percentage', value: '', status: 'Active' })}
          className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition shadow-lg shadow-orange-500/30"
        >
          <Plus size={20} /> Add Promo Code
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Promo Code</th>
                <th className="px-6 py-4 font-medium">Discount Type</th>
                <th className="px-6 py-4 font-medium">Value</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {promos.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500">No promo codes found.</td></tr>
              ) : promos.map((promo) => (
                <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 rounded-lg text-primary">
                        <Tag size={18} />
                      </div>
                      <span className="font-bold text-gray-900 tracking-wide">{promo.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 capitalize">{promo.type}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {promo.type === 'percentage' ? `${promo.value}%` : `$${promo.value.toFixed(2)}`}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                      promo.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {promo.status === 'Active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {promo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingPromo(promo)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(promo.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {editingPromo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-gray-900">{editingPromo.isNew ? 'Create Promo Code' : 'Edit Promo Code'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Promo Code</label>
                <input 
                  className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition uppercase" 
                  placeholder="e.g. SUMMER20"
                  value={editingPromo.code} 
                  onChange={e => setEditingPromo({...editingPromo, code: e.target.value.toUpperCase().replace(/\s+/g, '')})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Discount Type</label>
                  <select 
                    className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition" 
                    value={editingPromo.type} 
                    onChange={e => setEditingPromo({...editingPromo, type: e.target.value})}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Value</label>
                  <input 
                    type="number"
                    step="0.01"
                    className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition" 
                    value={editingPromo.value} 
                    onChange={e => setEditingPromo({...editingPromo, value: e.target.value})} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                <select 
                  className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition" 
                  value={editingPromo.status} 
                  onChange={e => setEditingPromo({...editingPromo, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button 
                className="px-6 py-3 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition" 
                onClick={() => setEditingPromo(null)}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition shadow-lg shadow-orange-500/30" 
                onClick={handleSave}
              >
                Save Promo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPromos;
