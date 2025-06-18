//React
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import swal from "sweetalert";

//Api
import { getOlimpistaEnable } from "../../../api/inscription.api";

export const useRegisterOlympianArea = () => {
  const [currentStep, sertCurrentStep] = useState(3);
  const [totalSteps, setTotalStep] = useState(4);

  const navigation = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      AreaPrincipal: sessionStorage.getItem("AreaPrincipal") || "",
      CategoriaPrincipal: sessionStorage.getItem("CategoriaPrincipal") || "",
      AreaSecundaria: sessionStorage.getItem("AreaSecundaria") || "",
      CategoriaSecundaria: sessionStorage.getItem("CategoriaSecundaria") || "",
    },
    mode: "onChange",
  });

  const watchedFields = {
    areaPrincipal: watch("AreaPrincipal"),
    categoriaPrincipal: watch("CategoriaPrincipal"),
    areaSecundaria: watch("AreaSecundaria"),
    categoriaSecundaria: watch("CategoriaSecundaria"),
  };

  const onSubmit = async (data) => {
    try {
      data.estado = false;

      if (data.AreaSecundaria == "" || data.CategoriaSecundaria == "") {
        delete data.AreaSecundaria;
        delete data.CategoriaSecundaria;
      }

      if (
        data.AreaPrincipal == data.AreaSecundaria &&
        data.AreaPrincipal !== "4"
      ) {
        swal(
          "No se puede seleccionar la misma área",
          "No es posible registrarse en la misma area, a menos que se trate de el área de INFORMÁTICA ",
          "warning"
        );
        return;
      }

      if (
        data.AreaPrincipal == 4 &&
        data.AreaSecundaria == 4 &&
        data.CategoriaPrincipal == data.CategoriaSecundaria
      ) {
        swal(
          "No se puede seleccionar la misma categoría",
          "Seleccione otra categoría",
          "warning"
        );
        return;
      }

      console.log("Hola antes del res");
      const resEnable = await getOlimpistaEnable(
        sessionStorage.getItem("CarnetIdentidadOlympian"),
        JSON.parse(sessionStorage.getItem("OlympicData")).idOlimpiada
      );

      console.log("res", resEnable);
      if (
        resEnable?.data?.data?.inscripciones_actuales == 1 &&
        data.AreaPrincipal &&
        data.AreaSecundaria
      ) {
        swal(
          "No se puede inscribir en mas de 2 áreas",
          "El olimpista solo puede inscribirse en una área mas",
          "warning"
        );
        return;
      }
      navigation("/register/tutor-legal", data);
    } catch (error) {
      if (error.response?.data?.message === "Olimpista no encontrado") {
        navigation("/register/tutor-legal", data);
        return;
      }
      console.log(error);
      swal("Error al registrar los datos");
    }
  };

  const cleanFlieds = (
    setCategoriasInteres,
    setCategoriasInteresSecundaria
  ) => {
    setValue("AreaPrincipal", "");
    setValue("CategoriaPrincipal", "");
    setValue("AreaSecundaria", "");
    setValue("CategoriaSecundaria", "");
    setCategoriasInteres([]);
    setCategoriasInteresSecundaria([]);
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

  return {
    currentStep,
    totalSteps,
    location,
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
