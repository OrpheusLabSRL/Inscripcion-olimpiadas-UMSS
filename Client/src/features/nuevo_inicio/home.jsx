import React, { useState, useEffect } from "react";
import "../nuevo_inicio/home.css";
import foto from "../../assets/images/estudiantesConCertificado.jpg";
import { getOlimpiadas } from "../../api/Administration.api";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton";
import { CiSearch } from "react-icons/ci";

const Home = () => {
  const [current, setCurrent] = useState(0);
  const [olympiads, setOlympiads] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOlimpiads = async () => {
      try {
        const { data } = await getOlimpiadas();
        const activas = data.filter((o) => o.estadoOlimpiada === 1);
        console.log("Olimpiadas activas:", activas);
        setOlympiads(activas);
      } catch (error) {
        console.error("Error al obtener olimpiadas:", error);
        setOlympiads([]);
      }
    };

    fetchOlimpiads();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % olympiads.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [olympiads]);

  const handleView = (id) => {
    navigate(`/olimpiada/${id}`);
  };

  const isPendent = (olympiad) => {
    const today = new Date();
    const startDate = new Date(olympiad.fechaInicioOlimpiada);
    const endDate = new Date(olympiad.fechaFinOlimpiada);

    // Check if the current date is before the start date or after the end date
    return today < startDate || today > endDate;
  };

  return (
    <div>
      <div className="carousel-container">
        {olympiads.map((olympiad, index) => (
          <div
            className={`carousel-slide ${index === current ? "active" : ""}`}
            key={olympiad.idOlimpiada}
          >
            <img
              src={
                olympiad.imagen ||
                "https://www.lifeder.com/wp-content/uploads/2019/12/matematicas-concepto-lifeder-min-1024x682.jpg"
              }
              alt={olympiad.nombreOlimpiada}
            />
            <div className="caption">
              <h3>{olympiad.nombreOlimpiada}</h3>
              <p>
                <strong>Desde</strong>{" "}
                {olympiad.fechaInicioOlimpiada
                  ? new Date(olympiad.fechaInicioOlimpiada).toLocaleDateString(
                      "es-ES",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "fecha no disponible."}{" "}
                <strong>hasta</strong>{" "}
                {olympiad.fechaFinOlimpiada
                  ? new Date(olympiad.fechaFinOlimpiada).toLocaleDateString(
                      "es-ES",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "fecha no disponible."}
              </p>
              {isPendent(olympiad) ? (
                <PrimaryButton
                  value="Proximamente"
                  className="caption-button"
                />
              ) : (
                <PrimaryButton
                  value="Más información"
                  onClick={() => handleView(olympiad.idOlimpiada)}
                  icon={<CiSearch />}
                />
              )}
            </div>
          </div>
        ))}

        <div className="controls">
          <button
            onClick={() =>
              setCurrent((current - 1 + olympiads.length) % olympiads.length)
            }
          >
            ‹
          </button>
          <button onClick={() => setCurrent((current + 1) % olympiads.length)}>
            ›
          </button>
        </div>
      </div>

      <div className="info-section">
        <h2>Bienvenido a la Olimpiada Científica Nacional San Simón</h2>

        <div className="info-box">
          <h3>Presentación</h3>
          <p>
            El Comité de la Olimpiadas Científica Nacional San Simón{" "}
            <strong>O! SANSI</strong>, a través de la Facultad de Ciencias y
            Tecnología de la Universidad Mayor de San Simón, convoca a los
            estudiantes del Sistema de Educación Regular a participar en las
            Olimpiadas O! SANSI.
          </p>
          <div className="requisitos-container">
            <div className="requisitos-texto">
              <h3>Requisitos</h3>
              <ol>
                <li>
                  Ser estudiante de nivel primaria o secundaria en el sistema de
                  Educación Regular del Estado Plurinacional de Bolivia.
                </li>
                <li>Registrar un tutor o profesor.</li>
                <li>
                  Registrarse en el formulario de inscripción para el(las)
                  área(s) que se postula.
                </li>
                <li>
                  Cumplir los requisitos específicos de la categoría de
                  competencia en la que se inscribe.
                </li>
                <li>
                  Tener su documento de identificación personal vigente (cédula
                  de identidad) en el desarrollo de la competencia.
                </li>
                <li>Contar con correo electrónico personal o del tutor.</li>
              </ol>
            </div>

            <div className="requisitos-imagen">
              <img src={foto} alt="Ilustración de requisitos" />
            </div>
          </div>
        </div>
      </div>
      <div className="info-inscripcion">
        <h2>Pasos para inscribirte</h2>

        <div className="pasos-grid">
          {[...Array(10)].map((_, i) => (
            <div className="pasos-inscripcion" key={i}>
              <div className="numero">{i + 1}</div>
              <div className="info-titulo">
                <h3>
                  <i
                    className={`bi ${
                      [
                        "bi-trophy",
                        "bi-ui-checks-grid",
                        "bi-person-badge",
                        "bi-person-lines-fill",
                        "bi-list-check",
                        "bi-person-vcard",
                        "bi-check-circle",
                        "bi-credit-card-2-front",
                        "bi-upload",
                        "bi-patch-check-fill",
                      ][i]
                    } me-2`}
                  ></i>
                  {
                    [
                      "Selecciona una olimpiada",
                      "Elige el tipo de inscripción",
                      "Registra al responsable de inscripción",
                      "Ingresa los datos del olimpista",
                      "Selecciona las áreas de competencia",
                      "Registra al tutor legal",
                      "Finaliza la inscripción",
                      "Realiza el pago",
                      "Sube el comprobante de pago",
                      "Inscripción completada",
                    ][i]
                  }
                </h3>
                <p>
                  {
                    [
                      "Elige la olimpiada en la que deseas participar. Este paso es obligatorio para todos los tipos de inscripción.",
                      "Puedes continuar con un registro manual, llenando los datos paso a paso, o subir una planilla Excel con los datos de los participantes.",
                      "Antes de continuar con el registro de participantes, se deben completar los datos del responsable que realiza la inscripción.",
                      "Registra los datos personales del estudiante que participará en la olimpiada.",
                      "Indica en qué áreas participará el olimpista. De forma opcional, puedes asignar a los tutores encargados de cada área.",
                      "Completa los datos del padre, madre o tutor legal del estudiante participante.",
                      "Una vez registrados todos los datos necesarios, genera la boleta de pago para continuar con el proceso.",
                      "Acude a las cajas de la universidad con la boleta de pago para completar el pago correspondiente.",
                      "Ingresa nuevamente a la plataforma y sube una foto clara del comprobante o factura entregado en caja.",
                      "Una vez validado el pago, el estado de inscripción de tus olimpistas pasará de 'pendiente' a 'completada'.",
                    ][i]
                  }
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
