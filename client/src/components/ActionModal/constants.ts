export const actionItemTags = [
  {
    "Contact Name": "{{contact.name}}",
  },
  {
    "Contact Email": "{{contact.email}}",
  },
  {
    "Contact Phone": "{{contact.phoneNumber}}",
  },
  {
    "Group Name": "{{contact.groupName}}",
  },
  {
    "To Number": "{{toNumber}}",
  },
  {
    "From Number": "{{fromNumber}}",
  },
  {
    Message: "{{message}}",
  },
  {
    "Media Url": "{{mediaUrl}}",
  },
  {
    "Template Name": "{{templateName}}",
  },
  {
    "Template Language": "{{templateLang}}",
  },
  {
    "Delay Time": "{{delayTime}}",
  },
  {
    "Delay Formate": "{{delayFormate}}",
  },
  {
    seconds: "seconds",
  },
  {
    minutes: "minutes",
  },
  {
    hours: "hours",
  },
  {
    days: "days",
  },
  {
    voiceText: "{{voiceText}}",
  },
];

export const actionEventMethods = [
  {
    name: "GET",
    desc: "Retrive data from the API Request.",
  },
  {
    name: "POST",
    desc: "Send data to be processed by the API request.",
  },
];

export const getEventOptions = () => {
  let options = [];
  for (let i = 0; i < actionEventMethods.length; i++) {
    let option = {
      value: actionEventMethods[i].name,
      label: actionEventMethods[i].name,
    };
    options.push(option);
  }
  return options;
};

export const payloadTypeOptions = [
  {
    value: "JSON",
    label: "JSON",
  },
  {
    value: "Form Data",
    label: "Form Data",
  },
  // {
  //   value: "Encoded Form Data",
  //   label: "Encoded Form Data",
  // },
];

export const authApiOptions = [
  {
    value: "No Auth",
    label: "No Auth",
  },
  {
    value: "Bearer Token",
    label: "Bearer Token",
  },
];

export function parseSingleData(data: any) {
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
