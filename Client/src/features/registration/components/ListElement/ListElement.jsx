// css
import "./ListElement.css";

//React
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

//component
import { GenericModal } from "../../../../components/modals/GenericModal";

export const ListElement = ({ data }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = (e) => {
    e.preventDefault();
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="container-element-list">
      <div className="list-data-header">
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
              <td>{data.municipio}</td>
              <td>
                <div>
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
          <div className="data-section-summary">
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
                <span className="data-label">Municipio:</span>
                <span className="data-value">{data.municipio}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Correo Electrónico:</span>
                <span className="data-value">{data.correo}</span>
              </div>
            </div>
          </div>

          {data.inscripciones.map((inscripcion, index) => (
            <div key={`inscripcion-${index}`}>
              <div className="data-section-summary">
                <div className="section-header">
                  <h3>Área {index + 1}</h3>
                </div>
                <div className="data-grid">
                  <div className="data-item">
                    <span className="data-label">Nombre área:</span>
                    <span className="data-value">
                      {inscripcion.nombre_area}
                    </span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Categoría:</span>
                    <span className="data-value">
                      {inscripcion.nombre_categoria}
                    </span>
                  </div>

                  {inscripcion.nombre_tutor_area ? (
                    <>
                      <div className="data-item">
                        <span className="data-label">
                          Nombre tutor de área:
                        </span>
                        <span className="data-value">
                          {inscripcion.nombre_tutor_area}
                        </span>
                      </div>
                      <div className="data-item">
                        <span className="data-label">
                          Apellido tutor de área:
                        </span>
                        <span className="data-value">
                          {inscripcion.apellido_tutor_area}
                        </span>
                      </div>

                      <div className="data-item">
                        <span className="data-label">Tipo de tutor:</span>
                        <span className="data-value">
                          {inscripcion.tipo_tutor}
                        </span>
                      </div>
                      <div className="data-item">
                        <span className="data-label">Carnet de Identidad:</span>
                        <span className="data-value">
                          {inscripcion.carnetIdentidad}
                        </span>
                      </div>
                      <div className="data-item">
                        <span className="data-label">Telefono:</span>
                        <span className="data-value">
                          {inscripcion.telefono}
                        </span>
                      </div>
                      <div className="data-item">
                        <span className="data-label">Correo Electronico:</span>
                        <span className="data-value">{inscripcion.correo}</span>
                      </div>
                    </>
                  ) : (
                    <span className="data-value">
                      No se cuenta con tutor de área
                    </span>
                  )}
                </div>
              </div>

              <div className="data-section-summary">
                <div className="section-header">
                  <h3>Tutor legal para Área {index + 1}</h3>
                </div>
                <div className="data-grid">
                  <div className="data-item">
                    <span className="data-label">Nombre tutor legal:</span>
                    <span className="data-value">
                      {inscripcion.tutor_legal.nombre}
                    </span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Apellido tutor de legal:</span>
                    <span className="data-value">
                      {inscripcion.tutor_legal.apellido}
                    </span>
                  </div>

                  <div className="data-item">
                    <span className="data-label">Tipo de tutor:</span>
                    <span className="data-value">
                      {inscripcion.tutor_legal.tipo_tutor}
                    </span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Carnet de Identidad:</span>
                    <span className="data-value">
                      {inscripcion.tutor_legal.carnetIdentidad}
                    </span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Telefono:</span>
                    <span className="data-value">
                      {inscripcion.tutor_legal.telefono}
                    </span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Correo Electronico:</span>
                    <span className="data-value">
                      {inscripcion.tutor_legal.correo}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="data-section-summary">
            <div className="section-header">
              <h3>Responsable de inscripción</h3>
            </div>
            <div className="data-grid">
              <div className="data-item">
                <span className="data-label">Nombre tutor legal:</span>
                <span className="data-value">
                  {data.responsableInscripcion.nombre}
                </span>
              </div>
              <div className="data-item">
                <span className="data-label">Apellido tutor de legal:</span>
                <span className="data-value">
                  {data.responsableInscripcion.apellido}
                </span>
              </div>
              <div className="data-item">
                <span className="data-label">Carnet de Identidad:</span>
                <span className="data-value">
                  {data.responsableInscripcion.carnetIdentidad}
                </span>
              </div>
              <div className="data-item">
                <span className="data-label">Telefono:</span>
                <span className="data-value">
                  {data.responsableInscripcion.telefono}
                </span>
              </div>
              <div className="data-item">
                <span className="data-label">Correo Electronico:</span>
                <span className="data-value">
                  {data.responsableInscripcion.correo}
                </span>
              </div>
            </div>
          </div>
        </div>
      </GenericModal>
    </div>
  );
};
