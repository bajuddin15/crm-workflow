export const parseDataInJSON = (data: any) => {
  let respData: any = [];

  data.forEach((item: any) => {
    respData.push({ [item.key]: item.value });
  });

  return respData;
};

export const itemTags = [
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
  {
    phoneNumber: "{{phoneNumber}}",
  },
];
