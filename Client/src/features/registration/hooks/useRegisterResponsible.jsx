//React
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import swal from "sweetalert";

export const useRegisterResponsible = () => {
  const [isReadOnly, setIsReadOnly] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isTutorResponsible, setIsTutorResponsible] = useState(false);
  const [totalSteps, setTotalStep] = useState(4);
  const navigation = useNavigate();
  const location = useLocation();
  const manual = sessionStorage.getItem("inscripcionManual");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
  } = useForm({
    defaultValues: {
      Nombre: sessionStorage.getItem("NombreResponsible") || "",
      Apellido: sessionStorage.getItem("ApellidoResponsible") || "",
      Numero_Celular: sessionStorage.getItem("NumeroResponsible") || "",
      Email: sessionStorage.getItem("EmailResponsible") || "",
      Ci: sessionStorage.getItem("CiResponsible") || "",
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

  const cleanFields = () => {
    setValue("Nombre", "");
    setValue("Apellido", "");
    setValue("Numero_Celular", "");
    setValue("Email", "");
    setValue("Ci", "");
    setIsTutorResponsible(false);
    setIsReadOnly({});
    clearErrors();
  };

  const limpiarCamposLocalStorage = () => {
    const campoAConservar = sessionStorage.getItem("tutorInscripcionId");
    const OlympicData = sessionStorage.getItem("OlympicData");

    sessionStorage.clear();
    if (campoAConservar !== null)
      sessionStorage.setItem("tutorInscripcionId", campoAConservar);
    if (OlympicData !== null)
      sessionStorage.setItem("OlympicData", OlympicData);
  };

  const cancelInscription = async () => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro que quieres salir?",
      text: "Se perderan los datos ingresados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, aceptar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      limpiarCamposLocalStorage();
      navigation(
        sessionStorage.getItem("tutorInscripcionId")
          ? "/register/listRegistered"
          : "/register"
      );
    }
  };

  const onSubmit = async (data) => {
    const manual = sessionStorage.getItem("inscripcionManual");

    if (isTutorResponsible) {
      const confirmacion = await Swal.fire({
        title: "Inscripción activa detectada",
        text: "Ya tienes una inscripción en proceso. ¿Deseas continuar con esta nueva inscripción o continuar con la anterior?",
        icon: "warning",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Nueva inscripción",
        denyButtonText: "Inscripción anterior",
        cancelButtonText: "Cancelar",
      });

      if (confirmacion.isConfirmed) {
        try {
          sessionStorage.setItem("prevPage", location.pathname);
          navigation(
            manual === "true" ? "/register/olympian" : "/register/excel",
            {
              state: { from: location.pathname },
              data,
            }
          );
        } catch (error) {
          console.log(error);
          swal("Error al registrar los datos");
        }
      } else if (confirmacion.isDenied) {
        navigation("/register/tutor-form", { state: { formType: "continue" } });
      }
    } else {
      try {
        sessionStorage.setItem("prevPage", location.pathname);
        navigation(
          manual === "true" ? "/register/olympian" : "/register/excel",
          {
            state: { from: location.pathname },
            data,
          }
        );
      } catch (error) {
        console.log(error);
        swal("Error al registrar los datos");
      }
    }
  };

  return {
    isReadOnly,
    setIsReadOnly,
    currentStep,
    totalSteps,
    setIsTutorResponsible,
    location,
    manual,
    register,
    handleSubmit,
    errors,
    setValue,
    watchedFields,
    cleanFields,
    cancelInscription,
    onSubmit,
    clearErrors,
  };
};
