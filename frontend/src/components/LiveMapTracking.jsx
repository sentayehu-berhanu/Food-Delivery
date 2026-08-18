import React from 'react';
import { Car } from 'lucide-react';

const LiveMapTracking = ({ status = 'DELIVERING' }) => {
  // We use a static map background to simulate a real map
  const mapImage = "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80";

  // Different animations based on status
  const isDelivering = status === 'DELIVERING' || status === 'ON_THE_WAY';

  return (
    <div className="relative w-full h-64 sm:h-80 rounded-3xl overflow-hidden bg-gray-200 shadow-inner group">
      {/* Map Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 ease-linear group-hover:scale-110"
        style={{ 
          backgroundImage: `url(${mapImage})`,
          filter: 'brightness(0.9) contrast(1.1)' 
        }}
      ></div>

      {/* Simulated Route Line (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path 
          d="M 20,80 C 40,80 30,20 80,20" 
          fill="transparent" 
          stroke="rgba(79, 70, 229, 0.4)" 
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
      </svg>

      {/* Destination Marker */}
      <div className="absolute top-[20%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative">
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg z-10 relative"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-red-500/20 rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Origin/Restaurant Marker */}
      <div className="absolute top-[80%] left-[20%] -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-4 h-4 bg-gray-800 rounded-full border-2 border-white shadow-lg"></div>
      </div>

      {/* Animated Car */}
      {isDelivering && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="w-full h-full absolute animate-drive-route">
            <div className="absolute -translate-x-1/2 -translate-y-1/2 bg-white text-primary p-2 rounded-full shadow-xl border-2 border-primary transform -rotate-45">
              <Car size={20} fill="currentColor" />
            </div>
          </div>
        </div>
      )}

      {/* Overlay Status */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg flex items-center justify-between border border-white">
        <div>
          <h4 className="font-bold text-gray-900 flex items-center gap-2">
            {isDelivering ? (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Driver is on the way
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                Preparing your order
              </>
            )}
          </h4>
          <p className="text-sm text-gray-500">
            {isDelivering ? 'Arriving in ~12 mins' : 'Waiting for driver assignment'}
          </p>
        </div>
        
        {isDelivering && (
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Driver</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" alt="Driver" />
              </div>
              <span className="font-bold text-gray-700 text-sm">Alex</span>
            </div>
          </div>
        )}
      </div>
      
      {/* CSS for custom animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes drive-route {
          0% { top: 80%; left: 20%; transform: rotate(15deg); }
          25% { top: 75%; left: 35%; transform: rotate(10deg); }
          50% { top: 45%; left: 32%; transform: rotate(-10deg); }
          75% { top: 25%; left: 55%; transform: rotate(20deg); }
          100% { top: 20%; left: 80%; transform: rotate(5deg); }
        }
        .animate-drive-route {
          animation: drive-route 15s linear infinite alternate;
        }
      `}} />
    </div>
  );
};

export default LiveMapTracking;
