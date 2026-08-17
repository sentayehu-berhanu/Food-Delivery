import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocationContext = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [deliveryLocation, setDeliveryLocation] = useState(() => {
    return localStorage.getItem('foodgo_location') || 'Select Location';
  });

  useEffect(() => {
    localStorage.setItem('foodgo_location', deliveryLocation);
  }, [deliveryLocation]);

  return (
    <LocationContext.Provider value={{ deliveryLocation, setDeliveryLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
