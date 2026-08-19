import React, { useState, useEffect } from 'react';
import { Building2, Users, Wallet, FileText, Plus, Search, ChevronRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const CorporatePortal = () => {
  const { user } = useAuth();
  const [corporateEmail, setCorporateEmail] = useState('');
  
  const currentKey = corporateEmail || user?._id || user?.email || 'default';
  const corporateKey = `corporateEmployees_${currentKey}`;
  const allowanceKey = `corporateAllowance_${currentKey}`;

  const [activeTab, setActiveTab] = useState('overview');
  const [allowance, setAllowance] = useState(25);
  const [isJoined, setIsJoined] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', password: '' });
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (!isJoined) return;
    
    const savedAllowance = localStorage.getItem(allowanceKey);
    if (savedAllowance) setAllowance(Number(savedAllowance));

    const saved = localStorage.getItem(corporateKey);
    if (saved) {
      setEmployees(JSON.parse(saved));
    } else {
      setEmployees([]); // Default to empty array for newly registered companies!
    }
    setIsDataLoaded(true);
  }, [corporateKey, isJoined, allowanceKey]);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem(corporateKey, JSON.stringify(employees));
    }
  }, [employees, corporateKey, isDataLoaded]);

  const handleUpdateAllowance = () => {
    toast.success(`Daily allowance updated to $${allowance}`);
    // In a real app, this would update the backend and local storage for the user's wallet/checkout
    localStorage.setItem(allowanceKey, allowance);
  };

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      // In our mock backend, auth register adds them to DB.
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newEmployee.name,
          email: newEmployee.email,
          password: newEmployee.password,
          role: 'CORPORATE'
        })
      });

      if (res.ok) {
        toast.success(`Employee ${newEmployee.name} added successfully!`);
        setEmployees([
          ...employees,
          {
            id: Date.now(),
            name: newEmployee.name,
            email: newEmployee.email,
            status: 'Active',
            spent: 0
          }
        ]);
        setIsAddModalOpen(false);
        setNewEmployee({ name: '', email: '', password: '' });
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to add employee');
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  const handleToggleStatus = (id) => {
    setEmployees(employees.map(emp => {
      if (emp.id === id) {
        const newStatus = emp.status === 'Active' ? 'Suspended' : 'Active';
        toast.success(`${emp.name} is now ${newStatus}`);
        return { ...emp, status: newStatus };
      }
      return emp;
    }));
  };

  const handleRemoveEmployee = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      setEmployees(employees.filter(emp => emp.id !== id));
      toast.success(`${name} has been removed`);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingEmployee.name || !editingEmployee.email) {
      toast.error('Name and Email are required');
      return;
    }

    // If a new password was provided, hit the reset password endpoint
    if (editingEmployee.password) {
      try {
        const res = await fetch('http://localhost:5000/api/auth/resetPassword', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: editingEmployee.email, newPassword: editingEmployee.password })
        });
        if (!res.ok) {
          toast.error('Failed to update password on server');
        }
      } catch (err) {
        toast.error('Error updating password');
      }
    }

    setEmployees(employees.map(emp => emp.id === editingEmployee.id ? { ...emp, name: editingEmployee.name, email: editingEmployee.email, spent: Number(editingEmployee.spent) || 0 } : emp));
    toast.success('Employee updated successfully');
    setIsEditModalOpen(false);
    setEditingEmployee(null);
  };

  const handleDownloadInvoice = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Employee Name,Email,Status,Spent Today\n";
    employees.forEach(emp => {
      csvContent += `"${emp.name}","${emp.email}","${emp.status}","$${Number(emp.spent).toFixed(2)}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Corporate_Invoice_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Invoice downloaded successfully");
  };

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-24 pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors duration-300">
        <div className="max-w-4xl w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-slate-700">
          <div className="md:w-1/2 p-12 bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex flex-col justify-center">
            <Building2 size={48} className="mb-6 opacity-80" />
            <h1 className="text-4xl font-black mb-4">FoodGo Corporate</h1>
            <p className="text-blue-100 text-lg mb-8">
              Fuel your team with the best local food. Manage catering, set daily lunch allowances, and consolidate billing in one easy portal.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-300" /> Tax-exempt catering</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-300" /> Automated allowances</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-300" /> Consolidated monthly invoicing</li>
            </ul>
          </div>
          <div className="md:w-1/2 p-12 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create Company Account</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                <input type="text" placeholder="e.g. Acme Corp" className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Work Email</label>
                <input 
                  type="email" 
                  placeholder="admin@acmecorp.com" 
                  value={corporateEmail}
                  onChange={(e) => setCorporateEmail(e.target.value)}
                  className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <button 
                onClick={() => {
                  if (!corporateEmail) {
                    toast.error("Please enter a work email to set up your account.");
                    return;
                  }
                  setIsJoined(true);
                  localStorage.setItem(allowanceKey, allowance);
                }}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition mt-4"
              >
                Set Up Corporate Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-24 pb-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <Building2 className="text-blue-600" /> Acme Corp Portal
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your team's food perks and catering.</p>
          </div>
          <button 
            onClick={handleDownloadInvoice}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FileText size={18} /> Download Invoice
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase">Active Employees</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{employees.filter(e => e.status === 'Active').length}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase">Total Spent (This Month)</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">$1,450.20</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase">Catering Orders</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="flex border-b border-gray-100 dark:border-slate-700">
            <button 
              className={`flex-1 py-4 font-bold text-center border-b-2 transition ${activeTab === 'overview' ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              onClick={() => setActiveTab('overview')}
            >
              Allowance Rules
            </button>
            <button 
              className={`flex-1 py-4 font-bold text-center border-b-2 transition ${activeTab === 'employees' ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              onClick={() => setActiveTab('employees')}
            >
              Manage Team
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Daily Team Lunch Allowance</h2>
                <div className="p-6 bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-600 rounded-2xl mb-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Set the maximum amount each employee can spend per day on the company tab. If their order exceeds this amount, they will pay the difference with their personal card.</p>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">$</span>
                      <input 
                        type="number" 
                        value={allowance}
                        onChange={(e) => setAllowance(Number(e.target.value))}
                        className="pl-8 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none w-32 font-bold"
                      />
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 font-bold">/ day per employee</span>
                  </div>
                </div>
                <button 
                  onClick={handleUpdateAllowance}
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-black dark:hover:bg-gray-100 transition"
                >
                  Save Rules
                </button>
              </div>
            )}

            {activeTab === 'employees' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search employees..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
                  >
                    <Plus size={18} /> Add Employee
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-gray-500 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-slate-700">
                        <th className="pb-3 font-bold">Employee</th>
                        <th className="pb-3 font-bold">Status</th>
                        <th className="pb-3 font-bold">Spent Today</th>
                        <th className="pb-3 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                      {employees.filter(emp => 
                        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        emp.email.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map(emp => (
                        <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                          <td className="py-4">
                            <div className="font-bold text-gray-900 dark:text-white">{emp.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{emp.email}</div>
                          </td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${emp.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'}`}>
                              {emp.status}
                            </span>
                          </td>
                          <td className="py-4 font-medium text-gray-900 dark:text-white">
                            ${emp.spent.toFixed(2)} <span className="text-gray-400 dark:text-gray-500 text-sm">/ ${allowance}</span>
                          </td>
                          <td className="py-4 text-right relative group">
                            <button className="text-blue-600 hover:underline font-medium text-sm">Manage</button>
                            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 shadow-xl rounded-lg border border-gray-100 dark:border-slate-700 hidden group-hover:block z-10 overflow-hidden">
                              <button onClick={() => { setEditingEmployee({...emp, password: ''}); setIsEditModalOpen(true); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition border-b border-gray-100 dark:border-slate-700">
                                Edit
                              </button>
                              <button onClick={() => handleToggleStatus(emp.id)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition">
                                {emp.status === 'Active' ? 'Suspend' : 'Activate'}
                              </button>
                              <button onClick={() => handleRemoveEmployee(emp.id, emp.name)} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition border-t border-gray-100 dark:border-slate-700">
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add Corporate Employee</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Employee Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Jane Doe"
                  className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={newEmployee.name} 
                  onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address (Username)</label>
                <input 
                  type="email"
                  placeholder="jane@company.com"
                  className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={newEmployee.email} 
                  onChange={e => setNewEmployee({...newEmployee, email: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Temporary Password</label>
                <input 
                  type="text"
                  placeholder="Password for login"
                  className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={newEmployee.password} 
                  onChange={e => setNewEmployee({...newEmployee, password: e.target.value})} 
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button 
                className="px-6 py-3 font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition" 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewEmployee({ name: '', email: '', password: '' });
                }}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/30" 
                onClick={handleAddEmployee}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && editingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Employee</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Employee Name</label>
                <input 
                  type="text"
                  className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={editingEmployee.name} 
                  onChange={e => setEditingEmployee({...editingEmployee, name: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input 
                  type="email"
                  className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={editingEmployee.email} 
                  onChange={e => setEditingEmployee({...editingEmployee, email: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">New Password (Optional)</label>
                <input 
                  type="text"
                  placeholder="Leave blank to keep current"
                  className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={editingEmployee.password} 
                  onChange={e => setEditingEmployee({...editingEmployee, password: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Spent Today ($)</label>
                <input 
                  type="number"
                  step="0.01"
                  className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={editingEmployee.spent} 
                  onChange={e => setEditingEmployee({...editingEmployee, spent: e.target.value})} 
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button 
                className="px-6 py-3 font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition" 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingEmployee(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/30" 
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorporatePortal;
