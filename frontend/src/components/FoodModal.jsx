import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, Minus, Plus } from 'lucide-react';

const FoodModal = ({ food, onClose, onAddToCart, restaurantEmail, restaurantId, restaurantName }) => {
  const modalRef = useRef(null);
  
  // State for customization
  const [selectedSize, setSelectedSize] = useState(food?.sizes?.[0] || null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedSauce, setSelectedSauce] = useState(food?.sauces?.[0] || null);
  const [instructions, setInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Modal Entrance Animation
    gsap.fromTo(modalRef.current, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
    );
  }, []);

  if (!food) return null;

  const handleClose = () => {
    gsap.to(modalRef.current, {
      y: 50, 
      opacity: 0, 
      duration: 0.3, 
      ease: 'power3.in',
      onComplete: onClose
    });
  };

  const toggleTopping = (topping) => {
    setSelectedToppings(prev => 
      prev.some(t => t.id === topping.id)
        ? prev.filter(t => t.id !== topping.id)
        : [...prev, topping]
    );
  };

  // Calculate Total Price
  const basePrice = selectedSize ? selectedSize.price : food.price;
  const toppingsPrice = selectedToppings.reduce((sum, top) => sum + top.price, 0);
  const totalPrice = (basePrice + toppingsPrice) * quantity;

  const handleAddToCart = () => {
    const cartItem = {
      foodId: food.id,
      name: food.name,
      basePrice,
      size: selectedSize,
      toppings: selectedToppings,
      sauce: selectedSauce,
      instructions,
      quantity,
      totalPrice,
      restaurantEmail,
      restaurantId,
      restaurantName
    };
    onAddToCart(cartItem);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="absolute inset-0" 
        onClick={handleClose}
      ></div>
      
      <div 
        ref={modalRef}
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] shadow-2xl relative z-10"
      >
        {/* Header Image */}
        {food.image && (
          <div className="relative h-48 w-full bg-gray-100">
            <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white transition"
            >
              <X size={20} className="text-gray-900" />
            </button>
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {!food.image && (
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{food.name}</h2>
              <button onClick={handleClose} className="p-2 bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
          )}
          
          {food.image && <h2 className="text-2xl font-bold text-gray-900 mb-2">{food.name}</h2>}
          <p className="text-gray-500 mb-6">{food.description}</p>

          {/* Sizes */}
          {food.sizes && food.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center justify-between">
                Choose Size <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Required</span>
              </h3>
              <div className="space-y-3">
                {food.sizes.map(size => (
                  <label key={size.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="size" 
                        className="w-5 h-5 text-primary focus:ring-primary accent-primary"
                        checked={selectedSize?.name === size.name}
                        onChange={() => setSelectedSize(size)}
                      />
                      <span className="font-medium text-gray-700">{size.name}</span>
                    </div>
                    <span className="text-gray-600">${size.price.toFixed(2)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Toppings */}
          {food.toppings && food.toppings.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center justify-between">
                Extra Toppings <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Optional</span>
              </h3>
              <div className="space-y-3">
                {food.toppings.map(topping => (
                  <label key={topping.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 text-primary rounded focus:ring-primary accent-primary"
                        checked={selectedToppings.some(t => t.id === topping.id)}
                        onChange={() => toggleTopping(topping)}
                      />
                      <span className="font-medium text-gray-700">{topping.name}</span>
                    </div>
                    <span className="text-gray-600">+${topping.price.toFixed(2)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Sauces */}
          {food.sauces && food.sauces.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3">Sauce</h3>
              <div className="grid grid-cols-2 gap-3">
                {food.sauces.map(sauce => (
                  <label key={sauce.name} className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition ${selectedSauce?.name === sauce.name ? 'border-primary bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name="sauce" 
                      className="hidden"
                      checked={selectedSauce?.name === sauce.name}
                      onChange={() => setSelectedSauce(sauce)}
                    />
                    <span className={`font-medium ${selectedSauce?.name === sauce.name ? 'text-primary' : 'text-gray-700'}`}>{sauce.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3">Special Instructions</h3>
            <textarea 
              rows="3"
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              placeholder="E.g. No onions please, extra napkins..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
          <div className="flex items-center bg-white rounded-full border border-gray-200 p-1">
            <button 
              className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus size={18} />
            </button>
            <span className="w-10 text-center font-bold text-lg">{quantity}</span>
            <button 
              className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus size={18} />
            </button>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-full font-bold transition flex justify-between items-center shadow-lg shadow-orange-500/30"
          >
            <span>Add to Cart</span>
            <span>${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodModal;
