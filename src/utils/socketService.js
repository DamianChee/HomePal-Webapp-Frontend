import io from 'socket.io-client';

// Socket.io instance that will be reused
let socket = null;

// Callback collection for different event types
const eventCallbacks = {
  notification: [],
  // Add more event types as needed
};

/**
 * Initialize WebSocket connection with the server
 * @param {string} serverUrl - The URL of the WebSocket server
 * @returns {boolean} - True if initialization was successful
 */
export const initializeSocket = (serverUrl) => {
  try {
    // Close existing connection if there is one
    if (socket) {
      console.log('[SocketService] Closing existing socket connection');
      socket.close();
    }

    // Create new socket connection
    console.log('[SocketService] Initializing socket connection to:', serverUrl);
    socket = io(serverUrl, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    // Setup event listeners
    setupSocketListeners();
    
    return true;
  } catch (error) {
    console.error('[SocketService] Socket initialization error:', error);
    return false;
  }
};

/**
 * Set up the socket event listeners
 */
const setupSocketListeners = () => {
  if (!socket) return;

  // Connection events
  socket.on('connect', () => {
    console.log('[SocketService] Socket connected. ID:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[SocketService] Socket disconnected. Reason:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('[SocketService] Connection error:', error);
  });

  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log('[SocketService] Reconnection attempt:', attemptNumber);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('[SocketService] Reconnected after', attemptNumber, 'attempts');
  });

  // Custom event handlers
  socket.on('notification', (data) => {
    console.log('[SocketService] Notification received:', data);
    // Call all registered notification callbacks
    triggerCallbacks('notification', data);
  });

  socket.on('event', (data) => {
    console.log('[SocketService] Event received:', data);
    // In the future, you can handle different event types differently
    triggerCallbacks('notification', {
      title: 'HomePal Alert',
      body: `Event: ${data.action || 'New event detected'}`,
      icon: '/logo192.png',
      data
    });
  });

  // Add more event listeners as needed
};

/**
 * Register a callback function for a specific event type
 * @param {string} eventType - The type of event to listen for
 * @param {Function} callback - The callback function to register
 * @returns {boolean} - True if registration was successful
 */
export const registerCallback = (eventType, callback) => {
  if (typeof callback !== 'function') return false;
  
  if (!eventCallbacks[eventType]) {
    eventCallbacks[eventType] = [];
  }
  
  eventCallbacks[eventType].push(callback);
  return true;
};

/**
 * Unregister a callback function for a specific event type
 * @param {string} eventType - The type of event
 * @param {Function} callback - The callback function to unregister
 */
export const unregisterCallback = (eventType, callback) => {
  if (!eventCallbacks[eventType]) return;
  
  eventCallbacks[eventType] = eventCallbacks[eventType].filter(cb => cb !== callback);
};

/**
 * Trigger all callbacks for a specific event type
 * @param {string} eventType - The type of event
 * @param {any} data - The data to pass to the callbacks
 */
const triggerCallbacks = (eventType, data) => {
  if (!eventCallbacks[eventType]) return;
  
  eventCallbacks[eventType].forEach(callback => {
    try {
      callback(data);
    } catch (error) {
      console.error(`[SocketService] Error in ${eventType} callback:`, error);
    }
  });
};

/**
 * Check if the socket is connected
 * @returns {boolean} - True if the socket is connected
 */
export const isConnected = () => {
  return socket?.connected || false;
};

/**
 * Get the socket instance
 * @returns {object|null} - The socket instance or null if not initialized
 */
export const getSocket = () => socket;

/**
 * Close the socket connection
 */
export const closeConnection = () => {
  if (socket) {
    socket.close();
    socket = null;
    console.log('[SocketService] Socket connection closed');
  }
};

/**
 * Send a message to the server
 * @param {string} eventType - The type of event to emit
 * @param {any} data - The data to send
 * @returns {boolean} - True if sending was successful
 */
export const sendMessage = (eventType, data) => {
  if (!socket?.connected) {
    console.warn('[SocketService] Cannot send message, socket not connected');
    return false;
  }
  
  try {
    socket.emit(eventType, data);
    return true;
  } catch (error) {
    console.error('[SocketService] Error sending message:', error);
    return false;
  }
};

/**
 * Create a mock event through WebSocket connection
 * @param {string} eventType - The type of event to create
 * @returns {Promise<boolean>} - True if creation was successful
 */
export const createMockEvent = async (eventType = "Bed-Exit") => {
  return new Promise((resolve) => {
    if (!socket?.connected) {
      console.warn('[SocketService] Cannot create mock event, socket not connected');
      resolve(false);
      return;
    }
    
    try {
      // Create the mock event payload
      const mockEvent = {
        action: eventType,
        time: new Date().toISOString(),
        isHandled: false,
        patientId: "test-patient-123",
        deviceId: "test-device-456",
        description: `Mock ${eventType} event created for testing`,
      };
      
      // Emit the event
      socket.emit('create-mock-event', mockEvent);
      console.log('[SocketService] Mock event emitted:', mockEvent);
      
      // Return true immediately, but socket.io provides no built-in acknowledgment
      // For a more reliable approach, you could implement a custom ack system on the server
      resolve(true);
    } catch (error) {
      console.error('[SocketService] Error creating mock event:', error);
      resolve(false);
    }
  });
};

/* Authentication-related functionality (for future implementation) */

/**
 * Authenticates the socket connection with the server
 * @param {string} token - The authentication token
 * @returns {Promise<boolean>} - True if authentication was successful
 * 
 * IMPLEMENTATION NOTES FOR FUTURE:
 * 1. This function should be called after the socket connection is established
 * 2. The token should be obtained from your authentication system
 * 3. The server must implement the 'authenticate' event handler
 * 4. The server should respond with a success or failure message
 */
export const authenticate = async (token) => {
  return new Promise((resolve) => {
    if (!socket?.connected) {
      console.warn('[SocketService] Cannot authenticate, socket not connected');
      resolve(false);
      return;
    }
    
    try {
      // For now, we just return true since authentication is not implemented
      console.log('[SocketService] Authentication placeholder (not implemented)');
      resolve(true);
      
      /* FUTURE IMPLEMENTATION:
      socket.emit('authenticate', { token }, (response) => {
        if (response.success) {
          console.log('[SocketService] Authentication successful');
          resolve(true);
        } else {
          console.error('[SocketService] Authentication failed:', response.error);
          resolve(false);
        }
      });
      */
    } catch (error) {
      console.error('[SocketService] Error during authentication:', error);
      resolve(false);
    }
  });
};