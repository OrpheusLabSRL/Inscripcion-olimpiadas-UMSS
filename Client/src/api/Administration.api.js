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

export const deleteAreaCategoriaByOlimpiadaAndArea = (idOlimpiada, idArea) => {
  return inscriptionApi.delete(
    `/eliminarOlimpiadas/${idOlimpiada}/area/${idArea}`
  );
};

export const updateOlimpiadaEstado = async (idOlimpiada, nuevoEstado) => {
  return await inscriptionApi.put(`/editarOlimpiadas/${idOlimpiada}/estado`, {
    estadoOlimpiada: nuevoEstado,
  });
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

export const createArea = async (data) => {
  return await inscriptionApi.post("/registrarAreas", data);
};

export const updateArea = async (id, data) => {
  return await inscriptionApi.put(`/areas/${id}`, data);
};

export const updateAreaStatus = async (id, estado) => {
  return await inscriptionApi.patch(`/areas/${id}/estado`, {
    estadoArea: estado,
  });
};

export const deleteArea = async (id) => {
  return await inscriptionApi.delete(`/areas/${id}`);
};

/* =======================
   GRADOS
======================= */

export const getGrados = async () => {
  const response = await inscriptionApi.get("/viewGrados");
  return response.data;
};

// ============================
// Categorías - Grados
// ============================

export const getCategoriaGrado = async () =>
  (await inscriptionApi.get("/viewCategoriaGrado")).data;

export const deleteCategoriaGrado = async (id) =>
  (await inscriptionApi.delete(`/deleteCategoriaGrado/${id}`)).data;

export const changeEstadoCategoriaGrado = async (id, estado) =>
  (
    await inscriptionApi.patch(`/changeEstadoCategoriaGrado/${id}`, {
      estadoCategoriaGrado: estado,
    })
  ).data;

export const updateCategoriaWithGrados = async (
  idCategoria,
  { nombreCategoria, grados, estadoCategoriaGrado }
) =>
  (
    await inscriptionApi.put(`/updateCategoriaWithGrados/${idCategoria}`, {
      nombreCategoria,
      grados,
      estadoCategoriaGrado: estadoCategoriaGrado || true,
    })
  ).data;

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

// ============================
// LOGIN
// ============================

export const login = async (credentials) => {
  const response = await inscriptionApi.post("/login", credentials);
  return response.data;
};

export const getInscripcionesConOlimpiadas = async () => {
  try {
    const response = await inscriptionApi.get(
      "/obtenerInscripciones/olimpiadas"
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener inscripciones:", error);
    throw error;
  }
};

// ============================
// ROLES Y PERMISOS
// ============================

export const getRoles = async () => {
  const response = await inscriptionApi.get("/roles");
  return response.data;
};
export const getPermisos = async () => {
  const response = await inscriptionApi.get("/permisos");
  return response.data;
};
export const setRol = async (data) => {
  const response = await inscriptionApi.post("/roles", data);
  return response.data;
};
export const setUser = async (data) => {
  const response = await inscriptionApi.post("/usuarios", data);
  return response.data;
};
