// En api/Reports.api.js
import inscriptionApi from "./baseInstance"; // o usa el mismo que Administration.api

export const getEstudiantesInscritos = async () => {
  const response = await inscriptionApi.get("/reporte/estudiantes");
  return response.data;
};
