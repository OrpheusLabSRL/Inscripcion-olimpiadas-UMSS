import axios from "axios";

const baseURL = "http://127.0.0.1:8000/api";

const inscriptionApi = axios.create({
  baseURL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

/* =======================
   OLIMPIADAS
======================= */

export const getOlimpiadas = async () => {
  const response = await inscriptionApi.get("/hola");
  console.log("Respuesta cruda de la API:", response.data);
  return response.data;
};

export const createOlympiad = async (data) =>
  await inscriptionApi.post("/registrarOlimpiadas", data);

export const asignarAreasYCategorias = async (data) =>
  await inscriptionApi.post("/asignar-olimpiada", data);
/* =======================
   CATEGORÍAS
======================= */

export const getCategorias = async () => {
  const response = await inscriptionApi.get("/categorias");
  return response.data;
};

export const createCategoria = async (data) =>
  await inscriptionApi.post("/categorias", data);

/* =======================
   ÁREAS
======================= */

export const getAreas = async () => {
  const response = await inscriptionApi.get("/areas");
  return response.data;
};

export const createArea = async (data) =>
  await inscriptionApi.post("/registerAreas", data);

/* =======================
   GRADOS
======================= */

export const getGrados = async () => {
  const response = await inscriptionApi.get("/grados");
  return response.data;
};
