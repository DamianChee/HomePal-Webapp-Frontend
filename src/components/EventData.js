/**
 * Event Data
 *
 * This file contains functions for data for the CarePal Mobile Dashboard.
 * Separating data from components follows best practices for React applications,
 * making it easier to maintain, test, and potentially replace with real API
 * data.
 */

/**
 * Helper Function for transformLiveEvents, it takes in one event at a time and
 * returns a javascript object along with a date formatted to work with the rest
 * of the app.
 */

const transformLiveEvent = (liveEvent) => {
  const date = new Date(liveEvent.time);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return {
    id: liveEvent.eventId,
    time: date.toLocaleTimeString(),
    date: `${day}/${month}/${year}`,
    event: liveEvent.action,
    status: liveEvent.isHandled ? "Handled" : "Unhandled",
    description: liveEvent.action,
  };
};

/**
 * Helper Function for fetchEvents, it takes in a list of events and calls
 * transformLiveEvent, passing and transforming the retrieved Firebase Firestore
 * list of events and turning them into a new array of Javascript objects in the
 * correct format and containing the correct information we need for the rest of
 * the app.
 */

const transformLiveEvents = (liveEvents) => {
  return liveEvents.map(transformLiveEvent);
};

/**
 * Runs a fetch from our backend API to retrieve events. It then calls
 * transformLiveEvents to convert and format the data retrieved into an object
 * that the rest of the app can handle.
 */

export const fetchEvents = async (fetchFn) => {
  try {
    const rawData = await fetchFn();
    console.log(`Raw Data from fetch:`, rawData);

    // Validate response structure
    if (!Array.isArray(rawData)) {
      throw new Error("Invalid response format: expected array");
    }

    const events = transformLiveEvents(rawData);
    return events;
  } catch (error) {
    console.error("[fetchEvents] Error processing events:", error.message);
    throw error;
  }
};

// Export mock events data
export const mockEvents = [
  {
    id: 1,
    time: "10:45 PM",
    date: `${today.getDate() - 2}/${
      today.getMonth() + 1
    }/${today.getFullYear()}`,
    event: "Entered bed",
    status: "normal",
    description: "Person detected in bed",
  },
  {
    id: 2,
    time: "11:30 PM",
    date: `${today.getDate() - 2}/${
      today.getMonth() + 1
    }/${today.getFullYear()}`,
    event: "Deep sleep detected",
    status: "normal",
    description: "Minimal movement period",
  },
  {
    id: 3,
    time: "12:45 AM",
    date: `${today.getDate() - 1}/${
      today.getMonth() + 1
    }/${today.getFullYear()}`,
    event: "Entered bed",
    status: "normal",
    description: "Person detected in bed",
  },
  {
    id: 4,
    time: "09:45 AM",
    date: `${today.getDate() - 1}/${
      today.getMonth() + 1
    }/${today.getFullYear()}`,
    event: "Entered bed",
    status: "normal",
    description: "Person detected in bed",
  },
  {
    id: 5,
    time: "04:45 PM",
    date: `${today.getDate() - 1}/${
      today.getMonth() + 1
    }/${today.getFullYear()}`,
    event: "Fall detected",
    status: "critical",
    description: "Fall near edge of bed",
  },
  {
    id: 6,
    time: "11:30 PM",
    date: `${today.getDate() - 1}/${
      today.getMonth() + 1
    }/${today.getFullYear()}`,
    event: "Bed exit",
    status: "warning",
    description: "Complete exit from bed detected",
  },
  {
    id: 7,
    time: `01:15 AM`,
    date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
    event: "Left bed",
    status: "warning",
    description: "Movement detected away from bed",
  },
  {
    id: 8,
    time: "02:45 AM",
    date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
    event: "Edge movement",
    status: "warning",
    description: "Activity near bed edge",
  },
  {
    id: 9,
    time: "03:10 AM",
    date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
    event: "Edge movement",
    status: "warning",
    description: "Activity near bed edge",
  },
  {
    id: 10,
    time: "04:32 AM",
    date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
    event: "Edge movement",
    status: "normal",
    description: "Activity near bed edge",
  },
  {
    id: 11,
    time: "05:05 AM",
    date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
    event: "Edge movement",
    status: "normal",
    description: "Brief movement near edge of bed",
  },
  {
    id: 12,
    time: "12:50 PM",
    date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
    event: "Entered bed",
    status: "normal",
    description: "Person detected in bed",
  },
  {
    id: 13,
    time: "01:48 PM",
    date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
    event: "Left bed",
    status: "warning",
    description: "Movement detected away from bed",
  },
  {
    id: 14,
    time: "02:45 PM",
    date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
    event: "Edge movement",
    status: "normal",
    description: "Brief movement near edge of bed",
  },
  {
    id: 15,
    time: "05:45 PM",
    date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
    event: "Entered bed",
    status: "normal",
    description: "Person detected in bed",
  },
  {
    id: 16,
    time: "09:45 PM",
    date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
    event: "Fall detected",
    status: "critical",
    description: "Fall near edge of bed",
  },
];

// export default mockEvents;
export default fetchEvents;
