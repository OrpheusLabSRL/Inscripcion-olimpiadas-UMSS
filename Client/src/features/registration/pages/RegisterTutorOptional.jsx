//components
import { Input } from "../../../components/inputs/Input";
import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";
import { Validator } from "../utils/ValidationRules";
import { NextPage } from "../../../components/Buttons/NextPage";

//react
import { MdCleaningServices } from "react-icons/md";

//Hooks
import { useRegisterTutorOptional } from "../hooks/useRegisterTutorOptional";
import { useSessionStorageTutor } from "../hooks/useSessionStorageTutor";
import { useAutoFillTutorOptional } from "../hooks/useAutoFillTutorOptional";

export const RegisterTutorOptional = () => {
  const {
    cleanFlieds,
    onSubmit,
    watchedFields,
    handleSubmit,
    register,
    isReadOnly,
    setIsReadOnly,
    errors,
    location,
    area,
    setValue,
    backPage,
  } = useRegisterTutorOptional();

  const namesSessionElements =
    area == "AreaPrincipal"
      ? {
          nombre: "NombrePrincipal",
          apellido: "ApellidoPrincipal",
          email: "EmailPrincipal",
          telefono: "NumeroPrincipal",
          ci: "CiPrincipal",
        }
      : {
          nombre: "NombreSecundaria",
          apellido: "ApellidoSecundaria",
          email: "EmailSecundaria",
          telefono: "NumeroSecundaria",
          ci: "CiSecundaria",
        };

  useSessionStorageTutor(namesSessionElements, watchedFields, location);

  useAutoFillTutorOptional(
    watchedFields.carnetIdentidad,
    setValue,
    namesSessionElements,
    setIsReadOnly
  );

  return (
    <div className="container-form">
      <form className="container-form-inputs" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-2c">
          <h1>Registro de profesor de área</h1>
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
            placeholder="Ingrese número de CI del profesor"
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
            placeholder="Ingrese nombre(s) del profesor"
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
            placeholder="Ingrese apellido(s) del profesor"
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
            type="button"
            value="Anterior"
            to={"/register/olympian-area"}
            onClick={backPage}
            className="btn-back-register"
          />
          <PrimaryButton type="submit" value="Registrar" />
        </div>
      </form>
    </div>
  );
};
