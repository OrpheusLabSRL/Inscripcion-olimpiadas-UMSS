//React
import React, { useEffect, useCallback } from "react";

//Api
import { getPersonData } from "../../../api/inscription.api";

//utils
import {
  municipioPorDepartamento,
  colegioPorMunicipio,
} from "../utils/DataOptions";

export const useAutoFillOlympian = (
  carnetIdentidad,
  setValue,
  setIsReadOnly,
  setColegiosFiltradas,
  setMunicipiosFiltradas,
  clearErrors
) => {
  const autofill = useCallback(async () => {
    try {
      const idOlimpiada = JSON.parse(
        sessionStorage.getItem("OlympicData")
      ).idOlimpiada;

      console.log("Antes del person data");

      const personData = await getPersonData({
        carnet_identidad: sessionStorage.getItem("CarnetIdentidadOlympian"),
        id_olimpiada: idOlimpiada,
      });

      console.log("Despues del person data", personData);

      if (personData?.data?.data?.nombre) {
        setValue("Nombre", personData.data.data.nombre);
        setValue("Apellido", personData.data.data.apellido);
        setValue("Email", personData.data.data.correoElectronico);
        setIsReadOnly((prev) => ({
          ...prev,
          CarnetIdentidad: true,
          Nombre: true,
          Apellido: true,
          Email: true,
        }));
        clearErrors(["CarnetIdentidad", "Nombre", "Apellido", "Email"]);
      }

      if (personData?.data?.data?.fechaNacimiento) {
        setValue("FechaNacimiento", personData.data.data.fechaNacimiento);
        setValue("Departamento", personData.data.data.departamento);
        const municipio =
          municipioPorDepartamento[personData.data.data.departamento] || [];
        setMunicipiosFiltradas(municipio);
        setValue("Municipio", personData.data.data.municipio);
        const colegios =
          colegioPorMunicipio[personData.data.data.municipio] || [];
        setColegiosFiltradas(colegios);
        setValue("Colegio", personData.data.data.colegio);
        setValue("Curso", personData.data.data.curso);
        setIsReadOnly((prev) => ({
          ...prev,
          CarnetIdentidad: true,
          FechaNacimiento: true,
          Departamento: true,
          Municipio: true,
          Colegio: true,
          Curso: true,
        }));
        clearErrors([
          "CarnetIdentidad",
          "FechaNacimiento",
          "Departamento",
          "Municipio",
          "Curso",
          "Colegio",
        ]);
      }
    } catch (error) {
      const ciResponsible = sessionStorage.getItem("CiResponsible") || "";
      const ciOlympian =
        sessionStorage.getItem("CarnetIdentidadOlympian") || "";

      console.log("Ci olimpiada", ciOlympian);

      if (ciResponsible == ciOlympian) {
        setValue("Nombre", sessionStorage.getItem("NombreResponsible"));
        setValue("Apellido", sessionStorage.getItem("ApellidoResponsible"));
        setValue("Email", sessionStorage.getItem("EmailResponsible"));
        setIsReadOnly((prev) => ({
          ...prev,
          CarnetIdentidad: true,
          Nombre: true,
          Apellido: true,
          Email: true,
        }));
        clearErrors(["CarnetIdentidad", "Nombre", "Apellido", "Email"]);
      }
    }
  }, [setIsReadOnly, setValue, setColegiosFiltradas, setMunicipiosFiltradas]);

  useEffect(() => {
    if (carnetIdentidad.length >= 7) {
      autofill();
    }
  }, [carnetIdentidad]);
  return { autofill };
};
