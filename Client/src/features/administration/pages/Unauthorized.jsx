import React from "react";
import { Shield, Home, ArrowLeft, Lock } from "lucide-react";
import "../Styles/Unauthorized.css";

const Unauthorized = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    // Aquí puedes usar tu router favorito para navegar al inicio
    window.location.href = "/";
  };

  return (
    <div className="access-denied-container">
      <div className="access-denied-content">
        {/* Icono principal animado */}
        <div className="access-denied-icon-wrapper">
          <div className="access-denied-shield-bg">
            <Shield className="access-denied-shield-icon" size={80} />
          </div>
          <div className="access-denied-lock-overlay">
            <Lock className="access-denied-lock-icon" size={32} />
          </div>
        </div>

        {/* Contenido principal */}
        <div className="access-denied-text-section">
          <h1 className="access-denied-title">Acceso Denegado</h1>
          <p className="access-denied-subtitle">
            No tienes los permisos necesarios para acceder a esta página
          </p>
          <p className="access-denied-description">
            Si crees que esto es un error, por favor contacta al administrador
            del sistema o verifica que tu cuenta tenga los permisos adecuados.
          </p>
        </div>

        {/* Código de error */}
        <div className="access-denied-error-code">
          <span className="access-denied-code-label">Código de Error:</span>
          <span className="access-denied-code-number">403</span>
        </div>

        {/* Botones de acción */}
        <div className="access-denied-actions">
          <button
            onClick={handleGoBack}
            className="access-denied-btn access-denied-btn-secondary"
          >
            <ArrowLeft size={20} />
            Volver Atrás
          </button>
          <button
            onClick={handleGoHome}
            className="access-denied-btn access-denied-btn-primary"
          >
            <Home size={20} />
            Ir al Inicio
          </button>
        </div>

        {/* Información adicional */}
        <div className="access-denied-help">
          <p className="access-denied-help-text">
            ¿Necesitas ayuda?
            <a href="/contacto" className="access-denied-help-link">
              Contacta soporte técnico
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
