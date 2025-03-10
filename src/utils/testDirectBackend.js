/**
 * Direct Backend Test Utility
 * 
 * This is a simplified utility for testing direct API communication
 */

/**
 * Create a mock event directly using the browser's fetch API
 * 
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export const createDirectMockEvent = async () => {
  try {
    // Create the mock event payload
    const mockEvent = {
      action: "Attempted-Bed-Exit",
      deviceId: "RP42A00002",
      isHandled: false,
      teleFlag: false,
      time: new Date().toISOString(),
    };
    
    // Get the backend URL from env or use a fallback
    const backendUrl = process.env.REACT_APP_BACKEND_DOMAIN || '';
    const apiUrl = `${backendUrl}/events/new`;
    
    // Log attempt
    console.log('Attempting direct API call to:', apiUrl);
    console.log('With payload:', mockEvent);
    
    // Make the request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(mockEvent),
    });
    
    // Log response
    console.log('API response status:', response.status);
    
    // Parse the response
    if (response.ok) {
      const data = await response.json();
      console.log('API call successful:', data);
      return true;
    } else {
      const errorData = await response.text();
      console.error('API call failed:', errorData);
      alert(`API call failed: ${response.status} - ${errorData}`);
      return false;
    }
  } catch (error) {
    console.error('API call error:', error);
    alert(`API call error: ${error.message}`);
    return false;
  }
};