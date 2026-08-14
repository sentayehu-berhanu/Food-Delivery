import React from 'react';
import { Plus } from 'lucide-react';

const FoodCard = ({ food, onClick }) => {
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover-lift cursor-pointer flex flex-col h-full"
      onClick={() => onClick(food)}
    >
      {food.image && (
        <div className="relative h-40 w-full overflow-hidden bg-gray-100">
          <img 
            src={food.image} 
            alt={food.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-1">{food.name}</h4>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{food.description}</p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-extrabold text-gray-900">${food.price.toFixed(2)}</span>
          <button className="bg-orange-50 text-primary p-2 rounded-full hover:bg-orange-100 transition">
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
