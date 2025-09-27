import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
console.log("👉 API BASE URL:", import.meta.env.VITE_API_BASE);
