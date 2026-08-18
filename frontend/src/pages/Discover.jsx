import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, Plus, ShoppingCart, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const DISCOVER_POSTS = [
  {
    id: 'post_1',
    restaurantId: 'rest_1',
    restaurantName: 'Pizza House',
    restaurantAvatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&auto=format&fit=crop&q=60',
    itemName: 'Truffle Mushroom Pizza',
    description: 'Fresh out of the oven! Our new signature Truffle Mushroom Pizza with roasted garlic and rich mozzarella. 🍕🍄',
    price: 18.99,
    media: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    likes: 1245,
    comments: 89
  },
  {
    id: 'post_2',
    restaurantId: 'rest_2',
    restaurantName: 'Burger Joint',
    restaurantAvatar: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100&auto=format&fit=crop&q=60',
    itemName: 'The Monster Burger',
    description: 'Double beef, triple cheese, crispy bacon, and our secret house sauce. Can you handle it? 🍔🔥',
    price: 16.50,
    media: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=800&auto=format&fit=crop&q=80',
    likes: 3421,
    comments: 210
  },
  {
    id: 'post_3',
    restaurantId: 'rest_3',
    restaurantName: 'Sushi Express',
    restaurantAvatar: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=100&auto=format&fit=crop&q=60',
    itemName: 'Dragon Roll Platter',
    description: 'Eel, cucumber, and avocado topped with spicy mayo. Beautiful and delicious! 🍣✨',
    price: 24.00,
    media: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
    likes: 892,
    comments: 45
  },
  {
    id: 'post_4',
    restaurantId: 'rest_5',
    restaurantName: 'The Sweet Tooth',
    restaurantAvatar: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=100&auto=format&fit=crop&q=60',
    itemName: 'Molten Lava Cake',
    description: 'Warm chocolate cake with a gooey fudge center, served with vanilla bean ice cream. 🍫🍦',
    price: 8.99,
    media: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&auto=format&fit=crop&q=80',
    likes: 5632,
    comments: 412
  }
];

const FoodPost = ({ post, isActive }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const { addToCart } = useCart();

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleAddToCart = () => {
    const cartItem = {
      cartId: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      id: post.id,
      name: post.itemName,
      price: post.price,
      restaurantId: post.restaurantId,
      image: post.media,
      quantity: 1
    };
    addToCart(cartItem);
    toast.success(`Added ${post.itemName} to cart!`);
  };

  return (
    <div className="relative w-full h-[100dvh] bg-black snap-start flex items-center justify-center overflow-hidden">
      {/* Background Image / Media */}
      <img 
        src={post.media} 
        alt={post.itemName}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ${isActive ? 'scale-100' : 'scale-110'}`}
      />
      
      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90"></div>

      {/* Main Content Area */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12 pb-24 md:pb-12 z-10 flex items-end justify-between">
        
        {/* Left Side: Info */}
        <div className="flex-1 max-w-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50">
              <img src={post.restaurantAvatar} alt={post.restaurantName} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{post.restaurantName}</h3>
              <div className="flex items-center text-white/80 text-xs">
                <MapPin size={12} className="mr-1" /> Nearby
              </div>
            </div>
            <button className="px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-full text-white text-xs font-bold transition ml-2">
              Follow
            </button>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight drop-shadow-md">
            {post.itemName}
          </h2>
          <p className="text-white/90 text-sm md:text-base mb-6 line-clamp-3 md:line-clamp-none drop-shadow-md">
            {post.description}
          </p>
          
          <button 
            onClick={handleAddToCart}
            className="group flex items-center gap-3 bg-primary hover:bg-primary-dark text-white px-6 py-4 rounded-2xl font-black text-lg transition shadow-xl hover:-translate-y-1 hover:shadow-orange-500/30"
          >
            <div className="bg-white/20 p-2 rounded-xl group-hover:scale-110 transition">
              <ShoppingCart size={20} className="text-white" />
            </div>
            <span>Order Now • ${post.price.toFixed(2)}</span>
          </button>
        </div>

        {/* Right Side: Actions (Vertical) */}
        <div className="flex flex-col items-center gap-6 ml-4">
          <button 
            onClick={handleLike}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 group-hover:bg-black/60 transition">
              <Heart size={24} className={`transition ${isLiked ? 'text-red-500 fill-red-500 scale-110' : 'text-white'}`} />
            </div>
            <span className="text-white font-bold text-xs">{likesCount >= 1000 ? (likesCount/1000).toFixed(1)+'k' : likesCount}</span>
          </button>

          <button className="flex flex-col items-center gap-1 group">
            <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 group-hover:bg-black/60 transition">
              <MessageCircle size={24} className="text-white" />
            </div>
            <span className="text-white font-bold text-xs">{post.comments}</span>
          </button>

          <button className="flex flex-col items-center gap-1 group">
            <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 group-hover:bg-black/60 transition">
              <Share2 size={24} className="text-white" />
            </div>
            <span className="text-white font-bold text-xs">Share</span>
          </button>
        </div>
        
      </div>
    </div>
  );
};

const Discover = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  // Intersection Observer to detect which post is active
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(Number(entry.target.dataset.index));
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6, // Fire when 60% of the post is visible
      }
    );

    const posts = document.querySelectorAll('.food-post');
    posts.forEach((post) => observer.observe(post));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 z-40 bg-black">
      {/* Absolute Header (Overlay on feed) */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <h1 className="text-2xl font-black text-white tracking-tight">FoodTok</h1>
        <div className="text-white/80 text-sm font-bold bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          Following | <span className="text-white">For You</span>
        </div>
      </div>

      {/* Snap Scrolling Container */}
      <div 
        ref={containerRef}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {DISCOVER_POSTS.map((post, index) => (
          <div key={post.id} className="food-post" data-index={index}>
            <FoodPost post={post} isActive={index === activeIndex} />
          </div>
        ))}
      </div>
      
      {/* Custom Styles for hiding scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default Discover;
