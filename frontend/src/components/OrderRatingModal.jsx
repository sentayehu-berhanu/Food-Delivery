import React, { useState } from 'react';
import { Star, X, MapPin, User as UserIcon } from 'lucide-react';
import { toast } from 'react-toastify';

const OrderRatingModal = ({ isOpen, onClose, order, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [foodRating, setFoodRating] = useState(0);
  const [foodHover, setFoodHover] = useState(0);
  const [foodReview, setFoodReview] = useState('');
  
  const [driverRating, setDriverRating] = useState(0);
  const [driverHover, setDriverHover] = useState(0);
  const [tipAmount, setTipAmount] = useState(0);

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (foodRating === 0) {
      toast.warn("Please select a rating for your food");
      return;
    }
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (driverRating === 0) {
      toast.warn("Please select a rating for the driver");
      return;
    }
    
    onSubmit({ 
      orderId: order.id, 
      restaurantId: order.restaurantId,
      foodRating,
      foodReview,
      driverRating,
      tipAmount
    });
    
    // Reset state
    setStep(1);
    setFoodRating(0);
    setDriverRating(0);
    setTipAmount(0);
    setFoodReview('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md relative shadow-2xl animate-fade-in-up overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full p-2 transition z-10"
        >
          <X size={20} />
        </button>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-6">
          <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
        </div>
        
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🍔
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Rate your food</h2>
              <p className="text-gray-500">How was your meal from {order.restaurantName}?</p>
            </div>
            
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setFoodHover(star)}
                  onMouseLeave={() => setFoodHover(0)}
                  onClick={() => setFoodRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                  <Star 
                    size={44} 
                    className={star <= (foodHover || foodRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} 
                  />
                </button>
              ))}
            </div>
            
            <div className="mb-6">
              <textarea
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition resize-none"
                rows="3"
                placeholder="What did you like or dislike? (Optional)"
                value={foodReview}
                onChange={(e) => setFoodReview(e.target.value)}
              ></textarea>
            </div>
            
            <button 
              onClick={handleNextStep}
              className="w-full bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold py-4 rounded-xl transition active:scale-95 flex items-center justify-center gap-2"
            >
              Next: Rate Driver
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <UserIcon size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Rate your driver</h2>
              <p className="text-gray-500">How was your delivery experience?</p>
            </div>
            
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setDriverHover(star)}
                  onMouseLeave={() => setDriverHover(0)}
                  onClick={() => setDriverRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                  <Star 
                    size={44} 
                    className={star <= (driverHover || driverRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} 
                  />
                </button>
              ))}
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
              <p className="text-center font-semibold text-gray-700 mb-3">Add a tip for the driver?</p>
              <div className="grid grid-cols-3 gap-3">
                {[2, 5, 10].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setTipAmount(amount)}
                    className={`py-2 rounded-xl font-bold transition-colors ${
                      tipAmount === amount 
                        ? 'bg-primary text-white shadow-md' 
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              {tipAmount > 0 && (
                <p className="text-center text-sm text-green-600 mt-3 font-medium animate-fade-in">
                  Thanks! 100% of tips go to the driver.
                </p>
              )}
            </div>
            
            <button 
              onClick={handleSubmit}
              className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-primary/30 active:scale-95"
            >
              Submit Feedback
            </button>
            <button 
              onClick={() => setStep(1)}
              className="w-full text-gray-500 font-medium py-3 mt-2 hover:text-gray-700 transition"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderRatingModal;
