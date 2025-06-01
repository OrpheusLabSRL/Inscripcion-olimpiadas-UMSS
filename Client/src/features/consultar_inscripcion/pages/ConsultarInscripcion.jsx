import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeaderProp from "../../home_usuario/components/HeaderProp";
import "../Styles/estadoInscripcion.css";
import imagen from "../../../assets/images/estadoInscripcion.png"

const ConsultarInscripcion = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [ci, setCi] = useState("");
  const [rol, setRol] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!ci.trim()) {
      newErrors.ci = "El carnet de identidad es requerido";
      isValid = false;
    } else if (!/^\d+$/.test(ci)) {
      newErrors.ci = "El carnet debe contener solo números";
      isValid = false;
    }

    if (!correo.trim()) {
      newErrors.correo = "El correo es requerido";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(correo)) {
      newErrors.correo = "El correo no es válido";
      isValid = false;
    }

    if (!rol) {
      newErrors.rol = "Seleccione su rol";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validar el formulario antes de enviar
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        rol === "tutor"
          ? "http://localhost:8000/api/consultar-inscripcion-tutor"
          : "http://localhost:8000/api/consultar-inscripcion-olimpista";

      const response = await axios.post(endpoint, {
        carnetIdentidad: ci,
        correoElectronico: correo,
        rol: rol,
      });

      if (response.data.success) {
        const redirectPath =
          rol === "tutor"
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
        // Si hay errores de validación del servidor
        const serverErrors = err.response.data.errors;
        const newErrors = {};

        if (serverErrors.carnetIdentidad) {
          newErrors.ci = serverErrors.carnetIdentidad[0];
        }
        if (serverErrors.correoElectronico) {
          newErrors.correo = serverErrors.correoElectronico[0];
        }
        if (serverErrors.rol) {
          newErrors.rol = serverErrors.rol[0];
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

  return (
  <div>
    <HeaderProp />

    <div className="consulta-wrapper">
      <div className="image-side">
        <img src={imagen} alt="Ilustración educativa" />
      </div>

      {/* Lado del formulario */}
      <div className="form-side">
        <form onSubmit={handleSubmit} noValidate>
          <h2>Consultar Estado de Inscripción</h2>

          <div className="form-group">
            <label htmlFor="ci">
              Carnet de Identidad <span className="required-field">*</span>
            </label>
            <input
              type="text"
              id="ci"
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              className={errors.ci ? "invalid-input" : ""}
              required
              placeholder="Ingrese su carnet de identidad"
              aria-required="true"
            />
            {errors.ci && <div className="error-message">{errors.ci}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="correo">
              Correo Electrónico <span className="required-field">*</span>
            </label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className={errors.correo ? "invalid-input" : ""}
              required
              placeholder="Ingrese su correo electrónico"
              aria-required="true"
            />
            {errors.correo && (
              <div className="error-message">{errors.correo}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="rol">
              Rol <span className="required-field">*</span>
            </label>
            <select
              id="rol"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className={errors.rol ? "invalid-input" : ""}
              required
              aria-required="true"
            >
              <option value="">Seleccione su rol</option>
              <option value="olimpista">Olimpista</option>
              <option value="tutor">Tutor/Responsable Inscripción</option>
            </select>
            {errors.rol && <div className="error-message">{errors.rol}</div>}
            <div className="help-message">
              En caso de ser tutor legal, tutor de área o responsable de inscripción seleccione tutor/Responsable Inscripción
            </div>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            <i className="bi bi-search"></i>
            {loading ? "Consultando..." : "Consultar"}
          </button>

          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  </div>
);

};

export default ConsultarInscripcion;
