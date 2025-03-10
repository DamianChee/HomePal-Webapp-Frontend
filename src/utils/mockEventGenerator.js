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
    // Format the current time for UTC+8 timezone in the requested format
    const now = new Date();
    // Adjust to UTC+8
    const utc8Time = new Date(now.getTime() + 8 * 60 * 60 * 1000);

    // Format date as "10 March 2025 at 08:58:36 UTC+8"
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = utc8Time.getUTCDate();
    const month = months[utc8Time.getUTCMonth()];
    const year = utc8Time.getUTCFullYear();
    const hours = String(utc8Time.getUTCHours()).padStart(2, "0");
    const minutes = String(utc8Time.getUTCMinutes()).padStart(2, "0");
    const seconds = String(utc8Time.getUTCSeconds()).padStart(2, "0");

    const formattedTime = `${day} ${month} ${year} at ${hours}:${minutes}:${seconds} UTC+8`;

    // Create the mock event payload with the specified fields
    const mockEvent = {
      action: "Attempted-Bed-Exit",
      deviceId: "RP42A00002",
      isHandled: false,
      teleFlag: false,
      time: formattedTime,
      eventId: `RP42A00002-EVT${Date.now()}`,
    };

    console.log("Sending mock event:", mockEvent);
    console.log(
      "Backend URL:",
      process.env.REACT_APP_BACKEND_DOMAIN + "/events/new"
    ); // Debug

    // Add direct fetch as backup to check if useFetch is the issue
    try {
      const directResponse = await fetch(
        process.env.REACT_APP_BACKEND_DOMAIN + "/events/new",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockEvent),
        }
      );

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
    const result = await fetchFn("/events/new", "POST", mockEvent);
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
