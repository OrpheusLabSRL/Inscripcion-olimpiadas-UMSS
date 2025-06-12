//css
import "../Styles/RegisterOlympian.css";

//components
import { Input } from "../../../components/inputs/Input";
import { Select } from "../../../components/inputs/Select";
import { NextPage } from "../../../components/Buttons/NextPage";
import ProgressBar from "../components/ProgressBar/ProgressBar";

//react
import React, { useMemo } from "react";
import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";
import { useState } from "react";
import { MdCleaningServices } from "react-icons/md";

//utils
import { Validator } from "../utils/ValidationRules";
import {
  cursosBolivia,
  departamentosBolivia,
  municipioPorDepartamento,
  colegioPorMunicipio,
} from "../utils/DataOptions";

//Hooks
import { useRegisterOlympian } from "../hooks/useRegisterOlympian";
import { useAutoFillOlympian } from "../hooks/useAutoFillOlympian";
import { useSessionStorageOlympian } from "../hooks/useSessionStorageOlympian";

export const RegisterOlympian = () => {
  const [municipiosFiltradas, setMunicipiosFiltradas] = useState(() => {
    const stored = sessionStorage.getItem("municipiosFiltradas");
    return stored ? JSON.parse(stored) : null;
  });
  const [colegiosFiltradas, setColegiosFiltradas] = useState(() => {
    const stored = sessionStorage.getItem("colegiosFiltradas");
    return stored ? JSON.parse(stored) : null;
  });

  const {
    currentStep,
    totalSteps,
    isReadOnly,
    setIsReadOnly,
    location,
    previousPath,
    register,
    handleSubmit,
    errors,
    setValue,
    watchedFields,
    cleanFlieds,
    cancelInscription,
    onSubmit,
  } = useRegisterOlympian();

  useAutoFillOlympian(
    watchedFields.carnetIdentidad,
    setValue,
    setIsReadOnly,
    setMunicipiosFiltradas,
    setColegiosFiltradas
  );

  useSessionStorageOlympian(watchedFields, location);

  const onSelectDepartamento = (e) => {
    const select = e.target;
    const selectedOption = select.options[select.selectedIndex];
    const label = selectedOption.text;

    setValue("Departamento", e.target.value);
    const municipios = municipioPorDepartamento[label] || [];
    setMunicipiosFiltradas(municipios);
    sessionStorage.setItem("municipiosFiltradas", JSON.stringify(municipios));
  };

  const onSelectMunicipio = (e) => {
    const select = e.target;
    const selectedOption = select.options[select.selectedIndex];
    const label = selectedOption.text;
    setValue("Municipio", e.target.value);
    const colegios = colegioPorMunicipio[label] || [];
    setColegiosFiltradas(colegios);
    sessionStorage.setItem("colegiosFiltradas", JSON.stringify(colegios));
  };

  const titleOlimpian = useMemo(() => {
    const dataOlimpian = JSON.parse(sessionStorage.getItem("OlympicData"));
    return `${dataOlimpian.nombreOlimpiada} versión ${dataOlimpian.version}`;
  }, []);

  return (
    <div className="container-form">
      <h1 className="title-register">{titleOlimpian}</h1>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <form
        className="container-form-inputs"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div className="input-2c">
          <h2>Registro de datos del Olimpista</h2>
          <h5 className="message-recomendation">
            Si ya tiene datos registrados, ingrese su CI y se llenara
            automáticamente los campos.
          </h5>
          <div className="container-clean-fields">
            <p>Limpiar campos</p>
            <MdCleaningServices
              className="icon-clean-fields"
              onClick={cleanFlieds}
            />
          </div>
        </div>

        <div className="input-1c">
          <Input
            label={"Carnet de identidad"}
            placeholder="Ingrese número de CI del olimpista"
            mandatory="true"
            name="CarnetIdentidad"
            isReadOnly={isReadOnly}
            value={watchedFields.carnetIdentidad}
            onChange={(e) => setValue("CarnetIdentidad", e.target.value)}
            register={register}
            validationRules={Validator.ci}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Input
            label={"Nombre(s)"}
            placeholder="Ingrese nombre(s) del olimpista"
            mandatory="true"
            name="Nombre"
            isReadOnly={isReadOnly}
            value={watchedFields.nombre}
            onChange={(e) => setValue("Nombre", e.target.value)}
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
            isReadOnly={isReadOnly}
            value={watchedFields.apellido}
            onChange={(e) => setValue("Apellido", e.target.value)}
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
            isReadOnly={isReadOnly}
            value={watchedFields.fechaNacimiento}
            onChange={(e) => setValue("FechaNacimiento", e.target.value)}
            register={register}
            validationRules={Validator.fechaNacimiento}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Select
            label={"Departamento"}
            placeholder="Seleccione un departamento"
            mandatory="true"
            name="Departamento"
            isReadOnly={isReadOnly}
            value={watchedFields.departamento}
            onChange={onSelectDepartamento}
            options={departamentosBolivia}
            register={register}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Select
            label={"Municipio"}
            placeholder="Ingrese el municipio"
            mandatory="true"
            name="Municipio"
            isReadOnly={isReadOnly}
            value={watchedFields.municipio}
            onChange={onSelectMunicipio}
            options={municipiosFiltradas}
            register={register}
            validationRules={Validator.municipio}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Select
            label={"Colegio"}
            placeholder="Nombre del Colegio"
            mandatory="true"
            name="Colegio"
            isReadOnly={isReadOnly}
            value={watchedFields.colegio}
            onChange={(e) => setValue("Colegio", e.target.value)}
            options={colegiosFiltradas}
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
            isReadOnly={isReadOnly}
            value={watchedFields.curso}
            onChange={(e) => setValue("Curso", e.target.value)}
            options={cursosBolivia}
            register={register}
            errors={errors}
          />
        </div>

        <div className="input-2c">
          <Input
            label={"Correo Electronico"}
            placeholder="ejemplo@correo.com"
            mandatory="true"
            name="Email"
            isReadOnly={isReadOnly}
            value={watchedFields.email}
            onChange={(e) => setValue("Email", e.target.value)}
            register={register}
            validationRules={Validator.email}
            errors={errors}
          />
        </div>
        <div className="container-btn-next-back input-2c">
          <NextPage
            type="button"
            value="Anterior"
            to={previousPath}
            className="btn-back-register"
          />
          <NextPage
            value="Cancelar"
            onClick={cancelInscription}
            className="btn-cancel-register"
          />
          <PrimaryButton type="submit" value="Siguiente" />
        </div>
      </form>
    </div>
  );
};
