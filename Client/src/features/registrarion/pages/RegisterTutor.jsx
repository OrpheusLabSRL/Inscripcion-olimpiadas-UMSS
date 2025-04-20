//css
import "../Styles/RegisterTutor.css";

//components
import { Input } from "../../../components/inputs/Input";
import { Select } from "../../../components/inputs/Select";
import { Validator } from "../utils/ValidationRules";
import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";
import { NextPage } from "../../../components/Buttons/NextPage";

//react
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, NavLink } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";
import swal from "sweetalert";

//api
import { setNewInscription } from "../../../api/inscription.api";

export const RegisterTutor = () => {
  const navigation = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      Nombre: localStorage.getItem("NombreLegal") || "",
      Apellido: localStorage.getItem("ApellidoLegal") || "",
      Tipo_Tutor: localStorage.getItem("TipoTutorLegal") || "",
      Numero_Celular: localStorage.getItem("NumeroLegal") || "",
      Email: localStorage.getItem("EmailLegal") || "",
      Ci: localStorage.getItem("CiLegal") || "",
    },
    mode: "onChange",
  });

  const tipoTutor = [
    { value: "Profesor", label: "Profesor" },
    { value: "Padre/Madre", label: "Papá/Mamá" },
  ];

  const watchedNombre = watch("Nombre");
  const watchedApellido = watch("Apellido");
  const watchedTipoTutor = watch("Tipo_Tutor");
  const watchedEmail = watch("Email");
  const watchedTelefono = watch("Numero_Celular");
  const watchedCarnetIdentidad = watch("Ci");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    localStorage.setItem("NombreLegal", watchedNombre);
  }, [watchedNombre]);

  useEffect(() => {
    localStorage.setItem("ApellidoLegal", watchedApellido);
  }, [watchedApellido]);

  useEffect(() => {
    localStorage.setItem("TipoTutorLegal", watchedTipoTutor);
  }, [watchedTipoTutor]);

  useEffect(() => {
    localStorage.setItem("EmailLegal", watchedEmail);
  }, [watchedEmail]);

  useEffect(() => {
    localStorage.setItem("NumeroLegal", watchedTelefono);
  }, [watchedTelefono]);

  useEffect(() => {
    localStorage.setItem("CiLegal", watchedCarnetIdentidad);
  }, [watchedCarnetIdentidad]);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("NombreLegal");
      localStorage.removeItem("ApellidoLegal");
      localStorage.removeItem("TipoTutorLegal");
      localStorage.removeItem("NumeroLegal");
      localStorage.removeItem("EmailLegal");
      localStorage.removeItem("CiLegal");
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const onSubmit = async (data) => {
    const dataToSend = {
      olimpista: {
        nombre: localStorage.getItem("NombreOlympian"),
        apellido: localStorage.getItem("ApellidoOlympian"),
        correo_electronico: localStorage.getItem("EmailOlympian"),
        carnet_identidad: localStorage.getItem("CarnetIdentidadOlympian"),
        curso: localStorage.getItem("CursoOlympian"),
        fecha_nacimiento: localStorage.getItem("FechaNacimientoOlympian"),
        colegio: localStorage.getItem("ColegioOlympian"),
        departamento: localStorage.getItem("DepartamentoOlympian"),
        provincia: localStorage.getItem("ProvinciaOlympian"),
      },
      responsable: localStorage.getItem("idTutorInscriptor")
        ? { id_persona: localStorage.getItem("idTutorInscriptor") }
        : {
            nombre: localStorage.getItem("NombreResponsible"),
            apellido: localStorage.getItem("ApellidoResponsible"),
            tipo_tutor: localStorage.getItem("TipoTutorResponsible"),
            correo_electronico: localStorage.getItem("EmailResponsible"),
            telefono: localStorage.getItem("NumeroResponsible"),
            carnet_identidad: localStorage.getItem("CiResponsible"),
          },
      tutor_legal: {
        nombre: localStorage.getItem("NombreLegal"),
        apellido: localStorage.getItem("ApellidoLegal"),
        tipo_tutor: localStorage.getItem("TipoTutorLegal"),
        correo_electronico: localStorage.getItem("EmailLegal"),
        telefono: localStorage.getItem("NumeroLegal"),
        carnet_identidad: localStorage.getItem("CiLegal"),
      },
      inscripciones: [
        {
          area: localStorage.getItem("AreaPrincipal"),
          categoria: localStorage.getItem("CategoriaPrincipal"),
          existeTutor: localStorage.getItem("TutorArea1"),
          tutorArea: {
            nombre: localStorage.getItem("NombrePrincipal"),
            apellido: localStorage.getItem("ApellidoPrincipal"),
            tipo_tutor: localStorage.getItem("TipoTutorPrincipal"),
            correo_electronico: localStorage.getItem("EmailPrincipal"),
            telefono: localStorage.getItem("NumeroPrincipal"),
            carnet_identidad: localStorage.getItem("CiPrincipal"),
          },
        },
      ],
    };

    if (localStorage.getItem("AreaSecundaria")) {
      dataToSend.inscripciones.push({
        area: localStorage.getItem("AreaSecundaria"),
        categoria: localStorage.getItem("CategoriaSecundaria"),
        existeTutor: localStorage.getItem("TutorArea2"),
        tutorArea: {
          nombre: localStorage.getItem("NombreSecundaria"),
          apellido: localStorage.getItem("ApellidoSecundaria"),
          tipo_tutor: localStorage.getItem("TipoTutorSecundaria"),
          correo_electronico: localStorage.getItem("EmailSecundaria"),
          telefono: localStorage.getItem("NumeroSecundaria"),
          carnet_identidad: localStorage.getItem("CiSecundaria"),
        },
      });
    }

    try {
      const resInscription = await setNewInscription(dataToSend);
      limpiarCamposLocalStorage();
      localStorage.setItem(
        "tutorInscripcionId",
        resInscription.data.data.tutor_responsable_id
      );

      swal("Datos registrados correctamente");
      navigation("/listRegistered");
    } catch (error) {
      console.log(error);
      swal("Error al registrar los datos");
    }
  };

  const limpiarCamposLocalStorage = () => {
    const keysToRemove = [
      "DepartamentoOlympian",
      "EmailLegal",
      "EmailOlympian",
      "EmailPrincipal",
      "EmailResponsible",
      "EmailSecundaria",
      "FechaNacimientoOlympian",
      "NombreLegal",
      "NombreOlympian",
      "NombrePrincipal",
      "NombreResponsible",
      "NombreSecundaria",
      "NumeroLegal",
      "NumeroPrincipal",
      "NumeroResponsible",
      "NumeroSecundaria",
      "ProvinciaOlympian",
      "TipoTutorLegal",
      "TipoTutorPrincipal",
      "TipoTutorResponsible",
      "TipoTutorSecundaria",
      "AreaSecundaria",
      "ApellidoLegal",
      "ApellidoOlympian",
      "ApellidoPrincipal",
      "ApellidoSecundaria",
      "ApellidoResponsible",
      "AreaPrincipal",
      "CarnetIdentidadOlympian",
      "CategoriaPrincipal",
      "CategoriaSecundaria",
      "CategoriasFiltradas",
      "CategoriasFiltradasSecundaria",
      "CiLegal",
      "CiPrincipal",
      "CiResponsible",
      "CiSecundaria",
      "ColegioOlympian",
      "CursoOlympian",
      "TutorArea1",
      "TutorArea2",
      "provinciasFiltradas",
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  };

  return (
    <div className="container-form">
      <NavLink to={"/register/OlympianArea"}>
        <IoArrowBackCircle className="btn-back" />
      </NavLink>
      <form className="container-form-inputs" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-2c">
          <h1>Registro de datos de tutor legal</h1>
        </div>

        <div className="input-1c">
          <Input
            label={"Carnet de identidad"}
            placeholder="Ingrese número de CI del tutor"
            mandatory="true"
            name="Ci"
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
            value={watchedEmail}
            onChange={(e) => setValue("Email", e.target.value)}
            register={register}
            validationRules={Validator.email}
            errors={errors}
          />
        </div>

        <div className="container-btn-back-olympian input-1c">
          <NextPage to={"/"} value="Cancelar" />
        </div>

        <div>
          <PrimaryButton type="submit" value="Registrar" />
        </div>
      </form>
    </div>
  );
};
