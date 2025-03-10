import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

/**
 * InAppNotification Component
 * 
 * A fallback notification system that works on all platforms,
 * especially for iOS where browser notifications are restricted.
 */
const InAppNotification = ({ 
  notification, 
  autoHideDuration = 5000,
  onClose = () => {}
}) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Show notification when props change
    if (notification) {
      setVisible(true);
      
      // Auto-hide the notification after duration
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, autoHideDuration);
      
      // Clear timer on unmount
      return () => clearTimeout(timer);
    }
  }, [notification, autoHideDuration, onClose]);
  
  // Don't render anything if no notification or not visible
  if (!notification || !visible) return null;
  
  // Determine color based on event type (if available)
  let bgColor = 'bg-blue-500';
  if (notification.title?.includes('Alert') || notification.body?.includes('Bed-Exit') || notification.body?.includes('fall')) {
    bgColor = 'bg-red-500';
  } else if (notification.body?.includes('Attempted')) {
    bgColor = 'bg-yellow-500';
  }
  
  const handleClose = () => {
    setVisible(false);
    onClose();
  };
  
  return (
    <div className="fixed inset-x-0 top-4 z-50 px-4 flex justify-center pointer-events-none">
      <div className={`${bgColor} shadow-lg rounded-lg px-4 py-3 flex items-center space-x-3 max-w-md w-full animate-bounce-once pointer-events-auto`}>
        <Bell className="text-white h-5 w-5 flex-shrink-0" />
        
        <div className="flex-1 text-white">
          <div className="font-medium">{notification.title || "HomePal Alert"}</div>
          <div className="text-sm">{notification.body || "New event detected"}</div>
        </div>
        
        <button 
          onClick={handleClose}
          className="text-white opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default InAppNotification;