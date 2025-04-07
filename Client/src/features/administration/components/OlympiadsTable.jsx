// src/features/administration/components/OlympiadsTable.jsx
import React from "react";

const olympiads = [
  {
    nombre: "Olimpiada Oh SanSi 2023",
    inicio: "2023-08-01",
    fin: "2023-12-15",
    estado: "Finalizado",
  },
  {
    nombre: "Olimpiada Oh! SanSi 2024",
    inicio: "2024-09-15",
    fin: "2024-11-30",
    estado: "Finalizado",
  },
  {
    nombre: "Olimpiada Oh! SanSi 2025",
    inicio: "2025-03-01",
    fin: "2025-06-30",
    estado: "Activo",
  },
];

const OlympiadsTable = () => (
  <table className="data-table">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Fecha inicio</th>
        <th>Fecha fin</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {olympiads.map((item, i) => (
        <tr key={i}>
          <td>{item.nombre}</td>
          <td>{item.inicio}</td>
          <td>{item.fin}</td>
          <td>
            <span
              className={`badge badge-${
                item.estado === "Activo" ? "success" : "danger"
              }`}
            >
              {item.estado}
            </span>
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

export default OlympiadsTable;
