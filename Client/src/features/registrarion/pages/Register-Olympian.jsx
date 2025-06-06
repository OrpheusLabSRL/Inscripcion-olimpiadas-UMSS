//css
import "../Styles/RegisterOlympian.css";

//components
import { Input } from "../../../components/inputs/Input";
import { Select } from "../../../components/inputs/Select";
import { NextPage } from "../../../components/Buttons/NextPage";
import ProgressBar from "../components/ProgressBar/ProgressBar";

//react
import { useForm } from "react-hook-form";
import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";
import { useNavigate, useLocation } from "react-router-dom";
import swal from "sweetalert";
import { useEffect, useState } from "react";
import { MdCleaningServices } from "react-icons/md";
import Swal from "sweetalert2";

//api
import {
  getOlimpistaEnable,
  getPersonData,
} from "../../../api/inscription.api";

//utils
import { Validator } from "../utils/ValidationRules";
import {
  cursosBolivia,
  departamentosBolivia,
  municipioPorDepartamento,
  colegioPorMunicipio,
} from "../utils/DataOptions";

export const RegisterOlympian = () => {
  const [currentStep, sertCurrentStep] = useState(2);
  const [totalSteps, setTotalStep] = useState(4);
  const [isReadOnly, setIsReadOnly] = useState({});
  const [municipiosFiltradas, setMunicipiosFiltradas] = useState(() => {
    const stored = sessionStorage.getItem("municipiosFiltradas");
    return stored ? JSON.parse(stored) : null;
  });
  const [colegiosFiltradas, setColegiosFiltradas] = useState(() => {
    const stored = sessionStorage.getItem("colegiosFiltradas");
    return stored ? JSON.parse(stored) : null;
  });

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

  const watchedNombre = watch("Nombre");
  const watchedApellido = watch("Apellido");
  const watchedFechaNacimiento = watch("FechaNacimiento");
  const watchedCarnetIdentidad = watch("CarnetIdentidad");
  const watchedColegio = watch("Colegio");
  const watchedCurso = watch("Curso");
  const watchedDepartamento = watch("Departamento");
  const watchedMunicipio = watch("Municipio");
  const watchedEmail = watch("Email");

  useEffect(() => {
    sessionStorage.setItem("NombreOlympian", watchedNombre);
  }, [watchedNombre]);

  useEffect(() => {
    sessionStorage.setItem("ApellidoOlympian", watchedApellido);
  }, [watchedApellido]);

  useEffect(() => {
    sessionStorage.setItem("FechaNacimientoOlympian", watchedFechaNacimiento);
  }, [watchedFechaNacimiento]);

  useEffect(() => {
    sessionStorage.setItem("CarnetIdentidadOlympian", watchedCarnetIdentidad);
    if (watchedCarnetIdentidad.length >= 7) {
      autofill();
    }
  }, [watchedCarnetIdentidad]);

  useEffect(() => {
    sessionStorage.setItem("ColegioOlympian", watchedColegio);
  }, [watchedColegio]);

  useEffect(() => {
    sessionStorage.setItem("CursoOlympian", watchedCurso);
  }, [watchedCurso]);

  useEffect(() => {
    sessionStorage.setItem("DepartamentoOlympian", watchedDepartamento);
  }, [watchedDepartamento]);

  useEffect(() => {
    sessionStorage.setItem("MunicipioOlympian", watchedMunicipio);
  }, [watchedMunicipio]);

  useEffect(() => {
    sessionStorage.setItem("EmailOlympian", watchedEmail);
  }, [watchedEmail]);

  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem("NombreOlympian");
      sessionStorage.removeItem("ApellidoOlympian");
      sessionStorage.removeItem("FechaNacimientoOlympian");
      sessionStorage.removeItem("CarnetIdentidadOlympian");
      sessionStorage.removeItem("ColegioOlympian");
      sessionStorage.removeItem("CursoOlympian");
      sessionStorage.removeItem("DepartamentoOlympian");
      sessionStorage.removeItem("MunicipioOlympian");
      sessionStorage.removeItem("EmailOlympian");
      sessionStorage.removeItem("municipiosFiltradas");
      sessionStorage.removeItem("colegiosFiltradas");
    };
    window.addEventListener("beforeunload", handleUnload);
    sessionStorage.setItem("pantallaActualRegistro", location.pathname);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const onSelectDepartamento = (e) => {
    const select = e.target;
    const selectedOption = select.options[select.selectedIndex];
    const label = selectedOption.text;

    setValue("Departamento", e.target.value);
    const municipios = municipioPorDepartamento[label] || [];
    setMunicipiosFiltradas(municipios);
    sessionStorage.setItem("municipiosFiltradas", JSON.stringify(municipios));
  };

  const onSelectMunicipio = (e) => {
    const select = e.target;
    const selectedOption = select.options[select.selectedIndex];
    const label = selectedOption.text;
    setValue("Municipio", e.target.value);
    const colegios = colegioPorMunicipio[label] || [];
    setColegiosFiltradas(colegios);
    sessionStorage.setItem("colegiosFiltradas", JSON.stringify(colegios));
  };

  const autofill = async () => {
    try {
      const personData = await getPersonData({
        carnet_identidad: sessionStorage.getItem("CarnetIdentidadOlympian"),
        id_olimpiada: sessionStorage.getItem("idOlimpiada"),
      });

      if (personData.data.data.nombre) {
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
      }

      if (personData.data.data.fechaNacimiento) {
        setValue("FechaNacimiento", personData.data.data.fechaNacimiento);
        setValue("Departamento", personData.data.data.departamento);
        const provincias =
          municipioPorDepartamento[personData.data.data.departamento] || [];
        setMunicipiosFiltradas(provincias);
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
      }
    } catch (error) {
      const ciResponsible = sessionStorage.getItem("CiResponsible") || "";
      const ciOlympian =
        sessionStorage.getItem("CarnetIdentidadOlympian") || "";

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
        console.log(isReadOnly);
      }
    }
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
        sessionStorage.getItem("CarnetIdentidadOlympian")
      );
      navigation("/register/olympian-area", data);
    } catch (error) {
      swal("Error", error.response.data.message, "error");
    }
  };

  return (
    <div className="container-form">
      <h1 className="title-register">Registro Olimpiadas O! Sansi 2025</h1>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <form
        className="container-form-inputs"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div className="input-2c">
          <h2>Registro de datos del Olimpista</h2>
          <h5 className="message-recomendation">
            Si ya tiene datos registrados, ingrese su CI y se llenara
            automáticamente los campos.
          </h5>
          <div className="container-clean-fields">
            <p>Limpiar campos</p>
            <MdCleaningServices
              className="icon-clean-fields"
              onClick={cleanFlieds}
            />
          </div>
        </div>

        <div className="input-1c">
          <Input
            label={"Carnet de identidad"}
            placeholder="Ingrese número de CI del olimpista"
            mandatory="true"
            name="CarnetIdentidad"
            isReadOnly={isReadOnly}
            value={watchedCarnetIdentidad}
            onChange={(e) => setValue("CarnetIdentidad", e.target.value)}
            register={register}
            validationRules={Validator.ci}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Input
            label={"Nombre(s)"}
            placeholder="Ingrese nombre(s) del olimpista"
            mandatory="true"
            name="Nombre"
            isReadOnly={isReadOnly}
            value={watchedNombre}
            onChange={(e) => setValue("Nombre", e.target.value)}
            register={register}
            validationRules={Validator.nombre}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Input
            label={"Apellido(s)"}
            placeholder="Ingrese apellido(s) del olimpista"
            mandatory="true"
            name="Apellido"
            isReadOnly={isReadOnly}
            value={watchedApellido}
            onChange={(e) => setValue("Apellido", e.target.value)}
            register={register}
            validationRules={Validator.apellido}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Input
            label={"Fecha de nacimiento"}
            placeholder="Ingrese la fecha de nacimiento del olimpista"
            type="date"
            mandatory="true"
            name="FechaNacimiento"
            isReadOnly={isReadOnly}
            value={watchedFechaNacimiento}
            onChange={(e) => setValue("FechaNacimiento", e.target.value)}
            register={register}
            validationRules={Validator.fechaNacimiento}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Select
            label={"Departamento"}
            placeholder="Seleccione un departamento"
            mandatory="true"
            name="Departamento"
            isReadOnly={isReadOnly}
            value={watchedDepartamento}
            onChange={onSelectDepartamento}
            options={departamentosBolivia}
            register={register}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Select
            label={"Municipio"}
            placeholder="Ingrese el municipio"
            mandatory="true"
            name="Municipio"
            isReadOnly={isReadOnly}
            value={watchedMunicipio}
            onChange={onSelectMunicipio}
            options={municipiosFiltradas}
            register={register}
            validationRules={Validator.municipio}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Select
            label={"Colegio"}
            placeholder="Nombre del Colegio"
            mandatory="true"
            name="Colegio"
            isReadOnly={isReadOnly}
            value={watchedColegio}
            onChange={(e) => setValue("Colegio", e.target.value)}
            options={colegiosFiltradas}
            register={register}
            validationRules={Validator.colegio}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Select
            label={"Curso"}
            placeholder="Seleccione un curso"
            mandatory="true"
            name="Curso"
            isReadOnly={isReadOnly}
            value={watchedCurso}
            onChange={(e) => setValue("Curso", e.target.value)}
            options={cursosBolivia}
            register={register}
            errors={errors}
          />
        </div>

        <div className="input-2c">
          <Input
            label={"Correo Electronico"}
            placeholder="ejemplo@correo.com"
            mandatory="true"
            name="Email"
            isReadOnly={isReadOnly}
            value={watchedEmail}
            onChange={(e) => setValue("Email", e.target.value)}
            register={register}
            validationRules={Validator.email}
            errors={errors}
          />
        </div>
        <div className="container-btn-next-back input-2c">
          <NextPage
            type="button"
            value="Anterior"
            to={previousPath}
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
