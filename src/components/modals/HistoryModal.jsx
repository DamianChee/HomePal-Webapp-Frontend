import { filterHistoryEvents } from "../utils";
import { ArrowLeft } from "lucide-react";

function HistoryModal({
  getStatusColor,
  setShowHistory,
  setHistoryDateFilter,
  setCurrentPages,
  setSelectedEvent,
  historyDateFilter,
  currentPages,
  today,
}) {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50">
      <div className="flex flex-col h-full">
        <div className="bg-gray-800 px-4 py-3 flex items-center space-x-3 border-b border-gray-700">
          <button
            onClick={() => setShowHistory(false)}
            className="text-gray-400"
            aria-label="Close history"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h3 className="text-white font-semibold">Event History</h3>
        </div>

        {/* Date Filter Tabs */}
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 ${
                historyDateFilter === today
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300"
              } text-sm rounded-full`}
              onClick={() => {
                setHistoryDateFilter(today);
                // Reset pagination when changing filters
                setCurrentPages({ ...currentPages, Today: 1 });
                console.log("History filter set to today's date:", today);
              }}
            >
              Today
            </button>
            <button
              className={`px-3 py-1 ${
                historyDateFilter === "Past Week"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300"
              } text-sm rounded-full`}
              onClick={() => {
                setHistoryDateFilter("Past Week");
                // Reset pagination when changing filters
                setCurrentPages({ ...currentPages, "Past Week": 1 });
                console.log("History filter set to: Past Week");
              }}
            >
              Past Week
            </button>
            <button
              className={`px-3 py-1 ${
                historyDateFilter === "All History"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300"
              } text-sm rounded-full`}
              onClick={() => {
                setHistoryDateFilter("All History");
                // Reset pagination when changing filters
                setCurrentPages({ ...currentPages, "All History": 1 });
                console.log("History filter set to: All History");
              }}
            >
              All History
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="flex-1 overflow-auto">
          {/* Get filtered events based on historyDateFilter */}
          {(() => {
            // Get filtered events using utility function
            const filteredEvents = filterHistoryEvents(
              events,
              historyDateFilter,
              activeFilters
            );

            // Group events by date for display
            const groupedEvents = {};

            // Process event dates for display
            filteredEvents.forEach((event) => {
              let displayDate = event.date;

              if (!groupedEvents[displayDate]) {
                groupedEvents[displayDate] = [];
              }

              groupedEvents[displayDate].push(event);
            });

            // If no events to display
            if (Object.keys(groupedEvents).length === 0) {
              return (
                <div className="p-8 text-center text-gray-400">
                  No events found for the selected filter.
                </div>
              );
            }

            // Render grouped events by date
            return Object.entries(groupedEvents).map(([date, dateEvents]) => (
              <div key={date}>
                <div className="px-4 py-2 bg-gray-800 text-sm text-white font-semibold sticky top-0 border-b border-gray-700">
                  {date}
                </div>
                {dateEvents.map((event) => (
                  <button
                    key={event.id}
                    className="w-full text-left flex items-start space-x-2 p-3 hover:bg-gray-800 border-b border-gray-700"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowHistory(false);
                      console.log("Selected event:", event);
                    }}
                  >
                    <div
                      className={`mt-0.5 h-3 w-3 rounded-full flex-shrink-0 ${getStatusColor(
                        event.event
                      )}`}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div className="text-white text-sm font-medium">
                          {event.event}
                        </div>
                        <div className="text-xs text-gray-400">
                          {event.time}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {event.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ));
          })()}

          {/* Data Retention Notice */}
          <div className="p-4 text-center text-xs text-gray-500">
            Event data is retained for 30 days.
            <br />
            Older events are automatically removed.
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryModal;
