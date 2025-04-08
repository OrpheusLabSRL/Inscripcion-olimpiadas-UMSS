import React, { useState, useEffect } from "react";
import {
  getAreas,
  getGrados,
  createCategoria,
} from "../../../api/inscription.api";
import "../styles/ModalGeneral.css";

const ModalAgregarCategoria = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombreCategoria: "",
    area: "",
    grado: "",
    estado: true,
  });

  const [areas, setAreas] = useState([]);
  const [grados, setGrados] = useState([]);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const areasFromAPI = await getAreas();
        const gradosFromAPI = await getGrados();
        setAreas(areasFromAPI);
        setGrados(gradosFromAPI);
      } catch (err) {
        console.error("Error al obtener áreas o grados:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      nombreCategoria: formData.nombreCategoria,
      estado: formData.estado,
      idArea: parseInt(formData.area),
      idGrado: parseInt(formData.grado),
    };

    try {
      console.log(data);
      await createCategoria(data);
      setErrors(null);
      onSubmit();
      onClose();
    } catch (error) {
      console.error("Error al registrar categoría:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-title">Agregar categoría</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre de la categoría</label>
            <input
              type="text"
              name="nombreCategoria"
              value={formData.nombreCategoria}
              onChange={handleChange}
              required
            />
            {errors?.nombreCategoria && (
              <span className="error-message">{errors.nombreCategoria[0]}</span>
            )}
          </div>

          <div className="form-group">
            <label>Área</label>
            <select
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un área</option>
              {areas.map((area) => (
                <option key={area.idArea} value={area.idArea}>
                  {area.nombreArea}
                </option>
              ))}
            </select>
            {errors?.areas && (
              <span className="error-message">{errors.areas[0]}</span>
            )}
          </div>

          <div className="form-group">
            <label>Grado</label>
            <select
              name="grado"
              value={formData.grado}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un grado</option>
              {grados.map((grado) => (
                <option key={grado.idGrado} value={grado.idGrado}>
                  {grado.numeroGrado}° de {grado.nivel}
                </option>
              ))}
            </select>
            {errors?.grados && (
              <span className="error-message">{errors.grados[0]}</span>
            )}
          </div>

          <div className="checkbox-row">
            <label htmlFor="estado">
              <span>Activo</span>
              <input
                id="estado"
                type="checkbox"
                name="estado"
                checked={formData.estado}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="save-button">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAgregarCategoria;
