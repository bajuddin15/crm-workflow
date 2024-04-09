import FormData from "form-data";
import axios from "axios";

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

export { getProviderDetails, getTokenFromNumber };
