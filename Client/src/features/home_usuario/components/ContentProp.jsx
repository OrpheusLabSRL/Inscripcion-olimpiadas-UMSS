import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Styles/ContentProp.css";

function ContentProp() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Matemáticas');

  const categoryImages = {
    'Matemáticas': 'https://www.lifeder.com/wp-content/uploads/2019/12/matematicas-concepto-lifeder-min-1024x682.jpg',
    'Física': 'https://concepto.de/wp-content/uploads/2018/08/f%C3%ADsica-e1534938838719.jpg',
    'Biología': 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj5Xk3FtqL__EGIiI7E82AekqqDLimo4jzoEFshq4DkMU6dJ-1o6rVe9MIYFMBkBUydt7CQbcvfZMJpblJmbtpS-FOh74aisVI8jd3VyV-NOnw_v4vbiglUMpWeWKYjcPFOSCVLpB7n-Mw/s1600/Qui%25C3%25A9n+utilizo+por+primera+vez+la+palabra+Biolog%25C3%25ADa.jpg',
    'Química': 'https://www.inspiracle.es/wp-content/uploads/2014/11/quimica.jpg',
    'Informática': 'https://concepto.de/wp-content/uploads/2015/08/informatica-1-e1590711779992-800x400.jpg',
    'Robótica': 'https://glocalideas.com/wp-content/uploads/2024/01/Robotica-cabecera-3-1200x675.png',
  };

  return (
    <main className="content-container">
      <section className="areas-competence">
        <h2>Áreas de Competencia</h2>
        <div className="competence-grid">
          <div className="category-card">
            <img src="https://www.lifeder.com/wp-content/uploads/2019/12/matematicas-concepto-lifeder-min-1024x682.jpg" alt="Matemáticas" />
            <h3>Matemáticas</h3>
            <p>Desarrolla tu pensamiento lógico y resolución de problemas a través de desafíos matemáticos.</p>
          </div>
          <div className="category-card">
            <img src="https://concepto.de/wp-content/uploads/2018/08/f%C3%ADsica-e1534938838719.jpg" alt="Física" />
            <h3>Física</h3>
            <p>Explora las leyes fundamentales del universo y sus aplicaciones prácticas.</p>
          </div>
          <div className="category-card">
            <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj5Xk3FtqL__EGIiI7E82AekqqDLimo4jzoEFshq4DkMU6dJ-1o6rVe9MIYFMBkBUydt7CQbcvfZMJpblJmbtpS-FOh74aisVI8jd3VyV-NOnw_v4vbiglUMpWeWKYjcPFOSCVLpB7n-Mw/s1600/Qui%25C3%25A9n+utilizo+por+primera+vez+la+palabra+Biolog%25C3%25ADa.jpg" alt="Biología" />
            <h3>Biología</h3>
            <p>Investiga los procesos de la vida y cómo interactúan los organismos en el entorno.</p>
          </div>
          <div className="category-card">
            <img src="https://www.inspiracle.es/wp-content/uploads/2014/11/quimica.jpg" alt="Química" />
            <h3>Química</h3>
            <p>Descubre la composición de la materia y sus transformaciones en procesos químicos.</p>
          </div>
          <div className="category-card">
            <img src="https://concepto.de/wp-content/uploads/2015/08/informatica-1-e1590711779992-800x400.jpg" alt="Informática" />
            <h3>Informática</h3>
            <p>Aprende sobre el procesamiento de datos, programación y nuevas tecnologías digitales.</p>
          </div>
          <div className="category-card">
            <img src="https://glocalideas.com/wp-content/uploads/2024/01/Robotica-cabecera-3-1200x675.png" alt="Robótica" />
            <h3>Robótica</h3>
            <p>Construye y programa robots que solucionen problemas del mundo real.</p>
          </div>
        </div>
      </section>

      <section className="registration-process">
        <h2>Proceso de Inscripción</h2>
        <div className="process-steps-horizontal">
          <div className="step-horizontal">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Registro</h3>
              <p>Completa el formulario de inscripción con tus datos personales y académicos.</p>
            </div>
          </div>
          <div className="step-horizontal">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Pago</h3>
              <p>Realiza el pago de la inscripción mediante los métodos disponibles.</p>
            </div>
          </div>
          <div className="step-horizontal">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Comprobante</h3>
              <p>Sube tu comprobante de pago en el formato solicitado.</p>
            </div>
          </div>
          <div className="step-horizontal">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>¡Listo!</h3>
              <p>Recibirás la confirmación de tu inscripción por correo electrónico.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-to-register">
        <h2>¿Cómo Inscribirse?</h2>
        <div className="tutorial-section">
          <h3>Tutorial Paso a Paso</h3>
          <p>Sigue este vídeo tutorial para completar tu proceso de inscripción sin problemas.</p>
          <div className="video-placeholder">
            [Aquí iría el componente de video o iframe]
          </div>
        </div>
      </section>
    </main>
  );
}

export default ContentProp;