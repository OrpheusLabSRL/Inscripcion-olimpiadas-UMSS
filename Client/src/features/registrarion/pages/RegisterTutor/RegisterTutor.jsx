//css
import "./RegisterTutor.css";

//components
import { Input } from "../../../../components/inputs/Input";
import { Select } from "../../../../components/inputs/Select";
import { Validator } from "./ValidationRules";
import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";

//react
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";
import swal from "sweetalert";

//utils
import { tipoTutor } from "./DataOptions";

export const RegisterTutor = () => {
  const navigation = useNavigate();
  const location = useLocation();
  const { id_olimpista } = location.state || {};
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
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = async (data) => {
    const dataTutor = {
      nombresTutor: data.Nombre,
      apellidosTutor: data.Apellido,
      tipoTutor: data.Tipo_Tutor,
      emailTutor: data.Email,
      telefono: data.Numero_Celular,
      carnetdeidentidad: data.Ci,
      id_olimpista,
    };

    try {
      swal("Datos registrados correctamente");
      navigation("/listRegistered", data);
    } catch (error) {
      console.log(error);
      swal("Error al registrar los datos");
    }
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

        <div className="container-btn-next">
          <PrimaryButton type="submit" value="Registrar" />
        </div>
      </form>
    </div>
  );
};
