import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL.replace(/\/api$/, "")
    : "https://boxly-backend-xr97.onrender.com";

const API = axios.create({
  baseURL: BASE_URL
});

export default API;