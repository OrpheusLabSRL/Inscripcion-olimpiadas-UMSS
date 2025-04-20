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
  const response = await inscriptionApi.get("/viewOlimpiadas");
  console.log("Respuesta cruda de la API:", response.data);
  return response.data;
};

export const createOlympiad = async (data) =>
  await inscriptionApi.post("/registrarOlimpiadas", data);

export const asignarAreasYCategorias = async (data) =>
  await inscriptionApi.post("/newAreaCategoria", data);

export const getAreasCategoriasPorOlimpiada = async (idOlimpiada) => {
  return await inscriptionApi.get(
    `/viewAreaCategoria/olimpiada/${idOlimpiada}`
  );
};

/* =======================
   CATEGORÍAS
======================= */

export const getCategorias = async () => {
  const response = await inscriptionApi.get("/viewCategorias");
  return response.data;
};

/* =======================
   ÁREAS
======================= */

export const getAreas = async () => {
  const response = await inscriptionApi.get("/viewAreas");
  return response.data;
};

/* =======================
   GRADOS
======================= */

export const getGrados = async () => {
  const response = await inscriptionApi.get("/viewGrados");
  return response.data;
};

// ============================
// Categorías
// ============================

export const getCategoriaGrado = async () =>
  (await inscriptionApi.get("/viewCategoriaGrado")).data;

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
