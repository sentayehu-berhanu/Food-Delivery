import React, { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';

const LocationModal = ({ isOpen, onClose }) => {
  const { deliveryLocation, setDeliveryLocation } = useLocationContext();
  const [inputValue, setInputValue] = useState(deliveryLocation === 'Select Location' ? '' : deliveryLocation);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setDeliveryLocation(inputValue.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden relative">
        <div className="p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Delivery Location</h2>
          <p className="text-gray-500 mb-6">Enter your address to see local restaurants.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter full address..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-gray-700 text-lg transition"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition shadow-lg shadow-orange-500/30"
            >
              Confirm Location
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
