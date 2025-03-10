import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import useFetch from "./hooks/useFetch";
import MobileMonitorDashboard from "./components/MobileMonitorDashboard";
import InAppNotification from "./components/InAppNotification";
import { 
  requestNotificationPermission, 
  setupMessageListener, 
  subscribeToEvents,
  checkNotificationSupport,
  showNotification,
  registerEventCallback,
  unregisterEventCallback
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
 * 5. Universal fallback notifications for all platforms
 */
function App() {
  console.log("[App] Component rendering...");
  
  const fetchData = useFetch();
  const [newEvents, setNewEvents] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [appReady, setAppReady] = useState(false);
  
  // State for in-app notifications (iOS fallback)
  const [notification, setNotification] = useState(null);
  
  // Notification callback for platforms without native notifications
  const handleNotification = useCallback((notificationData) => {
    console.log("[App] In-app notification triggered:", notificationData);
    setNotification(notificationData);
  }, []);
  
  const handleGetAPIStatus = async () => {
    console.log("[App] Checking API status...");
    try {
      const res = await fetchData("/api/status", "GET");
      if (!res.ok) throw new Error(res.data);
      console.log("[App] API status response:", res.data.response);
      return true;
    } catch (error) {
      console.error(`[App] API status check failed:`, error.message);
      return false;
    }
  };

  const handleGetAllEvents = async () => {
    console.log("[App] Getting all events...");
    try {
      const res = await fetchData("/events", "GET");
      if (!res.ok) throw new Error(res.data);
      console.log("[App] All events retrieved");
      return res.data.response;
    } catch (error) {
      console.error(`[App] Failed to get all events:`, error.message);
      return [];
    }
  };

  const handleGetLatestEvents = async () => {
    console.log("[App] Getting latest events...");
    try {
      const res = await fetchData(`/events/latest`, "GET");
      if (!res.ok) throw new Error(res.data);
      console.log("[App] Latest events retrieved");
      return res.data.response;
    } catch (error) {
      console.error(`[App] Failed to get latest events:`, error.message);
      return [];
    }
  };

  const handleGetRecentEvents = async () => {
    console.log("[App] Getting recent events...");
    try {
      const res = await fetchData(`/events/recent`, "GET");
      if (!res.ok) throw new Error(res.data);
      console.log("[App] Recent events retrieved");
      return res.data.response;
    } catch (error) {
      console.error(`[App] Failed to get recent events:`, error.message);
      return [];
    }
  };

  // Handle new event received from Firestore
  const handleNewEvent = (event) => {
    console.log("[App] New event received:", event);
    try {
      setNewEvents(prevEvents => [event, ...prevEvents]);
      
      // Try to show a notification - no need to check here as 
      // showNotification will handle that internally and call our callback
      // if native notifications aren't available
      showNotification(
        'HomePal Alert', 
        `New event: ${event.action || 'Event detected'}`
      );
    } catch (error) {
      console.error('[App] Error handling new event:', error);
      // Even if notification fails, still show in-app notification
      handleNotification({ 
        title: 'HomePal Alert', 
        body: `New event: ${event.action || 'Event detected'}` 
      });
    }
  };

  // Register the in-app notification callback
  useEffect(() => {
    // Register for fallback notifications
    registerEventCallback(handleNotification);
    
    // Cleanup on unmount
    return () => {
      unregisterEventCallback(handleNotification);
    };
  }, [handleNotification]);

  // Setup notification permission and Firebase listeners
  useEffect(() => {
    console.log("[App] Main useEffect running...");
    
    // Setup notification permission with error handling
    const setupNotifications = async () => {
      console.log("[App] Setting up notifications...");
      try {
        // Check if notifications are supported - but proceed anyway
        // as we'll use fallback for unsupported platforms
        const supported = checkNotificationSupport();
        console.log("[App] Notification API supported:", supported);
        
        // Try to request permission if supported
        let permission = false;
        if (supported) {
          permission = await requestNotificationPermission();
          setNotificationPermission(permission);
          console.log("[App] Notification permission:", permission);
          
          if (permission) {
            // Setup foreground message listener
            setupMessageListener();
          }
        } else {
          console.log("[App] Using fallback notifications only");
        }
        
        return true; // Return success even if permissions denied, we'll use fallback
      } catch (error) {
        console.error("[App] Failed to setup notifications:", error);
        return true; // Still return success, we'll use fallback
      }
    };
    
    // Initialize all services
    const initializeApp = async () => {
      console.log("[App] Initializing app...");
      setIsLoading(true);
      setHasError(false);
      
      try {
        // Try to initialize all services but continue even if some fail
        let unsubscribe = () => {};
        
        // 1. Setup notification permission (non-critical)
        console.log("[App] Setting up notifications...");
        await setupNotifications()
          .catch(err => {
            console.warn('[App] Notification setup failed:', err);
            // Continue anyway, we have fallback
          });
        
        // 2. Verify backend connectivity (more critical)
        console.log("[App] Checking API status...");
        const apiStatus = await handleGetAPIStatus()
          .catch(err => {
            console.warn('[App] API status check failed:', err);
            return false;
          });
        console.log("[App] API status:", apiStatus ? "Connected" : "Disconnected");
        
        // 3. Subscribe to Firestore events (handle errors internally)
        console.log("[App] Setting up Firestore listeners...");
        try {
          unsubscribe = subscribeToEvents(handleNewEvent) || (() => {});
          console.log("[App] Firestore listeners set up successfully");
        } catch (firestoreError) {
          console.error("[App] Failed to subscribe to Firestore events:", firestoreError);
          // App can still function without real-time updates
        }
        
        // Instead of immediately setting loading to false, we use a slight delay
        // This gives time for any React state updates to propagate
        console.log("[App] App initialization complete, preparing to render main content...");
        setTimeout(() => {
          console.log("[App] Setting loading state to false");
          setIsLoading(false);
          // Set app to ready after ensuring loading is complete
          setAppReady(true);
          console.log("[App] App is now ready");
        }, 500); // Short delay to ensure state updates are processed
        
        // Return cleanup function
        return () => {
          console.log("[App] Running cleanup function");
          try {
            if (unsubscribe) {
              unsubscribe();
              console.log("[App] Unsubscribed from Firestore");
            }
          } catch (cleanupError) {
            console.error("[App] Cleanup error:", cleanupError);
          }
        };
      } catch (error) {
        console.error("[App] Failed to initialize app:", error);
        setIsLoading(false);
        setHasError(true);
        return () => {}; // Empty cleanup function
      }
    };
    
    // Initialize app and store cleanup function
    console.log("[App] Starting app initialization...");
    const cleanup = initializeApp();
    
    // Return cleanup function for useEffect
    return () => {
      console.log("[App] Component unmounting, running cleanup...");
      cleanup.then(cleanupFn => {
        try {
          cleanupFn();
          console.log("[App] Cleanup completed");
        } catch (error) {
          console.error("[App] Error during cleanup:", error);
        }
      });
    };
  }, []);

  // Handle clearing notification
  const handleCloseNotification = () => {
    setNotification(null);
  };

  console.log("[App] Current state - isLoading:", isLoading, "hasError:", hasError, "appReady:", appReady);

  return (
    <div className="App">
      {/* In-app notification component - works on all platforms */}
      <InAppNotification 
        notification={notification} 
        onClose={handleCloseNotification}
        autoHideDuration={5000}
      />
      
      {isLoading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading HomePal...</p>
          <p className="debug-info">Please wait while we connect to services</p>
        </div>
      ) : hasError ? (
        <div className="error-screen">
          <h2>Connection Error</h2>
          <p>Unable to connect to HomePal services. Please check your connection and try again.</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : (
        <div className="dashboard-container">
          <MobileMonitorDashboard newEvents={newEvents} />
        </div>
      )}
    </div>
  );
}

export default App;