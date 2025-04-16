// css
import "./ListElement.css";

//React
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { useEffect } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";


//api
import {
  getAreasOlimpista,
  getTutoresOlimpista,
} from "../../../../api/inscription.api";

//component
import { GenericModal } from "../../../../components/modals/GenericModal";

export const ListElement = ({ data }) => {
  const [areasOlimpista, setAreasOlimpista] = useState([]);
  const [tutoresOlimpista, setTutoresOlimpista] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const areasOlimpistas = async () => {
      const res = await getAreasOlimpista(data.id_olimpista);
      setAreasOlimpista(res.data.data.areas);
    };

    const tutoresOlimpistas = async () => {
      const res = await getTutoresOlimpista(data.id_olimpista);
      setTutoresOlimpista(res.data.data);
    };

    areasOlimpistas();
    tutoresOlimpistas();
  }, []);

  const openModal = (e) => {
    e.preventDefault();
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const chooseTitleTutor = (rol) => {
    if (rol == "responsable inscripcion") return "Responsable de Inscripción";

    if (rol == "tutor area1") return "Tutor de área 1";
    if (rol == "tutor area2") return "Tutor de área 2";
    if (rol == "tutor legal") return "Tutor Legal";
  };

  return (
    <div className="container-element-list">
      <div className="list-data-header" key={data.id_olimpista}>
        <table className="container-table-list">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>CI</th>
              <th>Fecha Nacimiento</th>
              <th>Colegio</th>
              <th>Curso</th>
              <th>Departamento</th>
              <th>Provincia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.nombre}</td>
              <td>{data.apellido}</td>
              <td>{data.carnetIdentidad}</td>
              <td>{data.fechaNacimiento}</td>
              <td>{data.colegio}</td>
              <td>{data.curso}</td>
              <td>{data.departamento}</td>
              <td>{data.provincia}</td>
              <td>
                <div>
                  <FaEdit
                    style={{
                      fontSize: "25px",
                      color: "orange",
                      marginRight: "8px",
                      cursor: "pointer",
                    }}
                  />
                  <MdDelete
                    style={{
                      fontSize: "25px",
                      color: "red",
                      marginRight: "8px",
                      cursor: "pointer",
                    }}
                  />
                  <FaInfoCircle
                    style={{
                      fontSize: "25px",
                      color: "blue",
                      cursor: "pointer",
                    }}
                    onClick={openModal}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <GenericModal modalIsOpen={modalIsOpen} closeModal={closeModal}>
        <div className="olimpista-modal">
          <div className="data-section">
            <div className="section-header">
              <h3>Datos de olimpista</h3>
            </div>
            <div className="data-grid">
              <div className="data-item">
                <span className="data-label">Nombre:</span>
                <span className="data-value">{data.nombre}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Apellido:</span>
                <span className="data-value">{data.apellido}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Fecha de Nacimiento:</span>
                <span className="data-value">{data.fechaNacimiento}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Carnet de Identidad:</span>
                <span className="data-value">{data.carnetIdentidad}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Colegio:</span>
                <span className="data-value">{data.colegio}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Curso:</span>
                <span className="data-value">{data.curso}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Departamento:</span>
                <span className="data-value">{data.departamento}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Provincia:</span>
                <span className="data-value">{data.provincia}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Correo Electrónico:</span>
                <span className="data-value">{data.correo}</span>
              </div>
            </div>
          </div>

          {tutoresOlimpista.map((tutor, index) => (
            <div className="data-section" key={`tutor-${index}`}>
              <div className="section-header">
                <h3>{chooseTitleTutor(tutor.rol)}</h3>
              </div>
              <div className="data-grid">
                <div className="data-item">
                  <span className="data-label">Nombre:</span>
                  <span className="data-value">{tutor.nombre}</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Apellido:</span>
                  <span className="data-value">{tutor.apellido}</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Carnet de Identidad:</span>
                  <span className="data-value">{tutor.carnetIdentidad}</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Tipo de tutor:</span>
                  <span className="data-value">{tutor.tipoTutor}</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Número de celular:</span>
                  <span className="data-value">{tutor.numeroCelular}</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Correo Electrónico:</span>
                  <span className="data-value">{tutor.correo}</span>
                </div>
              </div>
            </div>
          ))}

          {areasOlimpista.map((area, index) => (
            <div className="data-section" key={`area-${index}`}>
              <div className="section-header">
                <h3>Área {index + 1}</h3>
              </div>
              <div className="data-grid">
                <div className="data-item">
                  <span className="data-label">Nombre área:</span>
                  <span className="data-value">{area.nombreArea}</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Categoría:</span>
                  <span className="data-value">
                    {area.categorias[0].nombreCategoria}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GenericModal>
    </div>
  );
};
