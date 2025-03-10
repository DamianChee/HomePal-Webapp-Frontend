import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import useFetch from "./hooks/useFetch";
import MobileMonitorDashboard from "./components/MobileMonitorDashboard";
import InAppNotification from "./components/InAppNotification";
import { subscribeToEvents } from "./firebase";
import {
  initializeSocket,
  registerCallback,
  unregisterCallback,
  isConnected,
} from "./utils/socketService";

/**
 * App Component
 *
 * Main application component that serves as the entry point.
 * Now using CarePal Mobile Dashboard as the default view with WebSocket notification support.
 *
 * The App includes:
 * 1. CarePal dashboard as the main view
 * 2. Firebase connectivity available in the background
 * 3. Uses modern React practices (hooks, functional components)
 * 4. Real-time event notifications via WebSockets (works on all browsers and iOS)
 * 5. Universal in-app notifications for all platforms
 */
function App() {
  console.log("[App] Component rendering...");

  const fetchData = useFetch();
  const [newEvents, setNewEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  // State for in-app notifications
  const [notification, setNotification] = useState(null);

  // Notification callback
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

  // Handle new event received from WebSocket
  const handleNewEvent = (event) => {
    console.log("[App] New event received:", event);
    try {
      setNewEvents((prevEvents) => [event, ...prevEvents]);

      // Display the notification using in-app notification
      handleNotification({
        title: "HomePal Alert",
        body: `New event: ${event.action || "Event detected"}`,
      });
    } catch (error) {
      console.error("[App] Error handling new event:", error);
    }
  };

  // Set up the socket connection
  const setupSocketConnection = useCallback(() => {
    // Get the backend URL from env or use a fallback
    const backendUrl =
      process.env.REACT_APP_BACKEND_DOMAIN + "/test-websocket" ||
      window.location.origin;
    console.log("[App] Setting up WebSocket connection to:", backendUrl);

    try {
      const initialized = initializeSocket(backendUrl);
      if (initialized) {
        console.log("[App] WebSocket initialized successfully");

        // Set up an interval to check connection status
        const statusInterval = setInterval(() => {
          const connected = isConnected();
          setSocketConnected(connected);
        }, 5000);

        return () => {
          clearInterval(statusInterval);
        };
      } else {
        console.error("[App] Failed to initialize WebSocket");
        return () => {};
      }
    } catch (error) {
      console.error("[App] Error setting up WebSocket:", error);
      return () => {};
    }
  }, []);

  // Register the notification callback
  useEffect(() => {
    // Register for notifications
    registerCallback("notification", handleNotification);

    // Cleanup on unmount
    return () => {
      unregisterCallback("notification", handleNotification);
    };
  }, [handleNotification]);

  // Setup WebSocket connection and Firebase listeners
  useEffect(() => {
    console.log("[App] Main useEffect running...");

    // Initialize all services
    const initializeApp = async () => {
      console.log("[App] Initializing app...");
      setIsLoading(true);
      setHasError(false);

      try {
        // Try to initialize all services but continue even if some fail
        let firebaseUnsubscribe = () => {};

        // 1. Setup WebSocket connection
        console.log("[App] Setting up WebSocket...");
        const socketCleanup = setupSocketConnection();

        // 2. Verify backend connectivity (more critical)
        console.log("[App] Checking API status...");
        const apiStatus = await handleGetAPIStatus().catch((err) => {
          console.warn("[App] API status check failed:", err);
          return false;
        });
        console.log(
          "[App] API status:",
          apiStatus ? "Connected" : "Disconnected"
        );

        // 3. Subscribe to Firestore events (as a backup for WebSockets)
        console.log("[App] Setting up Firestore listeners as backup...");
        try {
          firebaseUnsubscribe = subscribeToEvents(handleNewEvent) || (() => {});
          console.log("[App] Firestore listeners set up successfully");
        } catch (firestoreError) {
          console.error(
            "[App] Failed to subscribe to Firestore events:",
            firestoreError
          );
          // App can still function without real-time updates
        }

        // Instead of immediately setting loading to false, we use a slight delay
        // This gives time for any React state updates to propagate
        console.log(
          "[App] App initialization complete, preparing to render main content..."
        );
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
            if (firebaseUnsubscribe) {
              firebaseUnsubscribe();
              console.log("[App] Unsubscribed from Firestore");
            }
            socketCleanup();
            console.log("[App] WebSocket cleanup complete");
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
    const cleanupPromise = initializeApp();

    // Return cleanup function for useEffect
    return () => {
      console.log("[App] Component unmounting, running cleanup...");
      Promise.resolve(cleanupPromise).then((cleanupFn) => {
        try {
          if (cleanupFn) cleanupFn();
          console.log("[App] Cleanup completed");
        } catch (error) {
          console.error("[App] Error during cleanup:", error);
        }
      });
    };
  }, [setupSocketConnection]);

  // Handle clearing notification
  const handleCloseNotification = () => {
    setNotification(null);
  };

  console.log(
    "[App] Current state - isLoading:",
    isLoading,
    "hasError:",
    hasError,
    "appReady:",
    appReady
  );

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
          <p>
            Unable to connect to HomePal services. Please check your connection
            and try again.
          </p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : (
        <div className="dashboard-container">
          <MobileMonitorDashboard
            newEvents={newEvents}
            socketConnected={socketConnected}
          />
        </div>
      )}
    </div>
  );
}

export default App;
