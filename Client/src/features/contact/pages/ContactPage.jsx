import React from "react";
import HeaderProp from "../../homeUser/components/HeaderProp";
import "../Styles/ContactPage.css";
import { useContactForm } from "../hooks/useContactForm";

const ContactPage = () => {
  const {
    form,
    errors,
    touched,
    submitError,
    submitSuccess,
    loading,
    handleChange,
    handleBlur,
    handleSubmit,
    getInputClass,
  } = useContactForm();

  return (
    <div>
      <HeaderProp />
      <div className="contactContainer">
        <div className="contactSidebar">
          <div className="contactInfo">
            <div className="infoItem">
              <div className="infoContent">
                <h3> <i className="bi bi-envelope-fill"></i> Escríbenos</h3>
                <p>ohsansi@umss.edu</p>
              </div>
            </div>
            <div className="infoItem">
              <div className="infoContent">
                <h3> <i className="bi bi-geo-alt-fill"></i> Ubicación</h3>
                <p>
                  El Departamento de Sistemas e Informática de la Universidad Mayor de San Simón (UMSS) - Calle Sucre y parque La Torre
                </p>
              </div>
            </div>
            <div className="infoItem">
              <div className="infoContent">
                <h3> <i className="bi bi-clock-fill"></i> Hora de atención</h3>
                <p>Lunes a Viernes de 8:00 a 16:00</p>
              </div>
            </div>
          </div>
        </div>
        <div className="contactFormWrapper">
          {submitError && <div className="errorMessage">{submitError}</div>}
          {submitSuccess && <div className="successMessage">{submitSuccess}</div>}
          <h2 name="contact-title">Contáctanos</h2>
          <form onSubmit={handleSubmit} className="contactForm" noValidate>
            <div className="formGroup">
              <label htmlFor="fullName">
                <i className="bi bi-person-circle"></i> Nombre Completo <span className="requiredField">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej. Perez Juan"
                className={getInputClass("fullName")}
              />
              {touched.fullName && errors.fullName && (
                <span className="errorMessage">{errors.fullName}</span>
              )}
            </div>
            <div className="formGroup">
              <label htmlFor="email">
                <i className="bi bi-envelope"></i> Correo Electrónico <span className="requiredField">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="usuario@dominio.com"
                className={getInputClass("email")}
              />
              {touched.email && errors.email && (
                <span className="errorMessage">{errors.email}</span>
              )}
            </div>
            <div className="formGroup">
              <label htmlFor="phone">
                <i className="bi bi-telephone"></i> Número de Celular <span className="requiredField">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="12345678"
                className={getInputClass("phone")}
              />
              {touched.phone && errors.phone && (
                <span className="errorMessage">{errors.phone}</span>
              )}
            </div>
            <div className="formGroup">
              <label htmlFor="selection">
                <i className="bi bi-list-check"></i> Motivo de Contacto <span className="requiredField">*</span>
              </label>
              <select
                id="selection"
                name="selection"
                value={form.selection}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClass("selection")}
              >
                <option value="">Seleccione un motivo</option>
                <option value="consulta">Consulta</option>
                <option value="sugerencia">Sugerencia</option>
                <option value="reclamo">Reclamo</option>
                <option value="otro">Otro</option>
              </select>
              {touched.selection && errors.selection && (
                <span className="errorMessage">{errors.selection}</span>
              )}
            </div>
            <div className="formGroup">
              <label htmlFor="description">
                <i className="bi bi-chat-left-text"></i> Descripción <span className="requiredField">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Escriba su mensaje aquí..."
                className={getInputClass("description")}
              />
              {touched.description && errors.description && (
                <span className="errorMessage">{errors.description}</span>
              )}
            </div>
            <div className="formButtons">
              <button type="submit" className="submitButton" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Mensaje"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;