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
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = "Nombre es requerido";
    if (!formData.apellido.trim()) newErrors.apellido = "Apellido es requerido";
    if (!formData.tipoTutor) newErrors.tipoTutor = "Tipo de tutor es requerido";
    if (!formData.carnet.trim()) newErrors.carnet = "Carnet es requerido";
    if (!formData.email.trim()) {
      newErrors.email = "Email es requerido";
    } else if (!validateEmail(formData.email)) {
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
                  <label>Nombre <span className="required">*</span></label>
                  <input 
                    type="text" 
                    name="nombre"
                    placeholder="Ingrese su nombre" 
                    value={formData.nombre}
                    onChange={handleInputChange}
                  />
                  {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                </div>
                <div className="form-group">
                  <label>Apellido <span className="required">*</span></label>
                  <input 
                    type="text" 
                    name="apellido"
                    placeholder="Ingrese su apellido" 
                    value={formData.apellido}
                    onChange={handleInputChange}
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
                >
                  <option value="">Seleccione tipo de tutor</option>
                  <option value="Profesor">Profesor</option>
                  <option value="Madre">Madre</option>
                  <option value="Padre">Padre</option>
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
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <button type="submit" className="submit-button">Iniciar Nueva Inscripción</button>
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
                  />
                  {errors.carnet && <span className="error-message">{errors.carnet}</span>}
                </div>

                <button type="submit" className="submit-button">Continuar Inscripción</button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };