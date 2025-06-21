import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
console.log("BaseURL configurada:", baseURL);

const inscriptionApi = axios.create({
  baseURL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTicketDataRequest = (id) => inscriptionApi.get(`/boletas/data/${id}`); 
