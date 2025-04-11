// src/features/administration/components/AreasTable.jsx
import React, { useEffect, useState } from "react";
import { getAreas } from "../../../api/inscription.api"; // asegúrate que esta ruta esté bien
import "../styles/General.css";

const AreasTable = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await getAreas();
        setAreas(data); // ✅ arreglo directo desde la API
      } catch (error) {
        console.error("Error al obtener áreas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  if (loading) return <p>Cargando áreas...</p>;

  return (
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
        {areas.map((area) => (
          <tr key={area.idArea}>
            <td>{area.nombreArea}</td>
            <td>{area.descripcionArea}</td>
            <td>Bs.{area.costoArea}</td>
            <td>
              <span
                className={`badge badge-${
                  area.estadoArea ? "success" : "danger"
                }`}
              >
                {area.estadoArea ? "Activo" : "Inactivo"}
              </span>
            </td>
            {/*<td>
              <button>✏️</button>
              <button>🗑️</button>
            </td>*/}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AreasTable;
