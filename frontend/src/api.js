import axios from "axios";

const api = axios.create({
  baseURL: process.env.https://vnit-hostel-grievances-1-o.onrender.com;  // <--- BASE URL HERE
});

// Automatically attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
