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

export const getOlimpiadasWithAreasCategorias = async () => {
  const response = await inscriptionApi.get("/viewOlimpiadasWithAreasCategorias");
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

export const createCategoriaWithGrados = async (data) => {
  try {
    const response = await inscriptionApi.post(
      "/categorias/with-grados",
      {
        nombreCategoria: data.nombreCategoria.trim().toUpperCase(),
        grados: data.grados,
        estadoCategoriaGrado: data.estadoCategoriaGrado ?? true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    let errorMessage = "Error al registrar la categoría";

    if (error.response) {
      // Manejo de errores estructurados del backend
      if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.statusText) {
        errorMessage = error.response.statusText;
      }

      console.error("Error detallado del servidor:", error.response.data);
    } else if (error.request) {
      errorMessage = "No se recibió respuesta del servidor";
      console.error("Request:", error.request);
    } else {
      errorMessage = `Error al configurar la solicitud: ${error.message}`;
    }

    throw new Error(errorMessage);
  }
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

export const getUsuarios = () => inscriptionApi.get("/usuarios");
export const getRolesUser = () => inscriptionApi.get("/usuarios/roles");
export const createUsuario = (data) => inscriptionApi.post("/usuarios", data);
export const updateUsuario = (id, data) =>
  inscriptionApi.put(`/usuarios/${id}`, data);
export const updateUsuarioEstado = (id, estado) =>
  inscriptionApi.put(`/usuarios/${id}/estado`, { estadoUsuario: estado });
export const deleteUsuario = (id) => inscriptionApi.delete(`/usuarios/${id}`);

export const verificarUsoAreasMasivo = async (ids) => {
  const response = await inscriptionApi.post("/verificar-uso-areas", {
    ids,
  });
  return response.data;
};

export const verificarUsoCategoriasMasivo = async (ids) => {
  const response = await inscriptionApi.post("/verificar-uso-categorias", {
    ids,
  });
  return response.data;
};
