import React, { useState, useEffect } from "react";
import { X, ArrowLeft } from "lucide-react";

// Import mock data
import mockEvents from "./mockData";

// Import utility functions
import {
  getStatusColor,
  calculateTimeRemaining,
  calculatePauseEndTime,
  filterEvents,
  filterHistoryEvents,
} from "./utils";

// Import component modules
import HeaderSection from "./HeaderSection";
import StatusSection from "./StatusSection";
import QuickActionsSection from "./QuickActionsSection";
import EventDetail from "./EventDetail";
import EventTimeline from "./EventTimeline";
import RoomSettingsModal from "./modals/RoomSettingsModal";

/**
 * MobileMonitorDashboard Component
 *
 * This is the main container component for the CarePal Mobile Dashboard.
 * It has been refactored according to modern React best practices:
 *
 * 1. Component Composition: Breaking UI into smaller, reusable components
 * 2. Custom Hooks: Using React hooks effectively
 * 3. Separation of Concerns: UI components separated from business logic
 * 4. Utility Functions: Common functions extracted to utils.js
 * 5. Stateful Logic: Parent component manages state and passes props to children
 * 6. Clear Code Organization: Logical grouping of related code
 * 7. Consistent Naming: Following React naming conventions
 * 8. Props API: Clear interfaces between components
 */
