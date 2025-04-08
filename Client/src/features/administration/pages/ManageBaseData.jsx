// src/features/administration/pages/ManageBaseData.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./../Styles/BaseData.css";

const ManageBaseData = () => {
  const navigate = useNavigate();

  const items = [
    {
      title: "Áreas",
      description:
        "Gestiona las áreas principales de competencia como Matemáticas, Física, Química, etc.",
      icon: "",
      route: "/admin/areas",
    },
    {
      title: "Categorías",
      description:
        "Define las categorías por nivel, edad o tipo de participación dentro de cada área.",
      icon: "",
      route: "/admin/categorias",
    },
    {
      title: "Formulario de Inscripción",
      description:
        "Personaliza los campos y requisitos del formulario de inscripción.",
      icon: "",
      route: "/admin/formulario-inscripcion", // ruta placeholder
    },
  ];

  return (
    <div style={{ padding: "2rem", color: "black" }}>
      <h1>Datos Base</h1>
      <p>Configura las áreas, categorías y el formulario de inscripción</p>

      <div className="base-grid">
        {items.map((item, idx) => (
          <div key={idx} className="card-item">
            <div className="card-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <button className="add-button" onClick={() => navigate(item.route)}>
              Configurar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBaseData;
