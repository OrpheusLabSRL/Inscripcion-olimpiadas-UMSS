// src/api/inscriptionApi.js

import axios from "axios";

const baseURL = "http://127.0.0.1:8000/api";

const inscriptionApi = axios.create({
  baseURL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================
// Olimpistas (Estudiantes)
// ============================

export const registerDataOlympian = (data) =>
  inscriptionApi.post("/register", data);

export const getDataOlympian = (id_tutor) =>
  inscriptionApi.get(`/tutor/${id_tutor}/estudiantes`);

export const getAreasOlimpista = (id) =>
  inscriptionApi.get(`/olimpista/${id}/areas`);

export const getAreasOlimpistaByCi = (ci) =>
  inscriptionApi.get(`/olimpista/${ci}/areasByCi`);

export const getTutoresOlimpista = (id) =>
  inscriptionApi.get(`/olimpista/${id}/tutores`);

export const getOlimpistaEnable = (carnet) =>
  inscriptionApi.get(`/olimpista/${carnet}/habilitado`);

export const getPersonData = (data) =>
  inscriptionApi.post(`/persona/data`, data);

export const setNewInscription = (data) =>
  inscriptionApi.post("/newInscription", data);

export const finishRegistering = (id, codigoInscripcion) =>
  inscriptionApi.put(`/tutor/${id}/${codigoInscripcion}/inscripciones/update`);

// ============================
// Tutores
// ============================

export const setTutor = (data) => inscriptionApi.post("/tutores", data);

// ============================
// Contacto
// ============================

export const setContacto = (data) => inscriptionApi.post("/contacto", data);

// ============================
// Áreas
// ============================

export const createArea = async (data) =>
  (await inscriptionApi.post("/registerAreas", data)).data;

export const getCatalogoCompleto = async (id) =>
  (await inscriptionApi.get(`/catalogoCompleto/${id}`)).data;

// ============================
// Olimpiadas
// ============================

export const getOlimpiadas = async () => {
  const response = await inscriptionApi.get("/viewOlimpiadas");
  return response.data;
};

export const getAllOlimpistas = async () => {
  const response = await inscriptionApi.get("/olimpistas");
  return response.data;
};

export const getAllTutors = async () => {
  const response = await inscriptionApi.get("/tutores/all");
  return response.data;
};
