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
    case 'critical': return 'bg-red-500';
    case 'warning': return 'bg-yellow-500';
    case 'normal': return 'bg-green-500';
    default: return 'bg-gray-500';
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
  return events
    .filter(event => event.date === date)
    // Apply status filters
    .filter(event => {
      if (activeFilters.includes('all')) return true;
      if (event.status === 'critical' && activeFilters.includes('critical')) return true;
      if (event.status === 'warning' && activeFilters.includes('warning')) return true;
      if (event.status === 'normal' && activeFilters.includes('normal')) return true;
      return false;
    })
    // Sort by timestamp (most recent first)
    .sort((a, b) => b.timestamp - a.timestamp);
};

/**
 * Filter events for history view based on selected date filter
 * 
 * @param {Array} events - Array of event objects
 * @param {string} historyDateFilter - The date filter ('Today', 'Past Week', 'All History')
 * @param {Array} activeFilters - Array of active filter strings
 * @returns {Array} Filtered and sorted events
 */
export const filterHistoryEvents = (events, historyDateFilter, activeFilters) => {
  let filteredEvents = [];
  
  if (historyDateFilter === 'Today') {
    filteredEvents = events.filter(event => event.date === 'Today');
  } else if (historyDateFilter === 'Past Week') {
    filteredEvents = events.filter(event => 
      event.date === 'Today' || event.date === 'Yesterday' || event.date === 'Past Week'
    );
  } else if (historyDateFilter === 'All History') {
    filteredEvents = events; // All events
  }
  
  // Apply status filters
  return filteredEvents
    .filter(event => {
      if (activeFilters.includes('all')) return true;
      if (event.status === 'critical' && activeFilters.includes('critical')) return true;
      if (event.status === 'warning' && activeFilters.includes('warning')) return true;
      if (event.status === 'normal' && activeFilters.includes('normal')) return true;
      return false;
    })
    .sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp (newest first)
};