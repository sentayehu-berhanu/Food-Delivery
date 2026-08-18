import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FavoriteButton = ({ restaurantId, className = '' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user) {
      const favorites = JSON.parse(localStorage.getItem(`favorites_${user.email}`) || '[]');
      setIsFavorite(favorites.includes(restaurantId));
    }
  }, [user, restaurantId]);

  const toggleFavorite = (e) => {
    e.stopPropagation(); // Prevent clicking the parent card
    
    if (!user) {
      navigate('/login');
      return;
    }

    const storageKey = `favorites_${user.email}`;
    let favorites = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    if (isFavorite) {
      favorites = favorites.filter(id => id !== restaurantId);
    } else {
      favorites.push(restaurantId);
    }
    
    localStorage.setItem(storageKey, JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`p-2 rounded-full transition-all ${
        isFavorite 
          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
          : 'bg-white/80 backdrop-blur-md text-gray-500 hover:bg-white'
      } shadow-sm ${className}`}
      aria-label="Toggle Favorite"
    >
      <Heart 
        size={20} 
        className={`transition-all ${isFavorite ? 'fill-red-500 scale-110' : 'scale-100'}`} 
      />
    </button>
  );
};

export default FavoriteButton;
