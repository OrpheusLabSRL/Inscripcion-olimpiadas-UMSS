import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderProp from "../../home_usuario/components/HeaderProp";
import "../Styles/ResultadoConsulta_Tutor.css";

const ResultadoConsulta_Tutor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultado = location.state?.resultado;
  const [showModal, setShowModal] = useState(false);
  const [selectedOlimpistas, setSelectedOlimpistas] = useState([]);

  console.log("Datos completos recibidos:", resultado);

  if (!resultado || !resultado.success) {
    return (
      <>
        <HeaderProp />
        <div className="resultado-container">
          <div className="resultado-content">
            <h2>No se encontraron resultados</h2>
            <button
              className="btn-consulta"
              onClick={() => navigate("/consultar-inscripcion")}
            >
              Volver a consultar
            </button>
          </div>
        </div>
      </>
    );
  }

  const { tutor, olimpistas } = resultado.data;
  console.log("Datos de olimpistas:", olimpistas);

  const getEstadoPagoClass = (estado) => {
    return estado === "PAGO PENDIENTE" ? "estado-pendiente" : "estado-realizado";
  };

  // Agrupar olimpistas por codigoInscripcion
  const olimpistasAgrupados = olimpistas.reduce((grupos, olimpista) => {
    const codigoInscripcion = olimpista.codigoInscripcion || 'sin-inscripcion';
    if (!grupos[codigoInscripcion]) {
      grupos[codigoInscripcion] = [];
    }
    grupos[codigoInscripcion].push(olimpista);
    return grupos;
  }, {});

  const handleVerDetalles = (olimpistasGrupo) => {
    setSelectedOlimpistas(olimpistasGrupo);
    setShowModal(true);
  };

  const ModalDetalles = ({ olimpistas, onClose }) => {
    if (!olimpistas || olimpistas.length === 0) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Detalles de los Olimpistas</h3>
            <button className="close-button" onClick={onClose}>&times;</button>
          </div>
          <div className="modal-body">
            <table className="modal-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Carnet de Identidad</th>
                  <th>Tipo de Tutor</th>
                  <th>Materia</th>
                  <th>Categoría</th>
                  <th>Estado de Pago</th>
                </tr>
              </thead>
              <tbody>
                {olimpistas.map((olimpista) => (
                  <tr key={olimpista.idInscripcion}>
                    <td>{olimpista.nombre}</td>
                    <td>{olimpista.apellido}</td>
                    <td>{olimpista.carnetIdentidad}</td>
                    <td>{olimpista.tipoTutor}</td>
                    <td>{olimpista.materia || "No especificada"}</td>
                    <td>{olimpista.categoria || "No especificada"}</td>
                    <td className={getEstadoPagoClass(olimpista.estadoPago)}>
                      {olimpista.estadoPago}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <HeaderProp />
      <div className="resultadoContenedor">
        <div className="resultadoContenido">
          <h2>Resultado de la Consulta</h2>

          <div className="tutorInfo">
            <h3>Información del Tutor</h3>
            <p>
              <strong><i className="bi bi-person-vcard"></i> Nombre:</strong> {tutor.nombre} {tutor.apellido}
            </p>
            <p>
              <strong><i className="bi bi-credit-card-2-front"></i> Carnet de Identidad:</strong> {tutor.carnetIdentidad}
            </p>
            <p>
              <strong><i className="bi bi-envelope-at"></i> Correo Electrónico:</strong> {tutor.correoElectronico}
            </p>
            <p>
              <strong><i className="bi bi-telephone-fill"></i> Teléfono:</strong> {tutor.telefono}
            </p>
          </div>

          {Object.entries(olimpistasAgrupados).map(([codigoInscripcion, olimpistasGrupo]) => {
            const primerOlimpista = olimpistasGrupo[0];
            const formaInscripcion = primerOlimpista?.formaInscripcion || 'No especificada';
            const estadoPago = olimpistasGrupo.every(ol => ol.estadoPago === "PAGO REALIZADO")
              ? "PAGO REALIZADO"
              : "PAGO PENDIENTE";

            return (
              <div key={codigoInscripcion} className={formaInscripcion === 'Excel' ? "inscripcionTarjeta" : "olimpistasTabla"}>
                <h3>
                  {codigoInscripcion === 'sin-inscripcion'
                    ? 'Olimpistas sin inscripción'
                    : `Olimpistas correspondientes a la Inscripción: ${codigoInscripcion}`}
                </h3>
                {codigoInscripcion !== 'sin-inscripcion' && (
                  <>
                    <p className="formaInscripcion">
                      <strong>Forma de Inscripción:</strong> {formaInscripcion}
                    </p>
                    {formaInscripcion === 'Excel' ? (
                      <div className="excelResumen">
                        <p><strong>Cantidad Olimpistas:</strong> {olimpistasGrupo.length}</p>
                        <p className={estadoPago === "PAGO REALIZADO" ? "estadoRealizado" : "estadoPendiente"}>
                          <strong>Estado de Pago:</strong> {estadoPago}
                        </p>
                        <button
                          className="botonVerDetalles"
                          onClick={() => handleVerDetalles(olimpistasGrupo)}
                        >
                          Ver Detalles
                        </button>
                      </div>
                    ) : (
                      <table>
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Carnet de Identidad</th>
                            <th>Área</th>
                            <th>Categoría</th>
                            <th>Estado de Pago</th>
                          </tr>
                        </thead>
                        <tbody>
                          {olimpistasGrupo.map((olimpista, index) => (
                            <tr key={index}>
                              <td>{olimpista.nombre} {olimpista.apellido}</td>
                              <td>{olimpista.carnetIdentidad}</td>
                              <td>{olimpista.area}</td>
                              <td>{olimpista.categoria}</td>
                              <td className={olimpista.estadoPago === "PAGO REALIZADO" ? "estadoRealizado" : "estadoPendiente"}>
                                {olimpista.estadoPago}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </>
                )}
              </div>
            );
          })}

          <div className="botonVolverContenedor">
            <button className="botonVolver" onClick={() => navigate("/consultar-inscripcion")}>
              <i className="bi bi-arrow-left"></i> Volver
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <ModalDetalles
          olimpistas={selectedOlimpistas}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default ResultadoConsulta_Tutor;
