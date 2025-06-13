//css
import "../Styles/RegisterResponsible.css";

//components
import { Input } from "../../../components/inputs/Input";
import { Validator } from "../utils/ValidationRules";
import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";
import { NextPage } from "../../../components/Buttons/NextPage";
import ProgressBar from "../components/ProgressBar/ProgressBar";

//react
import { useMemo } from "react";
import { MdCleaningServices } from "react-icons/md";

//hooks
import { useRegisterResponsible } from "../hooks/useRegisterResponsible";
import { useAutoFillResponsible } from "../hooks/useAutoFillResponsible";
import { useSessionStorageTutor } from "../hooks/useSessionStorageTutor";

export const RegisterResponsible = () => {
  const {
    isReadOnly,
    setIsReadOnly,
    currentStep,
    totalSteps,
    setIsTutorResponsible,
    location,
    manual,
    register,
    handleSubmit,
    errors,
    setValue,
    watchedFields,
    cleanFields,
    cancelInscription,
    onSubmit,
  } = useRegisterResponsible();

  useAutoFillResponsible(
    watchedFields.carnetIdentidad,
    setValue,
    setIsReadOnly,
    setIsTutorResponsible
  );

  useSessionStorageTutor(
    {
      nombre: "NombreResponsible",
      apellido: "ApellidoResponsible",
      email: "EmailResponsible",
      telefono: "NumeroResponsible",
    },
    watchedFields,
    location
  );

  const titleOlimpian = useMemo(() => {
    const dataOlimpian = JSON.parse(sessionStorage.getItem("OlympicData"));
    return `${dataOlimpian.nombreOlimpiada} versión ${dataOlimpian.version}`;
  }, []);

  return (
    <div className="container-form">
      <h1 className="title-register">{titleOlimpian}</h1>
      {manual === "true" && (
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      )}
      <form
        className="container-form-inputs"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div className="input-2c">
          <h2>Datos de responsable de inscripción</h2>
          <h5 className="message-recomendation">
            Si ya tiene datos registrados, ingrese su CI y se llenara
            automáticamente los campos.
          </h5>
          <div className="container-clean-fields">
            <p>Limpiar campos</p>
            <MdCleaningServices
              className="icon-clean-fields"
              onClick={cleanFields}
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
            value="Cancelar"
            onClick={cancelInscription}
            className="btn-back-register"
          />
          <PrimaryButton type="submit" value="Siguiente" />
        </div>
      </form>
    </div>
  );
};
