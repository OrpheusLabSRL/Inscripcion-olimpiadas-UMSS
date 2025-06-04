//components
import { Input } from "../../../components/inputs/Input";
import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";
import { Validator } from "../utils/ValidationRules";
import { NextPage } from "../../../components/Buttons/NextPage";

//react
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { MdCleaningServices } from "react-icons/md";

//api
import { getPersonData } from "../../../api/inscription.api";

export const RegisterTutorOptional = () => {
  const [isReadOnly, setIsReadOnly] = useState({});
  const location = useLocation();
  const navigation = useNavigate();
  const { area } = location.state;
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      Nombre:
        area == "AreaPrincipal"
          ? sessionStorage.getItem("NombrePrincipal") || ""
          : sessionStorage.getItem("NombreSecundaria") || "",
      Apellido:
        area == "AreaPrincipal"
          ? sessionStorage.getItem("ApellidoPrincipal") || ""
          : sessionStorage.getItem("ApellidoSecundaria") || "",
      Numero_Celular:
        area == "AreaPrincipal"
          ? sessionStorage.getItem("NumeroPrincipal") || ""
          : sessionStorage.getItem("NumeroSecundaria") || "",
      Email:
        area == "AreaPrincipal"
          ? sessionStorage.getItem("EmailPrincipal") || ""
          : sessionStorage.getItem("EmailSecundaria") || "",
      Ci:
        area == "AreaPrincipal"
          ? sessionStorage.getItem("CiPrincipal") || ""
          : sessionStorage.getItem("CiSecundaria") || "",
    },
    mode: "onChange",
  });

  const watchedNombre = watch("Nombre");
  const watchedApellido = watch("Apellido");
  const watchedEmail = watch("Email");
  const watchedTelefono = watch("Numero_Celular");
  const watchedCarnetIdentidad = watch("Ci");

  useEffect(() => {
    sessionStorage.setItem("pantallaActualRegistro", location.pathname);
  }, []);

  useEffect(() => {
    area == "AreaPrincipal"
      ? sessionStorage.setItem("NombrePrincipal", watchedNombre)
      : sessionStorage.setItem("NombreSecundaria", watchedNombre);
  }, [watchedNombre]);

  useEffect(() => {
    area == "AreaPrincipal"
      ? sessionStorage.setItem("ApellidoPrincipal", watchedApellido)
      : sessionStorage.setItem("ApellidoSecundaria", watchedApellido);
  }, [watchedApellido]);

  useEffect(() => {
    area == "AreaPrincipal"
      ? sessionStorage.setItem("EmailPrincipal", watchedEmail)
      : sessionStorage.setItem("EmailSecundaria", watchedEmail);
  }, [watchedEmail]);

  useEffect(() => {
    area == "AreaPrincipal"
      ? sessionStorage.setItem("NumeroPrincipal", watchedTelefono)
      : sessionStorage.setItem("NumeroSecundaria", watchedTelefono);
  }, [watchedTelefono]);

  useEffect(() => {
    area == "AreaPrincipal"
      ? sessionStorage.setItem("CiPrincipal", watchedCarnetIdentidad)
      : sessionStorage.setItem("CiSecundaria", watchedCarnetIdentidad);
    if (watchedCarnetIdentidad.length >= 7) {
      autofill();
    }
  }, [watchedCarnetIdentidad]);

  const onSubmit = async (data) => {
    area == "AreaPrincipal"
      ? sessionStorage.setItem("TutorArea1", true)
      : sessionStorage.setItem("TutorArea2", true);
    navigation("/register/olympian-area");
  };

  const backPage = () => {
    const campos = {
      nombre: watchedNombre,
      apellido: watchedApellido,
      email: watchedEmail,
      telefono: watchedTelefono,
      ci: watchedCarnetIdentidad,
    };

    const algunCampoVacio = Object.values(campos).some(
      (valor) => !valor || valor.trim() === ""
    );

    if (algunCampoVacio) {
      area === "AreaPrincipal"
        ? sessionStorage.removeItem("TutorArea1")
        : sessionStorage.removeItem("TutorArea2");
    }
  };

  const autofill = async () => {
    try {
      const ci =
        area == "AreaPrincipal"
          ? sessionStorage.getItem("CiPrincipal", watchedCarnetIdentidad)
          : sessionStorage.getItem("CiSecundaria", watchedCarnetIdentidad);
      const personData = await getPersonData(ci);
      if (personData.data.data.nombre) {
        setValue("Nombre", personData.data.data.nombre);
        setValue("Apellido", personData.data.data.apellido);
        setValue("Email", personData.data.data.correoElectronico);
        setIsReadOnly((prev) => ({
          ...prev,
          Ci: true,
          Nombre: true,
          Apellido: true,
          Email: true,
        }));
      }

      if (personData.data.data.telefono) {
        setValue("Numero_Celular", personData.data.data.telefono);
        setIsReadOnly((prev) => ({
          ...prev,
          Numero_Celular: true,
        }));
      }
    } catch (error) {
      const ciResponsible = sessionStorage.getItem("CiResponsible") || "";
      const ciOlympian =
        sessionStorage.getItem("CarnetIdentidadOlympian") || "";
      const ciProfesor =
        area == "AreaPrincipal"
          ? sessionStorage.getItem("CiPrincipal") || ""
          : sessionStorage.getItem("CiSecundaria") || "";

      if (ciResponsible == ciProfesor) {
        setValue("Nombre", sessionStorage.getItem("NombreResponsible"));
        setValue("Apellido", sessionStorage.getItem("ApellidoResponsible"));
        setValue("Email", sessionStorage.getItem("EmailResponsible"));
        setValue("Numero_Celular", sessionStorage.getItem("NumeroResponsible"));

        setIsReadOnly((prev) => ({
          ...prev,
          Ci: true,
          Nombre: true,
          Apellido: true,
          Email: true,
          Numero_Celular: true,
        }));
      } else if (ciProfesor == ciOlympian) {
        setValue("Nombre", sessionStorage.getItem("NombreOlympian"));
        setValue("Apellido", sessionStorage.getItem("ApellidoOlympian"));
        setValue("Email", sessionStorage.getItem("EmailOlympian"));
        setIsReadOnly((prev) => ({
          ...prev,
          Ci: true,
          Nombre: true,
          Apellido: true,
          Email: true,
        }));
      }
    }
  };

  const cleanFlieds = () => {
    setValue("Nombre", "");
    setValue("Apellido", "");
    setValue("Tipo_Tutor", "");
    setValue("Numero_Celular", "");
    setValue("Email", "");
    setValue("Ci", "");

    setIsReadOnly({});
  };

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
            placeholder="Ingrese nombre(s) del profesor"
            mandatory="true"
            name="Nombre"
            isReadOnly={isReadOnly}
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
            placeholder="Ingrese apellido(s) del profesor"
            mandatory="true"
            name="Apellido"
            isReadOnly={isReadOnly}
            value={watchedApellido}
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
            value={watchedTelefono}
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
            value={watchedEmail}
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
