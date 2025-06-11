import axios from "axios";

const tutorApi = axios.create({
  baseURL: "http://orpheus.tis.cs.umss.edu.bo/api",
  responseType: "json",
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const registerTutor = (tutorData) => {
  return tutorApi
    .post("/tutores", tutorData)
    .then((response) => response)
    .catch((error) => {
      if (error.response) {
        throw error;
      } else if (error.request) {
        throw new Error(
          "No se pudo conectar con el servidor. Verifica tu conexión."
        );
      } else {
        throw new Error("Error al configurar la solicitud");
      }
    });
};

export const checkExistingTutor = (email, carnet) => {
  return tutorApi
    .get("/tutores/verificar", {
      params: {
        email: email,
        carnet: carnet,
      },
    })
    .then((response) => response)
    .catch((error) => {
      if (error.response) {
        throw error;
      } else if (error.request) {
        throw new Error(
          "No se pudo conectar con el servidor. Verifica tu conexión."
        );
      } else {
        throw new Error("Error al configurar la solicitud");
      }
    });
};
