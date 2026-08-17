import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { Search, MapPin, Clock, Star } from 'lucide-react';

const CATEGORIES = [
  { icon: '🍕', name: 'Pizza' },
  { icon: '🍔', name: 'Burger' },
  { icon: '🍣', name: 'Sushi' },
  { icon: '🌮', name: 'Mexican' },
  { icon: '☕', name: 'Cafe' },
  { icon: '🥗', name: 'Healthy' },
  { icon: '🍰', name: 'Desserts' },
  { icon: '🍦', name: 'Ice Cream' },
  { icon: '🍜', name: 'Noodles' },
  { icon: '🍛', name: 'Curry' },
  { icon: '🥪', name: 'Sandwich' },
  { icon: '🍗', name: 'Chicken' }
];

const RESTAURANTS = [
  { id: 1, name: 'Pizza House', rating: 4.8, time: '25-35 min', tags: 'Italian • Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Burger Joint', rating: 4.6, time: '30-40 min', tags: 'American • Fast Food', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
  { id: 3, name: 'Sushi Master', rating: 4.9, time: '20-30 min', tags: 'Japanese • Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60' },
];

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const heroRef = useRef(null);
  const searchRef = useRef(null);
  const categoriesRef = useRef(null);
  const restaurantsRef = useRef(null);

  const [heroSearch, setHeroSearch] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState('delivery');
  
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  const filteredRestaurants = RESTAURANTS.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.tags.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.from(heroRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });

      // Search bar animation
      gsap.from(searchRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: 'power3.out',
      });

      // Categories stagger
      gsap.from('.category-item', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.8,
        ease: 'back.out(1.7)',
      });

      // Restaurants stagger
      gsap.from('.restaurant-card', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        delay: 1,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center" ref={heroRef}>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Delicious food <br />
            <span className="text-primary">delivered to your door</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Order from hundreds of local restaurants and get your favorite meals delivered fast and fresh.
          </p>

          {/* Location Search Container */}
          <div 
            ref={searchRef}
            className="max-w-2xl mx-auto bg-white p-2 rounded-full shadow-lg flex items-center gap-2 border border-gray-100 glass"
          >
            <div className="flex-1 flex items-center pl-4">
              <MapPin className="text-primary mr-2" size={24} />
              <input 
                type="text" 
                placeholder="Search for restaurants or food..." 
                className="w-full py-3 outline-none text-gray-700 bg-transparent text-lg"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && heroSearch.trim()) {
                    navigate(`/?search=${encodeURIComponent(heroSearch.trim())}`);
                  }
                }}
              />
            </div>
            <button 
              onClick={() => heroSearch.trim() && navigate(`/?search=${encodeURIComponent(heroSearch.trim())}`)}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-bold transition flex items-center gap-2"
            >
              <Search size={20} />
              Find Food
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Categories */}
        <div className="mb-16" ref={categoriesRef}>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Explore Categories</h2>
            <button 
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-primary font-medium hover:underline"
            >
              {showAllCategories ? 'Show less' : 'See all'}
            </button>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {(showAllCategories ? CATEGORIES : CATEGORIES.slice(0, 6)).map((cat, idx) => (
              <div 
                key={idx} 
                onClick={() => navigate(`/?search=${encodeURIComponent(cat.name)}`)}
                className="category-item bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center cursor-pointer hover-lift flex flex-col items-center justify-center gap-3 group"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</div>
                <span className="font-medium text-gray-700">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Restaurants */}
        <div ref={restaurantsRef}>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Nearby Restaurants'}
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setDeliveryMode('delivery')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${deliveryMode === 'delivery' ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >
                Delivery
              </button>
              <button 
                onClick={() => setDeliveryMode('pickup')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${deliveryMode === 'pickup' ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >
                Pickup
              </button>
            </div>
          </div>
          
          {filteredRestaurants.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
              <p className="text-gray-500 text-lg">No restaurants found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRestaurants.map((restaurant) => (
              <div 
                key={restaurant.id} 
                className="restaurant-card bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover-lift cursor-pointer"
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 font-bold text-sm shadow-sm">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    {restaurant.rating}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">{restaurant.tags}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                      <Clock size={14} className="text-primary" />
                      <span className="font-medium">{restaurant.time}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                      <span className="font-medium text-green-600">
                        {deliveryMode === 'delivery' ? 'Free delivery' : 'Pickup available'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
