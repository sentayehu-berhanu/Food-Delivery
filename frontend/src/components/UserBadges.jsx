import React from 'react';
import { Award, Moon, Leaf, Flame, Star, Coffee } from 'lucide-react';

const UserBadges = () => {
  // Mock unlocked badges for the current user
  const unlockedBadges = ['burger_boss', 'midnight_snacker', 'first_order'];

  const badges = [
    {
      id: 'first_order',
      title: 'First Bite',
      description: 'Placed your very first order.',
      icon: <Star size={28} />,
      color: 'from-yellow-400 to-orange-500',
      shadow: 'shadow-orange-500/40'
    },
    {
      id: 'burger_boss',
      title: 'Burger Boss',
      description: 'Ordered 5+ burgers.',
      icon: <Flame size={28} />,
      color: 'from-red-400 to-rose-600',
      shadow: 'shadow-rose-500/40'
    },
    {
      id: 'midnight_snacker',
      title: 'Night Owl',
      description: 'Ordered food after 11 PM.',
      icon: <Moon size={28} />,
      color: 'from-indigo-400 to-purple-600',
      shadow: 'shadow-indigo-500/40'
    },
    {
      id: 'healthy_eater',
      title: 'Green Machine',
      description: 'Ordered vegan/vegetarian 3 times.',
      icon: <Leaf size={28} />,
      color: 'from-emerald-400 to-teal-600',
      shadow: 'shadow-emerald-500/40'
    },
    {
      id: 'caffeine_addict',
      title: 'Caffeine Addict',
      description: 'Ordered coffee 10+ times.',
      icon: <Coffee size={28} />,
      color: 'from-amber-600 to-yellow-800',
      shadow: 'shadow-amber-700/40'
    },
    {
      id: 'top_reviewer',
      title: 'Top Critic',
      description: 'Left 5 highly-rated reviews.',
      icon: <Award size={28} />,
      color: 'from-blue-400 to-cyan-600',
      shadow: 'shadow-blue-500/40'
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mt-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-2xl text-white shadow-lg shadow-orange-500/30">
          <Award size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Trophy Room</h2>
          <p className="text-gray-500 text-sm">Earn badges by completing special challenges!</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {badges.map(badge => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          
          return (
            <div 
              key={badge.id}
              className={`relative flex flex-col items-center text-center p-6 rounded-3xl transition-all duration-300 ${isUnlocked ? 'bg-gray-50 hover:-translate-y-1' : 'bg-gray-50/50 opacity-60 grayscale'}`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4 ${isUnlocked ? `bg-gradient-to-br ${badge.color} shadow-lg ${badge.shadow}` : 'bg-gray-300'}`}>
                {badge.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{badge.title}</h3>
              <p className="text-xs text-gray-500">{badge.description}</p>
              
              {!isUnlocked && (
                <div className="absolute top-3 right-3 text-[10px] font-bold bg-gray-200 text-gray-500 px-2 py-1 rounded-full">
                  LOCKED
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserBadges;
