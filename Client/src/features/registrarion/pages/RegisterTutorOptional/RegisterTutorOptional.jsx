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
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    console.log(data);
  };
  return (
    <div className="container-form">
      <NavLink to={"/Register/OlympianArea"}>
        <IoArrowBackCircle className="btn-back" />
      </NavLink>
      <form className="container-form-inputs" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-2c">
          <h1>Registro de datos de tutor de área</h1>
        </div>

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

        <div className="container-btn-next">
          <PrimaryButton type="submit" value="Registrar" />
        </div>
      </form>
    </div>
  );
};
