import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderProp from "../../home_usuario/components/HeaderProp";
import "../Styles/ResultadoConsulta.css";

const ResultadoConsulta = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultado = location.state?.resultado;
  const [showModal, setShowModal] = useState(false);
  const [selectedInscripcion, setSelectedInscripcion] = useState(null);

  console.log("Datos completos recibidos:", resultado);
  console.log("Datos de olimpistas:", resultado?.data?.olimpistas);

  // Verificamos que los datos de olimpistas tengan idInscripcion
  if (resultado?.data?.olimpistas) {
    resultado.data.olimpistas.forEach((olimpista, index) => {
      console.log(`Olimpista ${index}:`, olimpista);
      console.log(`ID Inscripción ${index}:`, olimpista.idInscripcion);
      console.log(`Área del olimpista ${index}:`, olimpista.area);
      console.log(`Categoría del olimpista ${index}:`, olimpista.categoria);
    });
  }

  if (!resultado || !resultado.success || !resultado.data) {
    return (
      <div className="resultado-container">
        <HeaderProp />
        <div className="resultado-content">
          <div className="error-message">
            <h3>Error</h3>
            <p>No se encontró la información solicitada.</p>
            <button
              className="btn-consulta"
              onClick={() => navigate("/consultar-inscripcion")}
            >
              Volver a consultar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { olimpista, inscripciones, tutor } = resultado.data;

  console.log("Datos de inscripciones del olimpista:", inscripciones);
  if (Array.isArray(inscripciones)) {
    inscripciones.forEach((inscripcion, index) => {
      console.log(`Inscripción ${index}:`, inscripcion);
      console.log(`Área ${index}:`, inscripcion.area);
      console.log(`Categoría ${index}:`, inscripcion.categoria);
    });
  }

  const handleVolver = () => {
    navigate("/consultar-inscripcion");
  };

  const renderPersonaInfo = (persona, tipo) => {
    return (
      <div className="persona-info">
        <h3 className="titulo-resultado">Información del {tipo}</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Nombre:</span>
            <span className="info-value">{persona.nombre}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Apellido:</span>
            <span className="info-value">{persona.apellido}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Carnet de Identidad:</span>
            <span className="info-value">{persona.carnetIdentidad}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Correo Electrónico:</span>
            <span className="info-value">{persona.correoElectronico}</span>
          </div>
        </div>
      </div>
    );
  };

  const handleVerDetalles = (inscripcion) => {
    setSelectedInscripcion(inscripcion);
    setShowModal(true);
  };

  const ModalDetalles = ({ inscripcion, onClose }) => {
    if (!inscripcion) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Detalles de la Inscripción</h3>
            <button className="close-button" onClick={onClose}>&times;</button>
          </div>
          <div className="modal-body">
            <div className="data-section">
              <h4>Información del Área</h4>
              <p><strong>Área:</strong> {inscripcion.olimpiadaAreaCategoria?.area?.nombreArea || "No disponible"}</p>
              <p><strong>Categoría:</strong> {inscripcion.olimpiadaAreaCategoria?.categoria?.nombreCategoria || "No disponible"}</p>
            </div>
            <div className="data-section">
              <h4>Información del Tutor Responsable</h4>
              <p><strong>Nombre:</strong> {inscripcion.tutorResponsable?.nombre} {inscripcion.tutorResponsable?.apellido}</p>
              <p><strong>Carnet de Identidad:</strong> {inscripcion.tutorResponsable?.carnetIdentidad}</p>
              <p><strong>Correo Electrónico:</strong> {inscripcion.tutorResponsable?.correoElectronico}</p>
              <p><strong>Teléfono:</strong> {inscripcion.tutorResponsable?.telefono}</p>
            </div>
            {inscripcion.tutorArea && (
              <div className="data-section">
                <h4>Información del Tutor de Área</h4>
                <p><strong>Nombre:</strong> {inscripcion.tutorArea?.nombre} {inscripcion.tutorArea?.apellido}</p>
                <p><strong>Carnet de Identidad:</strong> {inscripcion.tutorArea?.carnetIdentidad}</p>
                <p><strong>Correo Electrónico:</strong> {inscripcion.tutorArea?.correoElectronico}</p>
                <p><strong>Teléfono:</strong> {inscripcion.tutorArea?.telefono}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderOlimpistasTable = (olimpistas) => {
    console.log("Renderizando tabla de olimpistas con datos:", olimpistas);

    if (!olimpistas || olimpistas.length === 0) {
      return (
        <div className="olimpistas-info">
          <h3 className="titulo-resultado">Olimpistas</h3>
          <p>No hay inscripciones registradas.</p>
        </div>
      );
    }

    return (
      <div className="olimpistas-info">
        <h3 className="titulo-resultado">Olimpistas</h3>
        <div className="table-container">
          <table className="olimpistas-table">
            <thead>
              <tr>
                <th>ID Inscripción</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Carnet de Identidad</th>
                <th>Área</th>
                <th>Categoría</th>
                <th>Tipo de Tutor</th>
                <th>Estado de Pago</th>
              </tr>
            </thead>
            <tbody>
              {olimpistas.map((olimpista) => {
                console.log("Datos del olimpista:", olimpista);
                return (
                  <tr key={olimpista.idInscripcion}>
                    <td>{olimpista.idInscripcion}</td>
                    <td>{olimpista.nombre}</td>
                    <td>{olimpista.apellido}</td>
                    <td>{olimpista.carnetIdentidad}</td>
                    <td>{olimpista.area}</td>
                    <td>{olimpista.categoria}</td>
                    <td>{olimpista.tipoTutor}</td>
                    <td
                      className={
                        olimpista.estadoPago === "PAGO PENDIENTE"
                          ? "estado-pendiente"
                          : "estado-realizado"
                      }
                    >
                      {olimpista.estadoPago}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Si es una consulta de olimpista
  if (olimpista) {
    return (
      <>
        <HeaderProp />
        <div className="resultado-container">
          <div className="resultado-content">
            <h2 className="titulo-resultado">Resultado de la Consulta</h2>

            {/* Información del Olimpista */}
            {renderPersonaInfo(olimpista, "Olimpista")}

            {/* Tabla de Inscripciones */}
            <div className="inscripciones-info">
              <h3 className="titulo-resultado">Mis Inscripciones</h3>
              <div className="table-container">
                <table className="inscripciones-table">
                  <thead>
                    <tr>
                      <th>Área</th>
                      <th>Categoría</th>
                      <th>Tutor Responsable</th>
                      <th>Estado de Pago</th>
                      {inscripciones?.some(ins => ins.formaInscripcion === 'Excel') && <th>Acciones</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(inscripciones) && inscripciones.length > 0 ? (
                      inscripciones.map((inscripcion, index) => (
                        <tr key={index}>
                          <td>
                            {inscripcion.olimpiadaAreaCategoria?.area?.nombreArea || "No disponible"}
                          </td>
                          <td>
                            {inscripcion.olimpiadaAreaCategoria?.categoria?.nombreCategoria || "No disponible"}
                          </td>
                          <td>
                            {inscripcion.tutorResponsable ? 
                              `${inscripcion.tutorResponsable.nombre} ${inscripcion.tutorResponsable.apellido}` : 
                              "No disponible"
                            }
                          </td>
                          <td
                            className={
                              inscripcion.estadoInscripcion === 0
                                ? "estado-pendiente"
                                : "estado-realizado"
                            }
                          >
                            {inscripcion.estadoInscripcion === 0
                              ? "PAGO PENDIENTE"
                              : "PAGO REALIZADO"}
                          </td>
                          {inscripcion.formaInscripcion === 'Excel' && (
                            <td>
                              <button 
                                className="ver-detalles-btn"
                                onClick={() => handleVerDetalles(inscripcion)}
                              >
                                Ver Detalles
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-inscripciones">
                          No hay inscripciones registradas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="boton-volver-container">
              <button
                className="btn-consulta back-button"
                onClick={handleVolver}
              >
                Volver a consultar
              </button>
            </div>
          </div>
        </div>
        {showModal && (
          <ModalDetalles 
            inscripcion={selectedInscripcion} 
            onClose={() => setShowModal(false)} 
          />
        )}
      </>
    );
  }

  // Si es una consulta de tutor
  if (tutor) {
    console.log("Renderizando vista de tutor con datos:", {
      tutor,
      olimpistas: resultado?.data?.olimpistas,
    });

    return (
      <div className="resultado-container">
        <HeaderProp />
        <div className="resultado-content">
          {renderPersonaInfo(tutor, "Tutor")}
          {resultado?.data?.olimpistas &&
            renderOlimpistasTable(resultado.data.olimpistas)}
          <button onClick={handleVolver} className="btn-consulta volver-button">
            Volver a consultar
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ResultadoConsulta;

