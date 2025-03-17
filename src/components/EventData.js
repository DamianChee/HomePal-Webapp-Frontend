/**
 * Event Data
 *
 * This file contains functions for data for the CarePal Mobile Dashboard.
 * Separating data from components follows best practices for React applications,
 * making it easier to maintain, test, and potentially replace with real API
 * data.
 */

import useFetch from "./hooks/useFetch";
const fetchData = useFetch();

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

/**
 * Runs a status check to the backend. The endpoint being
 * [hostedsite]/api/status and a GET request. This is purely for debugging
 * purposes
 */

export const handleGetAPIStatus = async () => {
  try {
    const res = await fetchData("/api/status", "GET");
    if (!res.ok) throw new Error(res.data);
    console.log(res.data.response);
  } catch (error) {
    console.error(`[handleGetAPIStatus] Error has occured:`, error.message);
  }
};

/**
 * Grabs all Events stored on Firebase Firestore via our backend. The endpoint
 * being [hostedsite]/events and a GET request. You shouldn't really need ALL
 * events since we only display data from the last 30 days.
 */

export const handleGetAllEvents = async () => {
  try {
    const res = await fetchData("/events", "GET");
    if (!res.ok) throw new Error(res.data);
    console.log(res.data.response);
  } catch (error) {
    console.error(`[handleGetAllEvents] Error has occured:`, error.message);
  }
};

/**
 * Grabs the latest Events stored on Firebase Firestore via our backend which
 * will give you the 40 most recent events. The endpoint being
 * [hostedsite]/events/latest and a GET request. You shouldn't really need these
 * 40 latest events since we should be displaying data from the last 30 days.
 */

export const handleGetLatestEvents = async () => {
  try {
    const res = await fetchData(`/events/latest`, "GET");
    if (!res.ok) throw new Error(res.data);
    console.log(res.data.response);
  } catch (error) {
    console.error(`[handleGetLatestEvents] Error has occured:`, error.message);
  }
};

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

export const handleGetRecentEvents = async () => {
  try {
    const res = await fetchData(`/events/recent`, "GET");
    if (!res.ok) throw new Error(res.data);
    console.log(res.data.response);
  } catch (error) {
    console.error(`[handleGetRecentEvents] Error has occured:`, error.message);
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
