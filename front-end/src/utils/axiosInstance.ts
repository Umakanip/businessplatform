// utils/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // adjust if needed
  withCredentials: true,
});

export default axiosInstance;
