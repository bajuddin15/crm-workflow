import axios from "axios";
import toast from "react-hot-toast";

const useData = () => {
  const executeApiAndGetResp = async (formData: any) => {
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
    } = formData;

    const apiHeaders: any = {};
    for (let i = 0; i < headers.length; i++) {
      let head = headers[i];
      apiHeaders[head.key] = head.value;
    }

    let apiFormData: any;

    if (payloadType === "JSON") {
      const formDataObject: any = {};
      apiHeaders["Content-Type"] = "application/json";
      parameters.forEach((parameter: any) => {
        formDataObject[parameter.key] = parameter.value;
      });
      apiFormData = JSON.stringify(formDataObject);
    } else if (payloadType === "Form Data") {
      const formData = new FormData();
      apiHeaders["Content-Type"] = "application/x-www-form-urlencoded";
      parameters.forEach((parameter: any) => {
        formData.append(parameter.key, parameter.value);
      });
      apiFormData = formData;
    }

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
    } catch (error: any) {
      let errResp = error?.response?.data;
      apiResponse = null;
      toast.error(error?.message || errResp?.message);
    }

    return apiResponse;
  };

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Text copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text. Please try again.");
    }
  };

  const state = {};

  return {
    state,
    handleCopy,
    executeApiAndGetResp,
  };
};

export default useData;
