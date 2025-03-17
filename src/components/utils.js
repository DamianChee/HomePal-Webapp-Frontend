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

/**
 * This returns a formatted date for my own debugging purposes. I don't think
 * it's used anywhere anymore. But feel free to use it if you want to.
 * Currently not in use.
 *
 * @returns {Template String} Time right now in `HH:MM:SS[AM/PM] DD/MM/YYYY`
 */

export function formatDate() {
  const date = new Date(Date.now());

  // Format time
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;

  // Format date
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Return formatted string
  return `${formattedHours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}${ampm} ${day}/${month}/${year}`;
}

/**
 * Gets a date object (I'll be honest Claude Code wrote this. I know what it
 * does and I know I could probably just use the one liner
 * const date = new Date();
 * so I'll probably go hunt down usages of these at some point to replace it.)
 * It's in use in mockData.js and MobileMonitorDashboard.js
 *
 * @returns {Date} Date object of RIGHT NOW.
 */

export function getDateObject() {
  try {
    // Simply use the local date object without timezone adjustments
    const dateObject = new Date();

    if (isNaN(dateObject.getTime())) {
      console.error("ERROR: Invalid date object created!");
      return null;
    }

    return dateObject;
  } catch (error) {
    console.error("ERROR in getDateObject:", error);
    return null;
  }
}

/**
 * Parse Time takes in the time retrieved from Firebase Firestore to use for
 * sorting later on via sort((a, b) => parseTime(b.time) - parseTime(a.time));
 * It's in use in EventTimeline.js
 *
 * @param {String} timeStr - String of time e.g. "10:39:00 PM"
 * @returns {Template String} `day month year at hours:minutes:seconds UTC+8`
 */

export const parseTime = (timeStr) => {
  if (!timeStr?.trim()) return null; // Return null for invalid inputs

  console.log(timeStr);

  const [time, period] = timeStr.split(" ") || [];
  if (!time || !period) return null;

  const [hours, minutes] = time.split(":") || [];
  if (!hours || !minutes) return null;

  const hourNum = parseInt(hours);
  const minuteNum = parseInt(minutes);
  if (isNaN(hourNum) || isNaN(minuteNum)) return null;

  let hour = hourNum;
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return hour * 60 + minuteNum;
};

/**
 * Takes in a timestamp in default nanosecond and converts it to the format
 * saved in Firebase Firestore
 * Currently not in use (Previously used when trying to create mock data from
 * frontend to backend to Firebase Firestore)
 *
 * @param {Array} timestamp - Array of event objects
 * @returns {Template String} `day month year at hours:minutes:seconds UTC+8`
 */

export const formatFirebaseTimestamp = (timestamp) => {
  // Convert nanoseconds to milliseconds
  const totalMs =
    timestamp._seconds * 1000 + Math.floor(timestamp._nanoseconds / 1e6);

  // Create Date object
  const date = new Date(totalMs);

  // Format the date parts
  const day = date.getDate();
  const monthNames = [
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
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Return formatted string
  return `${day} ${month} ${year} at ${hours}:${minutes}:${seconds} UTC+8`;
};
