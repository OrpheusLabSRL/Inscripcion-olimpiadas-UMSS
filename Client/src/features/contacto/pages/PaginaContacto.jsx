import React, { useState } from "react";
import HeaderProp from "../../home_usuario/components/HeaderProp";
import "../Styles/PaginaContacto.css";
import axios from "axios";

const PaginaContacto = () => {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [correo, setCorreo] = useState("");
  const [celular, setCelular] = useState("");
  const [seleccion, setSeleccion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const handleNombreChange = (e) => {
    setNombreCompleto(e.target.value);
    if (touched.nombreCompleto) {
      validateField("nombreCompleto", e.target.value);
    }
  };

  const handleCorreoChange = (e) => {
    setCorreo(e.target.value);
    if (touched.correo) {
      validateField("correo", e.target.value);
    }
  };

  const handleCelularChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setCelular(value);
    if (touched.celular) {
      validateField("celular", value);
    }
  };

  const handleSeleccionChange = (e) => {
    setSeleccion(e.target.value);
    if (touched.seleccion) {
      validateField("seleccion", e.target.value);
    }
  };

  const handleDescripcionChange = (e) => {
    setDescripcion(e.target.value);
    if (touched.descripcion) {
      validateField("descripcion", e.target.value);
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
        case "nombreCompleto":
          if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
            error = "Solo se permiten caracteres alfabéticos";
          } else if (value.length > 50) {
            error = "Máximo 50 caracteres permitidos";
          }
          break;
        case "correo":
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = "El correo no es válido";
          }
          break;
        case "celular":
          if (!/^[0-9]+$/.test(value)) {
            error = "Solo se permiten números";
          } else if (value.length !== 8) {
            error = "Debe tener exactamente 8 dígitos";
          }
          break;
        case "seleccion":
          if (!value) {
            error = "Seleccione una opción";
          }
          break;
        default:
          break;
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    return error === "";
  };

  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = [
      "nombreCompleto",
      "correo",
      "celular",
      "seleccion",
      "descripcion",
    ];
    let isValid = true;

    fieldsToValidate.forEach((field) => {
      let value = "";
      switch (field) {
        case "nombreCompleto":
          value = nombreCompleto;
          break;
        case "correo":
          value = correo;
          break;
        case "celular":
          value = celular;
          break;
        case "seleccion":
          value = seleccion;
          break;
        case "descripcion":
          value = descripcion;
          break;
        default:
          break;
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
    ["nombreCompleto", "correo", "celular", "seleccion", "descripcion"].forEach(
      (field) => {
        allTouched[field] = true;
      }
    );
    setTouched(allTouched);

    if (validateForm()) {
      try {
        const response = await axios.post(
          "http://orpheus.tis.cs.umss.edu.bo/api/enviar-contacto",
          {
            nombre: nombreCompleto,
            correo,
            numero: celular,
            motivo: seleccion,
            descripcion,
          }
        );

        if (response.status === 200) {
          setSubmitSuccess("Mensaje enviado con éxito");
          setNombreCompleto("");
          setCorreo("");
          setCelular("");
          setSeleccion("");
          setDescripcion("");
          setTouched({});
          setErrors({});
        } else {
          setSubmitError("No se pudo enviar el mensaje. Inténtalo de nuevo.");
        }
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
        setSubmitError(
          "Hubo un error al procesar el formulario. Verifica tu conexión o inténtalo más tarde."
        );
      }
    } else {
      setSubmitError("Por favor, corrija los errores en el formulario");
    }
  };

  const getInputClass = (name) => {
    if (!touched[name]) return "";
    return errors[name] ? "entradaInvalida" : "entradaValida";
  };

  return (
    <div>
      <HeaderProp />
      <div className="contactoContenedor">
        <div className="contactoLateral">
          <div className="contactoInfo">
            <div className="infoItem">
              <div className="infoContenido">
                <h3>
                  {" "}
                  <i className="bi bi-envelope-fill"></i> Escríbenos
                </h3>
                <p>ohsansi@umss.edu</p>
              </div>
            </div>

            <div className="infoItem">
              <div className="infoContenido">
                <h3>
                  {" "}
                  <i className="bi bi-geo-alt-fill"></i> Ubicación
                </h3>
                <p>
                  El Departamento de Sistemas e Informática de la Universidad
                  Mayor de San Simón (UMSS) - Calle Sucre y parque La Torre
                </p>
              </div>
            </div>

            <div className="infoItem">
              <div className="infoContenido">
                <h3>
                  {" "}
                  <i className="bi bi-clock-fill"></i> Hora de atención
                </h3>
                <p>Lunes a Viernes de 8:00 a 16:00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="formularioContactoWrapper">
          {submitError && <div className="mensajeError">{submitError}</div>}
          {submitSuccess && <div className="mensajeExito">{submitSuccess}</div>}

          <h2 name="titulo-contacto">Contáctanos</h2>
          <form
            onSubmit={handleSubmit}
            className="formularioContacto"
            noValidate
          >
            <div className="grupoFormulario">
              <label htmlFor="nombreCompleto">
                <i className="bi bi-person-circle"></i> Nombre Completo{" "}
                <span className="campoRequerido">*</span>
              </label>
              <input
                type="text"
                id="nombreCompleto"
                name="nombreCompleto"
                value={nombreCompleto}
                onChange={handleNombreChange}
                onBlur={handleBlur}
                placeholder="Ej. Perez Juan"
                className={getInputClass("nombreCompleto")}
              />
              {touched.nombreCompleto && errors.nombreCompleto && (
                <span className="mensajeError">{errors.nombreCompleto}</span>
              )}
            </div>

            <div className="grupoFormulario">
              <label htmlFor="correo">
                <i className="bi bi-envelope"></i> Correo Electrónico{" "}
                <span className="campoRequerido">*</span>
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={correo}
                onChange={handleCorreoChange}
                onBlur={handleBlur}
                placeholder="usuario@dominio.com"
                className={getInputClass("correo")}
              />
              {touched.correo && errors.correo && (
                <span className="mensajeError">{errors.correo}</span>
              )}
            </div>

            <div className="grupoFormulario">
              <label htmlFor="celular">
                <i className="bi bi-telephone"></i> Número de Celular{" "}
                <span className="campoRequerido">*</span>
              </label>
              <input
                type="tel"
                id="celular"
                name="celular"
                value={celular}
                onChange={handleCelularChange}
                onBlur={handleBlur}
                placeholder="Ej. 72738789"
                className={getInputClass("celular")}
                maxLength={8}
              />
              {touched.celular && errors.celular && (
                <span className="mensajeError">{errors.celular}</span>
              )}
            </div>

            <div className="grupoFormulario">
              <label htmlFor="seleccion">
                <i className="bi bi-question-circle"></i> Motivo de la Consulta{" "}
                <span className="campoRequerido">*</span>
              </label>
              <select
                id="seleccion"
                name="seleccion"
                value={seleccion}
                onChange={handleSeleccionChange}
                onBlur={handleBlur}
                className={getInputClass("seleccion")}
              >
                <option value="" disabled>
                  Seleccione el Motivo de la Consulta
                </option>
                <option value="consulta">Consulta General</option>
                <option value="servicio">Solicitud de Servicio</option>
                <option value="reclamo">Reclamo</option>
                <option value="otro">Otro</option>
              </select>
              {touched.seleccion && errors.seleccion && (
                <span className="mensajeError">{errors.seleccion}</span>
              )}
            </div>

            <div className="grupoFormulario">
              <label htmlFor="descripcion">
                <i className="bi bi-file-earmark"></i> Descripción{" "}
                <span className="campoRequerido">*</span>
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={descripcion}
                onChange={handleDescripcionChange}
                onBlur={handleBlur}
                rows="6"
                className={getInputClass("descripcion")}
              ></textarea>
              {touched.descripcion && errors.descripcion && (
                <span className="mensajeError">{errors.descripcion}</span>
              )}
            </div>

            <div className="botonesFormulario">
              <button type="submit" className="botonEnviar">
                <i className="bi bi-send"></i> Enviar consulta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaginaContacto;
