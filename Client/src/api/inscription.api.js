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
export const getAreas = async () => {
  const response = await axios.get(baseURL + "/api/areas");
  return response.data;
};
export const createArea = async (data) => {
  return await axios.post(baseURL + "/api/registerAreas", data);
};
export const getOlimpiadas = async () => {
  const response = await axios.get(baseURL + "/api/hola");
  console.log("Respuesta cruda de la API:", response.data);
  return response.data;
};
export const createOlympiad = async (data) => {
  return await axios.post(baseURL + "/api/registrarOlimpiadas", data);
};
export const getGrados = async () => {
  const response = await axios.get(baseURL + "/api/grados");
  return response.data;
};
export const createCategoria = async (data) => {
  return await axios.post(baseURL + "/api/categorias", data);
};
export const getCategorias = async () => {
  const response = await axios.get(baseURL + "/api/categorias");
  return response.data;
};
