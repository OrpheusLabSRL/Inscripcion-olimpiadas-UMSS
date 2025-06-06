//React
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

//Css
import "../Styles/TutorForm.css";

//Componentes
import HeaderProp from "../../home_usuario/components/HeaderProp";
import { registerTutor, checkExistingTutor } from "../../../api/TutorForm.api";
import { GenericCard } from "../../../components/cards/GenericCard";
import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";

//Assets
import Logo from "../../../assets/images/O-Sansi.jpeg";

export const TutorForm = () => {
  const location = useLocation();
  const initialFormType = location.state?.formType || "new";
  const [formType, setFormType] = useState(initialFormType);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    tipoTutor: "",
    carnet: "",
    telefono: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let filteredValue = value;
    if (name === "nombre" || name === "apellido") {
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
      if (filteredValue.length > 50) {
        setErrors({ ...errors, [name]: "Máximo 50 caracteres permitidos" });
        setFormData({ ...formData, [name]: filteredValue.slice(0, 50) });
        return;
      }
    } else if (name === "carnet") {
      filteredValue = value.replace(/[^a-zA-Z0-9]/g, "");
    } else if (name === "telefono") {
      filteredValue = value.replace(/[^0-9]/g, "");
    }

    setFormData({
      ...formData,
      [name]: filteredValue,
    });

    if (touched[name]) {
      validateField(name, filteredValue);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let error = "";

    if (!value.trim()) {
      error = "Este campo es requerido";
    } else {
      switch (name) {
        case "nombre":
        case "apellido":
          if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
            error = "Solo se permiten caracteres alfabéticos";
          } else if (value.length > 50) {
            error = "Máximo 50 caracteres permitidos";
          }
          break;
        case "email":
          if (!validateEmail(value)) {
            error = "Email no válido";
          }
          break;
        case "carnet":
          if (!/^[a-zA-Z0-9]+$/.test(value)) {
            error = "Solo se permiten caracteres alfanuméricos";
          } else if (value.length > 12) {
            error = "Máximo 12 caracteres permitidos";
          } else if (value.length < 6) {
            error = "Mínimo 6 caracteres requeridos";
          }
          break;
        case "telefono":
          if (!/^[0-9]+$/.test(value)) {
            error = "Solo se permiten números";
          } else if (value.length !== 8) {
            error = "Debe tener exactamente 8 dígitos";
          }
          break;
        case "tipoTutor":
          if (!value) {
            error = "Seleccione un tipo de tutor";
          }
          break;
        default:
          break;
      }
    }

    setErrors({ ...errors, [name]: error });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = [
      "nombre",
      "apellido",
      "tipoTutor",
      "carnet",
      "telefono",
      "email",
    ];

    fieldsToValidate.forEach((field) => {
      validateField(field, formData[field]);
      if (!formData[field].trim() || errors[field]) {
        newErrors[field] = errors[field] || "Este campo es requerido";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    // Validación explícita antes de enviar
    if (
      formData.telefono.length !== 8 ||
      formData.carnet.length < 6 ||
      formData.carnet.length > 12
    ) {
      setErrors({
        ...errors,
        telefono:
          formData.telefono.length !== 8
            ? "Debe tener exactamente 8 dígitos"
            : errors.telefono,
        carnet:
          formData.carnet.length < 6
            ? "Mínimo 6 caracteres requeridos"
            : formData.carnet.length > 12
              ? "Máximo 12 caracteres permitidos"
              : errors.carnet,
      });
      return;
    }

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors).find(
        (field) => errors[field]
      );
      if (firstErrorField) {
        document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await registerTutor({
        nombresTutor: formData.nombre,
        apellidosTutor: formData.apellido,
        tipoTutor: formData.tipoTutor,
        carnetdeidentidad: formData.carnet,
        telefono: formData.telefono,
        emailTutor: formData.email,
      });

      if (response.data.success) {
        setSubmitSuccess("Registro exitoso! Redirigiendo...");
        setTimeout(() => {
          navigate("/register", {
            state: {
              tutorId: response.data.tutorId,
              tutorData: formData,
            },
          });
        }, 2000);
      } else {
        setSubmitError(response.data.message || "Error al registrar el tutor");
      }
    } catch (error) {
      console.error("Error al registrar tutor:", error);
      if (error.response) {
        if (error.response.data.error_code === "duplicate_ci") {
          setSubmitError(
            "Ya existe un registro con este carnet de identidad. Por favor, continúe su inscripción."
          );
        } else if (error.response.data.error_code === "duplicate_email") {
          setSubmitError(
            "Ya existe un registro con este correo electrónico. Por favor, continúe su inscripción."
          );
        } else {
          setSubmitError(
            error.response.data.message || `Error ${error.response.status}`
          );
        }
      } else if (error.request) {
        setSubmitError(
          "No se pudo conectar con el servidor. Verifica tu conexión."
        );
      } else {
        setSubmitError("Error al configurar la solicitud");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateContinueForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email es requerido";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email no válido";
    }
    if (!formData.carnet.trim()) {
      newErrors.carnet = "Carnet es requerido";
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.carnet)) {
      newErrors.carnet = "Solo se permiten caracteres alfanuméricos";
    } else if (formData.carnet.length > 12) {
      newErrors.carnet = "Máximo 12 caracteres permitidos";
    } else if (formData.carnet.length < 6) {
      newErrors.carnet = "Mínimo 6 caracteres requeridos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!validateContinueForm()) {
      const firstErrorField = Object.keys(errors).find(
        (field) => errors[field]
      );
      if (firstErrorField) {
        document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await checkExistingTutor(
        formData.email,
        formData.carnet
      );

      if (response.data.exists) {
        sessionStorage.setItem("tutorInscripcionId", response.data.tutorId);
        setSubmitSuccess("Datos verificados! Redirigiendo...");
        setTimeout(() => {
          navigate("/register/listRegistered", {
            state: {
              tutorId: response.data.tutorId,
              tutorData: {
                nombre: response.data.data.nombresTutor,
                apellido: response.data.data.apellidosTutor,
                tipoTutor: response.data.data.tipoTutor,
                carnet: response.data.data.carnetdeidentidad,
                telefono: response.data.data.telefono,
                email: response.data.data.emailTutor,
              },
            },
          });
        }, 2000);
      } else {
        setSubmitError(
          "No se encontró una inscripción con esos datos. Por favor, inicie una nueva inscripción."
        );
      }
    } catch (error) {
      console.error("Error al verificar tutor:", error);
      if (error.response) {
        setSubmitError(
          error.response.data.message || `Error ${error.response.status}`
        );
      } else if (error.request) {
        setSubmitError(
          "No se pudo conectar con el servidor. Verifica tu conexión."
        );
      } else {
        setSubmitError("Error al configurar la solicitud");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClass = (name) => {
    if (!touched[name]) return "";
    return errors[name] ? "invalid-input" : formData[name] ? "valid-input" : "";
  };

  return (
    <div>
      
        <div className="tutor-form-container">
          <div className="form-options-container">
            <button
              type="button"
              className={`form-option ${formType === "new" ? "active" : ""}`}
              onClick={() => setFormType("new")}
            >
              Nueva inscripción
            </button>
            <button
              type="button"
              className={`form-option ${formType === "continue" ? "active" : ""
                }`}
              onClick={() => setFormType("continue")}
            >
              Continuar inscripción
            </button>
          </div>

          {submitError && <div className="error-message">{submitError}</div>}
          {submitSuccess && (
            <div className="success-message">{submitSuccess}</div>
          )}

          {formType === "new" ? (
            <form
              onSubmit={handleSubmit}
              className="form-section"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <GenericCard
                image={Logo}
                title="Olimpiadas O! SanSi 2025"
                description="Inicia una nueva inscripcion y registra uno o mas estudiantes a las Olimpiadas O SanSi 2025"
                value="Nueva Inscripción"
                to="/register"
              />
            </form>
          ) : (
            <form onSubmit={handleContinue} className="form-section">
              <div className="form-group">
                <label htmlFor="continue-email">
                  Correo Electrónico <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="continue-email"
                  name="email"
                  placeholder="Ingrese su correo electrónico"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={getInputClass("email")}
                />
                {touched.email && errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="continue-carnet">
                  Carnet de identidad <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="continue-carnet"
                  name="carnet"
                  placeholder="Ingrese su carnet "
                  value={formData.carnet}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={getInputClass("carnet")}
                />
                {touched.carnet && errors.carnet && (
                  <span className="error-message">{errors.carnet}</span>
                )}
              </div>

              <div className="form-buttons">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Verificando..." : "Continuar"}
                </button>
              </div>
            </form>
          )}
        </div>
   
    </div>
  );
};
