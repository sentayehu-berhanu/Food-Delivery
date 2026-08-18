import React, { useState } from 'react';
import { Building2, Users, Wallet, FileText, Plus, Search, ChevronRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

const CorporatePortal = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [allowance, setAllowance] = useState(25);
  const [isJoined, setIsJoined] = useState(false);

  // Mock employee data
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Alex Johnson', email: 'alex@company.com', status: 'Active', spent: 15.50 },
    { id: 2, name: 'Sarah Miller', email: 'sarah@company.com', status: 'Active', spent: 24.00 },
    { id: 3, name: 'Mike Chen', email: 'mike@company.com', status: 'Invited', spent: 0 },
  ]);

  const handleUpdateAllowance = () => {
    toast.success(`Daily allowance updated to $${allowance}`);
    // In a real app, this would update the backend and local storage for the user's wallet/checkout
    localStorage.setItem('corporateAllowance', allowance);
  };

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Company Account</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Company Name</label>
                <input type="text" placeholder="e.g. Acme Corp" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Work Email</label>
                <input type="email" placeholder="admin@acmecorp.com" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <button 
                onClick={() => {
                  setIsJoined(true);
                  localStorage.setItem('corporateAllowance', allowance);
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
    <div className="min-h-screen bg-gray-50 pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <Building2 className="text-blue-600" /> Acme Corp Portal
            </h1>
            <p className="text-gray-500">Manage your team's food perks and catering.</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2">
            <FileText size={18} /> Download Invoice
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase">Active Employees</p>
              <p className="text-2xl font-black text-gray-900">{employees.filter(e => e.status === 'Active').length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase">Total Spent (This Month)</p>
              <p className="text-2xl font-black text-gray-900">$1,450.20</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase">Catering Orders</p>
              <p className="text-2xl font-black text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button 
              className={`flex-1 py-4 font-bold text-center border-b-2 transition ${activeTab === 'overview' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('overview')}
            >
              Allowance Rules
            </button>
            <button 
              className={`flex-1 py-4 font-bold text-center border-b-2 transition ${activeTab === 'employees' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('employees')}
            >
              Manage Team
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Daily Team Lunch Allowance</h2>
                <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl mb-6">
                  <p className="text-gray-600 mb-4">Set the maximum amount each employee can spend per day on the company tab. If their order exceeds this amount, they will pay the difference with their personal card.</p>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">$</span>
                      <input 
                        type="number" 
                        value={allowance}
                        onChange={(e) => setAllowance(Number(e.target.value))}
                        className="pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-32 font-bold"
                      />
                    </div>
                    <span className="text-gray-500 font-bold">/ day per employee</span>
                  </div>
                </div>
                <button 
                  onClick={handleUpdateAllowance}
                  className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition"
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
                    <input type="text" placeholder="Search employees..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-100 transition">
                    <Plus size={18} /> Invite Members
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-gray-500 text-sm border-b border-gray-100">
                        <th className="pb-3 font-bold">Employee</th>
                        <th className="pb-3 font-bold">Status</th>
                        <th className="pb-3 font-bold">Spent Today</th>
                        <th className="pb-3 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {employees.map(emp => (
                        <tr key={emp.id} className="hover:bg-gray-50">
                          <td className="py-4">
                            <div className="font-bold text-gray-900">{emp.name}</div>
                            <div className="text-sm text-gray-500">{emp.email}</div>
                          </td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {emp.status}
                            </span>
                          </td>
                          <td className="py-4 font-medium text-gray-900">
                            ${emp.spent.toFixed(2)} <span className="text-gray-400 text-sm">/ ${allowance}</span>
                          </td>
                          <td className="py-4 text-right">
                            <button className="text-blue-600 hover:underline font-medium text-sm">Manage</button>
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
    </div>
  );
};

export default CorporatePortal;
