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

export const getAreasCategoriasPorOlimpiada = async (idOlimpiada) => {
  return await inscriptionApi.get(`/olimpiada/${idOlimpiada}/areas-categorias`);
};

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

/* =======================
   COMBINACIONES (OlimpiadaAreaCategoria)
======================= */

export const getCombinaciones = async () => {
  const response = await inscriptionApi.get("/combinaciones");
  return response.data;
};

export const getCombinacionesPorOlimpiada = async (idOlimpiada) => {
  const response = await inscriptionApi.get(
    `/combinaciones/olimpiada/${idOlimpiada}`
  );
  return response.data;
};

export const createCombinacion = async (data) => {
  return await inscriptionApi.post("/combinaciones", data);
};

export const deleteCombinacion = async (id) => {
  return await inscriptionApi.delete(`/combinaciones/${id}`);
};

export const updateCombinacionEstado = async (id, estado) => {
  return await inscriptionApi.put(`/combinaciones/${id}`, { estado });
};

export const asignarCombinaciones = async (data) =>
  await inscriptionApi.post("/asignar-olimpiada", data);
