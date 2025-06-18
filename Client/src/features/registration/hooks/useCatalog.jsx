//React
import { useState, useEffect } from "react";

//util
import {
  filtrarAreasPorCurso,
  filtrarCategoriasPorCursoYArea,
} from "../utils/MethodsArea";

//Api
import {
  getCatalogoCompleto,
  getAreasOlimpistaByCi,
} from "../../../api/inscription.api";

export const useCatalog = (watchedFields) => {
  const [catalogo, setCatalogo] = useState([]);
  const [areaInteres, setAreaInteres] = useState([]);
  const [categoriasInteres, setCategoriasInteres] = useState(() => {
    const stored = sessionStorage.getItem("CategoriasFiltradas");
    return stored ? JSON.parse(stored) : null;
  });
  const [categoriasInteresSecundaria, setCategoriasInteresSecundaria] =
    useState(() => {
      const stored = sessionStorage.getItem("CategoriasFiltradasSecundaria");
      return stored ? JSON.parse(stored) : null;
    });

  useEffect(() => {
    sessionStorage.setItem("AreaPrincipal", watchedFields.areaPrincipal);
  }, [watchedFields.areaPrincipal]);

  useEffect(() => {
    const allCatalogo = async () => {
      try {
        const idOlimpiada = JSON.parse(
          sessionStorage.getItem("OlympicData")
        ).idOlimpiada;
        const catalogo = await getCatalogoCompleto(idOlimpiada);
        setCatalogo(catalogo);
      } catch (error) {
        console.log("Ocurrio un error");
      }
    };
    allCatalogo();
  }, []);

  useEffect(() => {
    const getAreas = async () => {
      let areasFiltradas = filtrarAreasPorCurso(
        sessionStorage.getItem("CursoOlympian"),
        catalogo
      );

      const areas = await getAreasOlimpistaByCi(
        sessionStorage.getItem("CarnetIdentidadOlympian")
      );

      if (areas.data.success != false) {
        areasFiltradas = areasFiltradas.filter(
          (area) => area.value !== areas.data?.data[0]
        );
      }

      setAreaInteres(areasFiltradas);
    };
    getAreas();
  }, [catalogo]);

  const onChooseArea = (e, setValue) => {
    const categoriasFiltradas = filtrarCategoriasPorCursoYArea(
      sessionStorage.getItem("CursoOlympian"),
      e.target.value,
      catalogo
    );

    if (e.target.name == "AreaPrincipal") {
      sessionStorage.setItem(
        "CategoriasFiltradas",
        JSON.stringify(categoriasFiltradas)
      );
      setCategoriasInteres(categoriasFiltradas);
      if (e.target.value == "")
        sessionStorage.setItem("CategoriaPrincipal", "");
    } else {
      sessionStorage.setItem(
        "CategoriasFiltradasSecundaria",
        JSON.stringify(categoriasFiltradas)
      );
      setCategoriasInteresSecundaria(categoriasFiltradas);
      if (e.target.value == "")
        sessionStorage.setItem("CategoriaSecundaria", "");
    }

    setValue(e.target.name, e.target.value);
  };
  return {
    onChooseArea,
    areaInteres,
    categoriasInteres,
    categoriasInteresSecundaria,
    setCategoriasInteres,
    setCategoriasInteresSecundaria,
  };
};
