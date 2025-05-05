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

inscriptionApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            return Promise.reject(error.response.data);
        } else if (error.request) {
            return Promise.reject({ message: "No se recibió respuesta del servidor" });
        } else {
            return Promise.reject({ message: "Error al configurar la solicitud" });
        }
    }
);

export const registerFromExcel = async (responsibleData, excelData) => {
    try {
        const response = await inscriptionApi.post("/register-from-excel", {
            responsible: responsibleData,
            olimpistas: excelData,
            formaInscripcion: "Excel",
        });
        return response.data;
    } catch (error) {
        console.error("Error registering from Excel:", error);
        throw error;
    }
};

export const getAvailableCombinations = async () => {
    try {
        const response = await inscriptionApi.get("/available-combinations");
        return response.data;
    } catch (error) {
        console.error("Error getting available combinations:", error);
        throw error;
    }
};