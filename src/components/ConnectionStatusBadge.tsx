// src/components/ConnectionStatusBadge.tsx
import React, { useState, useEffect } from 'react';

const ConnectionStatusBadge: React.FC = () => {
  // 1. Initialize state with the browser's current online status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // 2. Event listeners to update state when connection changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 3. Cleanup function to remove listeners when the component unmounts
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 4. Render the badge with conditional styling
  return (
    <div
      className={`
        fixed bottom-2 left-2 z-50 flex items-center px-3 py-1 rounded-full text-white text-xs font-bold transition-all
        ${isOnline ? 'bg-green-500' : 'bg-gray-500'}
      `}
    >
      <span className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-300' : 'bg-gray-300'}`}></span>
      {isOnline ? 'Online' : 'Offline'}
    </div>
  );
};

export default ConnectionStatusBadge;