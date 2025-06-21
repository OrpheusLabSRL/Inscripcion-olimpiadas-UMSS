//css
import "../Styles/RegisterTutor.css";

//components
import { Input } from "../../../components/inputs/Input";
import { Select } from "../../../components/inputs/Select";
import { Validator } from "../utils/ValidationRules";
import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";
import { NextPage } from "../../../components/Buttons/NextPage";
import ProgressBar from "../components/ProgressBar/ProgressBar";

//react
import { useMemo } from "react";
import { MdCleaningServices } from "react-icons/md";

//Hooks
import { useRegisterTutor } from "../hooks/useRegisterTutor";
import { useSessionStorageTutor } from "../hooks/useSessionStorageTutor";
import { useAutoFillTutor } from "../hooks/useAutoFillTutor";

export const RegisterTutor = () => {
  const {
    totalSteps,
    currentStep,
    isReadOnly,
    tipoTutor,
    location,
    register,
    handleSubmit,
    errors,
    watchedFields,
    onSubmit,
    cleanFlieds,
    cancelInscription,
    setValue,
    setIsReadOnly,
    setTipoTutor,
    clearErrors,
  } = useRegisterTutor();

  useSessionStorageTutor(
    {
      nombre: "NombreLegal",
      apellido: "ApellidoLegal",
      tipoTutor: "TipoTutorLegal",
      email: "EmailLegal",
      telefono: "NumeroLegal",
      ci: "CiLegal",
    },
    watchedFields,
    location
  );

  useAutoFillTutor(
    watchedFields.carnetIdentidad,
    setValue,
    setIsReadOnly,
    setTipoTutor,
    tipoTutor,
    clearErrors
  );

  const titleOlimpian = useMemo(() => {
    const dataOlimpian = JSON.parse(sessionStorage.getItem("OlympicData"));
    return `${dataOlimpian.nombreOlimpiada} versión ${dataOlimpian.version}`;
  }, []);

  return (
    <div className="container-form">
      <h1 className="title-register">{titleOlimpian}</h1>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <form className="container-form-inputs" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-2c">
          <h2>Registro de datos de tutor legal</h2>
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
            placeholder="Ingrese número de CI del tutor"
            mandatory="true"
            name="Ci"
            isReadOnly={isReadOnly}
            value={watchedFields.carnetIdentidad}
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
            placeholder="Ingrese apellido(s) del tutor"
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
          <Select
            label={"Tipo de tutor"}
            placeholder="Seleccione tipo"
            mandatory="true"
            options={tipoTutor}
            name="Tipo_Tutor"
            isReadOnly={isReadOnly}
            value={watchedFields.tipoTutor}
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
            isReadOnly={isReadOnly}
            value={watchedFields.telefono}
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
            to={"/register/olympian-area"}
            className="btn-back-register"
          />
          <NextPage
            value="Cancelar"
            onClick={cancelInscription}
            className="btn-cancel-register"
          />
          <PrimaryButton type="submit" value="Registrar" />
        </div>
      </form>
    </div>
  );
};
