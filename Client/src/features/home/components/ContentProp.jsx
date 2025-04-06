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
    navigate('/register/tutor-form'); // Redirige a tutor-form
  };

  const handleContinueRegistration = () => {
    navigate('/register/tutor'); // Redirige a tutor
  };

  return (
    <main className="container-content">
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
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
          <div className="category-card">
            <h3>Matemáticas</h3>
            <p>Descripción de la categoría 1.</p>
          </div>
          <div className="category-card">
            <h3>Física</h3>
            <p>Descripción de la inscripción.</p>
          </div>
          <div className="category-card">
            <h3>Química</h3>
            <p>Descripción de la categoría 3.</p>
          </div>
          <div className="category-card">
            <h3>Astronomía</h3>
            <p>Descripción de la categoría 4.</p>
          </div>
        </div>
      </section>

      <section className="registration-process">
        <h2>Proceso de Inscripción</h2>
        <p>Instrucciones sobre cómo inscribirse.</p>
      </section>
      <section className="how-to-register">
        <h2>¿Cómo Inscribirse?</h2>
        <p>Tutorial Paso a Paso.</p>
      </section>
    </main>
  );
}

export default ContentProp;