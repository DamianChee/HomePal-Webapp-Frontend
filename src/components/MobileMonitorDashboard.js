import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Bell, BellOff, Clock, X, Calendar, 
  User, Home, Filter, ArrowLeft, Edit2, Moon, MessageCircle
} from 'lucide-react';

/**
 * MobileMonitorDashboard Component
 * 
 * This component was translated from TypeScript to JavaScript.
 * It's a dashboard for monitoring care situations, particularly focused on nighttime bed monitoring.
 * The component maintains various states for tracking room settings, monitoring status,
 * alert configurations, and event history.
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
    end: "06:00"
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
    edgeDetection: true
  });
  
  // Filter state
  const [activeFilters, setActiveFilters] = useState(['all']);
  
  // Pagination state for Recent Activity
  const [eventsToShow, setEventsToShow] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;
  
  // History view state
  const [historyDateFilter, setHistoryDateFilter] = useState('Today');
  
  // Mock event data with 34 events in total (4 original + 30 new)
  const events = [
    // Today's events (10 events)
    {
      id: 1,
      time: '02:15 AM',
      date: 'Today',
      event: 'Left bed',
      status: 'critical',
      description: 'Movement detected away from bed',
      timestamp: new Date(new Date().setHours(2, 15, 0, 0)).getTime()
    },
    {
      id: 2,
      time: '01:45 AM',
      date: 'Today',
      event: 'Edge movement',
      status: 'warning',
      description: 'Activity near bed edge',
      timestamp: new Date(new Date().setHours(1, 45, 0, 0)).getTime()
    },
    {
      id: 5,
      time: '01:10 AM',
      date: 'Today',
      event: 'Restless sleep',
      status: 'normal',
      description: 'Increased movement frequency detected',
      timestamp: new Date(new Date().setHours(1, 10, 0, 0)).getTime()
    },
    {
      id: 6,
      time: '12:32 AM',
      date: 'Today',
      event: 'Sleep sounds',
      status: 'normal',
      description: 'Light snoring detected',
      timestamp: new Date(new Date().setHours(0, 32, 0, 0)).getTime()
    },
    {
      id: 7,
      time: '12:05 AM',
      date: 'Today',
      event: 'Edge movement',
      status: 'warning',
      description: 'Brief movement near edge of bed',
      timestamp: new Date(new Date().setHours(0, 5, 0, 0)).getTime()
    },
    {
      id: 8,
      time: '11:50 PM',
      date: 'Today',
      event: 'Entered bed',
      status: 'normal',
      description: 'Person detected in bed',
      timestamp: new Date(new Date().setHours(23, 50, 0, 0)).getTime() - 86400000
    },
    {
      id: 9,
      time: '11:48 PM',
      date: 'Today',
      event: 'Room entry',
      status: 'normal',
      description: 'Movement detected in room',
      timestamp: new Date(new Date().setHours(23, 48, 0, 0)).getTime() - 86400000
    },
    {
      id: 10,
      time: '11:45 PM',
      date: 'Today',
      event: 'Lights dimmed',
      status: 'normal',
      description: 'Room lighting level reduced',
      timestamp: new Date(new Date().setHours(23, 45, 0, 0)).getTime() - 86400000
    },
    {
      id: 11,
      time: '11:40 PM',
      date: 'Today',
      event: 'Bathroom visit',
      status: 'normal',
      description: 'Movement to bathroom detected',
      timestamp: new Date(new Date().setHours(23, 40, 0, 0)).getTime() - 86400000
    },
    {
      id: 12,
      time: '10:55 PM',
      date: 'Today',
      event: 'Room temperature',
      status: 'normal',
      description: 'Room temperature set to 68°F',
      timestamp: new Date(new Date().setHours(22, 55, 0, 0)).getTime() - 86400000
    },
    
    // Yesterday's events (10 events)
    {
      id: 3,
      time: '11:30 PM',
      date: 'Yesterday',
      event: 'Bed exit',
      status: 'critical',
      description: 'Complete exit from bed detected',
      timestamp: new Date(new Date().setHours(23, 30, 0, 0)).getTime() - 86400000
    },
    {
      id: 4,
      time: '10:15 PM',
      date: 'Yesterday',
      event: 'Edge detection',
      status: 'warning',
      description: 'Sitting on edge of bed',
      timestamp: new Date(new Date().setHours(22, 15, 0, 0)).getTime() - 86400000
    },
    {
      id: 13,
      time: '09:45 PM',
      date: 'Yesterday',
      event: 'Entered bed',
      status: 'normal',
      description: 'Person detected in bed',
      timestamp: new Date(new Date().setHours(21, 45, 0, 0)).getTime() - 86400000
    },
    {
      id: 14,
      time: '09:15 PM',
      date: 'Yesterday',
      event: 'Room entry',
      status: 'normal',
      description: 'Movement detected in room',
      timestamp: new Date(new Date().setHours(21, 15, 0, 0)).getTime() - 86400000
    },
    {
      id: 15,
      time: '02:30 PM',
      date: 'Yesterday',
      event: 'Medication check',
      status: 'normal',
      description: 'Medication reminder acknowledged',
      timestamp: new Date(new Date().setHours(14, 30, 0, 0)).getTime() - 86400000
    },
    {
      id: 16,
      time: '08:45 AM',
      date: 'Yesterday',
      event: 'Bed exit',
      status: 'normal',
      description: 'Morning wake-up detected',
      timestamp: new Date(new Date().setHours(8, 45, 0, 0)).getTime() - 86400000
    },
    {
      id: 17,
      time: '07:15 AM',
      date: 'Yesterday',
      event: 'Restless sleep',
      status: 'warning',
      description: 'Increased movement during sleep',
      timestamp: new Date(new Date().setHours(7, 15, 0, 0)).getTime() - 86400000
    },
    {
      id: 18,
      time: '05:30 AM',
      date: 'Yesterday',
      event: 'Bed exit',
      status: 'critical',
      description: 'Early morning bathroom visit',
      timestamp: new Date(new Date().setHours(5, 30, 0, 0)).getTime() - 86400000
    },
    {
      id: 19,
      time: '04:10 AM',
      date: 'Yesterday',
      event: 'Sleep sounds',
      status: 'warning',
      description: 'Heavy breathing detected',
      timestamp: new Date(new Date().setHours(4, 10, 0, 0)).getTime() - 86400000
    },
    {
      id: 20,
      time: '01:45 AM',
      date: 'Yesterday',
      event: 'Temperature alert',
      status: 'warning',
      description: 'Room temperature increased to 74°F',
      timestamp: new Date(new Date().setHours(1, 45, 0, 0)).getTime() - 86400000
    },
    
    // Past Week events (14 events)
    {
      id: 21,
      time: '11:30 PM',
      date: 'Past Week',
      event: 'Deep sleep detected',
      status: 'normal',
      description: 'Minimal movement period',
      timestamp: new Date(new Date().setHours(23, 30, 0, 0)).getTime() - 3 * 86400000
    },
    {
      id: 22,
      time: '10:45 PM',
      date: 'Past Week',
      event: 'Entered bed',
      status: 'normal',
      description: 'Person detected in bed',
      timestamp: new Date(new Date().setHours(22, 45, 0, 0)).getTime() - 3 * 86400000
    },
    {
      id: 23,
      time: '02:15 AM',
      date: 'Past Week',
      event: 'Bed exit',
      status: 'critical',
      description: 'Complete exit from bed detected',
      timestamp: new Date(new Date().setHours(2, 15, 0, 0)).getTime() - 4 * 86400000
    },
    {
      id: 24,
      time: '01:30 AM',
      date: 'Past Week',
      event: 'Edge movement',
      status: 'warning',
      description: 'Activity near bed edge',
      timestamp: new Date(new Date().setHours(1, 30, 0, 0)).getTime() - 4 * 86400000
    },
    {
      id: 25,
      time: '11:45 PM',
      date: 'Past Week',
      event: 'Entered bed',
      status: 'normal',
      description: 'Person detected in bed',
      timestamp: new Date(new Date().setHours(23, 45, 0, 0)).getTime() - 4 * 86400000
    },
    {
      id: 26,
      time: '10:30 PM',
      date: 'Past Week',
      event: 'Room temperature',
      status: 'normal',
      description: 'Room temperature set to 68°F',
      timestamp: new Date(new Date().setHours(22, 30, 0, 0)).getTime() - 5 * 86400000
    },
    {
      id: 27,
      time: '03:15 AM',
      date: 'Past Week',
      event: 'Bed exit',
      status: 'critical',
      description: 'Complete exit from bed detected',
      timestamp: new Date(new Date().setHours(3, 15, 0, 0)).getTime() - 6 * 86400000
    },
    {
      id: 28,
      time: '02:45 AM',
      date: 'Past Week',
      event: 'Edge movement',
      status: 'warning',
      description: 'Activity near bed edge',
      timestamp: new Date(new Date().setHours(2, 45, 0, 0)).getTime() - 6 * 86400000
    },
    {
      id: 29,
      time: '12:15 AM',
      date: 'Past Week',
      event: 'Deep sleep detected',
      status: 'normal',
      description: 'Minimal movement period',
      timestamp: new Date(new Date().setHours(0, 15, 0, 0)).getTime() - 6 * 86400000
    },
    {
      id: 30,
      time: '11:00 PM',
      date: 'Past Week',
      event: 'Entered bed',
      status: 'normal',
      description: 'Person detected in bed',
      timestamp: new Date(new Date().setHours(23, 0, 0, 0)).getTime() - 7 * 86400000
    },
    {
      id: 31,
      time: '04:30 AM',
      date: 'Past Week',
      event: 'Bed exit',
      status: 'critical',
      description: 'Complete exit from bed detected',
      timestamp: new Date(new Date().setHours(4, 30, 0, 0)).getTime() - 7 * 86400000
    },
    {
      id: 32,
      time: '03:15 AM',
      date: 'Past Week',
      event: 'Restless sleep',
      status: 'warning',
      description: 'Increased movement during sleep',
      timestamp: new Date(new Date().setHours(3, 15, 0, 0)).getTime() - 7 * 86400000
    },
    {
      id: 33,
      time: '01:45 AM',
      date: 'Past Week',
      event: 'Sleep sounds',
      status: 'normal',
      description: 'Light snoring detected',
      timestamp: new Date(new Date().setHours(1, 45, 0, 0)).getTime() - 7 * 86400000
    },
    {
      id: 34,
      time: '11:30 PM',
      date: 'Past Week',
      event: 'Entered bed',
      status: 'normal',
      description: 'Person detected in bed',
      timestamp: new Date(new Date().setHours(23, 30, 0, 0)).getTime() - 8 * 86400000
    }
  ];
  
  // Helper function for status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'normal': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Format time remaining
  const getTimeRemaining = () => {
    if (!pauseEndTime) return null;
    const now = new Date();
    const end = new Date(pauseEndTime);
    const diff = end - now;
    if (diff <= 0) return null;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
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
  
  // For custom duration
  const [customDuration, setCustomDuration] = useState(1); // Default 1 day

  // Handle pause monitoring with duration in hours
  const handlePauseMonitoring = (hours) => {
    if (hours) {
      const endTime = new Date();
      endTime.setHours(endTime.getHours() + hours);
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
    console.log('Monitoring resumed');
  };
  
  // Load saved settings on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('carePalSettings');
      if (savedSettings) {
        const { roomName, defaultSchedule } = JSON.parse(savedSettings);
        if (roomName) setRoomName(roomName);
        if (defaultSchedule) setDefaultSchedule(defaultSchedule);
      }
      
      // Log to console
      console.log('Settings loaded from localStorage');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);
  
  // Save settings when they change
  useEffect(() => {
    try {
      localStorage.setItem('carePalSettings', JSON.stringify({
        roomName,
        defaultSchedule
      }));
      
      // Log to console
      console.log('Settings saved to localStorage');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [roomName, defaultSchedule]);
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Brand Header */}
      <div className="bg-indigo-900 px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Moon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-semibold">CarePal</h1>
            <p className="text-indigo-200 text-xs">Night Bed Care Monitor</p>
          </div>
        </div>
      </div>

      {/* Room Info & Status */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <button 
            className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 transition-colors px-2 py-1 rounded-lg"
            onClick={() => setShowRoomSettings(true)}
            aria-label="Edit room name"
          >
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-white">{roomName}</span>
            <Edit2 className="h-3 w-3 text-gray-400 ml-1" />
          </button>
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
              <span className="text-xs text-gray-400">System Online</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Monitoring Status & Quick Stats */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          {monitoringPaused ? (
            <span className="text-yellow-400 font-medium">Monitoring Paused</span>
          ) : (
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-green-400 font-medium">In Bed</span>
              <span className="text-xs text-gray-400 ml-2">Updated 2m ago</span>
            </div>
          )}
        </div>
        
        {/* Key Metrics - Only shown when actively monitoring */}
        {!monitoringPaused && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-700/50 rounded-lg p-2 text-center">
              <div className="text-xs text-gray-400">Last Activity</div>
              <div className="text-sm text-white font-medium">7 min ago</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-2 text-center">
              <div className="text-xs text-gray-400">Time in Bed</div>
              <div className="text-sm text-white font-medium">6h 15m</div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-2">
          {monitoringPaused ? (
            <button 
              className="flex-1 py-2.5 px-3 rounded-lg bg-yellow-500 text-gray-900 flex items-center justify-between hover:bg-yellow-400 transition-colors shadow-md"
              onClick={() => setShowPauseOptions(true)}
            >
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="text-sm font-medium">Monitoring Paused</div>
                  <div className="text-xs opacity-80">
                    {getTimeRemaining() ? `Resume in ${getTimeRemaining()}` : 'Tap to resume'}
                  </div>
                </div>
              </div>
              <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded-full">Tap</span>
            </button>
          ) : (
            <button 
              className="flex-1 py-2.5 px-3 rounded-lg bg-gray-700 text-gray-300 flex items-center justify-between hover:bg-gray-600 transition-colors shadow-md"
              onClick={() => setShowPauseOptions(true)}
            >
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="text-sm font-medium">Pause Monitoring</div>
                  <div className="text-xs opacity-80">For maintenance or absence</div>
                </div>
              </div>
              <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded-full">Tap</span>
            </button>
          )}
          <button 
            className="py-2.5 px-3 rounded-lg bg-gray-700 text-gray-300 flex items-center justify-between hover:bg-gray-600 transition-colors shadow-md"
            onClick={() => setShowScheduleSettings(true)}
          >
            <div className="flex items-center">
              <Moon className="h-5 w-5 mr-2" />
              <div className="text-left whitespace-nowrap">
                <div className="text-sm font-medium">Night Hours</div>
                <div className="text-xs opacity-80">{defaultSchedule.start}-{defaultSchedule.end}</div>
              </div>
            </div>
            <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded-full ml-2">Tap</span>
          </button>
        </div>
        
        {/* Add Alert Settings Button */}
        <button 
          className="w-full mt-2 py-2.5 px-3 rounded-lg bg-gray-700 text-gray-300 flex items-center justify-between hover:bg-gray-600 transition-colors shadow-md"
          onClick={() => setShowAlertSettings(true)}
        >
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <div className="text-left">
              <div className="text-sm font-medium">Alert Settings</div>
              <div className="text-xs opacity-80">Customize alert types</div>
            </div>
          </div>
          <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded-full">Tap</span>
        </button>
      </div>
      
      {/* Selected Event View */}
      {selectedEvent && (
        <div className="px-4 py-3">
          <div className="bg-gray-800 rounded-lg overflow-hidden mb-3">
            <div className="flex justify-between items-center px-3 py-2.5 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${getStatusColor(selectedEvent.status)}`} />
                <div>
                  <h3 className="text-white text-sm font-medium">{selectedEvent.event}</h3>
                  <p className="text-xs text-gray-400">{selectedEvent.time}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 p-1 hover:bg-gray-700 rounded"
                aria-label="Close event details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Event Footage */}
            <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
              <div className="absolute inset-0 bg-gradient-to-b from-purple-900 to-yellow-400 opacity-20" />
              <div className="absolute top-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                Movement Snapshot
              </div>
            </div>

            {/* Event Details */}
            <div className="p-3">
              <div className="text-sm text-gray-300">{selectedEvent.description}</div>
            </div>
          </div>
        </div>
      )}

      {/* Event Timeline */}
      <div className="px-4 py-3">
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="flex justify-between items-center px-3 py-2 border-b border-gray-700">
            <h2 className="text-white text-sm font-medium">Recent Activity</h2>
            <div className="flex">
              <button 
                className="p-1.5 text-white bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg flex items-center space-x-1"
                onClick={() => {
                  setShowHistory(true);
                  // Reset filters and pagination when opening history
                  setHistoryDateFilter('Today');
                  setCurrentPage(1);
                }}
                aria-label="View history"
              >
                <Calendar className="h-4 w-4" />
                <span className="text-xs">History</span>
              </button>
              <button 
                className="p-1.5 text-white bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg flex items-center space-x-1 ml-2"
                onClick={() => setShowFilters(true)}
                aria-label="Filter events"
              >
                <Filter className="h-4 w-4" />
                <span className="text-xs">Filter</span>
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-700">
            {/* Group events by date */}
            {['Today', 'Yesterday'].map(date => {
              // Get filtered events for this date
              const filteredEvents = events
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
              
              // Calculate pagination for this date group
              const startIndex = (currentPage - 1) * eventsPerPage;
              const endIndex = Math.min(
                startIndex + eventsPerPage,
                filteredEvents.length
              );
              
              // Only show events up to the eventsToShow limit for this date
              const visibleEvents = filteredEvents.slice(0, eventsToShow);
              
              // Only render this date group if it has events to show
              if (filteredEvents.length === 0) return null;
              
              return (
                <div key={date}>
                  <div className="px-3 py-2 bg-gray-750 text-xs text-gray-400 font-medium">
                    {date}
                  </div>
                  
                  {/* Render visible events */}
                  {visibleEvents.map((event) => (
                    <button
                      key={event.id}
                      className={`w-full text-left flex items-start space-x-2 p-3 hover:bg-gray-700 active:bg-gray-600 transition-colors
                        ${selectedEvent?.id === event.id ? 'bg-gray-700' : ''}`}
                      onClick={() => setSelectedEvent(event)}
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
                  ))}
                  
                  {/* Show More button - only show if there are more events to display */}
                  {filteredEvents.length > visibleEvents.length && (
                    <div className="px-3 py-2 border-t border-gray-700">
                      <button 
                        className="w-full text-center text-blue-400 text-sm hover:text-blue-300 transition-colors"
                        onClick={() => {
                          if (eventsToShow < eventsPerPage) {
                            // First expand to 5
                            setEventsToShow(eventsPerPage);
                          } else {
                            // Then enable pagination
                            if (currentPage * eventsPerPage < filteredEvents.length) {
                              setCurrentPage(currentPage + 1);
                            }
                          }
                          console.log(`Showing more events for ${date}. Current page: ${currentPage}, Events to show: ${eventsToShow}`);
                        }}
                      >
                        Show More
                      </button>
                    </div>
                  )}
                  
                  {/* Pagination controls - only show if we've expanded beyond initial view */}
                  {eventsToShow >= eventsPerPage && filteredEvents.length > eventsPerPage && (
                    <div className="px-3 py-2 border-t border-gray-700 flex justify-between items-center">
                      <button 
                        className={`text-sm ${currentPage > 1 ? 'text-blue-400 hover:text-blue-300' : 'text-gray-600'} transition-colors`}
                        onClick={() => {
                          if (currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                            console.log(`Moving to previous page. Current page: ${currentPage - 1}`);
                          }
                        }}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      
                      <span className="text-xs text-gray-400">
                        Page {currentPage} of {Math.ceil(filteredEvents.length / eventsPerPage)}
                      </span>
                      
                      <button 
                        className={`text-sm ${currentPage < Math.ceil(filteredEvents.length / eventsPerPage) ? 'text-blue-400 hover:text-blue-300' : 'text-gray-600'} transition-colors`}
                        onClick={() => {
                          if (currentPage < Math.ceil(filteredEvents.length / eventsPerPage)) {
                            setCurrentPage(currentPage + 1);
                            console.log(`Moving to next page. Current page: ${currentPage + 1}`);
                          }
                        }}
                        disabled={currentPage >= Math.ceil(filteredEvents.length / eventsPerPage)}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

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
                  className={`px-3 py-1 ${historyDateFilter === 'Today' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'} text-sm rounded-full`}
                  onClick={() => {
                    setHistoryDateFilter('Today');
                    // Reset pagination when changing filters
                    setCurrentPage(1);
                    console.log('History filter set to: Today');
                  }}
                >
                  Today
                </button>
                <button 
                  className={`px-3 py-1 ${historyDateFilter === 'Past Week' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'} text-sm rounded-full`}
                  onClick={() => {
                    setHistoryDateFilter('Past Week');
                    // Reset pagination when changing filters
                    setCurrentPage(1);
                    console.log('History filter set to: Past Week');
                  }}
                >
                  Past Week
                </button>
                <button 
                  className={`px-3 py-1 ${historyDateFilter === 'All History' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'} text-sm rounded-full`}
                  onClick={() => {
                    setHistoryDateFilter('All History');
                    // Reset pagination when changing filters
                    setCurrentPage(1);
                    console.log('History filter set to: All History');
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
                // Helper function to get events by date filter
                const getFilteredEvents = () => {
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
                  return filteredEvents.filter(event => {
                    if (activeFilters.includes('all')) return true;
                    if (event.status === 'critical' && activeFilters.includes('critical')) return true;
                    if (event.status === 'warning' && activeFilters.includes('warning')) return true;
                    if (event.status === 'normal' && activeFilters.includes('normal')) return true;
                    return false;
                  }).sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp (newest first)
                };
                
                const filteredEvents = getFilteredEvents();
                
                // Group events by date for display
                const groupedEvents = {};
                
                // Process event dates for display
                filteredEvents.forEach(event => {
                  let displayDate;
                  
                  if (event.date === 'Today') {
                    displayDate = 'February 24, 2025'; // Example date, could be dynamic
                  } else if (event.date === 'Yesterday') {
                    displayDate = 'February 23, 2025';
                  } else {
                    // For 'Past Week' items, create dates based on timestamp
                    const eventDate = new Date(event.timestamp);
                    displayDate = eventDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
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
                          console.log('Selected event:', event);
                        }}
                      >
                        <div className={`mt-0.5 h-3 w-3 rounded-full flex-shrink-0 ${getStatusColor(event.status)}`} />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <div className="text-white text-sm font-medium">{event.event}</div>
                            <div className="text-xs text-gray-400">{event.time}</div>
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">{event.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ));
              })()}
              
              {/* Data Retention Notice */}
              <div className="p-4 text-center text-xs text-gray-500">
                Event data is retained for 30 days.<br/>
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
              <button onClick={() => setShowAlertSettings(false)} className="text-gray-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-gray-700">
                <div className="text-white text-sm font-medium mb-3">Alert Types</div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                      <div>
                        <div className="text-white text-sm font-medium">Bed Exit Alerts</div>
                        <div className="text-xs text-gray-400">When person leaves the bed</div>
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
                            bedExit: !alertSettings.bedExit
                          });
                          
                          // Log to console
                          console.log('Bed exit alerts:', !alertSettings.bedExit);
                        }}
                      />
                      <span className={`absolute cursor-pointer inset-0 rounded-full transition-colors duration-200 ${
                        alertSettings.bedExit ? 'bg-blue-500' : 'bg-gray-500'
                      }`}>
                        <span className={`absolute h-5 w-5 rounded-full bg-white transform transition-transform duration-200 ${
                          alertSettings.bedExit ? 'translate-x-6' : 'translate-x-1'
                        } top-0.5`}></span>
                      </span>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                      <div>
                        <div className="text-white text-sm font-medium">Edge Detection</div>
                        <div className="text-xs text-gray-400">When sitting on side of bed</div>
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
                            edgeDetection: !alertSettings.edgeDetection
                          });
                          
                          // Log to console
                          console.log('Edge detection:', !alertSettings.edgeDetection);
                        }}
                      />
                      <span className={`absolute cursor-pointer inset-0 rounded-full transition-colors duration-200 ${
                        alertSettings.edgeDetection ? 'bg-blue-500' : 'bg-gray-500'
                      }`}>
                        <span className={`absolute h-5 w-5 rounded-full bg-white transform transition-transform duration-200 ${
                          alertSettings.edgeDetection ? 'translate-x-6' : 'translate-x-1'
                        } top-0.5`}></span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-gray-700">
                <div className="text-white text-sm font-medium mb-3">Alert Notifications</div>
                <div className="text-xs text-gray-300">
                  Alerts will be sent via SMS and WhatsApp to registered caregivers.
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
                  console.log('Alert settings saved:', alertSettings);
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
              <button onClick={() => setShowFilters(false)} className="text-gray-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <button 
                className={`w-full p-3 text-left rounded-lg ${activeFilters.includes('all') ? 'bg-blue-600 text-white font-medium' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                onClick={() => {
                  setActiveFilters(['all']);
                  
                  // Log to console
                  console.log('Filter set to: all');
                }}
              >
                All Events
              </button>
              
              <button 
                className={`w-full p-3 text-left rounded-lg ${activeFilters.includes('critical') ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'} flex items-center space-x-3`}
                onClick={() => {
                  if (activeFilters.includes('all')) {
                    setActiveFilters(['critical']);
                  } else if (activeFilters.includes('critical')) {
                    setActiveFilters(activeFilters.filter(f => f !== 'critical'));
                  } else {
                    setActiveFilters([...activeFilters, 'critical']);
                  }
                  
                  // Log to console
                  console.log('Filter updated: critical events');
                }}
              >
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                <div>
                  <div className="text-white text-sm font-medium">Bed Exits Only</div>
                  <div className="text-xs text-gray-400">Person left the bed</div>
                </div>
              </button>
              
              <button 
                className={`w-full p-3 text-left rounded-lg ${activeFilters.includes('warning') ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'} flex items-center space-x-3`}
                onClick={() => {
                  if (activeFilters.includes('all')) {
                    setActiveFilters(['warning']);
                  } else if (activeFilters.includes('warning')) {
                    setActiveFilters(activeFilters.filter(f => f !== 'warning'));
                  } else {
                    setActiveFilters([...activeFilters, 'warning']);
                  }
                  
                  // Log to console
                  console.log('Filter updated: warning events');
                }}
              >
                <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <div className="text-white text-sm font-medium">Edge Activity Only</div>
                  <div className="text-xs text-gray-400">Sitting on edge of bed</div>
                </div>
              </button>
              
              <button 
                onClick={() => {
                  setShowFilters(false);
                  
                  // Log to console
                  console.log('Filters applied:', activeFilters);
                }}
                className="w-full bg-blue-500 text-white rounded-lg py-2 text-sm font-medium mt-2"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Room Settings Modal */}
      {showRoomSettings && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-labelledby="room-settings-title"
        >
          <div className="bg-gray-800 w-full max-w-sm rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 id="room-settings-title" className="text-white font-semibold">Room Settings</h3>
              <button 
                onClick={() => setShowRoomSettings(false)}
                className="text-gray-400"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label 
                  htmlFor="room-name"
                  className="text-sm text-gray-300 block mb-2"
                >
                  Room Name
                </label>
                <input 
                  id="room-name"
                  type="text"
                  value={roomName}
                  onChange={(e) => {
                    setRoomName(e.target.value);
                    
                    // Log to console
                    console.log('Room name updated:', e.target.value);
                  }}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2"
                  placeholder="Enter room name"
                />
              </div>
              
              <button 
                onClick={() => {
                  setShowRoomSettings(false);
                  
                  // Log to console
                  console.log('Room settings saved:', roomName);
                }}
                className="w-full bg-blue-500 text-white rounded-lg py-2 text-sm font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Night Hours Settings Modal */}
      {showScheduleSettings && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-labelledby="schedule-settings-title"
        >
          <div className="bg-gray-800 w-full max-w-sm rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 id="schedule-settings-title" className="text-white font-semibold">Night Monitoring Hours</h3>
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
                <label className="text-sm text-gray-300 block mb-2">Active Monitoring Period</label>
                <div className="flex space-x-2 items-center">
                  <input 
                    type="time"
                    value={defaultSchedule.start}
                    onChange={(e) => {
                      setDefaultSchedule({...defaultSchedule, start: e.target.value});
                      
                      // Log to console
                      console.log('Start time updated:', e.target.value);
                    }}
                    className="flex-1 bg-gray-700 text-white rounded px-3 py-2"
                    aria-label="Start time"
                  />
                  <span className="text-gray-400">to</span>
                  <input 
                    type="time"
                    value={defaultSchedule.end}
                    onChange={(e) => {
                      setDefaultSchedule({...defaultSchedule, end: e.target.value});
                      
                      // Log to console
                      console.log('End time updated:', e.target.value);
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
                  console.log('Schedule settings saved:', defaultSchedule);
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
              <h3 
                id="pause-options-title" 
                className="text-white font-semibold"
              >
                {monitoringPaused ? 'Resume Monitoring' : 'Pause Monitoring'}
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
                  <div className="text-sm opacity-90 mt-1">Return to active monitoring</div>
                </button>
              )}
              
              <button
                className="w-full p-3 text-left rounded-lg bg-gray-700 hover:bg-gray-600"
                onClick={() => handlePauseMonitoring(3)}
              >
                <div className="text-white text-sm font-medium">Short Pause</div>
                <div className="text-gray-400 text-xs mt-1">3 hours (changing sheets, bathroom break)</div>
              </button>

              <button
                className="w-full p-3 text-left rounded-lg bg-gray-700 hover:bg-gray-600"
                onClick={() => handlePauseMonitoring(12)}
              >
                <div className="text-white text-sm font-medium">Day Trip</div>
                <div className="text-gray-400 text-xs mt-1">12 hours (day outing, doctor visit)</div>
              </button>

              <button
                className="w-full p-3 text-left rounded-lg bg-gray-700 hover:bg-gray-600"
                onClick={() => handlePauseMonitoring(72)}
              >
                <div className="text-white text-sm font-medium">Weekend Trip</div>
                <div className="text-gray-400 text-xs mt-1">3 days (weekend away)</div>
              </button>
              
              <div className="p-3 rounded-lg bg-gray-700">
                <div className="text-white text-sm font-medium mb-2">Custom Duration</div>
                <div className="flex mb-2">
                  <select 
                    className="flex-1 bg-gray-600 rounded px-3 py-1 text-white text-sm"
                    value={customDuration}
                    onChange={(e) => {
                      setCustomDuration(parseInt(e.target.value));
                      
                      // Log to console
                      console.log('Custom duration set to:', e.target.value, 'days');
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