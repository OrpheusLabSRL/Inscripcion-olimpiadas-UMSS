import { useEffect, useCallback } from "react";
import { getPersonData } from "../../../api/inscription.api";

export const useAutoFillResponsible = (
  carnetIdentidad,
  setValue,
  setIsReadOnly,
  setIsTutorResponsible
) => {
  const autofill = useCallback(async () => {
    try {
      const idOlimpiada = JSON.parse(
        sessionStorage.getItem("OlympicData")
      ).idOlimpiada;
      const personData = await getPersonData({
        carnet_identidad: sessionStorage.getItem("CiResponsible"),
        id_olimpiada: idOlimpiada,
      });
      setIsTutorResponsible(personData.data.data.esTutorResponsable);
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
      }

      if (personData.data.data.tipoTutor) {
        setValue("Tipo_Tutor", personData.data.data.tipoTutor);
        setValue("Numero_Celular", personData.data.data.telefono);
        setIsReadOnly((prev) => ({
          ...prev,
          Ci: true,
          Tipo_Tutor: true,
          Numero_Celular: true,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  }, [setIsReadOnly, setValue, setIsTutorResponsible]);

  useEffect(() => {
    sessionStorage.setItem("CiResponsible", carnetIdentidad);
    if (carnetIdentidad.length >= 7) {
      autofill();
    }
  }, [carnetIdentidad, autofill]);

  return { autofill };
};
