//React
import { useEffect } from "react";

//Api
import { getPersonData } from "../../../api/inscription.api";

export const useAutoFillTutor = (
  carnetIdentidad,
  setValue,
  setIsReadOnly,
  setTipoTutor,
  tipoTutor
) => {
  useEffect(() => {
    if (carnetIdentidad.length >= 7) {
      autofill();
    }
  }, [carnetIdentidad]);

  const autofill = async () => {
    try {
      const idOlimpiada = JSON.parse(
        sessionStorage.getItem("OlympicData")
      ).idOlimpiada;
      const personData = await getPersonData({
        carnet_identidad: sessionStorage.getItem("CiLegal"),
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
      }

      if (personData.data.data.telefono) {
        if (personData.data.data.tipoTutor !== "ResponsableIns") {
          setValue("Numero_Celular", personData.data.data.telefono);
          if (personData.data.data.tipoTutor) {
            setValue("Tipo_Tutor", personData.data.data.tipoTutor);
            setIsReadOnly((prev) => ({
              ...prev,
              Tipo_Tutor: true,
              Numero_Celular: true,
            }));
          } else {
            setIsReadOnly((prev) => ({
              ...prev,
              Numero_Celular: true,
            }));
          }
        } else {
          setValue("Numero_Celular", personData.data.data.telefono);
          setIsReadOnly((prev) => ({
            ...prev,
            Numero_Celular: true,
          }));
        }
      }
    } catch (error) {
      const ciResponsible = sessionStorage.getItem("CiResponsible") || "";
      const ciOlympian =
        sessionStorage.getItem("CarnetIdentidadOlympian") || "";
      const ciProfesorPrincipal = sessionStorage.getItem("CiPrincipal") || "";
      const ciProfesorSecundario = sessionStorage.getItem("CiSecundaria") || "";
      const ciLegal = sessionStorage.getItem("CiLegal") || "";

      if (ciLegal == ciResponsible) {
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
        return;
      }
      if (ciLegal == ciOlympian) {
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
      }
      if (ciLegal == ciProfesorPrincipal) {
        setValue("Nombre", sessionStorage.getItem("NombrePrincipal"));
        setValue("Apellido", sessionStorage.getItem("ApellidoPrincipal"));
        setValue("Email", sessionStorage.getItem("EmailResponsible"));
        setValue("Numero_Celular", sessionStorage.getItem("NumeroPrincipal"));
        setValue("Tipo_Tutor", "Profesor");

        setIsReadOnly((prev) => ({
          ...prev,
          Ci: true,
          Nombre: true,
          Apellido: true,
          Email: true,
          Numero_Celular: true,
          Tipo_Tutor: true,
        }));
        return;
      }
      if (ciLegal == ciProfesorSecundario) {
        setValue("Nombre", sessionStorage.getItem("NombreSecundaria"));
        setValue("Apellido", sessionStorage.getItem("ApellidoSecundaria"));
        setValue("Email", sessionStorage.getItem("EmailSecundaria"));
        setValue("Numero_Celular", sessionStorage.getItem("NumeroSecundaria"));
        setValue("Tipo_Tutor", "Profesor");

        setIsReadOnly((prev) => ({
          ...prev,
          Ci: true,
          Nombre: true,
          Apellido: true,
          Email: true,
          Numero_Celular: true,
          Tipo_Tutor: true,
        }));
        return;
      }
    }
  };

  return <div>useAutoFillTutor</div>;
};
