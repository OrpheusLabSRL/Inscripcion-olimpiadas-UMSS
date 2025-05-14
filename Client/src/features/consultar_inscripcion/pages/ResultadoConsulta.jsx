import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderProp from "../../home_usuario/components/HeaderProp";
import "../Styles/ResultadoConsulta.css";

const ResultadoConsulta = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultado = location.state?.resultado;

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

  const renderPersonaInfo = (persona, tipo) => (
    <div className="persona-info">
      <h3 className="titulo-resultado">Información del {tipo}</h3>
      <table className="info-table">
        <tbody>
          <tr>
            <td className="label">Nombre:</td>
            <td>{persona?.nombre || "No disponible"}</td>
          </tr>
          <tr>
            <td className="label">Apellido:</td>
            <td>{persona?.apellido || "No disponible"}</td>
          </tr>
          <tr>
            <td className="label">Carnet de Identidad:</td>
            <td>{persona?.carnetIdentidad || "No disponible"}</td>
          </tr>
          <tr>
            <td className="label">Correo Electrónico:</td>
            <td>{persona?.correoElectronico || "No disponible"}</td>
          </tr>
          {tipo === "Tutor" && (
            <>
              <tr>
                <td className="label">Teléfono:</td>
                <td>{persona?.telefono || "No disponible"}</td>
              </tr>
            </>
          )}
          {tipo === "Olimpista" && (
            <>
              <tr>
                <td className="label">Curso:</td>
                <td>{persona?.curso || "No disponible"}</td>
              </tr>
              <tr>
                <td className="label">Colegio:</td>
                <td>{persona?.colegio || "No disponible"}</td>
              </tr>
              <tr>
                <td className="label">Departamento:</td>
                <td>{persona?.departamento || "No disponible"}</td>
              </tr>
              <tr>
                <td className="label">Municipio:</td>
                <td>{persona?.municipio || "No disponible"}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );

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
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(inscripciones) &&
                    inscripciones.length > 0 ? (
                      inscripciones.map((inscripcion, index) => (
                        <tr key={index}>
                          <td>
                            {inscripcion.olimpiadaAreaCategoria?.area
                              ?.nombreArea || "No disponible"}
                          </td>
                          <td>
                            {inscripcion.olimpiadaAreaCategoria?.categoria
                              ?.nombreCategoria || "No disponible"}
                          </td>

                          <td>
                            {inscripcion.tutorResponsable?.nombre}{" "}
                            {inscripcion.tutorResponsable?.apellido}
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
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="no-inscripciones">
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
