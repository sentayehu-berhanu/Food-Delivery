import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { toast } from 'react-toastify';

const GroupOrderContext = createContext();

export const useGroupOrder = () => useContext(GroupOrderContext);

export const GroupOrderProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();
  
  const [isActive, setIsActive] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [groupLink, setGroupLink] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [restaurantId, setRestaurantId] = useState(null);

  // Mock simulation for guests adding items
  useEffect(() => {
    let interval;
    if (isActive && isHost && !isLocked) {
      // Every 15-30 seconds, a random "guest" might join or add an item (mocking social interactions)
      interval = setInterval(() => {
        if (Math.random() > 0.5) {
          const guestNames = ['Alex', 'Sarah', 'Mike', 'Emily'];
          const randomGuest = guestNames[Math.floor(Math.random() * guestNames.length)];
          
          setMembers(prev => {
            if (!prev.find(m => m.name === randomGuest)) {
              toast.info(`👋 ${randomGuest} joined the group order!`);
              return [...prev, { id: `guest_${Date.now()}`, name: randomGuest, isHost: false }];
            }
            return prev;
          });

          // Mock adding an item (We will just append a special field to cart items to track who added what)
          // In a real app, this would come via Socket.io
        }
      }, 20000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, isHost, isLocked]);

  const startGroupOrder = (restId) => {
    setIsActive(true);
    setIsHost(true);
    setRestaurantId(restId);
    setIsLocked(false);
    setGroupLink(`http://localhost:5173/restaurant/${restId}?group=${Math.random().toString(36).substr(2, 9)}`);
    setMembers([{ id: user?.id || 'host', name: user?.name || 'You', isHost: true }]);
    toast.success("Group order started! Share the link with friends.");
  };

  const joinGroupOrder = (restId, hostName) => {
    setIsActive(true);
    setIsHost(false);
    setRestaurantId(restId);
    setIsLocked(false);
    setMembers([
      { id: 'host', name: hostName || 'Host', isHost: true },
      { id: user?.id || 'guest_me', name: user?.name || 'You', isHost: false }
    ]);
    toast.success(`Joined ${hostName || 'the'}'s group order!`);
  };

  const lockOrder = () => {
    setIsLocked(true);
    toast.info("Group order is now locked. Proceed to checkout!");
  };

  const cancelGroupOrder = () => {
    setIsActive(false);
    setIsHost(false);
    setGroupLink(null);
    setMembers([]);
    setIsLocked(false);
    setRestaurantId(null);
  };

  // Helper to add item as a specific member (for mock simulation or real usage)
  const addGroupItem = (item, memberId, memberName) => {
    if (isLocked) {
      toast.error("Order is locked, cannot add items.");
      return;
    }
    // We add to cart but inject the owner info
    addToCart({ ...item, addedBy: memberId, addedByName: memberName });
  };

  return (
    <GroupOrderContext.Provider value={{ 
      isActive, 
      isHost, 
      groupLink, 
      members, 
      isLocked, 
      restaurantId,
      startGroupOrder,
      joinGroupOrder,
      lockOrder,
      cancelGroupOrder,
      addGroupItem
    }}>
      {children}
    </GroupOrderContext.Provider>
  );
};
