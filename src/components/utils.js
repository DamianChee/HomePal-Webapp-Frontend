/**
 * Utility functions for the CarePal Mobile Dashboard
 *
 * Modern React best practices:
 * - Separate utility functions from components
 * - Pure functions with clear inputs and outputs
 * - Focused on a single purpose
 * - Well-documented with JSDoc comments
 */

/**
 * Transform a Firestore event to the format expected by the app
 * 
 * @param {Object} firestoreEvent - Event object from Firestore
 * @returns {Object} Transformed event object
 */
export const transformFirestoreEvent = (firestoreEvent) => {
  // Handle Firestore timestamp
  const eventTime = firestoreEvent.time?.toDate?.() || new Date(firestoreEvent.time);
  const day = eventTime.getDate();
  const month = eventTime.getMonth() + 1;
  const year = eventTime.getFullYear();

  return {
    id: firestoreEvent.id || `event-${Date.now()}`,
    time: eventTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: `${day}/${month}/${year}`,
    event: firestoreEvent.action || firestoreEvent.event || 'Unknown Event',
    status: firestoreEvent.status || 'normal',
    description: firestoreEvent.description || firestoreEvent.action || 'Event detected',
    timestamp: eventTime.getTime(),
    rawData: firestoreEvent
  };
};

/**
 * Get the CSS class for a status color based on the status string
 *
 * @param {string} status - The status string ('critical', 'warning', or 'normal')
 * @returns {string} CSS class for the status color
 */
export const getStatusColor = (status) => {
  switch (status) {
    case "Bedside-Fall":
      return "bg-red-500";
    case "Attempted-Bed-Exit":
      return "bg-yellow-500";
    case "Bed-Exit":
      return "bg-yellow-500";
    case "Bed-Entry":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

/**
 * Calculate the time remaining from now until a given end time
 *
 * @param {Date|number} pauseEndTime - The end time as Date object or timestamp
 * @returns {string|null} Time remaining in format "Xh Ym" or null if no time is remaining
 */
export const calculateTimeRemaining = (pauseEndTime) => {
  if (!pauseEndTime) return null;

  const now = new Date();
  const end = new Date(pauseEndTime);
  const diff = end - now;

  if (diff <= 0) return null;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
};

/**
 * Set an end time for pausing, by adding specified hours to current time
 *
 * @param {number} hours - Number of hours to add to current time
 * @returns {Date} The calculated end time
 */
export const calculatePauseEndTime = (hours) => {
  const endTime = new Date();
  endTime.setHours(endTime.getHours() + hours);
  return endTime;
};

/**
 * Filter and sort events by date and status
 *
 * @param {Array} events - Array of event objects
 * @param {string} date - The date to filter by ('Today', 'Yesterday', etc.)
 * @param {Array} activeFilters - Array of active filter strings
 * @returns {Array} Filtered and sorted events
 */
export const filterEvents = (events, date, activeFilters) => {
  return (
    events
      .filter((event) => event.date === date)
      // Apply status filters
      .filter((event) => {
        if (activeFilters.includes("all")) return true;
        if (
          event.event === "Bedside-Fall" &&
          activeFilters.includes("Bedside-Fall")
        )
          return true;
        if (event.event === "Bed-Exit" && activeFilters.includes("Bed-Exit"))
          return true;
        if (
          event.event === "Attempted-Bed-Exit" &&
          activeFilters.includes("Attempted-Bed-Exit")
        )
          return true;
        if (event.event === "Bed-Entry" && activeFilters.includes("Bed-Entry"))
          return true;
        return false;
      })
      // Sort by timestamp (most recent first)
      .sort((a, b) => b.timestamp - a.timestamp)
  );
};

/**
 * Filter events for history view based on selected date filter
 *
 * @param {Array} events - Array of event objects
 * @param {string} historyDateFilter - The date filter ('Today', 'Past Week', 'All History')
 * @param {Array} activeFilters - Array of active filter strings
 * @returns {Array} Filtered and sorted events
 */
export const filterHistoryEvents = (
  events,
  historyDateFilter,
  activeFilters
) => {
  let filteredEvents = [];

  // Get current date for comparison
  const today = new Date();
  const todayFormatted = `${today.getDate()}/${
    today.getMonth() + 1
  }/${today.getFullYear()}`;

  // Calculate one-week-ago date for "Past Week" filter
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  if (historyDateFilter === todayFormatted) {
    // Today's date as a string
    filteredEvents = events.filter((event) => event.date === todayFormatted);
  } else if (historyDateFilter === "Past Week") {
    // Events from last 7 days
    filteredEvents = events.filter((event) => {
      // Parse the event date string into a Date object
      const [day, month, year] = event.date.split("/").map(Number);
      const eventDate = new Date(year, month - 1, day);

      // Include if event date is >= one week ago
      return eventDate >= oneWeekAgo;
    });
  } else if (historyDateFilter === "All History") {
    filteredEvents = events; // All events
  }

  // Apply status filters
  return filteredEvents
    .filter((event) => {
      if (activeFilters.includes("all")) return true;
      if (
        event.event === "Bedside-Fall" &&
        activeFilters.includes("Bedside-Fall")
      )
        return true;
      if (
        event.event === "Attempted-Bed-Exit" &&
        activeFilters.includes("Attempted-Bed-Exit")
      )
        return true;
      if (event.event === "Bed-Exit" && activeFilters.includes("Bed-Exit"))
        return true;
      if (event.event === "Bed-Entry" && activeFilters.includes("Bed-Entry"))
        return true;
      return false;
    })
    .sort((a, b) => {
      // Sort by date (newest first), then by time
      const [aDay, aMonth, aYear] = a.date.split("/").map(Number);
      const [bDay, bMonth, bYear] = b.date.split("/").map(Number);

      const dateA = new Date(aYear, aMonth - 1, aDay);
      const dateB = new Date(bYear, bMonth - 1, bDay);

      if (dateB - dateA !== 0) return dateB - dateA;

      // If same date, compare by time
      const aTime = a.time.split(" ")[0].split(":");
      const bTime = b.time.split(" ")[0].split(":");
      const aHour = parseInt(aTime[0]);
      const bHour = parseInt(bTime[0]);

      if (aHour !== bHour) return bHour - aHour;

      const aMin = parseInt(aTime[1]);
      const bMin = parseInt(bTime[1]);
      return bMin - aMin;
    });
};
