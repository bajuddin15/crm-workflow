interface FilterParams {
  label: string;
  filterType: string;
  value: string;
}
interface FilterType {
  value: string;
  label: string;
}
type SignOfMap = "&&" | "||";

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

export const getOrganiseKeyName = (keyValue: string) => {
  switch (keyValue) {
    case "toNumber":
      return "To Number";
    case "fromNumber":
      return "From Number";
    case "message":
      return "Message";
    case "mediaUrl":
      return "Media Url";
    case "templateName":
      return "Template Name";
    case "templateLang":
      return "Template Language";
    case "contactName":
      return "Contact Name";
    case "email":
      return "Contact Email";
    case "phoneNumber":
      return "Contact Phone";
    case "groupName":
      return "Group Name";
    case "delayTime":
      return "Delay Time";
    case "delayFormate":
      return "Delay Formate";
    case "voiceText":
      return "Voice Text";
    default:
      return "";
  }
};

// Define the array of filter types
export const filterTypes: FilterType[] = [
  { value: "equal", label: "Equal to" },
  { value: "not_equal", label: "Does not equal to" },
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Does not contain" },
  { value: "exists", label: "Exists" },
  { value: "not_exists", label: "Does not exist" },
  { value: "is_empty", label: "Is empty" },
  { value: "is_not_empty", label: "Is not empty" },
  { value: "starts_with", label: "Starts with" },
  { value: "not_starts_with", label: "Does not start with" },
  { value: "ends_with", label: "Ends with" },
  { value: "not_ends_with", label: "Does not end with" },
  { value: "less_than", label: "Less than" },
  { value: "greater_than", label: "Greater than" },
];

export const filterLabels = [
  {
    value: "toNumber",
    label: "To Number",
  },
  {
    value: "fromNumber",
    label: "From Number",
  },
  {
    value: "message",
    label: "Message",
  },
  {
    value: "mediaUrl",
    label: "Media Url",
  },
  {
    value: "templateName",
    label: "Template Name",
  },
];

const filterTypeToSignMap: Record<string, string> = {
  equal: "===",
  not_equal: "!==",
  contains: ".includes", // Example: 'includes' for checking substring inclusion
  not_contains: ".includes", // Example: '!includes' (custom notation for 'not contains')
  exists: "!= null", // Check if value is not null or undefined
  not_exists: "== null", // Check if value is null or undefined
  is_empty: '=== ""', // Check if value is an empty string
  is_not_empty: '!== ""', // Check if value is not an empty string
  starts_with: ".startsWith", // Example: 'startsWith' method
  not_starts_with: ".startsWith", // Custom notation for 'not starts with'
  ends_with: ".endsWith", // Example: 'endsWith' method
  not_ends_with: ".endsWith", // Custom notation for 'not ends with'
  less_than: "<", // Less than comparison
  greater_than: ">", // Greater than comparison
};

export const getSignFromFilter = (filterType: string): string => {
  // Use the mapping to return the corresponding comparison sign
  return filterTypeToSignMap[filterType] || ""; // Default to empty string if no match found
};
const formatValueForExpression = (value: string): string => {
  return `"${value}"`; // Example: Wrap string values in double quotes
};
export const makeExpressions = (
  conditions: FilterParams[],
  signOfMap: SignOfMap
) => {
  console.log(conditions);
  const expression = conditions
    .map((condition) => {
      const filterType = condition.filterType;
      const sign = getSignFromFilter(condition.filterType);
      const formattedValue = formatValueForExpression(condition.value);
      switch (filterType) {
        case "equal":
        case "not_equal":
        case "less_than":
        case "greater_than":
          return `${condition.label} ${sign} ${formattedValue}`;
        case "exists":
        case "not_exists":
        case "is_empty":
        case "is_not_empty":
          return `${condition.label} ${sign}`;
        case "contains":
        case "starts_with":
        case "ends_with":
          return `${condition.label}${sign}(${formattedValue})`;
        case "not_contains":
        case "not_starts_with":
        case "not_ends_with":
          return `!${condition.label}${sign}(${formattedValue})`;
        default:
          return ""; // Handle other filterType values if needed
      }
    })
    .join(` ${signOfMap} `);

  return expression;
};
