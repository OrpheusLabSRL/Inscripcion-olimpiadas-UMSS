import axios from "axios";

let baseURL = "http://127.0.0.1:8000/api";

const inscriptionApi = axios.create({
  baseURL: baseURL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerDataOlympian = (olimpistaData) => {
  return inscriptionApi.post("/register", olimpistaData);
};
export const getDataOlympian = (id_tutor) => {
  return inscriptionApi.get(`/tutor/${id_tutor}/estudiantes`);
};
export const getCatalogoCompleto = () =>
  inscriptionApi.get("/catalogoCompleto");
export const getAreasOlimpista = (id) =>
  inscriptionApi.get(`/olimpista/${id}/areas`);
export const setNewInscription = (data) =>
  inscriptionApi.post("/newInscription", data);
