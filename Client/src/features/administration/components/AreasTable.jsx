import React from "react";
import "../styles/General.css";

const mockData = [
  {
    nombre: "Matemáticas",
    descripcion: "Resolución de problemas matemáticos",
    costo: "Bs.20",
    estado: "Activo",
  },
  {
    nombre: "Física",
    descripcion: "Principios fundamentales de física",
    costo: "Bs.15",
    estado: "Activo",
  },
];

const AreasTable = () => (
  <table className="data-table">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Descripción</th>
        <th>Costo</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {mockData.map((area, i) => (
        <tr key={i}>
          <td>{area.nombre}</td>
          <td>{area.descripcion}</td>
          <td>{area.costo}</td>
          <td>
            <span className="badge badge-success">{area.estado}</span>
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

export default AreasTable;
