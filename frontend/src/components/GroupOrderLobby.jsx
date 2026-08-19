import React from 'react';
import { useGroupOrder } from '../context/GroupOrderContext';
import { Users, Copy, Lock, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';

const GroupOrderLobby = () => {
  const { isActive, isHost, groupLink, members, isLocked, lockOrder, cancelGroupOrder } = useGroupOrder();

  if (!isActive) return null;

  const copyLink = () => {
    navigator.clipboard.writeText(groupLink);
    toast.success("Link copied! Send it to your friends.");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-indigo-100 mb-8 animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row gap-6 relative z-10">
        <div className="flex-1">
          <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
            <Users className="text-indigo-600" /> Group Order Active!
          </h2>
          <p className="text-gray-500 mb-4 text-sm">
            {isHost 
              ? "You are the host. Share the link below to let friends add items to this order." 
              : "You joined a group order! Add items to the shared cart."}
          </p>

          {isHost && !isLocked && (
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
              <input 
                type="text" 
                readOnly 
                value={groupLink} 
                className="bg-transparent border-none outline-none flex-1 text-sm text-gray-600 px-2 truncate"
              />
              <button 
                onClick={copyLink}
                className="p-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg transition"
              >
                <Copy size={16} />
              </button>
            </div>
          )}

          {isLocked && (
            <div className="bg-yellow-50 text-yellow-800 p-3 rounded-xl text-sm font-bold flex items-center gap-2 mt-4 border border-yellow-200">
              <Lock size={16} /> Order is locked. Proceeding to checkout.
            </div>
          )}
        </div>

        <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">Members ({members.length})</h3>
          <ul className="space-y-2 mb-4">
            {members.map(member => (
              <li key={member.id} className="flex items-center gap-2 text-sm text-gray-700">
                <div className={`w-2 h-2 rounded-full ${member.isHost ? 'bg-indigo-500' : 'bg-green-500'}`}></div>
                <span className="font-medium">{member.name}</span>
                {member.isHost && <span className="text-xs text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded-full ml-auto">Host</span>}
              </li>
            ))}
          </ul>

          <div className="flex gap-2 mt-auto pt-2 border-t border-gray-200">
            {isHost && !isLocked && (
              <button 
                onClick={lockOrder}
                className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition"
              >
                Lock Order
              </button>
            )}
            <button 
              onClick={cancelGroupOrder}
              className="flex-1 bg-white text-red-600 border border-red-200 text-xs font-bold py-2 rounded-lg hover:bg-red-50 transition"
            >
              {isHost ? 'Cancel Order' : 'Leave Group'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupOrderLobby;
