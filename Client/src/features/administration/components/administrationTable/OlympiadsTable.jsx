import React, { useEffect, useState } from "react";
import { getOlimpiadas } from "../../../../api/inscription.api";
import OlympiadsModal from "../administrationModal/OlympiadsModal";
import BaseDataModal from "../administrationModal/BaseDataModal";
import { CiCircleInfo } from "react-icons/ci";
import { MdEdit } from "react-icons/md";
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
      console.error("Error al obtener olimpiadas:", error);
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
          {loading ? (
            <tr>
              <td colSpan="5">Cargando olimpiadas...</td>
            </tr>
          ) : olympiads.length > 0 ? (
            olympiads.map((item) => (
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
                  <button
                    onClick={() => handleView(item)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.5rem",
                    }}
                  >
                    <CiCircleInfo />
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.5rem",
                      marginLeft: "0.5rem",
                    }}
                  >
                    <MdEdit />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay olimpiadas registradas.</td>
            </tr>
          )}
        </tbody>
      </table>

      <OlympiadsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        olimpiada={selectedOlympiad}
      />

      <BaseDataModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        olimpiada={selectedOlympiad}
      />
    </>
  );
};

export default OlympiadsTable;
