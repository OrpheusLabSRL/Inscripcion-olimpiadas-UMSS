//React
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import Swal from "sweetalert2";

//Api
import { setNewInscription } from "../../../api/inscription.api";

export const useRegisterTutor = () => {
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

  const watchedFields = {
    nombre: watch("Nombre"),
    apellido: watch("Apellido"),
    tipoTutor: watch("Tipo_Tutor"),
    email: watch("Email"),
    telefono: watch("Numero_Celular"),
    carnetIdentidad: watch("Ci"),
  };

  const onSubmit = async (data) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Se registraran los datos ingresados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, aceptar",
      cancelButtonText: "Cancelar",
    });
    console.log(sessionStorage.getItem("OlympicData"));

    if (confirmacion.isConfirmed) {
      const dataToSend = {
        codigoInscripcion: sessionStorage.getItem("codigoInscripcion") || "",
        idOlimpiada:
          JSON.parse(sessionStorage.getItem("OlympicData")).idOlimpiada || "",
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
              tipo_tutor: "ResponsableIns",
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

  return {
    totalSteps,
    currentStep,
    isReadOnly,
    tipoTutor,
    location,
    register,
    handleSubmit,
    errors,
    watchedFields,
    onSubmit,
    cleanFlieds,
    cancelInscription,
    setValue,
    setIsReadOnly,
    setTipoTutor,
  };
};
