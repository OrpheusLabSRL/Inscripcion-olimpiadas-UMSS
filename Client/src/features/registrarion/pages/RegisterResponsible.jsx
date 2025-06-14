import "../Styles/RegisterResponsible.css";

//components
import { Input } from "../../../components/inputs/Input";
import { Select } from "../../../components/inputs/Select";
import { Validator } from "../utils/ValidationRules";
import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";
import { NextPage } from "../../../components/Buttons/NextPage";
import ProgressBar from "../components/ProgressBar/ProgressBar";

//react
import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import swal from "sweetalert";
import { MdCleaningServices } from "react-icons/md";
import Swal from "sweetalert2";

//api
import { getPersonData } from "../../../api/inscription.api";

export const RegisterResponsible = () => {
  const [isReadOnly, setIsReadOnly] = useState({});
  const [currentStep, sertCurrentStep] = useState(1);
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
  } = useForm({
    defaultValues: {
      Nombre: sessionStorage.getItem("NombreResponsible") || "",
      Apellido: sessionStorage.getItem("ApellidoResponsible") || "",
      Tipo_Tutor: sessionStorage.getItem("TipoTutorResponsible") || "",
      Numero_Celular: sessionStorage.getItem("NumeroResponsible") || "",
      Email: sessionStorage.getItem("EmailResponsible") || "",
      Ci: sessionStorage.getItem("CiResponsible") || "",
    },
    mode: "onChange",
  });

  const tipoTutor = [
    { value: "Profesor", label: "Profesor" },
    { value: "Padre/Madre", label: "Papá/Mamá" },
    { value: "Estudiante", label: "Estudiante" },
    { value: "Tutor Legal", label: "Tutor Legal" },
  ];

  const watchedNombre = watch("Nombre");
  const watchedApellido = watch("Apellido");
  const watchedTipoTutor = watch("Tipo_Tutor");
  const watchedEmail = watch("Email");
  const watchedTelefono = watch("Numero_Celular");
  const watchedCarnetIdentidad = watch("Ci");

  useEffect(() => {
    window.scrollTo(0, 0);
    sessionStorage.setItem("pantallaActualRegistro", location.pathname);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("NombreResponsible", watchedNombre);
  }, [watchedNombre]);

  useEffect(() => {
    sessionStorage.setItem("ApellidoResponsible", watchedApellido);
  }, [watchedApellido]);

  useEffect(() => {
    sessionStorage.setItem("TipoTutorResponsible", watchedTipoTutor);
  }, [watchedTipoTutor]);

  useEffect(() => {
    sessionStorage.setItem("EmailResponsible", watchedEmail);
  }, [watchedEmail]);

  useEffect(() => {
    sessionStorage.setItem("NumeroResponsible", watchedTelefono);
  }, [watchedTelefono]);

  useEffect(() => {
    sessionStorage.setItem("CiResponsible", watchedCarnetIdentidad);

    if (watchedCarnetIdentidad.length >= 7) {
      autofill();
    }
  }, [watchedCarnetIdentidad]);

  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem("NombreResponsible");
      sessionStorage.removeItem("ApellidoResponsible");
      sessionStorage.removeItem("TipoTutorResponsible");
      sessionStorage.removeItem("NumeroResponsible");
      sessionStorage.removeItem("EmailResponsible");
      sessionStorage.removeItem("CiResponsible");
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const autofill = async () => {
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
  };

  const cleanFlieds = () => {
    setValue("Nombre", "");
    setValue("Apellido", "");
    setValue("Tipo_Tutor", "");
    setValue("Numero_Celular", "");
    setValue("Email", "");
    setValue("Ci", "");
    setIsTutorResponsible(false);
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

  const titleOlimpian = useMemo(() => {
    const dataOlimpian = JSON.parse(sessionStorage.getItem("OlympicData"));
    return `${dataOlimpian.nombreOlimpiada} versión ${dataOlimpian.version}`;
  }, []);

  return (
    <div className="container-form">
      <h1 className="title-register">{titleOlimpian}</h1>
      {manual === "true" && (
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      )}
      <form
        className="container-form-inputs"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div className="input-2c">
          <h2>Datos de responsable de inscripción</h2>
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
            placeholder="Ingrese número de CI del tutor"
            mandatory="true"
            name="Ci"
            isReadOnly={isReadOnly}
            value={watchedCarnetIdentidad}
            onChange={(e) => setValue("Ci", e.target.value)}
            register={register}
            validationRules={Validator.ci}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Input
            label={"Nombre(s)"}
            placeholder="Ingrese nombre(s) del tutor"
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
            placeholder="Ingrese apellido(s) del tutor"
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
          <Select
            label={"Tipo de tutor"}
            placeholder="Seleccione tipo"
            mandatory="true"
            options={tipoTutor}
            name="Tipo_Tutor"
            isReadOnly={isReadOnly}
            value={watchedTipoTutor}
            onChange={(e) => setValue("Tipo_Tutor", e.target.value)}
            register={register}
            validationRules={Validator.tipo_tutor}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Input
            label={"Número de celular"}
            placeholder="Ingrese número de celular"
            mandatory="true"
            name="Numero_Celular"
            isReadOnly={isReadOnly}
            value={watchedTelefono}
            onChange={(e) => setValue("Numero_Celular", e.target.value)}
            register={register}
            validationRules={Validator.numero}
            errors={errors}
          />
        </div>

        <div className="input-1c">
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
            value="Cancelar"
            onClick={cancelInscription}
            className="btn-back-register"
          />
          <PrimaryButton type="submit" value="Siguiente" />
        </div>
      </form>
    </div>
  );
};
