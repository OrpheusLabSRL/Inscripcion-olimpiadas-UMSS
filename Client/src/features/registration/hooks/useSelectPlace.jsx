//React
import { useState } from "react";

//Utils
import {
  municipioPorDepartamento,
  colegioPorMunicipio,
} from "../utils/DataOptions";

export const useSelectPlace = () => {
  const [municipiosFiltradas, setMunicipiosFiltradas] = useState(() => {
    const stored = sessionStorage.getItem("municipiosFiltradas");
    return stored ? JSON.parse(stored) : null;
  });
  const [colegiosFiltradas, setColegiosFiltradas] = useState(() => {
    const stored = sessionStorage.getItem("colegiosFiltradas");
    return stored ? JSON.parse(stored) : [];
  });

  const onSelectDepartamento = (e, setValue) => {
    const select = e.target;
    const selectedOption = select.options[select.selectedIndex];
    const label = selectedOption.text;

    setValue("Departamento", e.target.value);
    const municipios = municipioPorDepartamento[label] || [];
    setMunicipiosFiltradas(municipios);
    sessionStorage.setItem("municipiosFiltradas", JSON.stringify(municipios));
  };

  const onSelectMunicipio = (e, setValue) => {
    const select = e.target;
    const selectedOption = select.options[select.selectedIndex];
    const label = selectedOption.text;
    setValue("Municipio", e.target.value);
    const colegios = colegioPorMunicipio[label] || [];
    setColegiosFiltradas(colegios);
    sessionStorage.setItem("colegiosFiltradas", JSON.stringify(colegios));
  };
  return {
    municipiosFiltradas,
    colegiosFiltradas,
    setMunicipiosFiltradas,
    setColegiosFiltradas,
    onSelectDepartamento,
    onSelectMunicipio,
  };
};
