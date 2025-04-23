//css
import "../Styles/RegisterOlympian.css";

//components
import { Input } from "../../../components/inputs/Input";
import { Select } from "../../../components/inputs/Select";
import { NextPage } from "../../../components/Buttons/NextPage";

//react
import { useForm } from "react-hook-form";
import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import swal from "sweetalert";
import { IoArrowBackCircle } from "react-icons/io5";
import { useEffect, useState } from "react";

//api
import {
  getOlimpistaEnable,
  getPersonData,
} from "../../../api/inscription.api";

//utils
import { Validator } from "../utils/ValidationRules";
import {
  cursosBolivia,
  departamentosBolivia,
  provinciasPorDepartamento,
} from "../utils/DataOptions";

export const RegisterOlympian = () => {
  const [isReadOnly, setIsReadOnly] = useState({});
  const [provinciasFiltradas, setProvinciasFiltradas] = useState(() => {
    const stored = localStorage.getItem("provinciasFiltradas");
    return stored ? JSON.parse(stored) : null;
  });

  const navigation = useNavigate();
  const location = useLocation();
  const previousPath = location.state?.from;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      Nombre: localStorage.getItem("NombreOlympian") || "",
      Apellido: localStorage.getItem("ApellidoOlympian") || "",
      FechaNacimiento: localStorage.getItem("FechaNacimientoOlympian") || "",
      CarnetIdentidad: localStorage.getItem("CarnetIdentidadOlympian") || "",
      Colegio: localStorage.getItem("ColegioOlympian") || "",
      Curso: localStorage.getItem("CursoOlympian") || "",
      Departamento: localStorage.getItem("DepartamentoOlympian") || "",
      Provincia: localStorage.getItem("ProvinciaOlympian") || "",
      Email: localStorage.getItem("EmailOlympian") || "",
    },
    mode: "onChange",
  });

  const watchedNombre = watch("Nombre");
  const watchedApellido = watch("Apellido");
  const watchedFechaNacimiento = watch("FechaNacimiento");
  const watchedCarnetIdentidad = watch("CarnetIdentidad");
  const watchedColegio = watch("Colegio");
  const watchedCurso = watch("Curso");
  const watchedDepartamento = watch("Departamento");
  const watchedProvincia = watch("Provincia");
  const watchedEmail = watch("Email");

  useEffect(() => {
    localStorage.setItem("NombreOlympian", watchedNombre);
  }, [watchedNombre]);

  useEffect(() => {
    localStorage.setItem("ApellidoOlympian", watchedApellido);
  }, [watchedApellido]);

  useEffect(() => {
    localStorage.setItem("FechaNacimientoOlympian", watchedFechaNacimiento);
  }, [watchedFechaNacimiento]);

  useEffect(() => {
    localStorage.setItem("CarnetIdentidadOlympian", watchedCarnetIdentidad);
  }, [watchedCarnetIdentidad]);

  useEffect(() => {
    localStorage.setItem("ColegioOlympian", watchedColegio);
  }, [watchedColegio]);

  useEffect(() => {
    localStorage.setItem("CursoOlympian", watchedCurso);
  }, [watchedCurso]);

  useEffect(() => {
    localStorage.setItem("DepartamentoOlympian", watchedDepartamento);
  }, [watchedDepartamento]);

  useEffect(() => {
    localStorage.setItem("ProvinciaOlympian", watchedProvincia);
  }, [watchedProvincia]);

  useEffect(() => {
    localStorage.setItem("EmailOlympian", watchedEmail);
  }, [watchedEmail]);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("NombreOlympian");
      localStorage.removeItem("ApellidoOlympian");
      localStorage.removeItem("FechaNacimientoOlympian");
      localStorage.removeItem("CarnetIdentidadOlympian");
      localStorage.removeItem("ColegioOlympian");
      localStorage.removeItem("CursoOlympian");
      localStorage.removeItem("DepartamentoOlympian");
      localStorage.removeItem("ProvinciaOlympian");
      localStorage.removeItem("EmailOlympian");
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const onSelectDepartamento = (e) => {
    const select = e.target;
    const selectedOption = select.options[select.selectedIndex];
    const label = selectedOption.text;

    setValue("Departamento", e.target.value);
    const provincias = provinciasPorDepartamento[label] || [];
    setProvinciasFiltradas(provincias);
    localStorage.setItem("provinciasFiltradas", JSON.stringify(provincias));
  };

  const autofill = async () => {
    try {
      const personData = await getPersonData(
        localStorage.getItem("CarnetIdentidadOlympian")
      );
      if (personData.data.data.nombre) {
        setValue("Nombre", personData.data.data.nombre);
        setValue("Apellido", personData.data.data.apellido);
        setValue("Email", personData.data.data.correoElectronico);
        setIsReadOnly((prev) => ({
          ...prev,
          Nombre: true,
          Apellido: true,
          Email: true,
        }));
      }

      if (personData.data.data.fechaNacimiento) {
        setValue("FechaNacimiento", personData.data.data.fechaNacimiento);
        setValue("Departamento", personData.data.data.departamento);
        setValue("Provincia", personData.data.data.provincia);
        setValue("Colegio", personData.data.data.colegio);
        setValue("Curso", personData.data.data.curso);
        setIsReadOnly((prev) => ({
          ...prev,
          FechaNacimiento: true,
          Departamento: true,
          Provincia: true,
          Colegio: true,
          Curso: true,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    try {
      await getOlimpistaEnable(localStorage.getItem("CarnetIdentidadOlympian"));
      navigation("/Register/OlympianArea", data);
    } catch (error) {
      swal("Error", error.response.data.message, "error");
    }
  };

  return (
    <div className="container-form">
      <NavLink to={previousPath}>
        <IoArrowBackCircle className="btn-back" />
      </NavLink>
      <form className="container-form-inputs" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-2c">
          <h1>Registro de datos del Olimpista</h1>
          <h5 className="message-recomendation">
            Si ya tiene datos registrados, ingrese su CI y presione el botón
            "Autocompletar" para llenar automáticamente los campos.
          </h5>
        </div>

        <div className="input-1c">
          <Input
            label={"Carnet de identidad"}
            placeholder="Ingrese número de CI del olimpista"
            mandatory="true"
            name="CarnetIdentidad"
            isReadOnly={isReadOnly}
            autofill={autofill}
            value={watchedCarnetIdentidad}
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
            placeholder="Ingrese apellido(s) del olimpista"
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
            label={"Fecha de nacimiento"}
            placeholder="Ingrese la fecha de nacimiento del olimpista"
            type="date"
            mandatory="true"
            name="FechaNacimiento"
            isReadOnly={isReadOnly}
            value={watchedFechaNacimiento}
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
            value={watchedDepartamento}
            onChange={onSelectDepartamento}
            options={departamentosBolivia}
            register={register}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Select
            label={"Provincia"}
            placeholder="Ingrese la provincia"
            mandatory="true"
            name="Provincia"
            isReadOnly={isReadOnly}
            value={watchedProvincia}
            onChange={(e) => setValue("Provincia", e.target.value)}
            options={provinciasFiltradas}
            register={register}
            validationRules={Validator.provincia}
            errors={errors}
          />
        </div>

        <div className="input-1c">
          <Input
            label={"Colegio"}
            placeholder="Nombre del Colegio"
            mandatory="true"
            name="Colegio"
            isReadOnly={isReadOnly}
            value={watchedColegio}
            onChange={(e) => setValue("Colegio", e.target.value)}
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
            value={watchedCurso}
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
            value={watchedEmail}
            onChange={(e) => setValue("Email", e.target.value)}
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
