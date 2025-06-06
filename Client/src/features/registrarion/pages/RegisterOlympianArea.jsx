//css

import "../Styles/RegisterOlympianArea.css";

//components
import { AreaCategoriaElement } from "../components/AreaCategoriaElement/AreaCategoriaElement";
import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";
import { NextPage } from "../../../components/Buttons/NextPage";
import ProgressBar from "../components/ProgressBar/ProgressBar";

//react
import { useEffect, useState } from "react";
import swal from "sweetalert";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { MdCleaningServices } from "react-icons/md";
import Swal from "sweetalert2";

//api
import {
  getAreasOlimpistaByCi,
  getCatalogoCompleto,
  getOlimpistaEnable,
} from "../../../api/inscription.api";

//util
import {
  filtrarAreasPorCurso,
  filtrarCategoriasPorCursoYArea,
} from "../utils/MethodsArea";

export const RegisterOlympianArea = () => {
  const [currentStep, sertCurrentStep] = useState(3);
  const [totalSteps, setTotalStep] = useState(4);
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

  const watchedAreaPrincipal = watch("AreaPrincipal");
  const watchedCategoriaPrincipal = watch("CategoriaPrincipal");
  const watchedAreaSecundaria = watch("AreaSecundaria");
  const watchedCategoriaSecundaria = watch("CategoriaSecundaria");

  useEffect(() => {
    sessionStorage.setItem("AreaPrincipal", watchedAreaPrincipal);
  }, [watchedAreaPrincipal]);

  useEffect(() => {
    sessionStorage.setItem("CategoriaPrincipal", watchedCategoriaPrincipal);
  }, [watchedCategoriaPrincipal]);
  useEffect(() => {
    sessionStorage.setItem("AreaSecundaria", watchedAreaSecundaria);
  }, [watchedAreaSecundaria]);

  useEffect(() => {
    sessionStorage.setItem("CategoriaSecundaria", watchedCategoriaSecundaria);
  }, [watchedCategoriaSecundaria]);

  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem("AreaPrincipal");
      sessionStorage.removeItem("CategoriaPrincipal");
      sessionStorage.removeItem("AreaSecundaria");
      sessionStorage.removeItem("CategoriaSecundaria");
      sessionStorage.removeItem("CategoriasFiltradas");
      sessionStorage.removeItem("CategoriasFiltradasSecundaria");
      sessionStorage.removeItem("TutorArea1");
      sessionStorage.removeItem("TutorArea2");
    };
    window.addEventListener("beforeunload", handleUnload);
    sessionStorage.setItem("pantallaActualRegistro", location.pathname);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  useEffect(() => {
    const allCatalogo = async () => {
      try {
        const catalogo = await getCatalogoCompleto(
          sessionStorage.getItem("idOlimpiada")
        );
        console.log(catalogo);
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

  const onChooseArea = () => (e) => {
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
    console.log(e.target.value);
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
      const resEnable = await getOlimpistaEnable(
        sessionStorage.getItem("CarnetIdentidadOlympian")
      );
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
      console.log(error);
      swal("Error al registrar los datos");
    }
  };

  const cleanFlieds = () => {
    setValue("AreaPrincipal", "");
    setValue("CategoriaPrincipal", "");
    setValue("AreaSecundaria", "");
    setValue("CategoriaSecundaria", "");
    setCategoriasInteres([]);
    setCategoriasInteresSecundaria(null);
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

  return (
    <div className="container-form">
      <h1 className="title-register">Registro Olimpiadas O! Sansi 2025</h1>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <form className="container-form-inputs" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-2c">
          <h2>Datos de competición</h2>
          <h5 className="message-recomendation">
            Un olimpista puede participar en hasta dos áreas. Si desea
            participar solo en una, deje sin seleccionar el campo de 'área de
            interés secundaria'.
          </h5>
        </div>

        <div className="container-clean-fields input-2c">
          <p>Limpiar campos</p>
          <MdCleaningServices
            className="icon-clean-fields"
            onClick={cleanFlieds}
          />
        </div>

        <AreaCategoriaElement
          labelArea={"Área de interés principal"}
          placeholderArea={"Seleccione un área"}
          labelCategoria={"Categoria de interés principal"}
          placeholderCategoria={"Seleccione una categoria"}
          nameArea={"AreaPrincipal"}
          nameCategoria={"CategoriaPrincipal"}
          areas={areaInteres}
          mandatory={true}
          categorias={categoriasInteres}
          onChooseArea={onChooseArea()}
          setValue={setValue}
          watchedArea={watchedAreaPrincipal}
          watchedCategoria={watchedCategoriaPrincipal}
          register={register}
          errors={errors}
        />
        <AreaCategoriaElement
          labelArea={"Área de interés secundaria"}
          placeholderArea={"Seleccione un secundaria"}
          labelCategoria={"Categoria de interés secundaria"}
          placeholderCategoria={"Seleccione una categoria"}
          nameArea={"AreaSecundaria"}
          nameCategoria={"CategoriaSecundaria"}
          areas={areaInteres}
          categorias={categoriasInteresSecundaria}
          mandatory={
            categoriasInteresSecundaria &&
            categoriasInteresSecundaria.length !== 0
              ? true
              : false
          }
          asterisk={false}
          onChooseArea={onChooseArea()}
          setValue={setValue}
          watchedArea={watchedAreaSecundaria}
          watchedCategoria={watchedCategoriaSecundaria}
          register={register}
          errors={errors}
        />

        <div className="container-btn-next-back input-2c">
          <NextPage
            type="button"
            value="Anterior"
            to={"/register/olympian"}
            className="btn-back-register"
          />
          <NextPage
            value="Cancelar"
            onClick={cancelInscription}
            className="btn-cancel-register"
          />
          <PrimaryButton type="submit" value="Siguiente" />
        </div>
      </form>
    </div>
  );
};
