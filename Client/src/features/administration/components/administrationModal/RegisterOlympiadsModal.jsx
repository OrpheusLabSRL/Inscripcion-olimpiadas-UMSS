import React, { useState, useEffect } from "react";
import "../../Styles/ModalGeneral.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
  createOlympiad,
  getOlimpiadas,
} from "../../../../api/Administration.api";

const MySwal = withReactContent(Swal);

const RegisterOlympiadsModal = ({ isOpen, onClose, onSave }) => {
  const initialFormState = {
    nombreOlimpiada: "",
    version: "",
    fechaInicioOlimpiada: "",
    fechaFinOlimpiada: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [olympiads, setOlympiads] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchOlympiads();
    }
  }, [isOpen]);

  const fetchOlympiads = async () => {
    try {
      const data = await getOlimpiadas();
      setOlympiads(data.data || []);
    } catch (error) {
      console.error("Error al cargar olimpiadas:", error);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (name === "fechaInicioOlimpiada" || name === "fechaFinOlimpiada") {
      validarFechas(
        name === "fechaInicioOlimpiada" ? value : formData.fechaInicioOlimpiada,
        name === "fechaFinOlimpiada" ? value : formData.fechaFinOlimpiada
      );
    }
  };

  const validarFechas = (fechaInicio, fechaFin) => {
    const hoy = new Date().toISOString().split("T")[0];
    const nuevosErrores = { ...errors };

    if (fechaInicio && fechaInicio < hoy) {
      nuevosErrores.fechaInicioOlimpiada =
        "La fecha de inicio no puede ser pasada";
    } else {
      delete nuevosErrores.fechaInicioOlimpiada;
    }

    if (fechaFin && fechaFin < hoy) {
      nuevosErrores.fechaFinOlimpiada = "La fecha de fin no puede ser pasada";
    } else {
      delete nuevosErrores.fechaFinOlimpiada;
    }

    if (fechaInicio && fechaFin && fechaFin < fechaInicio) {
      nuevosErrores.fechaFinOlimpiada =
        "La fecha de fin no puede ser anterior a la de inicio";
    }

    if (fechaInicio && fechaFin) {
      if (fechaFin < fechaInicio) {
        nuevosErrores.fechaFinOlimpiada =
          "La fecha de fin no puede ser anterior a la de inicio";
      } else if (fechaFin === fechaInicio) {
        nuevosErrores.fechaFinOlimpiada =
          "La fecha de inicio y fin no pueden ser el mismo día";
      }
    }

    setErrors(nuevosErrores);
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombreOlimpiada.trim()) {
      nuevosErrores.nombreOlimpiada = "Este campo es requerido";
    }
    if (!formData.version) {
      nuevosErrores.version = "Este campo es requerido";
    }
    if (!formData.fechaInicioOlimpiada) {
      nuevosErrores.fechaInicioOlimpiada = "Este campo es requerido";
    }
    if (!formData.fechaFinOlimpiada) {
      nuevosErrores.fechaFinOlimpiada = "Este campo es requerido";
    }

    validarFechas(formData.fechaInicioOlimpiada, formData.fechaFinOlimpiada);

    const existe = olympiads.some(
      (o) =>
        o.nombreOlimpiada.trim().toLowerCase() ===
          formData.nombreOlimpiada.trim().toLowerCase() &&
        parseInt(o.version) === parseInt(formData.version)
    );

    if (existe) {
      nuevosErrores.nombreOlimpiada =
        "Ya existe una olimpiada con este nombre y versión";
      nuevosErrores.version =
        "Ya existe una olimpiada con este nombre y versión";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const result = await MySwal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas registrar esta olimpiada?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, registrar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: {
        container: "swal2Container",
      },
    });

    if (!result.isConfirmed) return;

    try {
      const payload = {
        ...formData,
        version: parseInt(formData.version),
        estadoOlimpiada: 0,
        idUsuario: 1,
      };

      await createOlympiad(payload);

      await MySwal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Versión registrada correctamente",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          container: "swal2Container",
        },
      });

      resetForm();
      onClose();
      onSave && onSave();
      window.location.reload();
    } catch (error) {
      console.error("Error al crear la olimpiada:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        await MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Error inesperado al guardar la olimpiada.",
          customClass: {
            container: "swal2Container",
          },
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="adminModalOverlay">
      <div className="adminModalContent">
        <button
          type="button"
          className="adminModalCloseBtn"
          onClick={handleClose}
        >
          ✖
        </button>

        <form onSubmit={handleSubmit} className="adminModalForm">
          <h2 className="adminModalTitle">Nueva Olimpiada</h2>

          <div className="adminFormGroup">
            <label className="adminFormLabel">
              Nombre de la Olimpiada{" "}
              <span className="adminRequiredField">*</span>
            </label>
            <input
              type="text"
              name="nombreOlimpiada"
              value={formData.nombreOlimpiada}
              onChange={handleChange}
              className={`adminFormInput ${
                errors.nombreOlimpiada ? "adminInputError" : ""
              }`}
            />
            {errors.nombreOlimpiada && (
              <p className="adminErrorMessage">{errors.nombreOlimpiada}</p>
            )}
          </div>

          <div className="adminFormGroup">
            <label className="adminFormLabel">
              Versión <span className="adminRequiredField">*</span>
            </label>
            <input
              type="number"
              name="version"
              value={formData.version}
              onChange={handleChange}
              className={`adminFormInput ${
                errors.version ? "adminInputError" : ""
              }`}
            />
            {errors.version && (
              <p className="adminErrorMessage">{errors.version}</p>
            )}
          </div>

          <div className="adminFormRow">
            <div className="adminFormGroup">
              <label className="adminFormLabel">
                Fecha de Inicio <span className="adminRequiredField">*</span>
              </label>
              <input
                type="date"
                name="fechaInicioOlimpiada"
                value={formData.fechaInicioOlimpiada}
                onChange={handleChange}
                className={`adminFormInput ${
                  errors.fechaInicioOlimpiada ? "adminInputError" : ""
                }`}
              />
              {errors.fechaInicioOlimpiada && (
                <p className="adminErrorMessage">
                  {errors.fechaInicioOlimpiada}
                </p>
              )}
            </div>

            <div className="adminFormGroup">
              <label className="adminFormLabel">
                Fecha de Finalización{" "}
                <span className="adminRequiredField">*</span>
              </label>
              <input
                type="date"
                name="fechaFinOlimpiada"
                value={formData.fechaFinOlimpiada}
                onChange={handleChange}
                className={`adminFormInput ${
                  errors.fechaFinOlimpiada ? "adminInputError" : ""
                }`}
              />
              {errors.fechaFinOlimpiada && (
                <p className="adminErrorMessage">{errors.fechaFinOlimpiada}</p>
              )}
            </div>
          </div>

          <div className="adminModalActions">
            <button
              type="button"
              onClick={handleClose}
              className="adminModalBtnCancel"
            >
              Cancelar
            </button>
            <button type="submit" className="adminModalBtnSave">
              Registrar Olimpiada
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterOlympiadsModal;
