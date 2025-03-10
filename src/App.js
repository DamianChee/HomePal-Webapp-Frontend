import React, { useState, useEffect } from "react";
import "./App.css";
import useFetch from "./hooks/useFetch";
import MobileMonitorDashboard from "./components/MobileMonitorDashboard";
import { 
  requestNotificationPermission, 
  setupMessageListener, 
  subscribeToEvents 
} from "./firebase";

/**
 * App Component
 *
 * Main application component that serves as the entry point.
 * Now using CarePal Mobile Dashboard as the default view.
 * The original app functionality is kept but commented out.
 *
 * The App includes:
 * 1. CarePal dashboard as the main view
 * 2. Firebase connectivity available in the background
 * 3. Uses modern React practices (hooks, functional components)
 * 4. Real-time event notifications from Firestore
 * 5. Push notifications via Firebase Cloud Messaging
 */
function App() {
  const fetchData = useFetch();
  const [newEvents, setNewEvents] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleGetAPIStatus = async () => {
    try {
      const res = await fetchData("/api/status", "GET");
      if (!res.ok) throw new Error(res.data);
      console.log(res.data.response);
      return true;
    } catch (error) {
      console.error(`[handleGetAPIStatus] Error has occurred:`, error.message);
      return false;
    }
  };

  const handleGetAllEvents = async () => {
    try {
      const res = await fetchData("/events", "GET");
      if (!res.ok) throw new Error(res.data);
      console.log(res.data.response);
      return res.data.response;
    } catch (error) {
      console.error(`[handleGetAllEvents] Error has occurred:`, error.message);
      return [];
    }
  };

  const handleGetLatestEvents = async () => {
    try {
      // const res = await fetchData("/events", "GET");
      const res = await fetchData(`/events/latest`, "GET");
      if (!res.ok) throw new Error(res.data);
      console.log(res.data.response);
      return res.data.response;
    } catch (error) {
      console.error(
        `[handleGetLatestEvents] Error has occurred:`,
        error.message
      );
      return [];
    }
  };

  const handleGetRecentEvents = async () => {
    try {
      // const res = await fetchData("/events", "GET");
      const res = await fetchData(`/events/recent`, "GET");
      if (!res.ok) throw new Error(res.data);
      console.log(res.data.response);
      return res.data.response;
    } catch (error) {
      console.error(
        `[handleGetRecentEvents] Error has occurred:`,
        error.message
      );
      return [];
    }
  };

  // Handle new event received from Firestore
  const handleNewEvent = (event) => {
    try {
      setNewEvents(prevEvents => [event, ...prevEvents]);
      
      // Show browser notification if permission granted and app is visible
      if (Notification.permission === 'granted' && document.visibilityState === 'visible') {
        // Create and show a notification using the Web Notifications API
        const notification = new Notification('HomePal Alert', {
          body: `New event: ${event.action || 'Event detected'}`,
          icon: '/logo192.png'
        });
        
        // Focus the window when notification is clicked
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }
    } catch (error) {
      console.error('Error handling new event:', error);
      // Continue app execution even if notification fails
    }
  };

  // Setup notification permission and Firebase listeners
  useEffect(() => {
    // Setup notification permission with error handling
    const setupNotifications = async () => {
      try {
        const token = await requestNotificationPermission();
        setNotificationPermission(!!token);
        
        if (token) {
          // Setup foreground message listener
          setupMessageListener();
        }
      } catch (error) {
        console.error("Failed to setup notifications:", error);
        // Continue app execution even if notifications fail
      }
    };
    
    // Initialize all services
    const initializeApp = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        // Try to initialize all services but continue even if some fail
        let unsubscribe = () => {};
        
        // 1. Setup notification permission (non-critical)
        await setupNotifications().catch(err => console.warn('Notification setup failed:', err));
        
        // 2. Verify backend connectivity (more critical)
        const apiStatus = await handleGetAPIStatus().catch(() => false);
        
        // 3. Subscribe to Firestore events (handle errors internally)
        try {
          unsubscribe = subscribeToEvents(handleNewEvent) || (() => {});
        } catch (firestoreError) {
          console.error("Failed to subscribe to Firestore events:", firestoreError);
          // App can still function without real-time updates
        }
        
        // Set loading state
        setIsLoading(false);
        
        // Return cleanup function
        return () => {
          try {
            if (unsubscribe) unsubscribe();
          } catch (cleanupError) {
            console.error("Cleanup error:", cleanupError);
          }
        };
      } catch (error) {
        console.error("Failed to initialize app:", error);
        setIsLoading(false);
        setHasError(true);
        return () => {}; // Empty cleanup function
      }
    };
    
    // Initialize app and store cleanup function
    const cleanup = initializeApp();
    
    // Return cleanup function for useEffect
    return () => {
      cleanup.then(cleanupFn => {
        try {
          cleanupFn();
        } catch (error) {
          console.error("Error during cleanup:", error);
        }
      });
    };
  }, []);

  // Display MobileMonitorDashboard as the main view
  // Pass new events from real-time listeners
  return (
    <div className="App">
      {isLoading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading HomePal...</p>
        </div>
      ) : hasError ? (
        <div className="error-screen">
          <h2>Connection Error</h2>
          <p>Unable to connect to HomePal services. Please check your connection and try again.</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : (
        <MobileMonitorDashboard newEvents={newEvents} />
      )}
    </div>
  );
}

export default App;