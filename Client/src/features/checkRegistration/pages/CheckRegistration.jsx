import React from "react";
import HeaderProp from "../../homeUser/components/HeaderProp";
import "../Styles/CheckRegistration.css";
import imagen from "../../../assets/images/estadoInscripcion.png";
import { useCheckRegistrationForm } from "../hooks/useCheckRegistrationForm";

const CheckRegistration = () => {
  const {
    form,
    errors,
    loading,
    error,
    handleChange,
    handleSubmit,
  } = useCheckRegistrationForm();

  
  return (
    <div>
      <HeaderProp />
      <div className="consultaWrapper">
        <div className="imagenLado">
          <img src={imagen} alt="Ilustración educativa" />
        </div>
        <div className="formularioLado">
          <form onSubmit={handleSubmit} noValidate>
            <h2>Consultar Estado de Inscripción</h2>
            <div className="grupoFormulario">
              <label htmlFor="idCard">
                <i className="bi bi-person-vcard"></i> Carnet de Identidad <span className="campoRequerido">*</span>
              </label>
              <input
                type="text"
                id="idCard"
                name="idCard"
                value={form.idCard}
                onChange={handleChange}
                className={errors.idCard ? "entradaInvalida" : ""}
                required
                placeholder="Ingrese su carnet de identidad"
                aria-required="true"
              />
              {errors.idCard && <div className="mensajeError">{errors.idCard}</div>}
            </div>
            <div className="grupoFormulario">
              <label htmlFor="email">
                <i className="bi bi-envelope"></i> Correo Electrónico <span className="campoRequerido">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? "entradaInvalida" : ""}
                required
                placeholder="Ingrese su correo electrónico"
                aria-required="true"
              />
              {errors.email && (
                <div className="mensajeError">{errors.email}</div>
              )}
            </div>
            <div className="grupoFormulario">
              <label htmlFor="role">
                <i className="bi bi-person-badge"></i> Rol <span className="campoRequerido">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className={errors.role ? "entradaInvalida" : ""}
                required
                aria-required="true"
              >
                <option value="">Seleccione su rol</option>
                <option value="olimpista">Olimpista</option>
                <option value="tutor">Tutor/Responsable Inscripción</option>
              </select>
              {errors.role && <div className="mensajeError">{errors.role}</div>}
              <div className="mensajeAyuda">
                En caso de ser tutor legal, tutor de área o responsable de inscripción seleccione Tutor/Responsable Inscripción
              </div>
            </div>
            <button
              type="submit"
              className="botonEnviar"
              disabled={loading}
            >
              <i className="bi bi-search"></i>
              {loading ? "Consultando..." : "Consultar"}
            </button>
            {error && <div className="mensajeError">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckRegistration;
