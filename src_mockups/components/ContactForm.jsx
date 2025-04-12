import React, { useState } from "react";
import FormField from "./FormField";
import SelectField from "./SelectField";
import BackButton from "./BackButton";
import styles from "./ContactForm.module.css";

const ContactForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    tipoContacto: "",
    ci: "",
    email: "",
    telefono: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      "nombre",
      "apellidos",
      "tipoContacto",
      "ci",
      "email",
      "telefono",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = "Este campo es obligatorio";
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Ingrese un correo electrónico válido";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Contact Form submitted:", formData);
    }
  };

  
  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.backButtonContainer}>
          <BackButton onClick={onBack} />
        </div>
      </div>

      <section className={styles.formContainer}>
        <h2 className={styles.title}>Datos de Contacto</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <FormField
              label="Nombre"
              required
              type="text"
              name="nombre"
              placeholder="Ingrese su nombre"
              value={formData.nombre}
              onChange={handleChange}
              error={formErrors.nombre}
            />

            <FormField
              label="Apellidos"
              required
              type="text"
              name="apellidos"
              placeholder="Ingrese sus apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              error={formErrors.apellidos}
            />

            <SelectField
              label="Tipo de Contacto"
              required
              name="tipoContacto"
              value={formData.tipoContacto}
              onChange={handleChange}
              error={formErrors.tipoContacto}
            >
              <option value="">Seleccione el tipo de contacto</option>
              <option value="padre">Padre</option>
              <option value="madre">Madre</option>
              <option value="tutor">Tutor</option>
            </SelectField>

            <FormField
              label="Carnet de Identidad"
              required
              type="text"
              name="ci"
              placeholder="Ingrese su CI"
              value={formData.ci}
              onChange={handleChange}
              error={formErrors.ci}
            />

            <div className={styles.fullWidth}>
              <FormField
                label="Correo Electrónico"
                required
                type="email"
                name="email"
                placeholder="usuario@dominio.com"
                value={formData.email}
                onChange={handleChange}
                error={formErrors.email}
              />
            </div>

            <div className={styles.halfWidth}>
              <FormField
                label="Número de Teléfono"
                required
                type="tel"
                name="telefono"
                placeholder="Ingrese su número de teléfono"
                value={formData.telefono}
                onChange={handleChange}
                error={formErrors.telefono}
              />
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitButton}>
              SIGUIENTE
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
export default ContactForm;
