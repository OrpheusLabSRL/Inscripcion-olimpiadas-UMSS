//React
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const useRegisterTutorOptional = () => {
  const [isReadOnly, setIsReadOnly] = useState({});
  const location = useLocation();
  const navigation = useNavigate();
  const { area } = location.state;
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      Nombre:
        area == "AreaPrincipal"
          ? sessionStorage.getItem("NombrePrincipal") || ""
          : sessionStorage.getItem("NombreSecundaria") || "",
      Apellido:
        area == "AreaPrincipal"
          ? sessionStorage.getItem("ApellidoPrincipal") || ""
          : sessionStorage.getItem("ApellidoSecundaria") || "",
      Numero_Celular:
        area == "AreaPrincipal"
          ? sessionStorage.getItem("NumeroPrincipal") || ""
          : sessionStorage.getItem("NumeroSecundaria") || "",
      Email:
        area == "AreaPrincipal"
          ? sessionStorage.getItem("EmailPrincipal") || ""
          : sessionStorage.getItem("EmailSecundaria") || "",
      Ci:
        area == "AreaPrincipal"
          ? sessionStorage.getItem("CiPrincipal") || ""
          : sessionStorage.getItem("CiSecundaria") || "",
    },
    mode: "onChange",
  });

  const watchedFields = {
    nombre: watch("Nombre"),
    apellido: watch("Apellido"),
    email: watch("Email"),
    telefono: watch("Numero_Celular"),
    carnetIdentidad: watch("Ci"),
  };

  const onSubmit = async (data) => {
    area == "AreaPrincipal"
      ? sessionStorage.setItem("TutorArea1", true)
      : sessionStorage.setItem("TutorArea2", true);
    navigation("/register/olympian-area");
  };

  const cleanFlieds = () => {
    setValue("Nombre", "");
    setValue("Apellido", "");
    setValue("Tipo_Tutor", "");
    setValue("Numero_Celular", "");
    setValue("Email", "");
    setValue("Ci", "");

    setIsReadOnly({});
  };

  const backPage = () => {
    const campos = {
      nombre: watchedFields.nombre,
      apellido: watchedFields.apellido,
      email: watchedFields.email,
      telefono: watchedFields.email,
      ci: watchedFields.carnetIdentidad,
    };

    const algunCampoVacio = Object.values(campos).some(
      (valor) => !valor || valor.trim() === ""
    );

    if (algunCampoVacio) {
      area === "AreaPrincipal"
        ? sessionStorage.removeItem("TutorArea1")
        : sessionStorage.removeItem("TutorArea2");
    }
  };

  return {
    cleanFlieds,
    onSubmit,
    watchedFields,
    handleSubmit,
    register,
    isReadOnly,
    setIsReadOnly,
    errors,
    location,
    area,
    setValue,
    backPage,
  };
};
