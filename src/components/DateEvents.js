import React from 'react';
import EventItem from './EventItem';

/**
 * DateEvents Component
 * 
 * This component handles the display of events for a specific date, including
 * pagination, "Show More/Less" toggle, and event list rendering.
 * 
 * Modern React best practices:
 * - Component composition - uses smaller EventItem component
 * - Prop drilling minimized
 * - Clear separation of concerns (UI vs. logic)
 * - Conditional rendering for pagination elements
 * - Consistent naming convention for handlers
 * 
 * @param {object} props - Component props
 * @param {string} props.date - The date string (e.g., 'Today', 'Yesterday')
 * @param {array} props.filteredEvents - Array of events for this date, already filtered
 * @param {boolean} props.isExpanded - Whether this date section is expanded
 * @param {function} props.onToggleExpand - Function to toggle expansion
 * @param {object} props.selectedEvent - Currently selected event
 * @param {function} props.onSelectEvent - Function to select an event
 * @param {function} props.getStatusColor - Function to get color for status
 * @param {number} props.currentPage - Current page number
 * @param {function} props.onPageChange - Function to change page
 * @param {number} props.initialEventsToShow - Number of events to show initially
 * @param {number} props.expandedEventsToShow - Number of events to show when expanded
 */
function DateEvents({
  date,
  filteredEvents,
  isExpanded,
  onToggleExpand,
  selectedEvent,
  onSelectEvent,
  getStatusColor,
  currentPage,
  onPageChange,
  initialEventsToShow,
  expandedEventsToShow
}) {
  // Calculate pagination for this date group
  const startIndex = (currentPage - 1) * expandedEventsToShow;
  const endIndex = startIndex + expandedEventsToShow;
  
  // Determine which events to show based on expansion state
  let visibleEvents;
  if (isExpanded) {
    // If expanded, use pagination
    visibleEvents = filteredEvents.slice(startIndex, endIndex);
  } else {
    // If not expanded, just show initial count
    visibleEvents = filteredEvents.slice(0, initialEventsToShow);
  }
  
  // Total number of pages for this date
  const totalPages = Math.ceil(filteredEvents.length / expandedEventsToShow);
  
  return (
    <div>
      <div className="px-3 py-2 bg-gray-750 text-xs text-gray-400 font-medium">
        {date}
      </div>
      
      {/* Render visible events */}
      {visibleEvents.map((event) => (
        <EventItem
          key={event.id}
          event={event}
          onClick={onSelectEvent}
          isSelected={selectedEvent?.id === event.id}
          getStatusColor={getStatusColor}
        />
      ))}
      
      {/* Show More/Less button - only show if there are more events than the initial count */}
      {filteredEvents.length > initialEventsToShow && (
        <div className="px-3 py-2 border-t border-gray-700">
          <button 
            className="w-full text-center text-blue-400 text-sm hover:text-blue-300 transition-colors"
            onClick={() => onToggleExpand(date)}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}
      
      {/* Pagination controls - only show if expanded and has multiple pages */}
      {isExpanded && totalPages > 1 && (
        <div className="px-3 py-2 border-t border-gray-700 flex justify-between items-center">
          <button 
            className={`text-sm ${currentPage > 1 ? 'text-blue-400 hover:text-blue-300' : 'text-gray-600'} transition-colors`}
            onClick={() => {
              if (currentPage > 1) {
                onPageChange(date, currentPage - 1);
              }
            }}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <span className="text-xs text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          
          <button 
            className={`text-sm ${currentPage < totalPages ? 'text-blue-400 hover:text-blue-300' : 'text-gray-600'} transition-colors`}
            onClick={() => {
              if (currentPage < totalPages) {
                onPageChange(date, currentPage + 1);
              }
            }}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default DateEvents;