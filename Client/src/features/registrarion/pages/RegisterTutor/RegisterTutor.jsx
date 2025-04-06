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
import { useNavigate } from "react-router-dom";

export const RegisterTutor = () => {
  const [currentStep, setCurrentStep] = useState(2);
  const totalSteps = 4;
  const navigation = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = async (data) => {
    navigation("/register/tutor", data);
  };

  return (
    <div className="container-form">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <form className="container-form-inputs" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-2c">
          <h1>Datos de contacto y tutores</h1>
        </div>

        <div className="input-2c">
          <h2>Información de contacto</h2>
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
            name="Pertenece_Numero"
            register={register}
            validationRules={Validator.pertenece_numero}
            errors={errors}
          />
        </div>

        <div className="input-2c">
          <h2>Datos del tutor</h2>
        </div>

        <div className="input-1c">
          <Input
            label={"Nombre"}
            placeholder="Ingrese nombre"
            mandatory="true"
            name="Nombre"
            register={register}
            validationRules={Validator.nombre}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Input
            label={"Apellido"}
            placeholder="Ingrese apellido"
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
            placeholder="Ingrese CI"
            mandatory="true"
            name="Ci"
            register={register}
            validationRules={Validator.ci}
            errors={errors}
          />
        </div>

        <div>
          <NextPage value="Atrás" to="/register" />
        </div>

        <div className="container-btn-next">
          <PrimaryButton type="submit" value="Siguiente" />
        </div>
      </form>
    </div>
  );
};
