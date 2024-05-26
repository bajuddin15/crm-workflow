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

export function parseJsonToKeyValue(data) {
  if (typeof data !== "object" || data === null) {
    return []; // Return an empty array if data is not an object
  }

  const parsedData = [];

  for (const key in data) {
    const value = data[key];
    if (typeof value === "string" || typeof value === "number") {
      parsedData.push({ key, value });
    }
  }

  return parsedData;
}

export function replacePlaceholders(template, data) {
  return template.replace(/{{\s*(\w+\.\w+)\s*}}/g, (match, p1) => {
    const keys = p1.split(".");
    let value = data;
    keys.forEach((key) => {
      value = value[key];
    });
    return value !== undefined ? value : match;
  });
}

export function parseSingleData(data) {
  if (typeof data !== "object" || data === null) {
    return []; // Return an empty array if data is not an object
  }

  const parsedData = [];

  for (const key in data) {
    const value = data[key];
    if (typeof value === "string" || typeof value === "number") {
      parsedData.push({ key, value });
    }
  }

  return parsedData;
}

/*

const data = {
  name:bajuddin
  age:23
}
value = {{name}}

*/

// mapped values for execute api resp
export const getMappedValue = (value, data, webhook) => {
  let result = "";
  if (value.includes("{{webhook.")) {
    result = replacePlaceholders(value, { webhook });
  } else if (value.includes("{{") && value.includes("}}")) {
    result = value.replace(/{{(\w+)}}/g, (match, p1) =>
      data[p1] !== undefined ? data[p1] : "match"
    );
  } else {
    result = value;
  }
  return result;
};
