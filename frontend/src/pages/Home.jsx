import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { Search, MapPin, Clock, Star, Heart, Sparkles, Mic, Leaf, WheatOff } from 'lucide-react';
import FavoriteButton from '../components/FavoriteButton';
import AIFoodMatchmaker from '../components/AIFoodMatchmaker';
import { useAuth } from '../context/AuthContext';

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

const DEFAULT_RESTAURANTS = [
  { id: '1', name: 'Pizza House', rating: 4.8, time: '25-35 min', tags: 'Italian • Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60', distance: 1.2 },
  { id: '2', name: 'Burger Joint', rating: 4.6, time: '30-40 min', tags: 'American • Fast Food', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60', distance: 2.5 },
  { id: '3', name: 'Sushi Master', rating: 4.9, time: '20-30 min', tags: 'Japanese • Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60', distance: 3.1 },
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const heroRef = useRef(null);
  const searchRef = useRef(null);
  const categoriesRef = useRef(null);
  const restaurantsRef = useRef(null);

  const [heroSearch, setHeroSearch] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    return JSON.parse(localStorage.getItem('recentSearches') || '[]');
  });
  
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState('delivery');
  const [sortBy, setSortBy] = useState('distance');
  const [dietFilter, setDietFilter] = useState('All');
  
  // Voice Search Mock
  const [isListening, setIsListening] = useState(false);
  
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  const [restaurants, setRestaurants] = useState(() => {
    const adminSaved = localStorage.getItem('mockRestaurants');
    if (adminSaved) {
      const parsedAdminRestaurants = JSON.parse(adminSaved);
      // Only show approved restaurants on the main website
      const approvedRestaurants = parsedAdminRestaurants.filter(r => r.status === 'APPROVED');
      
      return approvedRestaurants.map(adminRest => {
        // Check if it's one of our original default restaurants so we can keep its nice image and tags
        const original = DEFAULT_RESTAURANTS.find(orig => orig.name === adminRest.name);
        if (original) {
          return { ...original, id: adminRest.id };
        }
        
        // For entirely new restaurants added by the admin, give them some default values
        return {
          id: adminRest.id,
          name: adminRest.name,
          rating: (4.0 + Math.random()).toFixed(1),
          time: '30-45 min',
          tags: 'New Partner',
          distance: +(Math.random() * 5 + 1).toFixed(1), // Random distance 1-6 km
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60' // generic restaurant interior
        };
      });
    }
    return DEFAULT_RESTAURANTS;
  });

  let filteredRestaurants = restaurants.filter(r => 
    (r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.tags.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (dietFilter === 'All' || r.tags.toLowerCase().includes(dietFilter.toLowerCase()))
  );
  
  // Sort restaurants
  if (sortBy === 'distance') {
    filteredRestaurants.sort((a, b) => a.distance - b.distance);
  } else if (sortBy === 'rating') {
    filteredRestaurants.sort((a, b) => b.rating - a.rating);
  }

  // Calculate search suggestions
  const searchSuggestions = heroSearch.trim() ? [
    ...restaurants.filter(r => r.name.toLowerCase().includes(heroSearch.toLowerCase())).map(r => ({ type: 'Restaurant', text: r.name, id: r.id })),
    ...CATEGORIES.filter(c => c.name.toLowerCase().includes(heroSearch.toLowerCase())).map(c => ({ type: 'Category', text: c.name }))
  ].slice(0, 5) : [];

  const handleExecuteSearch = (query) => {
    if (!query.trim()) return;
    
    // Save to recent searches
    const newRecents = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(newRecents);
    localStorage.setItem('recentSearches', JSON.stringify(newRecents));
    
    setShowSearchDropdown(false);
    navigate(`/?search=${encodeURIComponent(query)}`);
    
    // Scroll to results
    restaurantsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setHeroSearch('Find me spicy tacos nearby');
      setTimeout(() => handleExecuteSearch('Mexican'), 500);
    }, 2000);
  };


  // Calculate Recommended Restaurant
  const [recommendedRestaurant, setRecommendedRestaurant] = useState(null);
  
  useEffect(() => {
    if (user && restaurants.length > 0) {
      const allMockOrders = JSON.parse(localStorage.getItem('mockLiveOrders') || '[]');
      const myOrders = allMockOrders.filter(o => o.customerName === user.name);
      
      if (myOrders.length > 0) {
        // Find most common tag from past orders (mock logic: just get tags from first item in first order)
        // Since we don't have tags in order items, we'll try to match the restaurant ID from the past orders
        // For simplicity: suggest a different restaurant that shares a tag with one they ordered from
        
        // Let's just pick a random highly rated restaurant they HAVEN'T ordered from, or just pick the top rated
        const orderedNames = myOrders.map(o => o.items[0]?.name || '');
        const recommendation = restaurants.find(r => r.rating >= 4.8 && !orderedNames.includes(r.name)) || restaurants[0];
        
        setRecommendedRestaurant(recommendation);
      }
    }
  }, [user, restaurants]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      if (heroRef.current) {
        gsap.from(heroRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
        });
      }

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Abstract animated background */}
        <div className="absolute top-0 left-0 w-full h-full bg-slate-900 overflow-hidden z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] rounded-full bg-primary/40 blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] rounded-full bg-orange-500/20 blur-[120px]"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10" ref={heroRef}>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight leading-tight">
            Cravings <br />
            <span className="gradient-text">delivered hot.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto font-light">
            Order from hundreds of local restaurants and get your favorite meals delivered fast and fresh.
          </p>

          {/* Location Search Container */}
          <div 
            ref={searchRef}
            className="max-w-2xl mx-auto relative z-30"
          >
            <div className="glass p-2.5 rounded-full shadow-2xl shadow-primary/20 flex items-center gap-2">
              <div className="flex-1 flex items-center pl-5">
                <MapPin className="text-primary mr-3" size={28} />
                <input 
                  type="text" 
                  placeholder="Search for restaurants or food..." 
                  className="w-full py-4 outline-none text-gray-900 bg-transparent text-lg font-medium placeholder-gray-500"
                  value={heroSearch}
                  onFocus={() => setShowSearchDropdown(true)}
                  onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                  onChange={(e) => {
                    setHeroSearch(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleExecuteSearch(heroSearch);
                  }}
                />
                <button 
                  onClick={handleVoiceSearch}
                  className={`p-3 rounded-full transition-all mr-2 ${isListening ? 'bg-red-100 text-red-500 animate-pulse scale-110' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  <Mic size={20} />
                </button>
              </div>
              <button 
                onClick={() => handleExecuteSearch(heroSearch)}
                className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-full font-bold transition-all flex items-center gap-2 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
              >
                <Search size={22} />
                Find Food
              </button>
            </div>

            {/* Smart Search Dropdown */}
            {showSearchDropdown && (heroSearch || recentSearches.length > 0) && (
              <div className="absolute top-full left-0 w-full mt-4 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden text-left z-40">
                {!heroSearch && recentSearches.length > 0 && (
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2 px-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recent Searches</span>
                      <button 
                        onClick={() => { setRecentSearches([]); localStorage.removeItem('recentSearches'); }}
                        className="text-xs text-gray-400 hover:text-red-500 transition"
                      >
                        Clear
                      </button>
                    </div>
                    {recentSearches.map((recent, idx) => (
                      <div 
                        key={idx}
                        onClick={() => { setHeroSearch(recent); handleExecuteSearch(recent); }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl cursor-pointer transition text-gray-700"
                      >
                        <Clock size={16} className="text-gray-400" />
                        <span className="font-medium">{recent}</span>
                      </div>
                    ))}
                  </div>
                )}

                {heroSearch && (
                  <div className="p-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 mb-2 block">Suggestions</span>
                    {searchSuggestions.length > 0 ? (
                      searchSuggestions.map((sugg, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            if (sugg.type === 'Restaurant') {
                              navigate(`/restaurant/${sugg.id}`);
                            } else {
                              setHeroSearch(sugg.text);
                              handleExecuteSearch(sugg.text);
                            }
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl cursor-pointer transition text-gray-700"
                        >
                          <Search size={16} className="text-gray-400" />
                          <span className="font-medium flex-1">{sugg.text}</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-500 font-semibold">{sugg.type}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500">No suggestions found. Press enter to search.</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* AI Food Matchmaker Banner */}
        <AIFoodMatchmaker />

        {/* Categories */}
        <div className="mb-16" ref={categoriesRef}>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Explore Categories</h2>
            <button 
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-primary font-medium hover:underline"
            >
              {showAllCategories ? 'Show less' : 'See all'}
            </button>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-5">
            {(showAllCategories ? CATEGORIES : CATEGORIES.slice(0, 6)).map((cat, idx) => (
              <div 
                key={idx} 
                onClick={() => navigate(`/?search=${encodeURIComponent(cat.name)}`)}
                className="category-item bg-white dark:bg-slate-800 p-6 rounded-[2rem] card-shadow border border-slate-100 dark:border-slate-700 text-center cursor-pointer hover-lift flex flex-col items-center justify-center gap-4 group hover:border-primary/30 dark:hover:border-primary/30"
              >
                <div className="text-5xl group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 drop-shadow-md">{cat.icon}</div>
                <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendation */}
        {recommendedRestaurant && (
          <div className="mb-16 bg-gradient-to-br from-orange-50 to-primary/10 rounded-[2rem] p-8 md:p-12 border border-primary/20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 text-primary/10">
              <Sparkles size={250} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-dark font-bold px-4 py-2 rounded-full text-sm mb-4">
                  <Sparkles size={16} /> Recommended for You
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                  Because you ordered similar food...
                </h2>
                <p className="text-gray-600 mb-6 text-lg">
                  We think you'll love <span className="font-bold text-gray-900">{recommendedRestaurant.name}</span>! They have amazing {recommendedRestaurant.tags.split('•')[0].trim()} dishes.
                </p>
                <button 
                  onClick={() => navigate(`/restaurant/${recommendedRestaurant.id}`)}
                  className="bg-primary text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-dark transition shadow-lg shadow-primary/30"
                >
                  Order from {recommendedRestaurant.name}
                </button>
              </div>
              <div className="w-full md:w-1/3">
                <div className="aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                  <img src={recommendedRestaurant.image} alt={recommendedRestaurant.name} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nearby Restaurants */}
        <div ref={restaurantsRef}>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Nearby Restaurants'}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                <span className="text-sm font-medium text-gray-500">Sort by:</span>
                <select 
                  className="bg-transparent text-sm font-bold text-gray-900 outline-none cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="distance">Distance</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
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
          </div>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <button 
              onClick={() => setDietFilter('All')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition ${dietFilter === 'All' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              All
            </button>
            <button 
              onClick={() => setDietFilter('Vegan')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition flex items-center gap-2 ${dietFilter === 'Vegan' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-700 border border-green-200 hover:bg-green-50'}`}
            >
              <Leaf size={16} /> Vegan
            </button>
            <button 
              onClick={() => setDietFilter('Vegetarian')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition flex items-center gap-2 ${dietFilter === 'Vegetarian' ? 'bg-green-500 text-white border-green-500' : 'bg-white text-green-600 border border-green-200 hover:bg-green-50'}`}
            >
              <Leaf size={16} /> Vegetarian
            </button>
            <button 
              onClick={() => setDietFilter('Gluten-Free')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition flex items-center gap-2 ${dietFilter === 'Gluten-Free' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-600 border border-amber-200 hover:bg-amber-50'}`}
            >
              <WheatOff size={16} /> Gluten-Free
            </button>
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
                className="restaurant-card bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden card-shadow border border-slate-100 dark:border-slate-700 hover-lift cursor-pointer group"
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold text-sm shadow-lg z-20 text-slate-900">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    {restaurant.rating}
                  </div>
                  <div className="absolute top-4 left-4 z-20">
                    <FavoriteButton restaurantId={restaurant.id} />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{restaurant.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">{restaurant.tags}</p>
                  
                  <div className="flex items-center justify-between text-sm border-t border-slate-100 dark:border-slate-700 pt-5">
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 font-semibold">
                      <Clock size={16} className="text-primary" />
                      <span>{restaurant.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <MapPin size={16} />
                      <span>{restaurant.distance} km</span>
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
