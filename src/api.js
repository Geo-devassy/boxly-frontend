import axios from "axios";

const getBaseUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL;
  if (!envUrl || envUrl === "undefined" || envUrl === "null") {
    return "https://boxly-backend-xr97.onrender.com";
  }
  return envUrl.replace(/\/api$/, "");
};

const BASE_URL = getBaseUrl();

const API = axios.create({
  baseURL: BASE_URL
});

export default API;
