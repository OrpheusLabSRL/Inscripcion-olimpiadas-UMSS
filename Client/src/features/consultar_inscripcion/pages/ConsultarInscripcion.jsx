import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeaderProp from "../../home_usuario/components/HeaderProp";
import "../Styles/ConsultarInscripcion.css";

const ConsultarInscripcion = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [ci, setCi] = useState("");
  const [rol, setRol] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (setter, name) => (e) => {
    const value = e.target.value;
    setter(value);
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case "correo":
        if (!value) {
          newErrors.correo = "El correo es requerido";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.correo = "El correo no es válido";
        } else {
          delete newErrors.correo;
        }
        break;
      case "ci":
        if (!value) {
          newErrors.ci = "El carnet de identidad es requerido";
        } else if (!/^\d+$/.test(value)) {
          newErrors.ci = "El carnet debe contener solo números";
        } else {
          delete newErrors.ci;
        }
        break;
      case "rol":
        if (!value) {
          newErrors.rol = "Seleccione su rol";
        } else {
          delete newErrors.rol;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleBlur = (name) => () => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, name === "correo" ? correo : name === "ci" ? ci : rol);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = rol === 'tutor' 
        ? 'http://localhost:8000/api/consultar-inscripcion-tutor'
        : 'http://localhost:8000/api/consultar-inscripcion-olimpista';

      console.log('Enviando datos al servidor:', {
        ci,
        correo,
        rol,
        url: endpoint
      });

      const response = await axios.post(endpoint, {
        carnetIdentidad: ci,
        correoElectronico: correo,
        rol: rol
      });

      console.log('Respuesta completa del servidor:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      });

      if (response.data.success) {
        const redirectPath = rol === 'tutor' 
          ? '/consultar-inscripcion/resultado-tutor'
          : '/consultar-inscripcion/resultado';
          
        navigate(redirectPath, { 
          state: { resultado: response.data },
          replace: true 
        });
      } else {
        setError(response.data.message || 'No se encontraron resultados');
      }
    } catch (err) {
      console.error('Error en la consulta:', err);
      if (err.response) {
        setError(err.response.data.message || 'Error al consultar la inscripción');
      } else if (err.request) {
        setError('No se pudo conectar con el servidor. Por favor, verifica que el servidor Laravel esté corriendo.');
      } else {
        setError('Error al procesar la solicitud');
      }
    }
  };

  return (
    <div className="consultar-inscripcion-container">
      <HeaderProp />
      <form className="consultar-form" onSubmit={handleSubmit} noValidate>
        <h2>Consultar Estado de Inscripción</h2>
        
        <div className="form-group">
          <label htmlFor="ci">Carnet de Identidad</label>
          <input
            type="text"
            id="ci"
            value={ci}
            onChange={handleChange(setCi, "ci")}
            onBlur={handleBlur("ci")}
            className={touched.ci && errors.ci ? "invalid-input" : ""}
            required
            placeholder="Ingrese su carnet de identidad"
            aria-required="true"
          />
          {touched.ci && errors.ci && (
            <div className="error-message">{errors.ci}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="correo">Correo Electrónico</label>
          <input
            type="email"
            id="correo"
            value={correo}
            onChange={handleChange(setCorreo, "correo")}
            onBlur={handleBlur("correo")}
            className={touched.correo && errors.correo ? "invalid-input" : ""}
            required
            placeholder="Ingrese su correo electrónico"
            aria-required="true"
          />
          {touched.correo && errors.correo && (
            <div className="error-message">{errors.correo}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="rol">Rol</label>
          <select
            id="rol"
            value={rol}
            onChange={handleChange(setRol, "rol")}
            onBlur={handleBlur("rol")}
            className={touched.rol && errors.rol ? "invalid-input" : ""}
            required
            aria-required="true"
          >
            <option value="">Seleccione su rol</option>
            <option value="olimpista">Olimpista</option>
            <option value="tutor">Tutor</option>
          </select>
          {touched.rol && errors.rol && (
            <div className="error-message">{errors.rol}</div>
          )}
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Consultando...' : 'Consultar'}
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default ConsultarInscripcion;
