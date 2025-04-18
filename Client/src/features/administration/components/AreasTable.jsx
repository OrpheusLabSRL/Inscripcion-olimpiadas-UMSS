import React, { useEffect, useState } from "react";
import { getAreas } from "../../../api/inscription.api";
import "../Styles/General.css";

const AreasTable = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await getAreas();
        setAreas(data);
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
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AreasTable;
