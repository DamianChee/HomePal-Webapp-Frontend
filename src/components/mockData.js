/**
 * Mock Event Data
 *
 * This file contains mock data for the CarePal Mobile Dashboard.
 * Separating data from components follows best practices for React applications,
 * making it easier to maintain, test, and potentially replace with real API data.
 */

import getDateObject from "../utils/dateFormatter";

// Helper function to create timestamp for today with specified hours/minutes
const createTimestamp = (hours, minutes, daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hours, minutes, 0, 0);
  return date.getTime();
};

const today = getDateObject();

// Export mock events data
const mockEvents = [
  // Today's events (10 events)
  {
    id: 1,
    time: `01:15 AM`,
    date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
    event: "Left bed",
    status: "warning",
    description: "Movement detected away from bed",
  },
  {
    id: 2,
    time: "02:45 AM",
    date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
    event: "Edge movement",
    status: "warning",
    description: "Activity near bed edge",
  },
  {
    id: 3,
    time: "03:10 AM",
    date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
    event: "Edge movement",
    status: "warning",
    description: "Activity near bed edge",
  },
  {
    id: 4,
    time: "04:32 AM",
    date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
    event: "Edge movement",
    status: "normal",
    description: "Activity near bed edge",
  },
  {
    id: 5,
    time: "05:05 AM",
    date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
    event: "Edge movement",
    status: "normal",
    description: "Brief movement near edge of bed",
  },
  {
    id: 6,
    time: "12:50 PM",
    date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
    event: "Entered bed",
    status: "normal",
    description: "Person detected in bed",
  },
  {
    id: 7,
    time: "01:48 PM",
    date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
    event: "Left bed",
    status: "warning",
    description: "Movement detected away from bed",
  },
  {
    id: 8,
    time: "02:45 PM",
    date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
    event: "Edge movement",
    status: "normal",
    description: "Brief movement near edge of bed",
  },
  {
    id: 9,
    time: "05:45 PM",
    date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
    event: "Entered bed",
    status: "normal",
    description: "Person detected in bed",
  },
  {
    id: 10,
    time: "09:45 PM",
    date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
    event: "Fall detected",
    status: "critical",
    description: "Fall near edge of bed",
  },

  // Yesterday's events (10 events)
  {
    id: 11,
    time: "11:30 PM",
    date: "Yesterday",
    event: "Bed exit",
    status: "warning",
    description: "Complete exit from bed detected",
    timestamp: createTimestamp(23, 30, 1),
  },
  {
    id: 12,
    time: "09:45 PM",
    date: `${today.getDate() - 1}/${
      today.getMonth() + 1
    }/${today.getFullYear()}`,
    event: "Fall detected",
    status: "critical",
    description: "Fall near edge of bed",
  },
  {
    id: 13,
    time: "09:45 PM",
    date: "Yesterday",
    event: "Entered bed",
    status: "normal",
    description: "Person detected in bed",
    timestamp: createTimestamp(21, 45, 1),
  },

  // Past Week events (14 events)
  {
    id: 21,
    time: "11:30 PM",
    date: "Past Week",
    event: "Deep sleep detected",
    status: "normal",
    description: "Minimal movement period",
    timestamp: createTimestamp(23, 30, 3),
  },
  {
    id: 22,
    time: "10:45 PM",
    date: "Past Week",
    event: "Entered bed",
    status: "normal",
    description: "Person detected in bed",
    timestamp: createTimestamp(22, 45, 3),
  },
  {
    id: 23,
    time: "02:15 AM",
    date: "Past Week",
    event: "Bed exit",
    status: "critical",
    description: "Complete exit from bed detected",
    timestamp: createTimestamp(2, 15, 4),
  },
  {
    id: 24,
    time: "01:30 AM",
    date: "Past Week",
    event: "Edge movement",
    status: "warning",
    description: "Activity near bed edge",
    timestamp: createTimestamp(1, 30, 4),
  },
  {
    id: 25,
    time: "11:45 PM",
    date: "Past Week",
    event: "Entered bed",
    status: "normal",
    description: "Person detected in bed",
    timestamp: createTimestamp(23, 45, 4),
  },
  {
    id: 26,
    time: "10:30 PM",
    date: "Past Week",
    event: "Room temperature",
    status: "normal",
    description: "Room temperature set to 68°F",
    timestamp: createTimestamp(22, 30, 5),
  },
  {
    id: 27,
    time: "03:15 AM",
    date: "Past Week",
    event: "Bed exit",
    status: "critical",
    description: "Complete exit from bed detected",
    timestamp: createTimestamp(3, 15, 6),
  },
  {
    id: 28,
    time: "02:45 AM",
    date: "Past Week",
    event: "Edge movement",
    status: "warning",
    description: "Activity near bed edge",
    timestamp: createTimestamp(2, 45, 6),
  },
  {
    id: 29,
    time: "12:15 AM",
    date: "Past Week",
    event: "Deep sleep detected",
    status: "normal",
    description: "Minimal movement period",
    timestamp: createTimestamp(0, 15, 6),
  },
  {
    id: 30,
    time: "11:00 PM",
    date: "Past Week",
    event: "Entered bed",
    status: "normal",
    description: "Person detected in bed",
    timestamp: createTimestamp(23, 0, 7),
  },
  {
    id: 31,
    time: "04:30 AM",
    date: "Past Week",
    event: "Bed exit",
    status: "critical",
    description: "Complete exit from bed detected",
    timestamp: createTimestamp(4, 30, 7),
  },
  {
    id: 32,
    time: "03:15 AM",
    date: "Past Week",
    event: "Restless sleep",
    status: "warning",
    description: "Increased movement during sleep",
    timestamp: createTimestamp(3, 15, 7),
  },
  {
    id: 33,
    time: "01:45 AM",
    date: "Past Week",
    event: "Sleep sounds",
    status: "normal",
    description: "Light snoring detected",
    timestamp: createTimestamp(1, 45, 7),
  },
  {
    id: 34,
    time: "11:30 PM",
    date: "Past Week",
    event: "Entered bed",
    status: "normal",
    description: "Person detected in bed",
    timestamp: createTimestamp(23, 30, 8),
  },
];

export default mockEvents;
