import React from 'react';
import { CheckCircle, ChefHat, Bike, Package, Clock } from 'lucide-react';

const STEPS = [
  { id: 'PENDING', label: 'Confirmed', icon: CheckCircle },
  { id: 'PREPARING', label: 'Preparing', icon: ChefHat },
  { id: 'READY', label: 'Ready', icon: Package },
  { id: 'OUT_FOR_DELIVERY', label: 'On the Way', icon: Bike },
  { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle }
];

const getStepIndex = (status) => {
  const index = STEPS.findIndex(s => s.id === status);
  return index === -1 ? 0 : index;
};

const OrderTimeline = ({ status }) => {
  const currentIndex = getStepIndex(status);

  return (
    <div className="w-full py-4 px-2">
      <div className="relative flex justify-between items-center w-full">
        {/* Background Track */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
        
        {/* Active Track */}
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-500 ease-in-out"
          style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        {STEPS.map((step, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/30' 
                    : 'bg-white border-2 border-gray-200 text-gray-400'
                } ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}`}
              >
                <Icon size={16} className={isCurrent ? 'animate-bounce' : ''} />
              </div>
              <span className={`absolute top-12 text-[10px] md:text-xs font-bold whitespace-nowrap transition-colors ${
                isActive ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
