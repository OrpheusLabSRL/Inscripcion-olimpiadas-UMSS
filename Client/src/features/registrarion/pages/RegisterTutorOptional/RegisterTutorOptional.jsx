//components
import { Input } from "../../../../components/inputs/Input";
import { Select } from "../../../../components/inputs/Select";
import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";
import { Validator } from "./ValidationRules";

//react
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";

//utils
import { tipoTutor } from "./DataOptions";

export const RegisterTutorOptional = () => {
  const location = useLocation();
  const navigation = useNavigate();
  const { area } = location.state;
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      Nombre:
        area == "AreaPrincipal"
          ? localStorage.getItem("NombrePrincipal") || ""
          : localStorage.getItem("NombreSecundaria") || "",
      Apellido:
        area == "AreaPrincipal"
          ? localStorage.getItem("ApellidoPrincipal") || ""
          : localStorage.getItem("ApellidoSecundaria") || "",
      Tipo_Tutor:
        area == "AreaPrincipal"
          ? localStorage.getItem("TipoTutorPrincipal") || ""
          : localStorage.getItem("TipoTutorSecundaria") || "",
      Numero_Celular:
        area == "AreaPrincipal"
          ? localStorage.getItem("NumeroPrincipal") || ""
          : localStorage.getItem("NumeroSecundaria") || "",
      Email:
        area == "AreaPrincipal"
          ? localStorage.getItem("EmailPrincipal") || ""
          : localStorage.getItem("EmailSecundaria") || "",
      Ci:
        area == "AreaPrincipal"
          ? localStorage.getItem("CiPrincipal") || ""
          : localStorage.getItem("CiSecundaria") || "",
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
    area == "AreaPrincipal"
      ? localStorage.setItem("NombrePrincipal", watchedNombre)
      : localStorage.setItem("NombreSecundaria", watchedNombre);
  }, [watchedNombre]);

  useEffect(() => {
    area == "AreaPrincipal"
      ? localStorage.setItem("ApellidoPrincipal", watchedApellido)
      : localStorage.setItem("ApellidoSecundaria", watchedApellido);
  }, [watchedApellido]);

  useEffect(() => {
    area == "AreaPrincipal"
      ? localStorage.setItem("TipoTutorPrincipal", watchedTipoTutor)
      : localStorage.setItem("TipoTutorSecundaria", watchedTipoTutor);
  }, [watchedTipoTutor]);

  useEffect(() => {
    area == "AreaPrincipal"
      ? localStorage.setItem("EmailPrincipal", watchedEmail)
      : localStorage.setItem("EmailSecundaria", watchedEmail);
  }, [watchedEmail]);

  useEffect(() => {
    area == "AreaPrincipal"
      ? localStorage.setItem("NumeroPrincipal", watchedTelefono)
      : localStorage.setItem("NumeroSecundaria", watchedTelefono);
  }, [watchedTelefono]);

  useEffect(() => {
    area == "AreaPrincipal"
      ? localStorage.setItem("CiPrincipal", watchedCarnetIdentidad)
      : localStorage.setItem("CiSecundaria", watchedCarnetIdentidad);
  }, [watchedCarnetIdentidad]);

  const onSubmit = async (data) => {
    area == "AreaPrincipal"
      ? localStorage.setItem("TutorArea1", true)
      : localStorage.setItem("TutorArea2", true);
    navigation("/Register/OlympianArea");
  };

  const backPage = () => {
    const campos = {
      nombre: watchedNombre,
      apellido: watchedApellido,
      tipoTutor: watchedTipoTutor,
      email: watchedEmail,
      telefono: watchedTelefono,
      ci: watchedCarnetIdentidad,
    };

    const algunCampoVacio = Object.values(campos).some(
      (valor) => !valor || valor.trim() === ""
    );

    if (algunCampoVacio) {
      area === "AreaPrincipal"
        ? localStorage.removeItem("TutorArea1")
        : localStorage.removeItem("TutorArea2");
    }
  };

  return (
    <div className="container-form">
      <NavLink to={"/Register/OlympianArea"} onClick={backPage}>
        <IoArrowBackCircle className="btn-back" />
      </NavLink>
      <form className="container-form-inputs" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-2c">
          <h1>Registro de datos de tutor de área</h1>
        </div>

        <div className="input-1c">
          <Input
            label={"Carnet de identidad"}
            placeholder="Ingrese número de CI del tutor"
            mandatory="true"
            name="Ci"
            value={watchedCarnetIdentidad}
            onChange={(e) => setValue("Ci", e.target.value)}
            s
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

        <div className="container-btn-next">
          <PrimaryButton type="submit" value="Registrar" />
        </div>
      </form>
    </div>
  );
};
