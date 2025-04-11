import axios from "axios";

const baseURL = "http://127.0.0.1:8000/api";

const inscriptionApi = axios.create({
  baseURL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

// Olimpistas (Estudiantes)

export const registerDataOlympian = (olimpistaData) =>
  inscriptionApi.post("/register", olimpistaData);

export const getDataOlympian = (id_tutor) =>
  inscriptionApi.get(`/tutor/${id_tutor}/estudiantes`);

export const getAreasOlimpista = (id) =>
  inscriptionApi.get(`/olimpista/${id}/areas`);

export const getTutoresOlimpista = (id) =>
  inscriptionApi.get(`/olimpista/${id}/tutores`);

export const setNewInscription = (data) =>
  inscriptionApi.post("/newInscription", data);

// Tutores

export const setTutor = (data) => inscriptionApi.post("/tutores", data);

// Contacto

export const setContacto = (data) => inscriptionApi.post("/contacto", data);

// Áreas

export const getAreas = async () => {
  const response = await axios.get(`${baseURL}/areas`);
  return response.data;
};

export const createArea = async (data) =>
  await axios.post(`${baseURL}/registerAreas`, data);

export const getCatalogoCompleto = () =>
  inscriptionApi.get("/catalogoCompleto");

// Olimpiadas

export const getOlimpiadas = async () => {
  const response = await axios.get(`${baseURL}/hola`);
  console.log("Respuesta cruda de la API:", response.data);
  return response.data;
};

export const createOlympiad = async (data) =>
  await axios.post(`${baseURL}/registrarOlimpiadas`, data);

// Categorías

export const getCategorias = async () => {
  const response = await axios.get(`${baseURL}/categorias`);
  return response.data;
};

export const createCategoria = async (data) =>
  await axios.post(`${baseURL}/categorias`, data);

// Grados

export const getGrados = async () => {
  const response = await axios.get(`${baseURL}/grados`);
  return response.data;
};
