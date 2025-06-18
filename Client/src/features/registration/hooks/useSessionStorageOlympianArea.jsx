//React
import { useEffect } from "react";

export const useSessionStorageOlympianArea = (watchedFields, location) => {
  useEffect(() => {
    sessionStorage.setItem("AreaPrincipal", watchedFields.areaPrincipal);
  }, [watchedFields.areaPrincipal]);

  useEffect(() => {
    sessionStorage.setItem(
      "CategoriaPrincipal",
      watchedFields.categoriaPrincipal
    );
  }, [watchedFields.categoriaPrincipal]);
  useEffect(() => {
    sessionStorage.setItem("AreaSecundaria", watchedFields.areaSecundaria);
  }, [watchedFields.areaSecundaria]);

  useEffect(() => {
    sessionStorage.setItem(
      "CategoriaSecundaria",
      watchedFields.categoriaSecundaria
    );
  }, [watchedFields.categoriaSecundaria]);

  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem("AreaPrincipal");
      sessionStorage.removeItem("CategoriaPrincipal");
      sessionStorage.removeItem("AreaSecundaria");
      sessionStorage.removeItem("CategoriaSecundaria");
      sessionStorage.removeItem("CategoriasFiltradas");
      sessionStorage.removeItem("CategoriasFiltradasSecundaria");
      sessionStorage.removeItem("TutorArea1");
      sessionStorage.removeItem("TutorArea2");
    };
    window.addEventListener("beforeunload", handleUnload);
    sessionStorage.setItem("pantallaActualRegistro", location.pathname);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [location]);
};
