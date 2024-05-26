import FormData from "form-data";
import axios from "axios";
import { getMappedValue } from "./common.js";

const getProviderDetails = async (token, providerNumber) => {
  const url =
    "https://app.crm-messaging.cloud/index.php/api/fetchProviderDetails";

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const formData = new FormData();
  formData.append("provider_number", providerNumber);

  let resData;
  try {
    const { data } = await axios.post(url, formData, { headers });
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
};

const getTokenFromNumber = async (number) => {
  const getTokenUri = `https://app.crm-messaging.cloud/index.php/api/fetch-token?provider_number=${number}`;
  let token;
  try {
    const { data } = await axios.get(getTokenUri);
    token = data?.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    token = null;
  }
  return token;
};

// execute api resp

export const executeApiAndGetResp = async (formData) => {
  const {
    // workflowId,
    // name,
    // unqName,
    actionEventMethod,
    endpointUrl,
    payloadType,
    // authType,
    headers,
    parameters,
    webhook,
    inputData,
  } = formData;

  const apiHeaders = {};
  for (let i = 0; i < headers.length; i++) {
    let head = headers[i];
    apiHeaders[head.key] = getMappedValue(head.value, inputData, webhook);
  }

  let apiFormData;

  if (payloadType === "JSON") {
    const formDataObject = {};
    apiHeaders["Content-Type"] = "application/json";
    parameters.forEach((parameter) => {
      formDataObject[parameter.key] = getMappedValue(
        parameter.value,
        inputData,
        webhook
      );
    });
    apiFormData = JSON.stringify(formDataObject);
  } else if (payloadType === "Form Data") {
    const formData = new FormData();
    apiHeaders["Content-Type"] = "application/x-www-form-urlencoded";
    parameters.forEach((parameter) => {
      const resultVal = getMappedValue(parameter.value, inputData, webhook);
      formData.append(parameter.key, resultVal);
    });
    apiFormData = formData;
  }

  console.log({
    apiFormData,
    apiHeaders,
  });

  let apiResponse;
  try {
    if (actionEventMethod === "GET") {
      const { data } = await axios.get(endpointUrl, { headers: apiHeaders });
      apiResponse = data;
    } else if (actionEventMethod === "POST") {
      const { data } = await axios.post(endpointUrl, apiFormData, {
        headers: apiHeaders,
      });
      apiResponse = data;
    }
  } catch (error) {
    let errResp = error?.response?.data;
    console.log("Error in rest Api action : ", errResp || error?.message);
    apiResponse = null;
  }

  return apiResponse;
};

export { getProviderDetails, getTokenFromNumber };
