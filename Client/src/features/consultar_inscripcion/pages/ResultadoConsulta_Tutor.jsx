import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderProp from "../../home_usuario/components/HeaderProp";
import "../Styles/ResultadoConsulta_Tutor.css";

const ResultadoConsulta_Tutor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultado = location.state?.resultado;

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
    return estado === "PAGO REALIZADO" ? "realizado" : "pendiente";
  };

  // Agrupar olimpistas por codigoBoleta
  const olimpistasAgrupados = olimpistas.reduce((grupos, olimpista) => {
    const codigoBoleta = olimpista.codigoBoleta || 'sin-boleta';
    if (!grupos[codigoBoleta]) {
      grupos[codigoBoleta] = [];
    }
    grupos[codigoBoleta].push(olimpista);
    return grupos;
  }, {});



  return (
    <>
      <HeaderProp />
      <div className="resultado-container">
        <div className="resultado-content">
          <h2>Resultado de la Consulta</h2>

          <div className="tutor-info">
            <h3>Información del Tutor</h3>
            <p>
              <strong>Nombre:</strong> {tutor.nombre} {tutor.apellido}
            </p>
            <p>
              <strong>Carnet de Identidad:</strong> {tutor.carnetIdentidad}
            </p>
            <p>
              <strong>Correo Electrónico:</strong> {tutor.correoElectronico}
            </p>
            <p>
              <strong>Teléfono:</strong> {tutor.telefono}
            </p>
          </div>

          {Object.entries(olimpistasAgrupados).map(([codigoBoleta, olimpistasGrupo]) => (
            <div key={codigoBoleta} className="olimpistas-table">
              <h3>
                {codigoBoleta === 'sin-boleta' 
                  ? 'Olimpistas sin boleta de pago' 
                  : `Olimpistas correspondientes a la boleta con código: ${codigoBoleta}`}
              </h3>
              <table>
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
                  {olimpistasGrupo.map((olimpista) => (
                    <tr key={olimpista.idInscripcion}>
                      <td>{olimpista.nombre}</td>
                      <td>{olimpista.apellido}</td>
                      <td>{olimpista.carnetIdentidad}</td>
                      <td>{olimpista.tipoTutor}</td>
                      <td>{olimpista.materia || "No especificada"}</td>
                      <td>{olimpista.categoria || "No especificada"}</td>
                      <td
                        className={`estado-pago ${getEstadoPagoClass(
                          olimpista.estadoPago
                        )}`}
                      >
                        {olimpista.estadoPago}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          
          <div className="boton-volver-container">
            <button
              className="btn-consulta back-button"
              onClick={() => navigate("/consultar-inscripcion")}
            >
              Volver a consultar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultadoConsulta_Tutor;
