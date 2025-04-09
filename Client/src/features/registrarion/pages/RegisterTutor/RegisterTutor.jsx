//css
import "./RegisterTutor.css";

//components
import { Input } from "../../../../components/inputs/Input";
import { Select } from "../../../../components/inputs/Select";
import { NextPage } from "../../../../components/Buttons/NextPage";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { Validator } from "./ValidationRules";
import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";

//react
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";
import swal from "sweetalert";

//utils
import { tipoTutor } from "./DataOptions";

//api
import { setTutor, setContacto } from "../../../../api/inscription.api";

export const RegisterTutor = () => {
  // const [currentStep, setCurrentStep] = useState(2);
  // const totalSteps = 4;
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
    mode: "onChange",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = async (data) => {
    console.log(data);
    const dataContacto = {
      correo_contacto: data.Email_contacto,
      pertenece_correo: data.Pertenece_Email,
      numero_contacto: data.Numero_contacto,
      pertenece_numero: data.Pertenece_Numero,
      id_olimpista,
    };

    const dataTutor = {
      nombresTutor: data.Nombre,
      apellidosTutor: data.Apellido,
      tipoTutor: data.Tipo_Tutor,
      emailTutor: data.Email,
      telefono: data.Numero_Celular,
      carnetdeidentidad: data.Ci,
      id_olimpista,
    };

    console.log("el data contacto es", dataContacto);

    try {
      const resTutor = await setTutor(dataTutor);
      const resContacto = await setContacto(dataContacto);
      swal("Datos registrados correctamente");
      navigation("/listRegistered", data);
    } catch (error) {
      console.log(error);
      swal("Error al registrar los datos");
    }
  };

  return (
    <div className="container-form">
      {/* <ProgressBar currentStep={currentStep} totalSteps={totalSteps} /> */}
      <NavLink to={"/listRegistered"}>
        <IoArrowBackCircle className="btn-back" />
      </NavLink>
      <form className="container-form-inputs" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-2c">
          <h1>Registro de datos de tutor legal</h1>
        </div>

        {/* <div className="input-2c">
          <h2>Información de contacto</h2>
        </div> */}

        {/* <div className="input-2c">
          <h2>Datos de tutor legal</h2>
        </div> */}

        <div className="input-1c">
          <Input
            label={"Nombre(s)"}
            placeholder="Ingrese nombre(s) del tutor"
            mandatory="true"
            name="Nombre"
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
            register={register}
            validationRules={Validator.email}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Input
            label={"Carnet de identidad"}
            placeholder="Ingrese número de CI del tutor"
            mandatory="true"
            name="Ci"
            register={register}
            validationRules={Validator.ci}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Input
            label={"Correo electrónico de contacto"}
            placeholder="ejemplo@correo.com"
            mandatory="true"
            name="Email_contacto"
            register={register}
            validationRules={Validator.email}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Select
            label={"¿A quién pertenece el correo?"}
            placeholder="Seleccione una opción"
            mandatory="true"
            options={tipoTutor}
            name="Pertenece_Email"
            register={register}
            validationRules={Validator.pertenece_correo}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Input
            label={"Número de celular de contacto"}
            placeholder="Ingrese número de celular"
            mandatory="true"
            name="Numero_contacto"
            register={register}
            validationRules={Validator.numero}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Select
            label={"¿A quién pertenece el número?"}
            placeholder="Seleccione una opción"
            mandatory="true"
            options={tipoTutor}
            name="Pertenece_Numero"
            register={register}
            validationRules={Validator.pertenece_numero}
            errors={errors}
          />
        </div>

        {/* <div>
          <NextPage value="Atrás" to="/register" />
        </div> */}

        <div className="container-btn-next">
          <PrimaryButton type="submit" value="Registrar" />
        </div>
      </form>
    </div>
  );
};
