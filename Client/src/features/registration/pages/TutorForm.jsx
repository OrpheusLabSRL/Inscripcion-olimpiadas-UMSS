import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/TutorForm.css";
import image from "../../../assets/images/continueInscription.png";
import HeaderProp from "../../homeUser/components/HeaderProp";
import { checkExistingTutor } from "../../../api/TutorForm.api";

export const TutorForm = () => {
  const [formData, setFormData] = useState({
    carnet: "",
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

    if (name === "carnet") {
      filteredValue = value.replace(/[^a-zA-Z0-9]/g, "");
    }

    setFormData({ ...formData, [name]: filteredValue });

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
      if (name === "email" && !validateEmail(value)) {
        error = "Email no válido";
      }
      if (name === "carnet") {
        if (!/^[a-zA-Z0-9]+$/.test(value)) {
          error = "Solo se permiten caracteres alfanuméricos";
        } else if (value.length > 12) {
          error = "Máximo 12 caracteres permitidos";
        } else if (value.length < 6) {
          error = "Mínimo 6 caracteres requeridos";
        }
      }
    }

    setErrors({ ...errors, [name]: error });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
      <HeaderProp />
      <div className="continueInscriptionWrapper">
        <div className="continueInscriptionImageSide">
          <img src={image} alt="Ilustración educativa" />
        </div>

        <div className="continueInscriptionFormSide">
          <form onSubmit={handleContinue} noValidate>
            <h2 className="continueInscriptionTitle">Continuar Inscripción</h2>
            <p className="continueInscriptionInstruction">
              Esta sección está destinada al responsable de inscripción. Si ya iniciaste el proceso, puedes continuar registrando a más estudiantes utilizando el mismo correo y carnet de identidad. Recuerda que el responsable es quien realiza el pago correspondiente.
            </p>

            {submitError && <div className="continueInscriptionErrorMessage">{submitError}</div>}
            {submitSuccess && <div className="continueInscriptionSuccessMessage">{submitSuccess}</div>}

            <div className="continueInscriptionFormGroup">
              <label htmlFor="continue-email">
                <i className="bi bi-envelope"></i> Correo Electrónico <span className="continueInscriptionRequired">*</span>
              </label>
              <input
                type="email"
                id="continue-email"
                name="email"
                placeholder="Ingrese su correo electrónico"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={errors.email ? "continueInscriptionInputInvalid" : ""}
                aria-required="true"
              />
              {touched.email && errors.email && (
                <div className="continueInscriptionErrorMessage">{errors.email}</div>
              )}
            </div>

            <div className="continueInscriptionFormGroup">
              <label htmlFor="continue-carnet">
                <i className="bi bi-person-vcard"></i> Carnet de Identidad <span className="continueInscriptionRequired">*</span>
              </label>
              <input
                type="text"
                id="continue-carnet"
                name="carnet"
                placeholder="Ingrese su carnet"
                value={formData.carnet}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={errors.carnet ? "continueInscriptionInputInvalid" : ""}
                aria-required="true"
              />
              {touched.carnet && errors.carnet && (
                <div className="continueInscriptionErrorMessage">{errors.carnet}</div>
              )}
            </div>

            <button
              type="submit"
              className="continueInscriptionSubmitButton"
              disabled={isSubmitting}
            >
              <i className="bi bi-check-circle"></i>
              {isSubmitting ? "Verificando..." : "Continuar"}
            </button>
          </form>
        </div>
      </div>
    </div>

  );
};
