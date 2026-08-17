import React from 'react';
import { X, MapPin, Clock, Phone, Mail, Navigation } from 'lucide-react';

const RestaurantInfoModal = ({ isOpen, onClose, restaurant }) => {
  if (!isOpen || !restaurant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden relative">
        <div className="p-6 border-b border-gray-100">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
          
          <h2 className="text-2xl font-bold text-gray-900">About {restaurant.name}</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
              <MapPin className="text-primary" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Address</h3>
              <p className="text-gray-600">{restaurant.address || '123 Main St, City, Country'}</p>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address || '123 Main St, City, Country')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm font-bold mt-2 flex items-center gap-1 hover:underline w-fit"
              >
                <Navigation size={14} /> Get Directions
              </a>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
              <Clock className="text-primary" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Opening Hours</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li className="flex justify-between w-48"><span>Monday - Friday:</span> <span>10:00 AM - 10:00 PM</span></li>
                <li className="flex justify-between w-48"><span>Saturday:</span> <span>11:00 AM - 11:00 PM</span></li>
                <li className="flex justify-between w-48 text-red-500"><span>Sunday:</span> <span>Closed</span></li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
              <Phone className="text-primary" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Contact</h3>
              <p className="text-gray-600">{restaurant.phone || '+1 (555) 123-4567'}</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
              <Mail className="text-primary" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Email</h3>
              <p className="text-gray-600">{restaurant.email || 'contact@pizzahouse.com'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantInfoModal;
