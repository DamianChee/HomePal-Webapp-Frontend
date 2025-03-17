import React, { useState, useEffect } from "react";

// Import mock data
import fetchEvents from "./EventData";

// Import utility functions
import {
  getStatusColor,
  calculateTimeRemaining,
  calculatePauseEndTime,
} from "./utils";

import { getDateObject } from "./utils";
import useFetch from "../hooks/useFetch";

// Import component modules
import HeaderSection from "./HeaderSection";
import StatusSection from "./StatusSection";
import QuickActionsSection from "./QuickActionsSection";
import EventDetail from "./EventDetail";
import EventTimeline from "./EventTimeline";

// Import modal component modules
import RoomSettingsModal from "./modals/RoomSettingsModal";
import HistoryModal from "./modals/HistoryModal";
import AlertSettingsModal from "./modals/AlertSettingsModal";
import FilterModal from "./modals/FilterModal";
import ScheduleSettingsModal from "./modals/ScheduleSettingsModal";
import PauseOptionsModal from "./modals/PauseOptionsModal";

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
  const fetchData = useFetch();

  /**
   * Grabs the recent Events stored on Firebase Firestore via our backend which
   * will give you the events from the last 30 days. The endpoint being
   * [hostedsite]/events/recent and a GET request. This should be the only one you
   * need.
   *
   * 17/3/2025 Damian (Yoowa)
   * I'm leaving this comment note here, I've yet to write in an endpoint that
   * checks for specific devices and return only events for it but it will/should
   * be in the works for the backend. Residentially, we will eventually want some
   * form of authentication and then linking of devices so that we can ensure
   * users only receive information from their own devices and the events from
   * their own devices, also if they have more than one device, to display from
   * all of them.
   */
  const handleGetRecentEvents = async () => {
    try {
      const res = await fetchData(`/events/recent`, "GET");
      if (!res.ok) throw new Error(res.data);
      return res.data.response;
    } catch (error) {
      console.error(
        `[handleGetRecentEvents] Error has occured:`,
        error.message
      );
    }
  };

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
  const [events, setEvents] = useState([]);

  // Setup objects for today's dates and comparisons later
  const dateObject = getDateObject();
  const today = `${dateObject.getDate()}/${
    dateObject.getMonth() + 1
  }/${dateObject.getFullYear()}`;

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
  }); // Separate pagination for today and yesterday

  // These are default magic numbers, I want to show 3 events at glance, then 5
  // per pages
  const initialEventsToShow = 3;
  const expandedEventsToShow = 5;

  // History view state
  const [historyDateFilter, setHistoryDateFilter] = useState(today);

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
    // console.log(`Monitoring paused for ${hours} hours`);
  };

  // Handle custom duration - converts days to hours
  const handleCustomDuration = () => {
    // Convert days to hours (24 hours per day)
    handlePauseMonitoring(customDuration * 24);

    // Log to console
    // console.log(`Monitoring paused for ${customDuration} days`);
  };

  // Resume monitoring
  const handleResumeMonitoring = () => {
    setMonitoringPaused(false);
    setPauseEndTime(null);
    setShowPauseOptions(false);

    // Log to console
    // console.log("Monitoring resumed");
  };

  // Handle toggling date expansion
  const handleToggleExpand = (date) => {
    if (expandedDates.includes(date)) {
      // If already expanded, collapse and reset page
      setExpandedDates(expandedDates.filter((d) => d !== date));
      setCurrentPages({ ...currentPages, [date]: 1 });
      // console.log(`Showing less events for ${date}`);
    } else {
      // If not expanded, expand and ensure we're on page 1
      setExpandedDates([...expandedDates, date]);
      // Always reset to page 1 when expanding to ensure consistency
      setCurrentPages({ ...currentPages, [date]: 1 });
      // console.log(`Showing more events for ${date}. Current page: 1`);
    }
  };

  // Handle page change for a date
  const handlePageChange = (date, newPage) => {
    setCurrentPages({ ...currentPages, [date]: newPage });
    // console.log(`Moving to page ${newPage} for ${date}`);
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
      // console.log("Settings loaded from localStorage");
    } catch (error) {
      console.error("Error loading settings:", error);
    }

    const loadEvents = async () => {
      try {
        // Use your existing fetchEvents function
        const fetchedEvents = await fetchEvents(handleGetRecentEvents);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    loadEvents();
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
      // console.log("Settings saved to localStorage");
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
          setHistoryDateFilter(today);
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
        <HistoryModal
          getStatusColor={getStatusColor}
          setShowHistory={setShowHistory}
          setHistoryDateFilter={setHistoryDateFilter}
          setCurrentPages={setCurrentPages}
          setSelectedEvent={setSelectedEvent}
          historyDateFilter={historyDateFilter}
          currentPages={currentPages}
          today={today}
        />
      )}

      {/* Alert Settings Modal */}
      {showAlertSettings && (
        <AlertSettingsModal
          setShowAlertSettings={setShowAlertSettings}
          setAlertSettings={setAlertSettings}
          alertSettings={alertSettings}
        />
      )}

      {/* Filter Modal */}
      {showFilters && (
        <FilterModal
          setShowFilters={setShowFilters}
          setActiveFilters={setActiveFilters}
          activeFilters={activeFilters}
        />
      )}

      {/* Schedule Settings Modal */}
      {showScheduleSettings && (
        <ScheduleSettingsModal
          setShowScheduleSettings={setShowScheduleSettings}
          setDefaultSchedule={setDefaultSchedule}
          defaultSchedule={defaultSchedule}
        />
      )}

      {/* Pause Options Modal */}
      {showPauseOptions && (
        <PauseOptionsModal
          setShowPauseOptions={setShowPauseOptions}
          setCustomDuration={setCustomDuration}
          handleResumeMonitoring={handleResumeMonitoring}
          handlePauseMonitoring={handlePauseMonitoring}
          handleCustomDuration={handleCustomDuration}
          customDuration={customDuration}
          monitoringPaused={monitoringPaused}
        />
      )}
    </div>
  );
}

export default MobileMonitorDashboard;
