import { useEffect } from "react";

export const useSessionStorageTutor = (
  namesSessionStorage,
  watchedFields,
  location
) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    sessionStorage.setItem("pantallaActualRegistro", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    sessionStorage.setItem(namesSessionStorage.nombre, watchedFields.nombre);
  }, [watchedFields.nombre, namesSessionStorage.nombre]);

  useEffect(() => {
    sessionStorage.setItem(
      namesSessionStorage.apellido,
      watchedFields.apellido
    );
  }, [watchedFields.apellido, namesSessionStorage.apellido]);

  useEffect(() => {
    if (watchedFields.tipoTutor == null) return;
    sessionStorage.setItem(
      namesSessionStorage.tipoTutor,
      watchedFields.tipoTutor
    );
  }, [watchedFields.tipoTutor, namesSessionStorage.tipoTutor]);

  useEffect(() => {
    sessionStorage.setItem(namesSessionStorage.email, watchedFields.email);
  }, [watchedFields.email, namesSessionStorage.email]);

  useEffect(() => {
    sessionStorage.setItem(
      namesSessionStorage.telefono,
      watchedFields.telefono
    );
  }, [watchedFields.telefono, namesSessionStorage.telefono]);

  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem(namesSessionStorage.nombre);
      sessionStorage.removeItem(namesSessionStorage.apellido);
      sessionStorage.removeItem(namesSessionStorage.tipoTutor);
      sessionStorage.removeItem(namesSessionStorage.telefono);
      sessionStorage.removeItem(namesSessionStorage.email);
      sessionStorage.removeItem(namesSessionStorage.carnetIdentidad);
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [namesSessionStorage]);
};
