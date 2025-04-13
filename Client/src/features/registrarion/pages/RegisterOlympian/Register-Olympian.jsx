//css
import "./RegisterOlympian.css";

//components
import { Input } from "../../../../components/inputs/Input";
import { Select } from "../../../../components/inputs/Select";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { NextPage } from "../../../../components/Buttons/NextPage";

//react
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";
import { useNavigate, NavLink } from "react-router-dom";
import swal from "sweetalert";
import { IoArrowBackCircle } from "react-icons/io5";

//utils
import { Validator } from "./ValidationRules";
import { cursosBolivia, departamentosBolivia } from "./DataOptions";

//api
import { registerDataOlympian } from "../../../../api/inscription.api";

export const RegisterOlympian = () => {
  // const [currentStep, setCurrentStep] = useState(1);
  // const totalSteps = 4;
  const navigation = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    mode: "onChange", // Esto valida cada vez que cambias algo
  });

  const onSubmit = async (data) => {
    try {
      // data.id_tutor = 1;
      // await registerDataOlympian(data);
      // swal("Datos registrados correctamente");
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
          <h1>Registro de datos del Olimpista</h1>
        </div>

        {/* <div className="input-2c">
          <h2>Datos del postulante</h2>
        </div> */}

        <div className="input-1c">
          <Input
            label={"Nombre(s)"}
            placeholder="Ingrese nombre(s) del olimpista"
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
            placeholder="Ingrese apellido(s) del olimpista"
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
            placeholder="Ingrese la fecha de nacimiento del olimpista"
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
            placeholder="Ingrese número de CI del olimpista"
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
            placeholder="Ingrese la provincia"
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
        <div className="container-btn-back-olympian input-1c">
          <NextPage to={"/"} value="Cancelar" />
        </div>

        <div className="container-btn-next-olympian input-1c">
          <PrimaryButton type="submit" value="Siguiente" />
        </div>
      </form>
    </div>
  );
};
