// src/features/categories/components/CategoriesTable.jsx
import React from "react";
import "../styles/General.css";

const mockData = [
  {
    nombre: "4S",
    areas: "Astronomía-Astrofísica, Biología, Física, Química",
    grado: "4to Secundaria",
    estado: "Activo",
  },
  {
    nombre: "5S",
    areas: "Astronomía-Astrofísica, Biología, Física, Química",
    grado: "5to Secundaria",
    estado: "Activo",
  },
];

const CategoriesTable = () => (
  <table className="data-table">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Áreas</th>
        <th>Grado</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {mockData.map((cat, i) => (
        <tr key={i}>
          <td>{cat.nombre}</td>
          <td>{cat.areas}</td>
          <td>{cat.grado}</td>
          <td>
            <span className="badge badge-success">{cat.estado}</span>
          </td>
          <td>
            <button>✏️</button>
            <button>🗑️</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default CategoriesTable;
