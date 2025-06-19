import React, { useState, useEffect } from "react";
import "../../Styles/ModalGeneral.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  updateOlimpiada,
  getOlimpiadas,
} from "../../../../api/Administration.api";

const MySwal = withReactContent(Swal);

const EditOlympiadModal = ({ isOpen, olympiad, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombreOlimpiada: "",
    version: "",
    fechaInicioOlimpiada: "",
    fechaFinOlimpiada: "",
  });
  const [errors, setErrors] = useState({});
  const [olympiads, setOlympiads] = useState([]);

  useEffect(() => {
    if (isOpen && olympiad) {
      setFormData({
        nombreOlimpiada: olympiad.nombreOlimpiada || "",
        version: olympiad.version || "",
        fechaInicioOlimpiada:
          olympiad.fechaInicioOlimpiada?.split("T")[0] || "",
        fechaFinOlimpiada: olympiad.fechaFinOlimpiada?.split("T")[0] || "",
      });
      setErrors({});
      fetchOlympiads();
    }
  }, [isOpen, olympiad]);

  useEffect(() => {
    validarFormulario(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const fetchOlympiads = async () => {
    try {
      const { data } = await getOlimpiadas();
      setOlympiads(data);
    } catch (err) {
      console.error("Error al cargar olimpiadas", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validarFormulario = (data) => {
    const nuevosErrores = {};
    const hoy = new Date().toISOString().split("T")[0];

    // Validar nombre
    if (!data.nombreOlimpiada.trim()) {
      nuevosErrores.nombreOlimpiada = "Este campo es requerido";
    }

    // Validar versión
    if (!data.version) {
      nuevosErrores.version = "Este campo es requerido";
    }

    // Validar fechas
    if (!data.fechaInicioOlimpiada) {
      nuevosErrores.fechaInicioOlimpiada = "Este campo es requerido";
    } else if (data.fechaInicioOlimpiada < hoy) {
      nuevosErrores.fechaInicioOlimpiada =
        "La fecha de inicio no puede ser pasada";
    }

    if (!data.fechaFinOlimpiada) {
      nuevosErrores.fechaFinOlimpiada = "Este campo es requerido";
    } else if (data.fechaFinOlimpiada < hoy) {
      nuevosErrores.fechaFinOlimpiada = "La fecha de fin no puede ser pasada";
    }

    if (data.fechaInicioOlimpiada && data.fechaFinOlimpiada) {
      if (data.fechaFinOlimpiada <= data.fechaInicioOlimpiada) {
        nuevosErrores.fechaFinOlimpiada =
          "Debe ser posterior a la fecha de inicio";
      }
    }

    // Validar combinación única nombre + versión
    const existe = olympiads.some(
      (o) =>
        o.idOlimpiada !== olympiad.idOlimpiada &&
        o.nombreOlimpiada.trim().toLowerCase() ===
          data.nombreOlimpiada.trim().toLowerCase() &&
        parseInt(o.version) === parseInt(data.version)
    );

    if (existe) {
      nuevosErrores.nombreOlimpiada =
        "Ya existe una olimpiada con ese nombre y versión";
      nuevosErrores.version =
        "Ya existe una olimpiada con ese nombre y versión";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario(formData)) return;

    const result = await MySwal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas guardar los cambios?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await updateOlimpiada(olympiad.idOlimpiada, {
        ...formData,
        version: parseInt(formData.version),
        estadoOlimpiada: olympiad.estadoOlimpiada,
        idUsuario: olympiad.idUsuario || 1,
      });

      await MySwal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "La olimpiada se actualizó correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });

      onClose();
      onSuccess && onSuccess();
    } catch (error) {
      console.error("Error al actualizar:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la olimpiada.",
      });
    }
  };

  if (!isOpen || !olympiad) return null;

  return (
    <div className="adminModalOverlay">
      <div className="adminModalContent">
        <button className="adminModalCloseBtn" onClick={onClose}>
          ✖
        </button>
        <form onSubmit={handleSubmit} className="adminModalForm" noValidate>
          <h2 className="adminModalTitle">Editar Olimpiada</h2>

          <div className="adminFormGroup">
            <label className="adminFormLabel">Nombre *</label>
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
            <label className="adminFormLabel">Versión *</label>
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
              <label className="adminFormLabel">Fecha Inicio *</label>
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
              <label className="adminFormLabel">Fecha Fin *</label>
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
              onClick={onClose}
              className="adminModalBtnCancel"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="adminModalBtnSave"
              disabled={Object.keys(errors).length > 0}
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOlympiadModal;
