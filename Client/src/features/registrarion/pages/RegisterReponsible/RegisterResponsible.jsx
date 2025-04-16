//css
import "./RegisterResponsible.css";

//components
import { Input } from "../../../../components/inputs/Input";
import { Select } from "../../../../components/inputs/Select";
import { Validator } from "./ValidationRules";
import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";
import { NextPage } from "../../../../components/Buttons/NextPage";

//react
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import swal from "sweetalert";

//utils
import { tipoTutor } from "./DataOptions";

export const RegisterResponsible = () => {
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
      Nombre: localStorage.getItem("NombreResponsible") || "",
      Apellido: localStorage.getItem("ApellidoResponsible") || "",
      Tipo_Tutor: localStorage.getItem("TipoTutorResponsible") || "",
      Numero_Celular: localStorage.getItem("NumeroResponsible") || "",
      Email: localStorage.getItem("EmailResponsible") || "",
      Ci: localStorage.getItem("CiResponsible") || "",
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
    localStorage.setItem("NombreResponsible", watchedNombre);
  }, [watchedNombre]);

  useEffect(() => {
    localStorage.setItem("ApellidoResponsible", watchedApellido);
  }, [watchedApellido]);

  useEffect(() => {
    localStorage.setItem("TipoTutorResponsible", watchedTipoTutor);
  }, [watchedTipoTutor]);

  useEffect(() => {
    localStorage.setItem("EmailResponsible", watchedEmail);
  }, [watchedEmail]);

  useEffect(() => {
    localStorage.setItem("NumeroResponsible", watchedTelefono);
  }, [watchedTelefono]);

  useEffect(() => {
    localStorage.setItem("CiResponsible", watchedCarnetIdentidad);
  }, [watchedCarnetIdentidad]);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("NombreResponsible");
      localStorage.removeItem("ApellidoResponsible");
      localStorage.removeItem("TipoTutorResponsible");
      localStorage.removeItem("NumeroResponsible");
      localStorage.removeItem("EmailResponsible");
      localStorage.removeItem("CiResponsible");
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const onSubmit = async (data) => {
    const dataResponsible = {
      nombresTutor: data.Nombre,
      apellidosTutor: data.Apellido,
      tipoTutor: data.Tipo_Tutor,
      emailTutor: data.Email,
      telefono: data.Numero_Celular,
      carnetdeidentidad: data.Ci,
      id_olimpista,
    };

    console.log(dataResponsible);
    console.log("Los datos son", data);

    try {
      navigation("/register/olympian", {
        state: { from: location.pathname },
        data,
      });
    } catch (error) {
      console.log(error);
      swal("Error al registrar los datos");
    }
  };

  return (
    <div className="container-form">
      {/* <ProgressBar currentStep={currentStep} totalSteps={totalSteps} /> */}
      <form className="container-form-inputs" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-2c">
          <h1>Datos de responsable de inscripción</h1>
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

        <div className="container-btn-back-responsible input-1c">
          <NextPage to={"/"} value="Cancelar" />
        </div>
        <div>
          <PrimaryButton type="submit" value="Siguiente" />
        </div>
      </form>
    </div>
  );
};