function MobileMonitorDashboard() {
  // Core state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [monitoringPaused, setMonitoringPaused] = useState(false);
  const [pauseEndTime, setPauseEndTime] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [roomName, setRoomName] = useState("Mom's Bedroom");
  const [defaultSchedule, setDefaultSchedule] = useState({
    start: "22:00",
    end: "06:00",
  });

  // Modal states
  const [showRoomSettings, setShowRoomSettings] = useState(false);
  const [showScheduleSettings, setShowScheduleSettings] = useState(false);
  const [showPauseOptions, setShowPauseOptions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAlertSettings, setShowAlertSettings] = useState(false);

  // Alert settings state
  const [alertSettings, setAlertSettings] = useState({
    bedExit: true,
    edgeDetection: true,
  });

  // Filter state
  const [activeFilters, setActiveFilters] = useState(["all"]);

  // Pagination state for Recent Activity
  const [expandedDates, setExpandedDates] = useState([]); // Track which dates are expanded
  const [currentPages, setCurrentPages] = useState({
    Today: 1,
    Yesterday: 1,
    "Past Week": 1,
  }); // Separate pagination for each date
  const initialEventsToShow = 3;
  const expandedEventsToShow = 5;

  // History view state
  const [historyDateFilter, setHistoryDateFilter] = useState("Today");

  // Use imported mock events data
  const events = mockEvents;

  // For custom duration
  const [customDuration, setCustomDuration] = useState(1); // Default 1 day

  // Time formatter function - wrapper around the utility
  const getTimeRemaining = () => {
    return calculateTimeRemaining(pauseEndTime);
  };

  // Handle pause monitoring with duration in hours
  const handlePauseMonitoring = (hours) => {
    if (hours) {
      const endTime = calculatePauseEndTime(hours);
      setPauseEndTime(endTime);
    }
    setMonitoringPaused(true);
    setShowPauseOptions(false);

    // Log to console instead of updating state directly
    console.log(`Monitoring paused for ${hours} hours`);
  };

  // Handle custom duration - converts days to hours
  const handleCustomDuration = () => {
    // Convert days to hours (24 hours per day)
    handlePauseMonitoring(customDuration * 24);

    // Log to console
    console.log(`Monitoring paused for ${customDuration} days`);
  };

  // Resume monitoring
  const handleResumeMonitoring = () => {
    setMonitoringPaused(false);
    setPauseEndTime(null);
    setShowPauseOptions(false);

    // Log to console
    console.log("Monitoring resumed");
  };

  // Handle toggling date expansion
  const handleToggleExpand = (date) => {
    if (expandedDates.includes(date)) {
      // If already expanded, collapse and reset page
      setExpandedDates(expandedDates.filter((d) => d !== date));
      setCurrentPages({ ...currentPages, [date]: 1 });
      console.log(`Showing less events for ${date}`);
    } else {
      // If not expanded, expand
      setExpandedDates([...expandedDates, date]);
      console.log(
        `Showing more events for ${date}. Current page: ${currentPages[date]}`
      );
    }
  };

  // Handle page change for a date
  const handlePageChange = (date, newPage) => {
    setCurrentPages({ ...currentPages, [date]: newPage });
    console.log(`Moving to page ${newPage} for ${date}`);
  };

  // Timer for pause countdown
  useEffect(() => {
    if (pauseEndTime) {
      const interval = setInterval(() => {
        if (new Date() >= new Date(pauseEndTime)) {
          setMonitoringPaused(false);
          setPauseEndTime(null);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [pauseEndTime]);

  // Load saved settings on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("carePalSettings");
      if (savedSettings) {
        const { roomName, defaultSchedule } = JSON.parse(savedSettings);
        if (roomName) setRoomName(roomName);
        if (defaultSchedule) setDefaultSchedule(defaultSchedule);
      }

      // Log to console
      console.log("Settings loaded from localStorage");
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  }, []);

  // Save settings when they change
  useEffect(() => {
    try {
      localStorage.setItem(
        "carePalSettings",
        JSON.stringify({
          roomName,
          defaultSchedule,
        })
      );

      // Log to console
      console.log("Settings saved to localStorage");
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  }, [roomName, defaultSchedule]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header Sections */}
      <HeaderSection
        roomName={roomName}
        onEditRoom={() => setShowRoomSettings(true)}
      />

      {/* Status Section */}
      <StatusSection
        monitoringPaused={monitoringPaused}
        timeRemaining={getTimeRemaining()}
      />

      {/* Quick Actions Section */}
      <QuickActionsSection
        monitoringPaused={monitoringPaused}
        onShowPauseOptions={() => setShowPauseOptions(true)}
        onShowScheduleSettings={() => setShowScheduleSettings(true)}
        onShowAlertSettings={() => setShowAlertSettings(true)}
        defaultSchedule={defaultSchedule}
        getTimeRemaining={getTimeRemaining}
      />

      {/* Selected Event View */}
      <EventDetail
        event={selectedEvent}
        getStatusColor={getStatusColor}
        onClose={() => setSelectedEvent(null)}
      />

      {/* Event Timeline */}
      <EventTimeline
        events={events}
        activeFilters={activeFilters}
        expandedDates={expandedDates}
        currentPages={currentPages}
        selectedEvent={selectedEvent}
        onSetShowHistory={() => {
          setShowHistory(true);
          setHistoryDateFilter("Today");
          setCurrentPages({ ...currentPages, Today: 1 });
        }}
        onSetShowFilters={() => setShowFilters(true)}
        onSelectEvent={setSelectedEvent}
        onToggleExpand={handleToggleExpand}
        onPageChange={handlePageChange}
        getStatusColor={getStatusColor}
        initialEventsToShow={initialEventsToShow}
        expandedEventsToShow={expandedEventsToShow}
      />

      {/* Modals */}
      <RoomSettingsModal
        show={showRoomSettings}
        onClose={() => setShowRoomSettings(false)}
        roomName={roomName}
        onRoomNameChange={setRoomName}
      />

      {/* History Modal */}
      {showHistory && (
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
                    historyDateFilter === "Today"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  } text-sm rounded-full`}
                  onClick={() => {
                    setHistoryDateFilter("Today");
                    // Reset pagination when changing filters
                    setCurrentPages({ ...currentPages, Today: 1 });
                    console.log("History filter set to: Today");
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
                  let displayDate;

                  if (event.date === "Today") {
                    displayDate = "February 24, 2025"; // Example date, could be dynamic
                  } else if (event.date === "Yesterday") {
                    displayDate = "February 23, 2025";
                  } else {
                    // For 'Past Week' items, create dates based on timestamp
                    const eventDate = new Date(event.timestamp);
                    displayDate = eventDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    });
                  }

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
                return Object.entries(groupedEvents).map(
                  ([date, dateEvents]) => (
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
                              event.status
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
                  )
                );
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
      )}

      {/* Alert Settings Modal */}
      {showAlertSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 w-full max-w-sm rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">Alert Settings</h3>
              <button
                onClick={() => setShowAlertSettings(false)}
                className="text-gray-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-gray-700">
                <div className="text-white text-sm font-medium mb-3">
                  Alert Types
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                      <div>
                        <div className="text-white text-sm font-medium">
                          Bed Exit Alerts
                        </div>
                        <div className="text-xs text-gray-400">
                          When person leaves the bed
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        className="opacity-0 w-0 h-0"
                        checked={alertSettings.bedExit}
                        onChange={() => {
                          setAlertSettings({
                            ...alertSettings,
                            bedExit: !alertSettings.bedExit,
                          });

                          // Log to console
                          console.log(
                            "Bed exit alerts:",
                            !alertSettings.bedExit
                          );
                        }}
                      />
                      <span
                        className={`absolute cursor-pointer inset-0 rounded-full transition-colors duration-200 ${
                          alertSettings.bedExit ? "bg-blue-500" : "bg-gray-500"
                        }`}
                      >
                        <span
                          className={`absolute h-5 w-5 rounded-full bg-white transform transition-transform duration-200 ${
                            alertSettings.bedExit
                              ? "translate-x-1"
                              : "translate-x-0"
                          } top-0.5`}
                        ></span>
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                      <div>
                        <div className="text-white text-sm font-medium">
                          Edge Detection
                        </div>
                        <div className="text-xs text-gray-400">
                          When sitting on side of bed
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        className="opacity-0 w-0 h-0"
                        checked={alertSettings.edgeDetection}
                        onChange={() => {
                          setAlertSettings({
                            ...alertSettings,
                            edgeDetection: !alertSettings.edgeDetection,
                          });

                          // Log to console
                          console.log(
                            "Edge detection:",
                            !alertSettings.edgeDetection
                          );
                        }}
                      />
                      <span
                        className={`absolute cursor-pointer inset-0 rounded-full transition-colors duration-200 ${
                          alertSettings.edgeDetection
                            ? "bg-blue-500"
                            : "bg-gray-500"
                        }`}
                      >
                        <span
                          className={`absolute h-5 w-5 rounded-full bg-white transform transition-transform duration-200 ${
                            alertSettings.edgeDetection
                              ? "translate-x-1"
                              : "-translate-x-1"
                          } top-0.5`}
                        ></span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gray-700">
                <div className="text-white text-sm font-medium mb-3">
                  Alert Notifications
                </div>
                <div className="text-xs text-gray-300">
                  Alerts will be sent via SMS and WhatsApp to registered
                  caregivers.
                </div>

                <div className="mt-3 text-xs text-gray-400">
                  Primary contact: +1 (555) 123-4567
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  Secondary contact: +1 (555) 987-6543
                </div>
              </div>

              <button
                onClick={() => {
                  setShowAlertSettings(false);

                  // Log to console
                  console.log("Alert settings saved:", alertSettings);
                }}
                className="w-full bg-blue-500 text-white rounded-lg py-2 text-sm font-medium"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/80 flex items-end z-50">
          <div className="bg-gray-800 w-full rounded-t-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">Filter Timeline</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                className={`w-full p-3 text-left rounded-lg ${
                  activeFilters.includes("all")
                    ? "bg-blue-600 text-white font-medium"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
                onClick={() => {
                  setActiveFilters(["all"]);

                  // Log to console
                  console.log("Filter set to: all");
                }}
              >
                All Events
              </button>

              <button
                className={`w-full p-3 text-left rounded-lg ${
                  activeFilters.includes("critical")
                    ? "bg-blue-600"
                    : "bg-gray-700 hover:bg-gray-600"
                } flex items-center space-x-3`}
                onClick={() => {
                  if (activeFilters.includes("all")) {
                    setActiveFilters(["critical"]);
                  } else if (activeFilters.includes("critical")) {
                    setActiveFilters(
                      activeFilters.filter((f) => f !== "critical")
                    );
                  } else {
                    setActiveFilters([...activeFilters, "critical"]);
                  }

                  // Log to console
                  console.log("Filter updated: critical events");
                }}
              >
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                <div>
                  <div className="text-white text-sm font-medium">
                    Bed Exits Only
                  </div>
                  <div className="text-xs text-gray-400">
                    Person left the bed
                  </div>
                </div>
              </button>

              <button
                className={`w-full p-3 text-left rounded-lg ${
                  activeFilters.includes("warning")
                    ? "bg-blue-600"
                    : "bg-gray-700 hover:bg-gray-600"
                } flex items-center space-x-3`}
                onClick={() => {
                  if (activeFilters.includes("all")) {
                    setActiveFilters(["warning"]);
                  } else if (activeFilters.includes("warning")) {
                    setActiveFilters(
                      activeFilters.filter((f) => f !== "warning")
                    );
                  } else {
                    setActiveFilters([...activeFilters, "warning"]);
                  }

                  // Log to console
                  console.log("Filter updated: warning events");
                }}
              >
                <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <div className="text-white text-sm font-medium">
                    Edge Activity Only
                  </div>
                  <div className="text-xs text-gray-400">
                    Sitting on edge of bed
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowFilters(false);

                  // Log to console
                  console.log("Filters applied:", activeFilters);
                }}
                className="w-full bg-blue-500 text-white rounded-lg py-2 text-sm font-medium mt-2"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Settings Modal */}
      {showScheduleSettings && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-labelledby="schedule-settings-title"
        >
          <div className="bg-gray-800 w-full max-w-sm rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3
                id="schedule-settings-title"
                className="text-white font-semibold"
              >
                Night Monitoring Hours
              </h3>
              <button
                onClick={() => setShowScheduleSettings(false)}
                className="text-gray-400"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 block mb-2">
                  Active Monitoring Period
                </label>
                <div className="flex space-x-2 items-center">
                  <input
                    type="time"
                    value={defaultSchedule.start}
                    onChange={(e) => {
                      setDefaultSchedule({
                        ...defaultSchedule,
                        start: e.target.value,
                      });

                      // Log to console
                      console.log("Start time updated:", e.target.value);
                    }}
                    className="flex-1 bg-gray-700 text-white rounded px-3 py-2"
                    aria-label="Start time"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="time"
                    value={defaultSchedule.end}
                    onChange={(e) => {
                      setDefaultSchedule({
                        ...defaultSchedule,
                        end: e.target.value,
                      });

                      // Log to console
                      console.log("End time updated:", e.target.value);
                    }}
                    className="flex-1 bg-gray-700 text-white rounded px-3 py-2"
                    aria-label="End time"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setShowScheduleSettings(false);

                  // Log to console
                  console.log("Schedule settings saved:", defaultSchedule);
                }}
                className="w-full bg-blue-500 text-white rounded-lg py-2 text-sm font-medium"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pause Options Modal */}
      {showPauseOptions && (
        <div
          className="fixed inset-0 bg-black/80 flex items-end z-50"
          role="dialog"
          aria-labelledby="pause-options-title"
        >
          <div className="bg-gray-800 w-full rounded-t-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 id="pause-options-title" className="text-white font-semibold">
                {monitoringPaused ? "Resume Monitoring" : "Pause Monitoring"}
              </h3>
              <button
                onClick={() => setShowPauseOptions(false)}
                className="text-gray-400"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {monitoringPaused && (
                <button
                  className="w-full p-3 text-left rounded-lg bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleResumeMonitoring}
                >
                  <div className="font-medium">Resume Monitoring Now</div>
                  <div className="text-sm opacity-90 mt-1">
                    Return to active monitoring
                  </div>
                </button>
              )}

              <button
                className="w-full p-3 text-left rounded-lg bg-gray-700 hover:bg-gray-600"
                onClick={() => handlePauseMonitoring(3)}
              >
                <div className="text-white text-sm font-medium">
                  Short Pause
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  3 hours (changing sheets, bathroom break)
                </div>
              </button>

              <button
                className="w-full p-3 text-left rounded-lg bg-gray-700 hover:bg-gray-600"
                onClick={() => handlePauseMonitoring(12)}
              >
                <div className="text-white text-sm font-medium">Day Trip</div>
                <div className="text-gray-400 text-xs mt-1">
                  12 hours (day outing, doctor visit)
                </div>
              </button>

              <button
                className="w-full p-3 text-left rounded-lg bg-gray-700 hover:bg-gray-600"
                onClick={() => handlePauseMonitoring(72)}
              >
                <div className="text-white text-sm font-medium">
                  Weekend Trip
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  3 days (weekend away)
                </div>
              </button>

              <div className="p-3 rounded-lg bg-gray-700">
                <div className="text-white text-sm font-medium mb-2">
                  Custom Duration
                </div>
                <div className="flex mb-2">
                  <select
                    className="flex-1 bg-gray-600 rounded px-3 py-1 text-white text-sm"
                    value={customDuration}
                    onChange={(e) => {
                      setCustomDuration(parseInt(e.target.value));

                      // Log to console
                      console.log(
                        "Custom duration set to:",
                        e.target.value,
                        "days"
                      );
                    }}
                  >
                    <option value="1">1 day</option>
                    <option value="2">2 days</option>
                    <option value="3">3 days</option>
                    <option value="4">4 days</option>
                    <option value="5">5 days</option>
                    <option value="6">6 days</option>
                    <option value="7">1 week</option>
                    <option value="14">2 weeks</option>
                  </select>
                </div>
                <button
                  className="w-full bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  onClick={handleCustomDuration}
                >
                  Set Custom Duration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileMonitorDashboard;
