//css
import "../../Styles/RegisterTutor.css";

//components
import { Input } from "../../../../components/inputs/Input";
import { Select } from "../../../../components/inputs/Select";
import { Validator } from "./ValidationRules";
import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";
import { NextPage } from "../../../../components/Buttons/NextPage";

//react
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, NavLink } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";
import swal from "sweetalert";

//utils
import { tipoTutor } from "./DataOptions";

//api
import {
  registerDataOlympian,
  setTutor,
  setNewInscription,
} from "../../../../api/inscription.api";

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
    const idTutorInscriptor = localStorage.getItem("tutorInscripcionId");

    const dataTutorResponsible = {
      nombresTutor: localStorage.getItem("NombreResponsible"),
      apellidosTutor: localStorage.getItem("ApellidoResponsible"),
      tipoTutor: localStorage.getItem("TipoTutorResponsible"),
      emailTutor: localStorage.getItem("EmailResponsible"),
      telefono: localStorage.getItem("NumeroResponsible"),
      carnetdeidentidad: localStorage.getItem("NumeroResponsible"),
      rol: "responsable inscripcion",
    };
    const dataTutorLegal = {
      nombresTutor: localStorage.getItem("NombreLegal"),
      apellidosTutor: localStorage.getItem("ApellidoLegal"),
      tipoTutor: localStorage.getItem("TipoTutorLegal"),
      emailTutor: localStorage.getItem("EmailLegal"),
      telefono: localStorage.getItem("NumeroLegal"),
      carnetdeidentidad: localStorage.getItem("NumeroLegal"),
      rol: "tutor legal",
    };

    const dataTutorArea1 = {
      nombresTutor: localStorage.getItem("NombrePrincipal"),
      apellidosTutor: localStorage.getItem("ApellidoPrincipal"),
      tipoTutor: localStorage.getItem("TipoTutorPrincipal"),
      emailTutor: localStorage.getItem("EmailPrincipal"),
      telefono: localStorage.getItem("NumeroPrincipal"),
      carnetdeidentidad: localStorage.getItem("NumeroPrincipal"),
      rol: "tutor area1",
    };

    const dataTutorArea2 = {
      nombresTutor: localStorage.getItem("NombreSecundaria"),
      apellidosTutor: localStorage.getItem("ApellidoSecundaria"),
      tipoTutor: localStorage.getItem("TipoTutorSecundaria"),
      emailTutor: localStorage.getItem("EmailSecundaria"),
      telefono: localStorage.getItem("NumeroSecundaria"),
      carnetdeidentidad: localStorage.getItem("NumeroSecundaria"),
      rol: "tutor area2",
    };

    const dataOlimpista = {
      Nombre: localStorage.getItem("NombreOlympian"),
      Apellido: localStorage.getItem("ApellidoOlympian"),
      Email: localStorage.getItem("EmailOlympian"),
      CarnetIdentidad: localStorage.getItem("CarnetIdentidadOlympian"),
      Curso: localStorage.getItem("CursoOlympian"),
      FechaNacimiento: localStorage.getItem("FechaNacimientoOlympian"),
      Colegio: localStorage.getItem("ColegioOlympian"),
      Departamento: localStorage.getItem("DepartamentoOlympian"),
      Provincia: localStorage.getItem("ProvinciaOlympian"),
    };

    const inscripcion = {
      Area: localStorage.getItem("AreaPrincipal"),
      Categoria: localStorage.getItem("CategoriaPrincipal"),
      AreaOpcional: localStorage.getItem("AreaSecundaria"),
      CategoriaOpcional: localStorage.getItem("CategoriaSecundaria"),
      estado: false,
    };

    try {
      if (idTutorInscriptor !== null)
        dataOlimpista.id_tutor = idTutorInscriptor;
      const resOlympian = await registerDataOlympian(dataOlimpista);
      const idOlimpista = resOlympian.data.data.id_olimpista;
      dataTutorResponsible.id_olimpista = idOlimpista;
      dataTutorLegal.id_olimpista = idOlimpista;
      inscripcion.id_olimpista = idOlimpista;
      let resTutorResponsible = null;

      if (idTutorInscriptor == null || idTutorInscriptor == "")
        resTutorResponsible = await setTutor(dataTutorResponsible);

      await setTutor(dataTutorLegal);
      let idTutorArea1 = null,
        idTutorArea2 = null;

      if (
        Object.values(dataTutorArea1).every(
          (valor) => valor !== null && valor !== ""
        )
      ) {
        dataTutorArea1.id_olimpista = idOlimpista;
        const res = await setTutor(dataTutorArea1);
        idTutorArea1 = res.data.tutorId;
      }
      if (
        Object.values(dataTutorArea2).every(
          (valor) => valor !== null && valor !== ""
        )
      ) {
        dataTutorArea2.id_olimpista = idOlimpista;
        const res = await setTutor(dataTutorArea2);
        idTutorArea2 = res.data.tutorId;
      }

      if (idTutorArea1) inscripcion.id_tutor1 = idTutorArea1;
      if (idTutorArea2) inscripcion.id_tutor2 = idTutorArea2;

      await setNewInscription(inscripcion);

      limpiarCamposLocalStorage();
      if (resTutorResponsible?.data?.tutorId != null) {
        localStorage.setItem(
          "tutorInscripcionId",
          resTutorResponsible.data.tutorId
        );
      }

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
