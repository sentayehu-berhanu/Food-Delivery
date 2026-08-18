import React from 'react';
import { Plus, Leaf, WheatOff } from 'lucide-react';

const FoodCard = ({ food, onClick }) => {
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover-lift cursor-pointer flex flex-col h-full"
      onClick={() => onClick(food)}
    >
      {food.image && (
        <div className="relative h-40 w-full overflow-hidden bg-gray-100 flex-shrink-0">
          <img 
            src={food.image} 
            alt={food.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {food.calories && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-orange-600 shadow-sm flex items-center gap-1">
              {food.calories}
            </div>
          )}
        </div>
      )}
      {!food.image && food.calories && (
        <div className="px-4 pt-4 pb-1">
           <div className="inline-block bg-orange-50 px-2 py-1 rounded-md text-xs font-bold text-orange-600 border border-orange-100">
             {food.calories}
           </div>
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-1">{food.name}</h4>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{food.description}</p>
          {food.dietary && food.dietary.length > 0 && (
            <div className="flex gap-2 mb-3">
              {food.dietary.includes('Vegetarian') && <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-green-700 bg-green-50 px-2 py-1 rounded-full"><Leaf size={12}/> Veg</span>}
              {food.dietary.includes('Vegan') && <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-green-800 bg-green-100 px-2 py-1 rounded-full"><Leaf size={12}/> Vegan</span>}
              {food.dietary.includes('Gluten-Free') && <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-50 px-2 py-1 rounded-full"><WheatOff size={12}/> GF</span>}
            </div>
          )}
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
