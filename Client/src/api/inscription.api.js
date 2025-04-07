import axios from "axios";

let baseURL = " http://127.0.0.1:8000";

const inscriptionApi = axios.create({
  baseURL: baseURL,
  responseType: "json",
  //   withCredentials: true,
});

export const registerDataOlympian = (olimpistaData) => {
  return inscriptionApi.post("/api/register", olimpistaData);
};
