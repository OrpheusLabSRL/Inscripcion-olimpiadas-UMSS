import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TutorForm.css";
import HeaderProp from "../../../../features/home/components/HeaderProp";

export const TutorForm = () => {
  const [formType, setFormType] = useState("new");
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    tipoTutor: "",
    carnet: "",
    email: ""
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validación en tiempo real
    let filteredValue = value;
    if (name === "nombre" || name === "apellido") {
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
      if (name === "nombre" && filteredValue.length > 30) return;
      if (name === "apellido" && filteredValue.length > 30) return;
    } else if (name === "carnet") {
      filteredValue = value.replace(/[^a-zA-Z0-9]/g, "");
      if (filteredValue.length > 12) return;
    }
    
    setFormData({
      ...formData,
      [name]: filteredValue
    });

    // Validación en tiempo real
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
      switch (name) {
        case "nombre":
        case "apellido":
          if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
            error = "Solo se permiten caracteres alfabéticos";
          }
          break;
        case "email":
          if (!validateEmail(value)) {
            error = "Email no válido";
          }
          break;
        case "carnet":
          if (!/^[a-zA-Z0-9]+$/.test(value)) {
            error = "Solo se permiten caracteres alfanuméricos";
          }
          break;
        default:
          break;
      }
    }
    
    setErrors({ ...errors, [name]: error });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = ["nombre", "apellido", "tipoTutor", "carnet", "email"];
    
    fieldsToValidate.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = "Este campo es requerido";
      }
    });
    
    if (!validateEmail(formData.email) && formData.email.trim()) {
      newErrors.email = "Email no válido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate('/register');
    }
  };

  const validateContinueForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email es requerido";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email no válido";
    }
    if (!formData.carnet.trim()) newErrors.carnet = "Carnet es requerido";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (validateContinueForm()) {
      navigate('/register');
    }
  };

  const getInputClass = (name) => {
    if (!touched[name]) return "";
    return errors[name] ? "invalid-input" : "valid-input";
  };

  return (
    <div className="tutor-page-wrapper">
      <HeaderProp />
      <div className="tutor-form-content">
        <div className="tutor-form-container">
          <h1>Proceso de Inscripción</h1>
          <p className="form-description">Inicia una nueva inscripción o continua si ya empezaste una</p>
          
          <div className="form-options-container">
            <button 
              className={`form-option ${formType === 'new' ? 'active' : ''}`}
              onClick={() => setFormType('new')}
            >
              Nueva inscripción
            </button>
            <button 
              className={`form-option ${formType === 'continue' ? 'active' : ''}`}
              onClick={() => setFormType('continue')}
            >
              Continuar inscripción
            </button>
          </div>

          {formType === 'new' ? (
            <form onSubmit={handleSubmit} className="form-section">
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre(s) <span className="required">*</span></label>
                  <input 
                    type="text" 
                    name="nombre"
                    placeholder="Ingrese su(s) nombre(s)" 
                    value={formData.nombre}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={getInputClass("nombre")}
                    maxLength={30}
                  />
                  {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                </div>
                <div className="form-group">
                  <label>Apellido(s) <span className="required">*</span></label>
                  <input 
                    type="text" 
                    name="apellido"
                    placeholder="Ingrese su(s) apellido(s)" 
                    value={formData.apellido}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={getInputClass("apellido")}
                    maxLength={30}
                  />
                  {errors.apellido && <span className="error-message">{errors.apellido}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Tipo de Tutor <span className="required">*</span></label>
                <select 
                  name="tipoTutor"
                  value={formData.tipoTutor}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={getInputClass("tipoTutor")}
                >
                  <option value="">Seleccione tipo de tutor</option>
                  <option value="Profesor">Profesor</option>
                  <option value="Madre">Madre</option>
                  <option value="Padre">Padre</option>
                  <option value="Tutor Legal">Tutor Legal</option>
                </select>
                {errors.tipoTutor && <span className="error-message">{errors.tipoTutor}</span>}
              </div>

              <div className="form-group">
                <label>Carnet de identidad <span className="required">*</span></label>
                <input 
                  type="text" 
                  name="carnet"
                  placeholder="Ingrese su carnet de identidad" 
                  value={formData.carnet}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={getInputClass("carnet")}
                  maxLength={12}
                />
                {errors.carnet && <span className="error-message">{errors.carnet}</span>}
              </div>

              <div className="form-group">
                <label>Correo Electrónico <span className="required">*</span></label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Ingrese su correo electrónico" 
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={getInputClass("email")}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-buttons">
                <button type="button" className="back-button" onClick={() => navigate(-1)}>
                  Atrás
                </button>
                <button type="submit" className="submit-button">
                  Siguiente
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleContinue} className="form-section">
              <div className="form-group">
                <label>Correo Electrónico <span className="required">*</span></label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Ingrese su correo electrónico" 
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={getInputClass("email")}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Carnet de identidad <span className="required">*</span></label>
                <input 
                  type="text" 
                  name="carnet"
                  placeholder="Ingrese su carnet de identidad" 
                  value={formData.carnet}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={getInputClass("carnet")}
                  maxLength={12}
                />
                {errors.carnet && <span className="error-message">{errors.carnet}</span>}
              </div>

              <div className="form-buttons">
                <button type="button" className="back-button" onClick={() => navigate(-1)}>
                  Atrás
                </button>
                <button type="submit" className="submit-button">
                  Continuar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};