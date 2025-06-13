import { useEffect } from "react";

export const useSessionStorageOlympian = (watchedFields, location) => {
  useEffect(() => {
    sessionStorage.setItem("NombreOlympian", watchedFields.nombre);
  }, [watchedFields.nombre]);

  useEffect(() => {
    sessionStorage.setItem("ApellidoOlympian", watchedFields.apellido);
  }, [watchedFields.apellido]);

  useEffect(() => {
    sessionStorage.setItem(
      "CarnetIdentidadOlympian",
      watchedFields.carnetIdentidad
    );
  }, [watchedFields.carnetIdentidad]);

  useEffect(() => {
    sessionStorage.setItem(
      "FechaNacimientoOlympian",
      watchedFields.fechaNacimiento
    );
  }, [watchedFields.fechaNacimiento]);

  useEffect(() => {
    sessionStorage.setItem("ColegioOlympian", watchedFields.colegio);
  }, [watchedFields.colegio]);

  useEffect(() => {
    sessionStorage.setItem("CursoOlympian", watchedFields.curso);
  }, [watchedFields.curso]);

  useEffect(() => {
    sessionStorage.setItem("DepartamentoOlympian", watchedFields.departamento);
  }, [watchedFields.departamento]);

  useEffect(() => {
    sessionStorage.setItem("MunicipioOlympian", watchedFields.municipio);
  }, [watchedFields.municipio]);

  useEffect(() => {
    sessionStorage.setItem("EmailOlympian", watchedFields.email);
  }, [watchedFields.email]);

  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem("NombreOlympian");
      sessionStorage.removeItem("ApellidoOlympian");
      sessionStorage.removeItem("FechaNacimientoOlympian");
      sessionStorage.removeItem("CarnetIdentidadOlympian");
      sessionStorage.removeItem("ColegioOlympian");
      sessionStorage.removeItem("CursoOlympian");
      sessionStorage.removeItem("DepartamentoOlympian");
      sessionStorage.removeItem("MunicipioOlympian");
      sessionStorage.removeItem("EmailOlympian");
      sessionStorage.removeItem("municipiosFiltradas");
      sessionStorage.removeItem("colegiosFiltradas");
    };
    window.addEventListener("beforeunload", handleUnload);
    sessionStorage.setItem("pantallaActualRegistro", location.pathname);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [location.pathname]);
};
