import React, { useState } from "react";
import FormField from "./FormField";
import SelectField from "./SelectField";
import styles from "./OlympistaForm.module.css";

const departamentosBolivia = [
  "Chuquisaca",
  "La Paz",
  "Cochabamba",
  "Oruro",
  "Potosí",
  "Tarija",
  "Santa Cruz",
  "Beni",
  "Pando",
];

const OlympistaForm = ({ onNext }) => {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    ci: "",
    colegio: "",
    curso: "",
    departamento: "",
    provincia: "",
    email: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [provincias, setProvincias] = useState([]);

  const provinciasPorDepartamento = {
    Chuquisaca: ["Sucre", "Monteagudo", "Camargo", "Villa Abecia", "Yotala"],
    "La Paz": [
      "La Paz",
      "El Alto",
      "Viacha",
      "Chulumani",
      "Coroico",
      "Sorata",
    ],
    Cochabamba: [
      "Cochabamba",
      "Quillacollo",
      "Sacaba",
      "Punata",
      "Villa Tunari",
    ],
    Oruro: ["Oruro", "Huanuni", "Challapata", "Poopó", "Eucaliptus"],
    Potosí: ["Potosí", "Uyuni", "Villazón", "Llallagua", "Tupiza"],
    Tarija: ["Tarija", "Yacuiba", "Villa Montes", "Bermejo", "Entre Ríos"],
    "Santa Cruz": [
      "Santa Cruz de la Sierra",
      "Montero",
      "Warnes",
      "Yapacaní",
      "San Ignacio de Velasco",
    ],
    Beni: ["Trinidad", "Riberalta", "Guayaramerín", "San Ignacio", "Santa Ana"],
    Pando: ["Cobija", "Puerto Rico", "Porvenir", "Filadelfia", "Nueva Esperanza"],
  };
  const colegiosCochabamba = [
    "Colegio Anglo Americano",
    "Colegio Alemán Santa María",
    "Colegio Don Bosco",
    "Colegio La Salle",
    "Colegio San Agustín",
    "Colegio Maryknoll",
    "Colegio Espíritu Santo",
    "Colegio Adventista Maranatha",
    "Colegio Bautista Boliviano",
    "Colegio Boliviano Holandés",
  ];
  const cursosPrimariaSecundaria = [
    "3ro de Primaria",
    "4to de Primaria",
    "5to de Primaria",
    "6to de Primaria",
    "1ro de Secundaria",
    "2do de Secundaria",
    "3ro de Secundaria",
    "4to de Secundaria",
    "5to de Secundaria",
    "6to de Secundaria",
  ];
  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      "nombres",
      "apellidos",
      "fechaNacimiento",
      "ci",
      "colegio",
      "curso",
      "departamento",
      "provincia",
      "email",
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

    if (name === "departamento") {
      setProvincias(provinciasPorDepartamento[value] || []);
      setFormData((prev) => ({ ...prev, provincia: "" })); // Reset provincia when departamento changes
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <section className={styles.formContainer}>
      <h2 className={styles.title}>Datos del Olimpista</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <FormField
            label="Nombres"
            required
            type="text"
            name="nombres"
            placeholder="Ingrese sus nombres"
            value={formData.nombres}
            onChange={handleChange}
            error={formErrors.nombres}
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

          <FormField
            label="Fecha de Nacimiento"
            required
            type="date"
            name="fechaNacimiento"
            placeholder="Seleccione su fecha de nacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            error={formErrors.fechaNacimiento}
          />

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

          <SelectField
            label="Colegio"
            required
            name="colegio"
            value={formData.colegio}
            onChange={handleChange}
            error={formErrors.colegio}
          >
            <option value="">Seleccione el colegio del olimpista</option>
            {colegiosCochabamba.map((colegio) => (
              <option key={colegio} value={colegio}>
                {colegio}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Curso"
            required
            name="curso"
            value={formData.curso}
            onChange={handleChange}
            error={formErrors.curso}
          >
            <option value="">Seleccione un curso</option>
            {cursosPrimariaSecundaria.map((curso) => (
              <option key={curso} value={curso}>
                {curso}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Departamento"
            required
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
            error={formErrors.departamento}
          >
            <option value="">Seleccione un departamento</option>
            {departamentosBolivia.map((departamento) => (
              <option key={departamento} value={departamento}>
                {departamento}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Provincia"
            required
            name="provincia"
            value={formData.provincia}
            onChange={handleChange}
            error={formErrors.provincia}
            disabled={!formData.departamento} // Disable if no department is selected
          >
            <option value="">Seleccione una provincia</option>
            {provincias.map((provincia) => (
              <option key={provincia} value={provincia}>
                {provincia}
              </option>
            ))}
          </SelectField>

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
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submitButton}>
            SIGUIENTE
          </button>
        </div>
      </form>
    </section>
  );
};

export default OlympistaForm;