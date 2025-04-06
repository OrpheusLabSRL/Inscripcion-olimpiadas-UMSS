import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./ContentProp.css";

function ContentProp() {
  const [showButtons, setShowButtons] = useState(false);
  const navigate = useNavigate();

  const handleStartClick = () => {
    setShowButtons(true);
  };

  const handleStartRegistration = () => {
    navigate('/register/tutor-form', { state: { formType: 'new' } });
  };

  const handleContinueRegistration = () => {
    navigate('/register/tutor-form', { state: { formType: 'continue' } });
  };

  return (
    <main className="content-container">
      <section className={`event-description ${showButtons ? 'active' : ''}`}>
        <h2>Olimpiadas Científicas Oh! SanSi</h2>
        <p>Descubre y desarrolla tu potencial científico en las áreas más fascinantes de la ciencia</p>
        
        {!showButtons ? (
          <button className="start-adventure" onClick={handleStartClick}>
            Comienza tu Aventura Científica
          </button>
        ) : (
          <div className="action-buttons">
            <button 
              className="action-button start-button" 
              onClick={handleStartRegistration}
            >
              Empezar Inscripción
            </button>
            <button 
              className="action-button continue-button"
              onClick={handleContinueRegistration}
            >
              Continuar Inscripción
            </button>
          </div>
        )}
      </section>

      <section className="areas-competence">
        <h2>Áreas de Competencia</h2>
        <div className="competence-grid">
          <div className="category-card">
            <h3>Matemáticas</h3>
            <p>Desarrolla tu pensamiento lógico y resolución de problemas a través de desafíos matemáticos.</p>
          </div>
          <div className="category-card">
            <h3>Física</h3>
            <p>Explora las leyes fundamentales del universo y sus aplicaciones prácticas.</p>
          </div>
          <div className="category-card">
            <h3>Química</h3>
            <p>Descubre la composición de la materia y sus transformaciones en procesos químicos.</p>
          </div>
          <div className="category-card">
            <h3>Astronomía</h3>
            <p>Estudia los cuerpos celestes, el cosmos y los fenómenos del universo.</p>
          </div>
        </div>

        <div className="competence-rules">
          <h3>Reglamento de Competencia</h3>
          <div className="rules-section">
            <h4>Normas Generales</h4>
            <ul className="rules-list">
              <li>Todos los participantes deben registrarse dentro del plazo establecido</li>
              <li>Se evaluarán tanto conocimientos teóricos como prácticos</li>
              <li>Las pruebas se realizarán en las instalaciones designadas</li>
            </ul>
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