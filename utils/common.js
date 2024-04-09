export const calculateTimeInMillis = (timeValue, timeFormat) => {
  switch (timeFormat.toLowerCase()) {
    case "seconds":
      return timeValue * 1000;
    case "minutes":
      return timeValue * 60 * 1000;
    case "hours":
      return timeValue * 60 * 60 * 1000;
    case "days":
      return timeValue * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
};

export const findValueByKey = (apiResponse, format) => {
  const key = format.replace(/^{{|}}$/g, "");

  let value = "";
  for (const item of apiResponse) {
    if (item.key === key) {
      value = item.value;
      break;
    }
  }
  return value;
};
