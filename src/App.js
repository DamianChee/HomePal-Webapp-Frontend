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
  console.log("[App] Component rendering...");
  
  const fetchData = useFetch();
  const [newEvents, setNewEvents] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [appReady, setAppReady] = useState(false); // Added safety flag

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
      console.error('[App] Error handling new event:', error);
      // Continue app execution even if notification fails
    }
  };

  // Setup notification permission and Firebase listeners
  useEffect(() => {
    console.log("[App] Main useEffect running...");
    
    // Setup notification permission with error handling
    const setupNotifications = async () => {
      console.log("[App] Setting up notifications...");
      try {
        const token = await requestNotificationPermission();
        setNotificationPermission(!!token);
        console.log("[App] Notification permission:", !!token);
        
        if (token) {
          // Setup foreground message listener
          setupMessageListener();
          console.log("[App] Message listener set up");
        }
        return !!token;
      } catch (error) {
        console.error("[App] Failed to setup notifications:", error);
        return false;
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
        const notificationsReady = await setupNotifications()
          .catch(err => {
            console.warn('[App] Notification setup failed:', err);
            return false;
          });
        console.log("[App] Notifications ready:", notificationsReady);
        
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

  console.log("[App] Current state - isLoading:", isLoading, "hasError:", hasError, "appReady:", appReady);

  // Display MobileMonitorDashboard as the main view only when ready
  return (
    <div className="App">
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