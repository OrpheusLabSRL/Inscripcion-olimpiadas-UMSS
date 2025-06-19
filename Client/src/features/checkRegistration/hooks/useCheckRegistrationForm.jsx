import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const initialState = {
  idCard: "",
  email: "",
  role: "",
};

export const useCheckRegistrationForm = () => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!form.idCard.trim()) {
      newErrors.idCard = "El carnet de identidad es requerido";
      isValid = false;
    } else if (!/^\d+$/.test(form.idCard)) {
      newErrors.idCard = "El carnet debe contener solo números";
      isValid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = "El correo es requerido";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "El correo no es válido";
      isValid = false;
    }

    if (!form.role) {
      newErrors.role = "Seleccione su rol";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setLoading(true);
    try {
      const endpoint =
        form.role === "tutor"
          ? "http://localhost:8000/api/consultar-inscripcion-tutor"
          : "http://localhost:8000/api/consultar-inscripcion-olimpista";
      const response = await axios.post(endpoint, {
        carnetIdentidad: form.idCard,
        correoElectronico: form.email,
        rol: form.role,
      });
      if (response.data.success) {
        const redirectPath =
          form.role === "tutor"
            ? "/consultar-inscripcion/resultado-tutor"
            : "/consultar-inscripcion/resultado";
        navigate(redirectPath, {
          state: { resultado: response.data },
          replace: true,
        });
      } else {
        setError(response.data.message || "No se encontraron resultados");
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const serverErrors = err.response.data.errors;
        const newErrors = {};
        if (serverErrors.carnetIdentidad) {
          newErrors.idCard = serverErrors.carnetIdentidad[0];
        }
        if (serverErrors.correoElectronico) {
          newErrors.email = serverErrors.correoElectronico[0];
        }
        if (serverErrors.rol) {
          newErrors.role = serverErrors.rol[0];
        }
        setErrors(newErrors);
      } else if (err.response) {
        setError(
          err.response.data.message || "Error al consultar la inscripción"
        );
      } else if (err.request) {
        setError(
          "No se pudo conectar con el servidor. Por favor, verifica que el servidor Laravel esté corriendo."
        );
      } else {
        setError("Error al procesar la solicitud");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    errors,
    loading,
    error,
    handleChange,
    handleSubmit,
  };
}; 