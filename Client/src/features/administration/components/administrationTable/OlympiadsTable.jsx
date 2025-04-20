import React, { useEffect, useState } from "react";
import { getOlimpiadas } from "../../../../api/inscription.api";
import OlympiadsModal from "../administrationModal/OlympiadsModal";
import BaseDataModal from "../administrationModal/BaseDataModal"; // 👈 Asegúrate de que la ruta sea correcta
import "../../Styles/General.css";

const OlympiadsTable = () => {
  const [olympiads, setOlympiads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOlympiad, setSelectedOlympiad] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchOlimpiads = async () => {
    try {
      const data = await getOlimpiadas();
      setOlympiads(data.data);
      console.log("Respuesta cruda de la API:", data.data);
    } catch (error) {
      setOlympiads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOlimpiads();
  }, []);

  const handleView = (olympiad) => {
    setSelectedOlympiad(olympiad);
    setIsModalOpen(true);
  };

  const handleEdit = (olympiad) => {
    setSelectedOlympiad(olympiad);
    setIsEditModalOpen(true);
  };

  if (loading) return <p>Cargando olimpiadas...</p>;

  return (
    <>
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
              <td>{item.fechaInicioOlimpiada}</td>
              <td>{item.fechaFinOlimpiada}</td>
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
                <button onClick={() => handleView(item)}>👁️</button>
                <button
                  onClick={() => handleEdit(item)}
                  style={{ marginLeft: "0.5rem" }}
                >
                  ✏️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para ver detalles */}
      <OlympiadsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        olimpiada={selectedOlympiad}
      />

      {/* Modal para editar (BaseData) */}
      <BaseDataModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        olimpiada={selectedOlympiad}
      />
    </>
  );
};

export default OlympiadsTable;
