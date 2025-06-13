//React
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import swal from "sweetalert";

//Api
import { getOlimpistaEnable } from "../../../api/inscription.api";

export const useRegisterOlympian = () => {
  const [currentStep, setCurrentStep] = useState(2);
  const [totalSteps, setTotalStep] = useState(4);
  const [isReadOnly, setIsReadOnly] = useState({});

  const navigation = useNavigate();
  const location = useLocation();
  const previousPath = sessionStorage.getItem("prevPage");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      Nombre: sessionStorage.getItem("NombreOlympian") || "",
      Apellido: sessionStorage.getItem("ApellidoOlympian") || "",
      FechaNacimiento: sessionStorage.getItem("FechaNacimientoOlympian") || "",
      CarnetIdentidad: sessionStorage.getItem("CarnetIdentidadOlympian") || "",
      Colegio: sessionStorage.getItem("ColegioOlympian") || "",
      Curso: sessionStorage.getItem("CursoOlympian") || "",
      Departamento: sessionStorage.getItem("DepartamentoOlympian") || "",
      Municipio: sessionStorage.getItem("MunicipioOlympian") || "",
      Email: sessionStorage.getItem("EmailOlympian") || "",
    },
    mode: "onChange",
  });

  const watchedFields = {
    nombre: watch("Nombre"),
    apellido: watch("Apellido"),
    fechaNacimiento: watch("FechaNacimiento"),
    carnetIdentidad: watch("CarnetIdentidad"),
    colegio: watch("Colegio"),
    curso: watch("Curso"),
    departamento: watch("Departamento"),
    municipio: watch("Municipio"),
    email: watch("Email"),
  };

  const cleanFlieds = () => {
    setValue("Nombre", "");
    setValue("Apellido", "");
    setValue("Email", "");
    setValue("CarnetIdentidad", "");
    setValue("FechaNacimiento", "");
    setValue("Departamento", "");
    setValue("Municipio", "");
    setValue("Colegio", "");
    setValue("Curso", "");

    setIsReadOnly({});
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

  const limpiarCamposLocalStorage = () => {
    const campoAConservar = sessionStorage.getItem("tutorInscripcionId");
    sessionStorage.clear();
    if (campoAConservar !== null)
      sessionStorage.setItem("tutorInscripcionId", campoAConservar);
  };

  const onSubmit = async (data) => {
    try {
      await getOlimpistaEnable(
        sessionStorage.getItem("CarnetIdentidadOlympian"),
        JSON.parse(sessionStorage.getItem("OlympicData")).idOlimpiada
      );
      navigation("/register/olympian-area", data);
    } catch (error) {
      swal("Error", error.response.data.message, "error");
    }
  };

  return {
    currentStep,
    totalSteps,
    isReadOnly,
    setIsReadOnly,
    location,
    previousPath,
    register,
    handleSubmit,
    errors,
    setValue,
    watchedFields,
    cleanFlieds,
    cancelInscription,
    onSubmit,
  };
};
