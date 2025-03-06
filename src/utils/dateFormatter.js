export function formatDate() {
  const date = new Date(Date.now());

  // Format time
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;

  // Format date
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Return formatted string
  return `${formattedHours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}${ampm} ${day}/${month}/${year}`;
}

export function getDateObject() {
  try {
    // Simply use the local date object without timezone adjustments
    const dateObject = new Date();

    if (isNaN(dateObject.getTime())) {
      console.error("ERROR: Invalid date object created!");
      return null;
    }

    return dateObject;
  } catch (error) {
    console.error("ERROR in getDateObject:", error);
    return null;
  }
}

export const parseTime = (timeStr) => {
  if (!timeStr?.trim()) return null; // Return null for invalid inputs

  const [time, period] = timeStr.split(" ") || [];
  if (!time || !period) return null;

  const [hours, minutes] = time.split(":") || [];
  if (!hours || !minutes) return null;

  const hourNum = parseInt(hours);
  const minuteNum = parseInt(minutes);
  if (isNaN(hourNum) || isNaN(minuteNum)) return null;

  let hour = hourNum;
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return hour * 60 + minuteNum;
};

export const formatFirebaseTimestamp = (timestamp) => {
  // Convert nanoseconds to milliseconds
  const totalMs =
    timestamp._seconds * 1000 + Math.floor(timestamp._nanoseconds / 1e6);

  // Create Date object
  const date = new Date(totalMs);

  // Format the date parts
  const day = date.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Return formatted string
  return `${day} ${month} ${year} at ${hours}:${minutes}:${seconds} UTC+8`;
};
