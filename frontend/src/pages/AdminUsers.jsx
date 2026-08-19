import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Edit2, Trash2, Shield, ShieldOff, Ban, CheckCircle, Building2 } from 'lucide-react';

const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real users from backend
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('foodgo_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Transform backend fields to match our UI mapping
        const formattedUsers = data.map(u => {
          let joinedDate = 'N/A';
          try {
            if (u.createdAt) {
              joinedDate = new Date(u.createdAt).toISOString().split('T')[0];
            }
          } catch(e) {}
          return {
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            status: u.status,
            password: u.password,
            joined: joinedDate
          };
        });
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('foodgo_token')}` }
      });
      
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuickStatusChange = async (user, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('foodgo_token')}`
        },
        body: JSON.stringify({ ...user, status: newStatus })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickPromote = async (user) => {
    if (!window.confirm(`Promote ${user.name} to ADMIN?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('foodgo_token')}`
        },
        body: JSON.stringify({ ...user, role: 'ADMIN' })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === user.id ? { ...u, role: 'ADMIN' } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickDemote = async (user) => {
    if (!window.confirm(`Demote ${user.name} to CUSTOMER?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('foodgo_token')}`
        },
        body: JSON.stringify({ ...user, role: 'CUSTOMER' })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === user.id ? { ...u, role: 'CUSTOMER' } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  let filteredUsers = activeTab === 'ALL' ? users : users.filter(u => u.role === activeTab);
  
  if (searchQuery) {
    filteredUsers = filteredUsers.filter(u => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filterStatus !== 'ALL') {
    filteredUsers = filteredUsers.filter(u => u.status === filterStatus);
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN': return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold flex items-center w-fit gap-1"><Shield size={12}/> Admin</span>;
      case 'DRIVER': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold w-fit">Driver</span>;
      case 'CORPORATE': return <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold flex items-center w-fit gap-1"><Building2 size={12}/> Corporate</span>;
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
          {['ALL', 'CUSTOMER', 'DRIVER', 'CORPORATE', 'ADMIN'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                activeTab === tab ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab === 'ALL' ? 'All Users' : (tab === 'CORPORATE' ? 'Corporate' : tab + 'S')}
            </button>
          ))}
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition text-sm"
            />
          </div>
          <button 
            onClick={() => {
              if (filterStatus === 'ALL') setFilterStatus('ACTIVE');
              else if (filterStatus === 'ACTIVE') setFilterStatus('BANNED');
              else setFilterStatus('ALL');
            }}
            title="Filter by Status"
            className={`px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg transition flex items-center gap-2 text-sm font-bold ${filterStatus !== 'ALL' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
          >
            <Filter size={18} />
            {filterStatus !== 'ALL' && filterStatus}
          </button>
          <button 
            onClick={() => setEditingUser({ name: '', email: '', role: 'CUSTOMER', status: 'ACTIVE', password: '', isNewUser: true })}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold transition flex items-center gap-2"
          >
            + Add User
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
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">Loading users...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No users found.</td>
              </tr>
            ) : filteredUsers.map((user) => (
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
                    <button 
                      onClick={() => setEditingUser({...user, newPassword: ''})}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                    {user.status === 'ACTIVE' ? (
                      <button 
                        onClick={() => handleQuickStatusChange(user, 'BANNED')}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                        title="Ban User"
                      >
                        <Ban size={16} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleQuickStatusChange(user, 'ACTIVE')}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Unban User"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {user.role !== 'ADMIN' ? (
                      <button 
                        onClick={() => handleQuickPromote(user)}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                        title="Promote to Admin"
                      >
                        <Shield size={16} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleQuickDemote(user)}
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                        title="Demote to Customer"
                      >
                        <ShieldOff size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-gray-900">{editingUser.isNewUser ? 'Add New User' : 'Edit User'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                <input 
                  className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition" 
                  value={editingUser.name} 
                  onChange={e => setEditingUser({...editingUser, name: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input 
                  type="email"
                  className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition" 
                  value={editingUser.email} 
                  onChange={e => setEditingUser({...editingUser, email: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  {editingUser.isNewUser ? 'Password' : 'New Password'}
                </label>
                {!editingUser.isNewUser && (
                  <p className="text-xs text-gray-500 mb-2">
                    Current password: <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{editingUser.password || 'password123'}</span>
                  </p>
                )}
                <input 
                  type="text"
                  className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition" 
                  value={editingUser.isNewUser ? (editingUser.password || '') : (editingUser.newPassword || '')} 
                  onChange={e => setEditingUser(
                    editingUser.isNewUser 
                      ? {...editingUser, password: e.target.value}
                      : {...editingUser, newPassword: e.target.value}
                  )} 
                  placeholder={editingUser.isNewUser ? "Set a password for login" : "Leave blank to keep current password"}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
                <select 
                  className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition" 
                  value={editingUser.role} 
                  onChange={e => setEditingUser({...editingUser, role: e.target.value})}
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="CORPORATE">Corporate</option>
                  <option value="DRIVER">Driver</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                <select 
                  className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition" 
                  value={editingUser.status} 
                  onChange={e => setEditingUser({...editingUser, status: e.target.value})}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="BANNED">Banned</option>
                </select>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button 
                className="px-6 py-3 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition" 
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition shadow-lg shadow-orange-500/30" 
                onClick={async () => {
                  try {
                    const url = editingUser.isNewUser ? 'http://localhost:5000/api/admin/users' : `http://localhost:5000/api/admin/users/${editingUser.id}`;
                    const method = editingUser.isNewUser ? 'POST' : 'PUT';
                    
                    const res = await fetch(url, {
                      method,
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('foodgo_token')}`
                      },
                      body: JSON.stringify({
                        name: editingUser.name,
                        email: editingUser.email,
                        role: editingUser.role,
                        status: editingUser.status,
                        password: editingUser.isNewUser ? editingUser.password : (editingUser.newPassword || editingUser.password)
                      })
                    });

                    if (res.ok) {
                      const data = await res.json();
                      let joinedDate = 'N/A';
                      try {
                        if (data.createdAt) {
                          joinedDate = new Date(data.createdAt).toISOString().split('T')[0];
                        }
                      } catch(e) {}
                      
                      const savedUser = {
                        id: data._id,
                        name: data.name,
                        email: data.email,
                        role: data.role,
                        status: data.status,
                        password: data.password,
                        joined: joinedDate
                      };

                      if (editingUser.isNewUser) {
                        setUsers([savedUser, ...users]);
                      } else {
                        setUsers(users.map(u => u.id === editingUser.id ? savedUser : u));
                      }
                      setEditingUser(null);
                      setActiveTab('ALL');
                      setSearchQuery('');
                      setFilterStatus('ALL');
                    } else {
                      const errData = await res.json();
                      alert(errData.message || 'Failed to save user');
                    }
                  } catch (error) {
                    console.error('Error saving user:', error);
                    alert('An error occurred while saving.');
                  }
                }}
              >
                {editingUser.isNewUser ? 'Add User' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
