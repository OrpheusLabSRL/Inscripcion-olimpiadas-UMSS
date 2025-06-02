//css
import "../Styles/RegisterTutor.css";

//components
import { Input } from "../../../components/inputs/Input";
import { Select } from "../../../components/inputs/Select";
import { Validator } from "../utils/ValidationRules";
import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";
import { NextPage } from "../../../components/Buttons/NextPage";
import ProgressBar from "../components/ProgressBar/ProgressBar";

//react
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";
import swal from "sweetalert";
import { MdCleaningServices } from "react-icons/md";
import Swal from "sweetalert2";

//api
import { setNewInscription, getPersonData } from "../../../api/inscription.api";

export const RegisterTutor = () => {
  const [currentStep, sertCurrentStep] = useState(4);
  const [totalSteps, setTotalStep] = useState(4);
  const [isReadOnly, setIsReadOnly] = useState({});
  const [tipoTutor, setTipoTutor] = useState([
    { value: "Padre/Madre", label: "Papá/Mamá" },
    { value: "Tutor Legal", label: "Tutor Legal" },
    { value: "Profesor", label: "Profesor" },
    { value: "Estudiante", label: "Estudiante" },
  ]);
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
      Nombre: sessionStorage.getItem("NombreLegal") || "",
      Apellido: sessionStorage.getItem("ApellidoLegal") || "",
      Tipo_Tutor: sessionStorage.getItem("TipoTutorLegal") || "",
      Numero_Celular: sessionStorage.getItem("NumeroLegal") || "",
      Email: sessionStorage.getItem("EmailLegal") || "",
      Ci: sessionStorage.getItem("CiLegal") || "",
    },
    mode: "onChange",
  });

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
    sessionStorage.setItem("NombreLegal", watchedNombre);
  }, [watchedNombre]);

  useEffect(() => {
    sessionStorage.setItem("ApellidoLegal", watchedApellido);
  }, [watchedApellido]);

  useEffect(() => {
    sessionStorage.setItem("TipoTutorLegal", watchedTipoTutor);
  }, [watchedTipoTutor]);

  useEffect(() => {
    sessionStorage.setItem("EmailLegal", watchedEmail);
  }, [watchedEmail]);

  useEffect(() => {
    sessionStorage.setItem("NumeroLegal", watchedTelefono);
  }, [watchedTelefono]);

  useEffect(() => {
    sessionStorage.setItem("CiLegal", watchedCarnetIdentidad);
    if (watchedCarnetIdentidad.length >= 7) {
      autofill();
    }
  }, [watchedCarnetIdentidad]);

  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem("NombreLegal");
      sessionStorage.removeItem("ApellidoLegal");
      sessionStorage.removeItem("TipoTutorLegal");
      sessionStorage.removeItem("NumeroLegal");
      sessionStorage.removeItem("EmailLegal");
      sessionStorage.removeItem("CiLegal");
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const onSubmit = async (data) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Se registraran los datos ingresados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, aceptar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      const dataToSend = {
        codigoInscripcion: sessionStorage.getItem("codigoInscripcion") || "",
        olimpista: {
          nombre: sessionStorage.getItem("NombreOlympian"),
          apellido: sessionStorage.getItem("ApellidoOlympian"),
          correo_electronico: sessionStorage.getItem("EmailOlympian"),
          carnet_identidad: sessionStorage.getItem("CarnetIdentidadOlympian"),
          curso: sessionStorage.getItem("CursoOlympian"),
          fecha_nacimiento: sessionStorage.getItem("FechaNacimientoOlympian"),
          colegio: sessionStorage.getItem("ColegioOlympian"),
          departamento: sessionStorage.getItem("DepartamentoOlympian"),
          municipio: sessionStorage.getItem("MunicipioOlympian"),
        },
        responsable: sessionStorage.getItem("tutorInscripcionId")
          ? { id_persona: sessionStorage.getItem("tutorInscripcionId") }
          : {
              nombre: sessionStorage.getItem("NombreResponsible"),
              apellido: sessionStorage.getItem("ApellidoResponsible"),
              tipo_tutor: sessionStorage.getItem("TipoTutorResponsible"),
              correo_electronico: sessionStorage.getItem("EmailResponsible"),
              telefono: sessionStorage.getItem("NumeroResponsible"),
              carnet_identidad: sessionStorage.getItem("CiResponsible"),
            },
        tutor_legal: {
          nombre: sessionStorage.getItem("NombreLegal"),
          apellido: sessionStorage.getItem("ApellidoLegal"),
          tipo_tutor: sessionStorage.getItem("TipoTutorLegal"),
          correo_electronico: sessionStorage.getItem("EmailLegal"),
          telefono: sessionStorage.getItem("NumeroLegal"),
          carnet_identidad: sessionStorage.getItem("CiLegal"),
        },
        inscripciones: [
          {
            area: sessionStorage.getItem("AreaPrincipal"),
            categoria: sessionStorage.getItem("CategoriaPrincipal"),
            existeTutor: sessionStorage.getItem("TutorArea1") === "true",
            formaInscripcion: "Manual",
            registrandose: true,
            tutorArea: {
              nombre: sessionStorage.getItem("NombrePrincipal"),
              apellido: sessionStorage.getItem("ApellidoPrincipal"),
              tipo_tutor: "Profesor",
              correo_electronico: sessionStorage.getItem("EmailPrincipal"),
              telefono: sessionStorage.getItem("NumeroPrincipal"),
              carnet_identidad: sessionStorage.getItem("CiPrincipal"),
            },
          },
        ],
      };

      if (sessionStorage.getItem("AreaSecundaria")) {
        dataToSend.inscripciones.push({
          area: sessionStorage.getItem("AreaSecundaria"),
          categoria: sessionStorage.getItem("CategoriaSecundaria"),
          existeTutor: sessionStorage.getItem("TutorArea2") === "true",
          formaInscripcion: "Manual",
          registrandose: true,
          tutorArea: {
            nombre: sessionStorage.getItem("NombreSecundaria"),
            apellido: sessionStorage.getItem("ApellidoSecundaria"),
            tipo_tutor: "Profesor",
            correo_electronico: sessionStorage.getItem("EmailSecundaria"),
            telefono: sessionStorage.getItem("NumeroSecundaria"),
            carnet_identidad: sessionStorage.getItem("CiSecundaria"),
          },
        });
      }

      try {
        const resInscription = await setNewInscription(dataToSend);
        limpiarCamposLocalStorage();
        sessionStorage.setItem(
          "tutorInscripcionId",
          resInscription.data.data.tutor_responsable_id
        );

        swal("Datos registrados correctamente");
        navigation("/register/listRegistered");
      } catch (error) {
        console.log(error);
        swal("Error al registrar los datos");
      }
    }
  };

  const limpiarCamposLocalStorage = () => {
    const campoAConservar = sessionStorage.getItem("tutorInscripcionId");
    sessionStorage.clear();
    if (campoAConservar !== null)
      sessionStorage.setItem("tutorInscripcionId", campoAConservar);
  };

  const autofill = async () => {
    try {
      const personData = await getPersonData(sessionStorage.getItem("CiLegal"));
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
        setTipoTutor([
          ...tipoTutor,
          { value: "Profesor", label: "Profesor" },
          { value: "Estudiante", label: "Estudiante" },
        ]);

        setValue("Tipo_Tutor", personData.data.data.tipoTutor);
        setValue("Numero_Celular", personData.data.data.telefono);
        setIsReadOnly((prev) => ({
          ...prev,
          Tipo_Tutor: true,
          Numero_Celular: true,
        }));
      }
    } catch (error) {
      const ciResponsible = sessionStorage.getItem("CiResponsible") || "";
      const ciOlympian =
        sessionStorage.getItem("CarnetIdentidadOlympian") || "";
      const ciProfesorPrincipal = sessionStorage.getItem("CiPrincipal") || "";
      const ciProfesorSecundario = sessionStorage.getItem("CiSecundaria") || "";
      const ciLegal = sessionStorage.getItem("CiLegal") || "";

      if (ciLegal == ciResponsible) {
        setTipoTutor([
          ...tipoTutor,
          { value: "Profesor", label: "Profesor" },
          { value: "Estudiante", label: "Estudiante" },
        ]);
        setValue("Nombre", sessionStorage.getItem("NombreResponsible"));
        setValue("Apellido", sessionStorage.getItem("ApellidoResponsible"));
        setValue("Email", sessionStorage.getItem("EmailResponsible"));
        setValue("Numero_Celular", sessionStorage.getItem("NumeroResponsible"));
        setValue("Tipo_Tutor", sessionStorage.getItem("TipoTutorResponsible"));

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
        setTipoTutor([
          ...tipoTutor,
          { value: "Profesor", label: "Profesor" },
          { value: "Estudiante", label: "Estudiante" },
        ]);
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
        setTipoTutor([
          ...tipoTutor,
          { value: "Profesor", label: "Profesor" },
          { value: "Estudiante", label: "Estudiante" },
        ]);
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

  const cleanFlieds = () => {
    setValue("Nombre", "");
    setValue("Apellido", "");
    setValue("Tipo_Tutor", "");
    setValue("Numero_Celular", "");
    setValue("Email", "");
    setValue("Ci", "");
    setTipoTutor([
      { value: "Padre/Madre", label: "Papá/Mamá" },
      { value: "Tutor Legal", label: "Tutor Legal" },
    ]);
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

  return (
    <div className="container-form">
      <h1 className="title-register">Registro Olimpiadas O! Sansi 2025</h1>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <form className="container-form-inputs" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-2c">
          <h1>Registro de datos de tutor legal</h1>
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
            type="button"
            value="Anterior"
            to={"/register/olympian-area"}
          />
          <NextPage value="Cancelar" onClick={cancelInscription} />
          <PrimaryButton type="submit" value="Registrar" />
        </div>
      </form>
    </div>
  );
};
