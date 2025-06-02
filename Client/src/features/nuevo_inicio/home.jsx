import React, { useState, useEffect } from 'react';
import '../nuevo_inicio/home.css';
import foto from "../../assets/images/estudiantesConCertificado.jpg"
import { getOlimpiadas } from "../../api/Administration.api";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [current, setCurrent] = useState(0);
  const [olympiads, setOlympiads] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOlimpiads = async () => {
      try {
        const { data } = await getOlimpiadas();
        const activas = data.filter((o) => o.estadoOlimpiada === 1);
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
              <p>{olympiad.fechaInicioOlimpiada || "fecha no disponible."} {olympiad.fechaFinOlimpiada || "fecha no disponible."}</p>
              <button
                className="caption-button"
                onClick={() => handleView(olympiad.idOlimpiada)}
              >
                Ver más
              </button>
            </div>
          </div>
        ))}

        <div className="controls">
          <button onClick={() => setCurrent((current - 1 + olympiads.length) % olympiads.length)}>
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
            El Comité de la Olimpiadas Científica Nacional San Simón <strong>O! SANSI</strong>, a través de la Facultad de Ciencias y Tecnología de la Universidad Mayor de San Simón, convoca a los estudiantes del Sistema de Educación Regular a participar en las Olimpiadas O! SANSI.
          </p>
          <div className="requisitos-container">
            <div className="requisitos-texto">
              <h3>Requisitos</h3>
              <ol>
                <li>Ser estudiante de nivel primaria o secundaria en el sistema de Educación Regular del Estado Plurinacional de Bolivia.</li>
                <li>Registrar un tutor o profesor.</li>
                <li>Registrarse en el formulario de inscripción para el(las) área(s) que se postula.</li>
                <li>Cumplir los requisitos específicos de la categoría de competencia en la que se inscribe.</li>
                <li>Tener su documento de identificación personal vigente (cédula de identidad) en el desarrollo de la competencia.</li>
                <li>Contar con correo electrónico personal o del tutor.</li>
              </ol>
            </div>

            <div className="requisitos-imagen">
              <img
                src={foto}
                alt="Ilustración de requisitos"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="info-inscripcion">
        <h2>Pasos para inscribirte</h2>

        <div className="pasos-inscripcion">
          <div className="numero">1</div>
          <div className="info-titulo">
            <h3>Selecciona una olimpiada</h3>
            <p>Ingresa a la plataforma y elige la olimpiada en la que deseas participar. Este paso es obligatorio para todos: estudiantes, tutores o responsables de inscripción.</p>
          </div>
        </div>

        <div className="pasos-inscripcion">
          <div className="numero">2</div>
          <div className="info-titulo">
            <h3>Elige el tipo de inscripción</h3>
            <p>Puedes elegir entre una inscripción manual (llenando un formulario paso a paso) o una inscripción masiva mediante una plantilla Excel.</p>
          </div>
        </div>

      </div>


    </div>



  );
};

export default Home;
