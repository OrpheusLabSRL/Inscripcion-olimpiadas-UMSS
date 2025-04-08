import axios from "axios";

let baseURL = " http://127.0.0.1:8000/api";

const inscriptionApi = axios.create({
  baseURL: baseURL,
  responseType: "json",
  //   withCredentials: true,
});

export const registerDataOlympian = (olimpistaData) => {
  return inscriptionApi.post("/register", olimpistaData);
};
export const getDataOlympian = (id_tutor) => {
  return inscriptionApi.get(`/tutor/${id_tutor}/estudiantes`);
};
export const getCatalogoCompleto = () =>
  inscriptionApi.get("/catalogoCompleto");
