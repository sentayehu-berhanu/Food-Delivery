import React, { useState } from 'react';
import { Clock, Check, X, ChefHat, CheckCircle } from 'lucide-react';

const DashboardOrders = () => {
  // Mock data for Phase 4 UI. This will be replaced with real data fetching.
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('mockLiveOrders');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ORD-1024',
        customerName: 'John Doe',
        time: '5 mins ago',
        items: [
          { name: 'Classic Burger', qty: 2, customizations: 'Large, Extra Cheese' },
          { name: 'Fries', qty: 1, customizations: '' }
        ],
        total: 35.50,
        status: 'PENDING'
      },
      {
        id: 'ORD-1023',
        customerName: 'Sarah Smith',
        time: '15 mins ago',
        items: [
          { name: 'Margherita Pizza', qty: 1, customizations: 'Extra Sauce' }
        ],
        total: 18.00,
        status: 'PREPARING'
      },
      {
        id: 'ORD-1022',
        customerName: 'Mike Johnson',
        time: '30 mins ago',
        items: [
          { name: 'Spicy Chicken Wings', qty: 2, customizations: 'Ranch' }
        ],
        total: 24.00,
        status: 'READY'
      }
    ];
  });

  const [activeFilter, setActiveFilter] = useState('ALL');

  React.useEffect(() => {
    localStorage.setItem('mockLiveOrders', JSON.stringify(orders));
  }, [orders]);

  const updateStatus = (id, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">NEW</span>;
      case 'PREPARING': return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">PREPARING</span>;
      case 'READY': return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">READY</span>;
      default: return null;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (order.status === 'REJECTED' || order.status === 'PICKED_UP') return false;
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'NEW' && order.status === 'PENDING') return true;
    if (activeFilter === 'PREPARING' && order.status === 'PREPARING') return true;
    if (activeFilter === 'READY' && order.status === 'READY') return true;
    return false;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Live Orders</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveFilter('ALL')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeFilter === 'ALL' ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
          >All</button>
          <button 
            onClick={() => setActiveFilter('NEW')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeFilter === 'NEW' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'}`}
          >New</button>
          <button 
            onClick={() => setActiveFilter('PREPARING')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeFilter === 'PREPARING' ? 'bg-blue-500 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'}`}
          >Preparing</button>
          <button 
            onClick={() => setActiveFilter('READY')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeFilter === 'READY' ? 'bg-green-500 text-white' : 'bg-green-100 hover:bg-green-200 text-green-800'}`}
          >Ready</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 font-medium">No live orders found.</div>
        ) : filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{order.id}</h3>
                <p className="text-sm text-gray-500">{order.customerName}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(order.status)}
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} /> {order.time}
                </span>
              </div>
            </div>
            
            <div className="p-5 flex-1">
              <ul className="space-y-3">
                {order.items.map((item, idx) => (
                  <li key={idx} className="text-sm">
                    <div className="flex justify-between font-medium text-gray-900">
                      <span><span className="text-primary font-bold">{item.qty}x</span> {item.name}</span>
                    </div>
                    {item.customizations && (
                      <p className="text-xs text-gray-500 mt-0.5 ml-5">{item.customizations}</p>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-gray-500 text-sm font-medium">Total</span>
                <span className="font-bold text-lg text-gray-900">${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-2">
              {order.status === 'PENDING' && (
                <>
                  <button 
                    onClick={() => updateStatus(order.id, 'REJECTED')}
                    className="flex items-center justify-center gap-2 py-2 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 font-bold text-sm transition"
                  >
                    <X size={16} /> Reject
                  </button>
                  <button 
                    onClick={() => updateStatus(order.id, 'PREPARING')}
                    className="flex items-center justify-center gap-2 py-2 rounded-xl text-white bg-primary hover:bg-primary-dark shadow-md shadow-orange-500/20 font-bold text-sm transition"
                  >
                    <Check size={16} /> Accept
                  </button>
                </>
              )}
              {order.status === 'PREPARING' && (
                <button 
                  onClick={() => updateStatus(order.id, 'READY')}
                  className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white bg-blue-500 hover:bg-blue-600 shadow-md shadow-blue-500/20 font-bold text-sm transition"
                >
                  <ChefHat size={18} /> Mark as Ready
                </button>
              )}
              {order.status === 'READY' && (
                <button 
                  onClick={() => updateStatus(order.id, 'PICKED_UP')}
                  className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-xl text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 font-bold text-sm transition"
                >
                  <CheckCircle size={18} /> Mark as Picked Up
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardOrders;
