import React from 'react';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MOCK_CROSS_SELLS = [
  {
    id: 'cs1',
    restaurantId: 'convenience-1',
    restaurantName: 'DashMart (Nearby)',
    name: 'Ben & Jerry\'s Half Baked',
    price: 6.99,
    basePrice: 6.99,
    image: 'https://images.unsplash.com/photo-1559703248-dcaaec9fab78?w=300&auto=format&fit=crop&q=60',
    description: 'Perfect dessert after your meal.'
  },
  {
    id: 'cs2',
    restaurantId: 'convenience-1',
    restaurantName: 'DashMart (Nearby)',
    name: 'Coca-Cola 2L',
    price: 3.49,
    basePrice: 3.49,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&auto=format&fit=crop&q=60',
    description: 'Ice cold refreshment.'
  },
  {
    id: 'cs3',
    restaurantId: 'sweet-tooth',
    restaurantName: 'Sweet Tooth Desserts',
    name: 'Chocolate Chip Cookie',
    price: 2.99,
    basePrice: 2.99,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&auto=format&fit=crop&q=60',
    description: 'Freshly baked and warm.'
  }
];

const CrossSellCarousel = () => {
  const { addToCart } = useCart();

  const handleAdd = (item) => {
    const cartItem = {
      ...item,
      foodId: item.id,
      quantity: 1,
      totalPrice: item.price
    };
    addToCart(cartItem);
  };

  return (
    <div className="bg-orange-50 p-6 rounded-b-3xl border-t border-orange-100 mt-4">
      <div className="mb-4">
        <h3 className="font-bold text-lg text-gray-900">Add from nearby stores?</h3>
        <p className="text-sm text-gray-600">Combine orders into a single delivery! (+$1.99 multi-stop fee)</p>
      </div>
      
      <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar">
        {MOCK_CROSS_SELLS.map(item => (
          <div key={item.id} className="min-w-[200px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="h-24 w-full bg-gray-100">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-3 flex-1 flex flex-col">
              <p className="text-xs text-orange-600 font-bold mb-1">{item.restaurantName}</p>
              <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1">{item.name}</h4>
              <div className="mt-auto flex justify-between items-center">
                <span className="font-bold text-gray-900">${item.price.toFixed(2)}</span>
                <button 
                  onClick={() => handleAdd(item)}
                  className="bg-primary/10 text-primary p-1.5 rounded-full hover:bg-primary/20 transition"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrossSellCarousel;
