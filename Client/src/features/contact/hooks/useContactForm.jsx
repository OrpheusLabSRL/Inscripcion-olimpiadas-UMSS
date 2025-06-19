import { useState } from "react";
import axios from "axios";

const initialState = {
  fullName: "",
  email: "",
  phone: "",
  selection: "",
  description: "",
};

export const useContactForm = () => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "phone") {
      newValue = value.replace(/[^0-9]/g, "");
    }
    setForm((prev) => ({ ...prev, [name]: newValue }));
    if (touched[name]) {
      validateField(name, newValue);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
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
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const validateForm = () => {
    const fields = Object.keys(initialState);
    let isValid = true;
    fields.forEach((field) => {
      const valid = validateField(field, form[field]);
      if (!valid) isValid = false;
    });
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    setTouched({ fullName: true, email: true, phone: true, selection: true, description: true });
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:8000/api/enviar-contacto", {
          nombre: form.fullName,
          correo: form.email,
          numero: form.phone,
          motivo: form.selection,
          descripcion: form.description,
        });
        if (response.status === 200) {
          setSubmitSuccess("Mensaje enviado con éxito");
          setForm(initialState);
          setTouched({});
          setErrors({});
        } else {
          setSubmitError("No se pudo enviar el mensaje. Inténtalo de nuevo.");
        }
      } catch (error) {
        setSubmitError("Hubo un error al procesar el formulario. Verifica tu conexión o inténtalo más tarde.");
      } finally {
        setLoading(false);
      }
    } else {
      setSubmitError("Por favor, corrija los errores en el formulario");
    }
  };

  const getInputClass = (name) => {
    if (!touched[name]) return "";
    return errors[name] ? "invalidInput" : "validInput";
  };

  return {
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
  };
}; 