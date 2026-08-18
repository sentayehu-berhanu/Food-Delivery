import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Star, Clock, Info, Search, Filter } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import FoodModal from '../components/FoodModal';
import RestaurantInfoModal from '../components/RestaurantInfoModal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Mock Data for Phase 2
const MOCK_RESTAURANT = {
  id: '1',
  name: 'Pizza House',
  rating: 4.8,
  time: '25-35 min',
  tags: 'Italian • Pizza • Fast Food',
  priceLevel: '$$',
  image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&auto=format&fit=crop&q=80',
  categories: ['Popular', 'Pizzas', 'Sides', 'Drinks'],
  address: '456 Pizza Lane, Food City, FC 12345',
  phone: '+1 (555) 987-6543',
  email: 'hello@pizzahouse.com'
};

const MOCK_MENU = [
  {
    id: 'f1',
    category: 'Popular',
    name: 'Margherita Pizza',
    description: 'Fresh tomato, mozzarella, and basil on a crispy thin crust.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60',
    sizes: [
      { name: 'Regular (10")', price: 12.00 },
      { name: 'Large (14")', price: 16.00 }
    ],
    toppings: [
      { id: 't1', name: 'Extra Cheese', price: 2.00 },
      { id: 't2', name: 'Pepperoni', price: 2.50 },
      { id: 't3', name: 'Mushrooms', price: 1.50 }
    ],
    sauces: [
      { name: 'Tomato Sauce' },
      { name: 'Garlic Butter' },
      { name: 'Spicy Marinara' }
    ]
  },
  {
    id: 'f2',
    category: 'Popular',
    name: 'Classic Burger',
    description: 'Beef patty, american cheese, lettuce, tomato, and our secret sauce.',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
    sizes: [
      { name: 'Single', price: 10.00 },
      { name: 'Double', price: 13.50 }
    ],
    toppings: [
      { id: 't4', name: 'Bacon', price: 2.00 },
      { id: 't5', name: 'Fried Egg', price: 1.50 },
      { id: 't6', name: 'Avocado', price: 2.00 }
    ],
    sauces: [
      { name: 'Ketchup & Mustard' },
      { name: 'Mayo' },
      { name: 'BBQ Sauce' }
    ]
  },
  {
    id: 'f3',
    category: 'Sides',
    name: 'Garlic Bread',
    description: 'Oven baked bread topped with garlic, butter and herbs.',
    price: 5.50,
    image: null,
    sizes: [],
    toppings: [
      { id: 't7', name: 'Add Cheese', price: 1.50 }
    ],
    sauces: []
  }
];

const RestaurantDetails = () => {
  const { id } = useParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  
  const [restaurant, setRestaurant] = useState(MOCK_RESTAURANT);
  const [menuItems, setMenuItems] = useState(MOCK_MENU);
  
  const headerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    // Load restaurant details from localStorage if available
    const adminSaved = localStorage.getItem('mockRestaurants');
    if (adminSaved) {
      const parsed = JSON.parse(adminSaved);
      const found = parsed.find(r => r.id.toString() === id?.toString());
      if (found) {
        setRestaurant({
          id: found.id,
          name: found.name,
          rating: (4.0 + Math.random()).toFixed(1),
          time: '30-45 min',
          tags: 'New Partner',
          priceLevel: '$$',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
          categories: ['Popular', 'Burgers', 'Pizza', 'Appetizers', 'Drinks', 'Desserts'],
          address: '123 Partner Lane',
          phone: '(555) 123-4567',
          email: 'contact@partner.com'
        });
      }
    }

    // Load menu items from partner dashboard localStorage
    const savedMenu = localStorage.getItem('mockMenuItems');
    if (savedMenu) {
      const parsedMenu = JSON.parse(savedMenu);
      const formattedMenu = parsedMenu.map(m => ({
        id: m.id,
        category: m.category || 'Popular',
        name: m.name,
        description: 'Freshly prepared daily.',
        price: m.price,
        image: m.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
        sizes: [],
        toppings: [],
        sauces: []
      }));
      if (formattedMenu.length > 0) {
        setMenuItems(formattedMenu);
      }
    }
  }, [id]);

  useEffect(() => {
    // Page load animations
    gsap.fromTo(headerRef.current, 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
    
    gsap.fromTo('.menu-item-card', 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.3, ease: 'power3.out' }
    );
  }, [menuItems]);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleFoodClick = (food) => {
    setSelectedFood(food);
  };

  const handleAddToCart = (cartItem) => {
    if (!user) {
      navigate('/login', { state: { message: 'Please log in to add items to your cart.' } });
      return;
    }
    addToCart(cartItem);
    console.log('Added to cart:', cartItem);
  };

  const filteredMenu = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && (searchQuery ? true : matchesCategory); // If searching, ignore category filter
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Cover Header */}
      <div ref={headerRef} className="bg-white">
        <div className="h-64 md:h-80 w-full relative">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{restaurant.name}</h1>
              <p className="text-gray-500 mb-4">{restaurant.tags}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-700">
                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg">
                  <Star size={16} className="fill-yellow-500 text-yellow-500" />
                  <span>{restaurant.rating} (500+ ratings)</span>
                </div>
                <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg">
                  <Clock size={16} className="text-gray-500" />
                  <span>{restaurant.time}</span>
                </div>
                <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg">
                  <span className="text-gray-500">{restaurant.priceLevel}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsInfoModalOpen(true)}
              className="flex items-center gap-2 text-primary font-bold hover:bg-orange-50 px-4 py-2 rounded-xl transition"
            >
              <Info size={20} />
              More Info
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Categories */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search in menu..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Filter size={18} className="text-primary" />
                Categories
              </h3>
              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => setActiveCategory('All')}
                  className={`text-left px-4 py-2.5 rounded-xl font-medium transition ${activeCategory === 'All' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  All Items
                </button>
                {restaurant.categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-left px-4 py-2.5 rounded-xl font-medium transition ${activeCategory === cat ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="lg:w-3/4" ref={menuRef}>
            <div className="mb-6 flex justify-between items-end">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery ? 'Search Results' : activeCategory}
              </h2>
            </div>
            
            {filteredMenu.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <p className="text-gray-500 text-lg">No items found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMenu.map(food => (
                  <div key={food.id} className="menu-item-card h-full">
                    <FoodCard food={food} onClick={handleFoodClick} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Food Customization Modal */}
      {selectedFood && (
        <FoodModal 
          food={selectedFood} 
          onClose={() => setSelectedFood(null)} 
          onAddToCart={handleAddToCart}
          restaurantEmail={restaurant.email}
        />
      )}

      {/* Restaurant Info Modal */}
      <RestaurantInfoModal 
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        restaurant={restaurant}
      />
    </div>
  );
};

export default RestaurantDetails;
