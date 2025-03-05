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
  const dateObject = new Date(Date.now());

  const adjustToAsiaTimeZone = new Date(
    dateObject.toLocaleString("en-US", {
      timeZone: "Asia/Shanghai",
    })
  );

  return adjustToAsiaTimeZone;
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
