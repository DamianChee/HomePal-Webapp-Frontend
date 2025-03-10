/**
 * Mock Event Generator Utility
 * 
 * This file contains a utility function for generating and sending mock events
 * for testing purposes. Use with caution in production environments.
 * 
 * *** HOW TO REMOVE THIS FEATURE ***
 * To completely remove the mock event generation feature:
 * 1. Delete this entire file (mockEventGenerator.js)
 * 2. Remove the import in HeaderSection.js
 * 3. Remove the onClick handler from the CarePal logo in HeaderSection.js
 * 4. Remove any related state or variables in HeaderSection.js
 */

import useFetch from "../hooks/useFetch";

/**
 * Creates a mock event with the specified format and sends it to the backend API
 * 
 * @param {function} fetchFn - The fetch function from useFetch hook
 * @returns {Promise<object>} - The result of the API call
 */
export const createMockEvent = async (fetchFn) => {
  try {
    // Create the mock event payload with the specified fields
    const mockEvent = {
      action: "Attempted-Bed-Exit",
      deviceId: "RP42A00002",
      isHandled: false,
      teleFlag: false,
      time: new Date().toISOString(),
    };

    console.log("Sending mock event:", mockEvent);
    console.log("Backend URL:", process.env.REACT_APP_BACKEND_DOMAIN + "/events"); // Debug
    
    // Add direct fetch as backup to check if useFetch is the issue
    try {
      const directResponse = await fetch(process.env.REACT_APP_BACKEND_DOMAIN + "/events", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockEvent),
      });
      
      console.log("Direct fetch status:", directResponse.status); // Debug
      
      if (directResponse.ok) {
        const directData = await directResponse.json();
        console.log("Direct fetch success:", directData);
        return { success: true, data: directData };
      }
    } catch (directError) {
      console.error("Direct fetch failed:", directError);
      // Continue with regular fetchFn as backup
    }
    
    // Send the mock event to the backend using the provided fetch function
    console.log("Trying with fetchFn");
    const result = await fetchFn("/events", "POST", mockEvent);
    console.log("fetchFn result:", result);
    
    if (result.ok) {
      console.log("Mock event created successfully:", result.data);
      return { success: true, data: result.data };
    } else {
      console.error("Failed to create mock event:", result.data);
      return { success: false, error: result.data };
    }
  } catch (error) {
    console.error("Error creating mock event:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Custom hook for using the mock event generator
 * 
 * @returns {function} Function to create a mock event
 */
export const useMockEventGenerator = () => {
  const fetchData = useFetch();
  
  const generateMockEvent = async () => {
    return await createMockEvent(fetchData);
  };
  
  return generateMockEvent;
};