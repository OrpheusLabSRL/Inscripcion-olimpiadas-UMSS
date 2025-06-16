import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeaderProp from "../../home_usuario/components/HeaderProp";
import "../Styles/CheckRegistration.css";
import imagen from "../../../assets/images/estadoInscripcion.png"

const CheckRegistration = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [idCard, setIdCard] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!idCard.trim()) {
      newErrors.idCard = "El carnet de identidad es requerido";
      isValid = false;
    } else if (!/^\d+$/.test(idCard)) {
      newErrors.idCard = "El carnet debe contener solo números";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "El correo es requerido";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El correo no es válido";
      isValid = false;
    }

    if (!role) {
      newErrors.role = "Seleccione su rol";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        role === "tutor"
          ? "http://localhost:8000/api/consultar-inscripcion-tutor"
          : "http://localhost:8000/api/consultar-inscripcion-olimpista";

      const response = await axios.post(endpoint, {
        carnetIdentidad: idCard,
        correoElectronico: email,
        rol: role,
      });

      if (response.data.success) {
        const redirectPath =
          role === "tutor"
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
                value={idCard}
                onChange={(e) => setIdCard(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={role}
                onChange={(e) => setRole(e.target.value)}
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
