//css
import "./RegisterOlympian.css";

//components
import { Input } from "../../../../components/inputs/Input";
import { Select } from "../../../../components/inputs/Select";
import ProgressBar from "../../components/ProgressBar/ProgressBar";

//react
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";
import { useNavigate } from "react-router-dom";

//utils
import { Validator } from "./ValidationRules";
import {
  cursosBolivia,
  departamentosBolivia,
  areasDeInteres,
  categorias,
} from "./DataOptions";

export const RegisterOlympian = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const navigation = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({});

  const onSubmit = async (data) => {
    navigation("/register/tutor", data);
  };

  return (
    <div className="container-form">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <form className="container-form-inputs" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-2c">
          <h1>Inscripción Olimpiada Oh! SanSi</h1>
        </div>

        <div className="input-2c">
          <h2>Datos del postulante</h2>
        </div>

        <div className="input-1c">
          <Input
            label={"Nombre"}
            placeholder="Ingrese sus nombres"
            mandatory="true"
            name="Nombre"
            register={register}
            validationRules={Validator.nombre}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Input
            label={"Apellidos"}
            placeholder="Ingrese sus apellidos"
            mandatory="true"
            name="Apellido"
            register={register}
            validationRules={Validator.apellido}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Input
            label={"Fecha de nacimiento"}
            placeholder="Ingrese sus apellidos"
            type="date"
            mandatory="true"
            name="FechaNacimiento"
            register={register}
            validationRules={Validator.fechaNacimiento}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Input
            label={"Carnet de identidad"}
            placeholder="Ingrese su CI"
            mandatory="true"
            name="CarnetIdentidad"
            register={register}
            validationRules={Validator.ci}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Input
            label={"Colegio"}
            placeholder="Nombre del Colegio"
            mandatory="true"
            name="Colegio"
            register={register}
            validationRules={Validator.colegio}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Select
            label={"Curso"}
            placeholder="Seleccione un curso"
            mandatory="true"
            name="Curso"
            options={cursosBolivia}
            register={register}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Select
            label={"Departamento"}
            placeholder="Seleccione un departamento"
            mandatory="true"
            name="Departamento"
            options={departamentosBolivia}
            register={register}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Input
            label={"Provincia"}
            placeholder="Ingrese su provincia"
            mandatory="true"
            name="Provincia"
            register={register}
            validationRules={Validator.provincia}
            errors={errors}
          />
        </div>

        <div className="input-2c">
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

        <div className="input-2c">
          <h2>Areas y categorias de interes</h2>
        </div>

        <div className="input-1c">
          <Select
            label={"Area de Interes"}
            placeholder="Seleccione un area"
            mandatory="true"
            name="Area"
            options={areasDeInteres}
            register={register}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Select
            label={"Categoria de Interes"}
            placeholder="Seleccione una categoria"
            mandatory="true"
            name="Categoria"
            options={categorias}
            register={register}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Select
            label={"Segunda Area de Interes"}
            placeholder="Seleccione un area"
            options={areasDeInteres}
          />
        </div>

        <div className="input-1c">
          <Select
            label={"Categoria de Interes"}
            placeholder="Seleccione una categoria"
            options={categorias}
          />
        </div>

        <div className="container-btn-next">
          <PrimaryButton type="submit" value="Siguiente" />
        </div>
      </form>
    </div>
  );
};
