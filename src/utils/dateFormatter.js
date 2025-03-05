function formatDate() {
  const date = new Date(Date.now());

  const damiansDate = new Date(
    date.toLocaleString("en-US", {
      timeZone: "Asia/Shanghai",
    })
  );

  // Format time
  const hours = damiansDate.getHours();
  const minutes = damiansDate.getMinutes();
  const seconds = damiansDate.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;

  // Format date
  const day = damiansDate.getDate();
  const month = damiansDate.getMonth() + 1;
  const year = damiansDate.getFullYear();

  // Return formatted string
  return `${formattedHours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}${ampm} ${day}/${month}/${year}`;
}

function getDateObject() {
  console.log("--- Starting getDateObject() ---");

  // Step 1: Get initial date
  const dateObject = new Date();
  console.log("Initial date:", dateObject.toString());
  console.log("Initial timestamp:", dateObject.getTime());

  // Step 2: Store original timestamp
  const originalTimestamp = dateObject.getTime();
  console.log("Original timestamp:", originalTimestamp);

  // Step 3: Create adjusted date
  const adjustedDate = new Date(originalTimestamp);
  console.log("Adjusted date before modification:", adjustedDate.toString());

  // Step 4: Apply timezone adjustment manually
  const shanghaiOffset = 8 * 60; // Asia/Shanghai is UTC+8
  const currentHours = dateObject.getUTCHours();
  console.log("Current UTC hours:", currentHours);
  console.log("Applying offset:", shanghaiOffset, "minutes");

  adjustedDate.setHours(currentHours + shanghaiOffset);
  console.log("Final date:", adjustedDate.toString());
  console.log("Final timestamp:", adjustedDate.getTime());

  // Verify date integrity
  if (isNaN(adjustedDate.getTime())) {
    console.error("ERROR: Invalid date object created!");
    return null;
  }

  return adjustedDate;
}

const parseTime = (timeStr) => {
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

module.exports = formatDate;
module.exports = getDateObject;
module.exports = parseTime;
