import React from 'react';

/**
 * EventItem Component
 * 
 * This is a reusable component that renders a single event in the timeline.
 * 
 * Following modern React best practices:
 * - Uses functional component pattern
 * - Props destructuring
 * - Explicit prop types (in comments)
 * - Consistent JSX formatting
 * - Each component has a single responsibility
 * 
 * @param {object} event - The event data object
 * @param {function} onClick - Function to call when event is clicked
 * @param {boolean} isSelected - Whether this event is currently selected
 * @param {function} getStatusColor - Function to determine color based on status
 */
function EventItem({ event, onClick, isSelected, getStatusColor }) {
  return (
    <button
      key={event.id}
      className={`w-full text-left flex items-start space-x-2 p-3 hover:bg-gray-700 active:bg-gray-600 transition-colors
        ${isSelected ? 'bg-gray-700' : ''}`}
      onClick={() => onClick(event)}
      aria-label={`View details of ${event.event} at ${event.time}`}
    >
      <div className={`mt-0.5 h-3 w-3 rounded-full flex-shrink-0 ${getStatusColor(event.status)}`} />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <div className="text-white text-sm font-medium">{event.event}</div>
          <div className="text-xs text-gray-400">{event.time}</div>
        </div>
        <div className="text-xs text-gray-400 mt-0.5">{event.description}</div>
      </div>
      <div className="flex-shrink-0 text-xs bg-gray-600 px-1.5 py-0.5 rounded text-white ml-1">View</div>
    </button>
  );
}

export default EventItem;