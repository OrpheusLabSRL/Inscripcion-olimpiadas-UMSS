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
export const getAreas = async () => {
  const response = await axios.get(baseURL + "/areas");
  return response.data;
};
export const createArea = async (data) => {
  return await axios.post(baseURL + "/registerAreas", data);
};
export const getOlimpiadas = async () => {
  const response = await axios.get(baseURL + "/hola");
  console.log("Respuesta cruda de la API:", response.data);
  return response.data;
};
export const createOlympiad = async (data) => {
  return await axios.post(baseURL + "/registrarOlimpiadas", data);
};
export const getGrados = async () => {
  const response = await axios.get(baseURL + "/grados");
  return response.data;
};
export const createCategoria = async (data) => {
  return await axios.post(baseURL + "/categorias", data);
};
export const getCategorias = async () => {
  const response = await axios.get(baseURL + "/categorias");
  return response.data;
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
export const setTutor = (data) => inscriptionApi.post("/tutores", data);
export const setContacto = (data) => inscriptionApi.post("/contacto", data);
export const getTutoresOlimpista = (id) =>
  inscriptionApi.get(`/olimpista/${id}/tutores`);
