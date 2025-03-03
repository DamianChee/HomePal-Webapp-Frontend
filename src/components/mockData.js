/**
 * Mock Event Data
 * 
 * This file contains mock data for the CarePal Mobile Dashboard.
 * Separating data from components follows best practices for React applications,
 * making it easier to maintain, test, and potentially replace with real API data.
 */

// Helper function to create timestamp for today with specified hours/minutes
const createTimestamp = (hours, minutes, daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hours, minutes, 0, 0);
  return date.getTime();
};

// Export mock events data
const mockEvents = [
  // Today's events (10 events)
  {
    id: 1,
    time: '02:15 AM',
    date: 'Today',
    event: 'Left bed',
    status: 'critical',
    description: 'Movement detected away from bed',
    timestamp: createTimestamp(2, 15)
  },
  {
    id: 2,
    time: '01:45 AM',
    date: 'Today',
    event: 'Edge movement',
    status: 'warning',
    description: 'Activity near bed edge',
    timestamp: createTimestamp(1, 45)
  },
  {
    id: 5,
    time: '01:10 AM',
    date: 'Today',
    event: 'Restless sleep',
    status: 'normal',
    description: 'Increased movement frequency detected',
    timestamp: createTimestamp(1, 10)
  },
  {
    id: 6,
    time: '12:32 AM',
    date: 'Today',
    event: 'Sleep sounds',
    status: 'normal',
    description: 'Light snoring detected',
    timestamp: createTimestamp(0, 32)
  },
  {
    id: 7,
    time: '12:05 AM',
    date: 'Today',
    event: 'Edge movement',
    status: 'warning',
    description: 'Brief movement near edge of bed',
    timestamp: createTimestamp(0, 5)
  },
  {
    id: 8,
    time: '11:50 PM',
    date: 'Today',
    event: 'Entered bed',
    status: 'normal',
    description: 'Person detected in bed',
    timestamp: createTimestamp(23, 50, 1)
  },
  {
    id: 9,
    time: '11:48 PM',
    date: 'Today',
    event: 'Room entry',
    status: 'normal',
    description: 'Movement detected in room',
    timestamp: createTimestamp(23, 48, 1)
  },
  {
    id: 10,
    time: '11:45 PM',
    date: 'Today',
    event: 'Lights dimmed',
    status: 'normal',
    description: 'Room lighting level reduced',
    timestamp: createTimestamp(23, 45, 1)
  },
  {
    id: 11,
    time: '11:40 PM',
    date: 'Today',
    event: 'Bathroom visit',
    status: 'normal',
    description: 'Movement to bathroom detected',
    timestamp: createTimestamp(23, 40, 1)
  },
  {
    id: 12,
    time: '10:55 PM',
    date: 'Today',
    event: 'Room temperature',
    status: 'normal',
    description: 'Room temperature set to 68°F',
    timestamp: createTimestamp(22, 55, 1)
  },
  
  // Yesterday's events (10 events)
  {
    id: 3,
    time: '11:30 PM',
    date: 'Yesterday',
    event: 'Bed exit',
    status: 'critical',
    description: 'Complete exit from bed detected',
    timestamp: createTimestamp(23, 30, 1)
  },
  {
    id: 4,
    time: '10:15 PM',
    date: 'Yesterday',
    event: 'Edge detection',
    status: 'warning',
    description: 'Sitting on edge of bed',
    timestamp: createTimestamp(22, 15, 1)
  },
  {
    id: 13,
    time: '09:45 PM',
    date: 'Yesterday',
    event: 'Entered bed',
    status: 'normal',
    description: 'Person detected in bed',
    timestamp: createTimestamp(21, 45, 1)
  },
  {
    id: 14,
    time: '09:15 PM',
    date: 'Yesterday',
    event: 'Room entry',
    status: 'normal',
    description: 'Movement detected in room',
    timestamp: createTimestamp(21, 15, 1)
  },
  {
    id: 15,
    time: '02:30 PM',
    date: 'Yesterday',
    event: 'Medication check',
    status: 'normal',
    description: 'Medication reminder acknowledged',
    timestamp: createTimestamp(14, 30, 1)
  },
  {
    id: 16,
    time: '08:45 AM',
    date: 'Yesterday',
    event: 'Bed exit',
    status: 'normal',
    description: 'Morning wake-up detected',
    timestamp: createTimestamp(8, 45, 1)
  },
  {
    id: 17,
    time: '07:15 AM',
    date: 'Yesterday',
    event: 'Restless sleep',
    status: 'warning',
    description: 'Increased movement during sleep',
    timestamp: createTimestamp(7, 15, 1)
  },
  {
    id: 18,
    time: '05:30 AM',
    date: 'Yesterday',
    event: 'Bed exit',
    status: 'critical',
    description: 'Early morning bathroom visit',
    timestamp: createTimestamp(5, 30, 1)
  },
  {
    id: 19,
    time: '04:10 AM',
    date: 'Yesterday',
    event: 'Sleep sounds',
    status: 'warning',
    description: 'Heavy breathing detected',
    timestamp: createTimestamp(4, 10, 1)
  },
  {
    id: 20,
    time: '01:45 AM',
    date: 'Yesterday',
    event: 'Temperature alert',
    status: 'warning',
    description: 'Room temperature increased to 74°F',
    timestamp: createTimestamp(1, 45, 1)
  },
  
  // Past Week events (14 events)
  {
    id: 21,
    time: '11:30 PM',
    date: 'Past Week',
    event: 'Deep sleep detected',
    status: 'normal',
    description: 'Minimal movement period',
    timestamp: createTimestamp(23, 30, 3)
  },
  {
    id: 22,
    time: '10:45 PM',
    date: 'Past Week',
    event: 'Entered bed',
    status: 'normal',
    description: 'Person detected in bed',
    timestamp: createTimestamp(22, 45, 3)
  },
  {
    id: 23,
    time: '02:15 AM',
    date: 'Past Week',
    event: 'Bed exit',
    status: 'critical',
    description: 'Complete exit from bed detected',
    timestamp: createTimestamp(2, 15, 4)
  },
  {
    id: 24,
    time: '01:30 AM',
    date: 'Past Week',
    event: 'Edge movement',
    status: 'warning',
    description: 'Activity near bed edge',
    timestamp: createTimestamp(1, 30, 4)
  },
  {
    id: 25,
    time: '11:45 PM',
    date: 'Past Week',
    event: 'Entered bed',
    status: 'normal',
    description: 'Person detected in bed',
    timestamp: createTimestamp(23, 45, 4)
  },
  {
    id: 26,
    time: '10:30 PM',
    date: 'Past Week',
    event: 'Room temperature',
    status: 'normal',
    description: 'Room temperature set to 68°F',
    timestamp: createTimestamp(22, 30, 5)
  },
  {
    id: 27,
    time: '03:15 AM',
    date: 'Past Week',
    event: 'Bed exit',
    status: 'critical',
    description: 'Complete exit from bed detected',
    timestamp: createTimestamp(3, 15, 6)
  },
  {
    id: 28,
    time: '02:45 AM',
    date: 'Past Week',
    event: 'Edge movement',
    status: 'warning',
    description: 'Activity near bed edge',
    timestamp: createTimestamp(2, 45, 6)
  },
  {
    id: 29,
    time: '12:15 AM',
    date: 'Past Week',
    event: 'Deep sleep detected',
    status: 'normal',
    description: 'Minimal movement period',
    timestamp: createTimestamp(0, 15, 6)
  },
  {
    id: 30,
    time: '11:00 PM',
    date: 'Past Week',
    event: 'Entered bed',
    status: 'normal',
    description: 'Person detected in bed',
    timestamp: createTimestamp(23, 0, 7)
  },
  {
    id: 31,
    time: '04:30 AM',
    date: 'Past Week',
    event: 'Bed exit',
    status: 'critical',
    description: 'Complete exit from bed detected',
    timestamp: createTimestamp(4, 30, 7)
  },
  {
    id: 32,
    time: '03:15 AM',
    date: 'Past Week',
    event: 'Restless sleep',
    status: 'warning',
    description: 'Increased movement during sleep',
    timestamp: createTimestamp(3, 15, 7)
  },
  {
    id: 33,
    time: '01:45 AM',
    date: 'Past Week',
    event: 'Sleep sounds',
    status: 'normal',
    description: 'Light snoring detected',
    timestamp: createTimestamp(1, 45, 7)
  },
  {
    id: 34,
    time: '11:30 PM',
    date: 'Past Week',
    event: 'Entered bed',
    status: 'normal',
    description: 'Person detected in bed',
    timestamp: createTimestamp(23, 30, 8)
  }
];

export default mockEvents;