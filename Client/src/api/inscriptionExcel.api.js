import axios from "axios";

const baseURL = "http://127.0.0.1:8000/api";

const inscriptionApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

// Interceptor para manejar errores
inscriptionApi.interceptors.response.use(
  (response) => {
    // Verificar estructura básica de la respuesta
    if (!response.data) {
      return Promise.reject({
        message: "La respuesta del servidor no contiene datos",
      });
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const errorData = error.response.data || {};
      const errorMessage =
        errorData.message || "Error en la respuesta del servidor";
      return Promise.reject({ ...errorData, message: errorMessage });
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      return Promise.reject({
        message: "No se recibió respuesta del servidor",
      });
    } else {
      // Algo sucedió al configurar la solicitud
      return Promise.reject({ message: "Error al configurar la solicitud" });
    }
  }
);

export const registerFromExcel = async (responsibleData, excelData) => {
  try {
    const response = await inscriptionApi.post("/register-from-excel", {
      responsible: responsibleData,
      olimpistas: excelData,
    });

    if (!response.data) {
      throw new Error("No se recibieron datos en la respuesta");
    }

    return response;
  } catch (error) {
    console.error("Error registering from Excel:", error);
    throw error;
  }
};

export const validateExcelData = async (excelData) => {
  try {
    const response = await inscriptionApi.post("/validate-excel-data", {
      data: excelData,
    });
    return response;
  } catch (error) {
    console.error("Error validating Excel data:", error);
    throw error;
  }
};

export const getAvailableCombinations = async () => {
  try {
    const response = await inscriptionApi.get("/available-combinations");

    if (!response.data) {
      throw new Error("No se recibieron datos del servidor");
    }

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Error al obtener combinaciones"
      );
    }

    return response;
  } catch (error) {
    console.error("Error getting available combinations:", error);
    throw {
      message:
        error.response?.data?.message ||
        error.message ||
        "Error al obtener las combinaciones disponibles",
      response: error.response,
    };
  }
};
