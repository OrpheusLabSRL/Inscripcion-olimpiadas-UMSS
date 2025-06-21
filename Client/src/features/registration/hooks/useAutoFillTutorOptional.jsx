//React
import { useEffect, useCallback } from "react";

//Api
import { getPersonData } from "../../../api/inscription.api";

export const useAutoFillTutorOptional = (
  carnetIdentidad,
  setValue,
  namesSessionElements,
  setIsReadOnly,
  clearErrors
) => {
  const autofill = useCallback(async () => {
    try {
      const idOlimpiada = JSON.parse(
        sessionStorage.getItem("OlympicData")
      ).idOlimpiada;
      const ci = sessionStorage.getItem(namesSessionElements.ci);
      const personData = await getPersonData({
        carnet_identidad: ci,
        id_olimpiada: idOlimpiada,
      });
      if (personData.data.data.nombre) {
        setValue("Nombre", personData.data.data.nombre);
        setValue("Apellido", personData.data.data.apellido);
        setValue("Email", personData.data.data.correoElectronico);
        setIsReadOnly((prev) => ({
          ...prev,
          Ci: true,
          Nombre: true,
          Apellido: true,
          Email: true,
        }));
        clearErrors(["Ci", "Nombre", "Apellido", "Email"]);
      }

      if (personData.data.data.telefono) {
        setValue("Numero_Celular", personData.data.data.telefono);
        setIsReadOnly((prev) => ({
          ...prev,
          Numero_Celular: true,
        }));
        clearErrors(["Numero_Celular"]);
      }
    } catch (error) {
      const ciResponsible = sessionStorage.getItem("CiResponsible") || "";
      const ciOlympian =
        sessionStorage.getItem("CarnetIdentidadOlympian") || "";
      const ciProfesor = sessionStorage.getItem(namesSessionElements.ci);

      if (ciResponsible == ciProfesor) {
        setValue("Nombre", sessionStorage.getItem("NombreResponsible"));
        setValue("Apellido", sessionStorage.getItem("ApellidoResponsible"));
        setValue("Email", sessionStorage.getItem("EmailResponsible"));
        setValue("Numero_Celular", sessionStorage.getItem("NumeroResponsible"));

        setIsReadOnly((prev) => ({
          ...prev,
          Ci: true,
          Nombre: true,
          Apellido: true,
          Email: true,
          Numero_Celular: true,
        }));
        clearErrors(["Ci", "Nombre", "Apellido", "Email", "Numero_Celular"]);
      } else if (ciProfesor == ciOlympian) {
        setValue("Nombre", sessionStorage.getItem("NombreOlympian"));
        setValue("Apellido", sessionStorage.getItem("ApellidoOlympian"));
        setValue("Email", sessionStorage.getItem("EmailOlympian"));
        setIsReadOnly((prev) => ({
          ...prev,
          Ci: true,
          Nombre: true,
          Apellido: true,
          Email: true,
        }));
        clearErrors(["Ci", "Nombre", "Apellido", "Email"]);
      }
    }
  }, [setIsReadOnly, setValue, namesSessionElements]);

  useEffect(() => {
    if (carnetIdentidad.length >= 7) {
      autofill();
    }
  }, [carnetIdentidad]);
  return { autofill };
};
