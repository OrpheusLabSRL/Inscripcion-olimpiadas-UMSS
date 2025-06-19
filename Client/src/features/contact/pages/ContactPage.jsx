import React, { useState } from "react";
import HeaderProp from "../../homeUser/components/HeaderProp";
import "../Styles/ContactPage.css";
import axios from "axios";

const ContactPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selection, setSelection] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const handleNameChange = (e) => {
    setFullName(e.target.value);
    if (touched.fullName) {
      validateField("fullName", e.target.value);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (touched.email) {
      validateField("email", e.target.value);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPhone(value);
    if (touched.phone) {
      validateField("phone", value);
    }
  };

  const handleSelectionChange = (e) => {
    setSelection(e.target.value);
    if (touched.selection) {
      validateField("selection", e.target.value);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    if (touched.description) {
      validateField("description", e.target.value);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, e.target.value);
  };

  const validateField = (name, value) => {
    let error = "";

    if (!value.trim()) {
      error = "Este campo es requerido";
    } else {
      switch (name) {
        case "fullName":
          if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
            error = "Solo se permiten caracteres alfabéticos";
          } else if (value.length > 50) {
            error = "Máximo 50 caracteres permitidos";
          }
          break;
        case "email":
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = "El correo no es válido";
          }
          break;
        case "phone":
          if (!/^[0-9]+$/.test(value)) {
            error = "Solo se permiten números";
          } else if (value.length !== 8) {
            error = "Debe tener exactamente 8 dígitos";
          }
          break;
        case "selection":
          if (!value) {
            error = "Seleccione una opción";
          }
          break;
        default:
          break;
      }
    }

    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    return error === "";
  };

  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = ["fullName", "email", "phone", "selection", "description"];
    let isValid = true;

    fieldsToValidate.forEach((field) => {
      let value = "";
      switch (field) {
        case "fullName": value = fullName; break;
        case "email": value = email; break;
        case "phone": value = phone; break;
        case "selection": value = selection; break;
        case "description": value = description; break;
        default: break;
      }

      const fieldIsValid = validateField(field, value);
      if (!fieldIsValid) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    const allTouched = {};
    ["fullName", "email", "phone", "selection", "description"].forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:8000/api/enviar-contacto", {
          nombre: fullName,
          correo: email,
          numero: phone,
          motivo: selection,
          descripcion: description,
        });

        if (response.status === 200) {
          setSubmitSuccess("Mensaje enviado con éxito");
          setFullName("");
          setEmail("");
          setPhone("");
          setSelection("");
          setDescription("");
          setTouched({});
          setErrors({});
        } else {
          setSubmitError("No se pudo enviar el mensaje. Inténtalo de nuevo.");
        }
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
        setSubmitError("Hubo un error al procesar el formulario. Verifica tu conexión o inténtalo más tarde.");
      }
    } else {
      setSubmitError("Por favor, corrija los errores en el formulario");
    }
  };

  const getInputClass = (name) => {
    if (!touched[name]) return "";
    return errors[name] ? "invalidInput" : "validInput";
  };

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
                value={fullName}
                onChange={handleNameChange}
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
                value={email}
                onChange={handleEmailChange}
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
                value={phone}
                onChange={handlePhoneChange}
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
                value={selection}
                onChange={handleSelectionChange}
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
                value={description}
                onChange={handleDescriptionChange}
                onBlur={handleBlur}
                placeholder="Escriba su mensaje aquí..."
                className={getInputClass("description")}
              />
              {touched.description && errors.description && (
                <span className="errorMessage">{errors.description}</span>
              )}
            </div>

            <div className="formButtons">
              <button type="submit" className="submitButton">
                <i className="bi bi-send me-2"></i>
                Enviar Mensaje
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;