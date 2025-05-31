import React, { useState, useEffect } from 'react';
import '../nuevo_inicio/home.css'; // Estilos personalizados

const images = [
  {
    src: 'https://www.lifeder.com/wp-content/uploads/2019/12/matematicas-concepto-lifeder-min-1024x682.jpg',
    title: 'Primera imagen',
    description: 'Descripción de la primera imagen',
  },
  {
    src: 'https://concepto.de/wp-content/uploads/2018/08/f%C3%ADsica-e1534938838719.jpg',
    title: 'Segunda imagen',
    description: 'Descripción de la segunda imagen',
  },
  {
    src: 'https://glocalideas.com/wp-content/uploads/2024/01/Robotica-cabecera-3-1200x675.png',
    title: 'Tercera imagen',
    description: 'Descripción de la tercera imagen',
  },
];

const Home = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <div className="carousel-container">
        {images.map((img, index) => (
          <div
            className={`carousel-slide ${index === current ? 'active' : ''}`}
            key={index}
          >
            <img src={img.src} alt={img.title} />
            <div className="caption">
              <h3>{img.title}</h3>
              <p>{img.description}</p>
              <button className="caption-button">Ver más</button>
            </div>
          </div>
        ))}

        <div className="controls">
          <button onClick={() => setCurrent((current - 1 + images.length) % images.length)}>
            ‹
          </button>
          <button onClick={() => setCurrent((current + 1) % images.length)}>
            ›
          </button>
        </div>
      </div>

      <div className="info-section">
        <h2>Bienvenido a la Olimpiada Científica Nacional San Simón</h2>
        <hr />
        <div className="info-box">
          <h3>Presentación</h3>
          <p>
            El Comité de la Olimpiadas Científica Nacional San Simón <strong>O! SANSI</strong>, a través de la Facultad de Ciencias y Tecnología de la Universidad Mayor de San Simón, convoca a los estudiantes del Sistema de Educación Regular a participar en las Olimpiadas O! SANSI.
          </p>

          <h3>Requisitos</h3>
          <ul>
            <li><i class="bi bi-check-circle-fill"></i> Ser estudiante de nivel primaria o secundaria en el sistema de Educación Regular del Estado Plurinacional de Bolivia.</li>
            <li><i class="bi bi-check-circle-fill"></i> Registrar un tutor o profesor.</li>
            <li><i class="bi bi-check-circle-fill"></i> Registrarse en el formulario de inscripción para el(las) área(s) que se postula.</li>
            <li><i class="bi bi-check-circle-fill"></i> Cumplir los requisitos específicos de la categoría de competencia en la que se inscribe.</li>
            <li><i class="bi bi-check-circle-fill"></i> Tener su documento de identificación personal vigente (cédula de identidad) en el desarrollo de la competencia.</li>
            <li><i class="bi bi-check-circle-fill"></i> Contar con correo electrónico personal o del tutor.</li>
          </ul>
        </div>
      </div>

      <div className="info-inscripcion">
        <h2>Pasos para inscribirte</h2>
        <div className='pasos-inscripcion'>
          <div className='numero'>1</div>
          <div className="info-titulo">
            <h3>Selecciona una olimpiada</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus culpa exercitationem necessitatibus obcaecati officia
            </p>
          </div>

        </div>
        <div className='pasos-inscripcion'>
          <div className='numero'>2</div>
          <div className="info-titulo">
            <h3>Selecciona como inscribirte</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus culpa exercitationem necessitatibus obcaecati officia
            </p>
          </div>

        </div>
      </div>
    </div>



  );
};

export default Home;
