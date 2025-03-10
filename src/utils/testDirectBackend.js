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

    // Create the mock event payload
    const mockEvent = {
      action: "Attempted-Bed-Exit",
      deviceId: "RP42A00002",
      isHandled: false,
      teleFlag: false,
      time: formattedTime,
      eventId: `RP42A00002-EVT${Date.now()}`,
    };

    // Get the backend URL from env or use a fallback
    const backendUrl = process.env.REACT_APP_BACKEND_DOMAIN || "";
    const apiUrl = `${backendUrl}/events/new`;

    // Log attempt
    console.log("Attempting direct API call to:", apiUrl);
    console.log("With payload:", mockEvent);

    // Make the request
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(mockEvent),
    });

    // Log response
    console.log("API response status:", response.status);

    // Parse the response
    if (response.ok) {
      const data = await response.json();
      console.log("API call successful:", data);
      return true;
    } else {
      const errorData = await response.text();
      console.error("API call failed:", errorData);
      alert(`API call failed: ${response.status} - ${errorData}`);
      return false;
    }
  } catch (error) {
    console.error("API call error:", error);
    alert(`API call error: ${error.message}`);
    return false;
  }
};
