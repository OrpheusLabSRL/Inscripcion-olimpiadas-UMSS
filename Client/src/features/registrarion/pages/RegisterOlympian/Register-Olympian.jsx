//css
import "./RegisterOlympian.css";

//components
import { Input } from "../../../../components/inputs/Input";
import { Select } from "../../../../components/inputs/Select";
import { NextPage } from "../../../../components/Buttons/NextPage";

//react
import { useForm } from "react-hook-form";
import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import swal from "sweetalert";
import { IoArrowBackCircle } from "react-icons/io5";
import { useEffect } from "react";

//utils
import { Validator } from "./ValidationRules";
import { cursosBolivia, departamentosBolivia } from "./DataOptions";

export const RegisterOlympian = () => {
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

  const onSubmit = async (data) => {
    try {
      navigation("/Register/OlympianArea", data);
    } catch (error) {
      console.log(error);
      swal("Error al registrar los datos");
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
        </div>

        <div className="input-1c">
          <Input
            label={"Nombre(s)"}
            placeholder="Ingrese nombre(s) del olimpista"
            mandatory="true"
            name="Nombre"
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
            value={watchedFechaNacimiento}
            onChange={(e) => setValue("FechaNacimiento", e.target.value)}
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
            value={watchedCarnetIdentidad}
            onChange={(e) => setValue("CarnetIdentidad", e.target.value)}
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
            value={watchedCurso}
            onChange={(e) => setValue("Curso", e.target.value)}
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
            value={watchedDepartamento}
            onChange={(e) => setValue("Departamento", e.target.value)}
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
            value={watchedProvincia}
            onChange={(e) => setValue("Provincia", e.target.value)}
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
