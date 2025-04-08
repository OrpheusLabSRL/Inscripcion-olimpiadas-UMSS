// src/features/administration/components/OlympiadsTable.jsx
import React, { useEffect, useState } from "react";
import { getOlimpiadas } from "../../../api/inscription.api"; // asegúrate que la ruta es correcta
import "../styles/General.css";

const OlympiadsTable = () => {
  const [olympiads, setOlympiads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOlimpiads = async () => {
      try {
        const data = await getOlimpiadas();
        setOlympiads(data.data);
      } catch (error) {
        setOlympiads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOlimpiads();
  }, []);

  if (loading) return <p>Cargando olimpiadas...</p>;

  return (
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
        {olympiads.map((item) => (
          <tr key={item.idOlimpiada}>
            <td>{item.nombreOlimpiada}</td>
            <td>{item.fechaInicioOlimp}</td>
            <td>{item.fechaFinOlimp}</td>
            <td>
              <span
                className={`badge badge-${
                  item.estadoOlimpiada ? "success" : "danger"
                }`}
              >
                {item.estadoOlimpiada ? "Activo" : "Finalizado"}
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
};

export default OlympiadsTable;
