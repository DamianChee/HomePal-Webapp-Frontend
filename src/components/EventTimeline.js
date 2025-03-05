import React from "react";
import { Calendar, Filter } from "lucide-react";
import DateEvents from "./DateEvents";
import { getDateObject, parseTime } from "../utils/dateFormatter";

/**
 * EventTimeline Component
 *
 * This component renders the timeline of events, including the header with
 * filter and history buttons, and the list of events grouped by date.
 *
 * Modern React best practices:
 * - Component composition - uses DateEvents for each date group
 * - Props passing with clear interfaces
 * - Adopts Container/Presentational pattern - contains business logic for filtering
 * - Event handlers clearly named and focused on specific tasks
 * - Applies consistent styling patterns
 *
 * @param {object} props - Component props
 * @param {array} props.events - All events
 * @param {array} props.activeFilters - Active filter values
 * @param {array} props.expandedDates - Array of expanded date strings
 * @param {object} props.currentPages - Object mapping dates to their current page
 * @param {object} props.selectedEvent - Currently selected event object
 * @param {function} props.onSetShowHistory - Function to show history view
 * @param {function} props.onSetShowFilters - Function to show filters view
 * @param {function} props.onSelectEvent - Function to select an event
 * @param {function} props.onToggleExpand - Function to toggle date expansion
 * @param {function} props.onPageChange - Function to change page for a date
 * @param {function} props.getStatusColor - Function to get color for status
 * @param {number} props.initialEventsToShow - Number of events to show initially
 * @param {number} props.expandedEventsToShow - Number of events to show when expanded
 */
function EventTimeline({
  events,
  activeFilters,
  expandedDates,
  currentPages,
  selectedEvent,
  onSetShowHistory,
  onSetShowFilters,
  onSelectEvent,
  onToggleExpand,
  onPageChange,
  getStatusColor,
  initialEventsToShow,
  expandedEventsToShow,
}) {
  const dateObject = getDateObject();

  const today = `${dateObject.getDate()}/${
    dateObject.getMonth() + 1
  }/${dateObject.getFullYear()}`;

  const yesterday = `${dateObject.getDate() - 1}/${
    dateObject.getMonth() + 1
  }/${dateObject.getFullYear()}`;

  return (
    <div className="px-4 py-3">
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {/* Timeline Header */}
        <div className="flex justify-between items-center px-3 py-2 border-b border-gray-700">
          <h2 className="text-white text-sm font-medium">Recent Activity</h2>
          <div className="flex">
            <button
              className="p-1.5 text-white bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg flex items-center space-x-1"
              onClick={onSetShowHistory}
              aria-label="View history"
            >
              <Calendar className="h-4 w-4" />
              <span className="text-xs">History</span>
            </button>
            <button
              className="p-1.5 text-white bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg flex items-center space-x-1 ml-2"
              onClick={onSetShowFilters}
              aria-label="Filter events"
            >
              <Filter className="h-4 w-4" />
              <span className="text-xs">Filter</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-700">
          {/* Group events by date */}
          {[today, yesterday].map((date) => {
            // Get filtered events for this date
            const filteredEvents = events
              .filter((event) => event.date === date)
              // Apply status filters
              .filter((event) => {
                if (activeFilters.includes("all")) return true;
                if (
                  event.status === "critical" &&
                  activeFilters.includes("critical")
                )
                  return true;
                if (
                  event.status === "warning" &&
                  activeFilters.includes("warning")
                )
                  return true;
                if (
                  event.status === "normal" &&
                  activeFilters.includes("normal")
                )
                  return true;
                return false;
              })
              // Sort by timestamp (most recent first)
              .sort((a, b) => parseTime(b.time) - parseTime(a.time));

            // Skip rendering if no events to show
            if (filteredEvents.length === 0) return null;

            return (
              <DateEvents
                key={date}
                date={date}
                filteredEvents={filteredEvents}
                isExpanded={expandedDates.includes(date)}
                onToggleExpand={onToggleExpand}
                selectedEvent={selectedEvent}
                onSelectEvent={onSelectEvent}
                getStatusColor={getStatusColor}
                currentPage={currentPages[date]}
                onPageChange={onPageChange}
                initialEventsToShow={initialEventsToShow}
                expandedEventsToShow={expandedEventsToShow}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default EventTimeline;
