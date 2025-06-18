import React from "react";
import { Shield, Home, ArrowLeft, Lock, Mail } from "lucide-react";
import "../Styles/Unauthorized.css";

const Unauthorized = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleContactSupport = () => {
    window.location.href =
      "mailto:soporte@sistema.com?subject=Problema de acceso 403";
  };

  return (
    <div className="access-denied-container">
      <div className="access-denied-card">
        {/* Icono principal con animación */}
        <div className="access-denied-icon-container">
          <div className="shield-animation">
            <Shield
              className="shield-icon"
              size={80}
              aria-hidden="true"
              focusable="false"
            />
            <div className="lock-overlay">
              <Lock
                className="lock-icon"
                size={32}
                aria-hidden="true"
                focusable="false"
              />
            </div>
          </div>
        </div>

        {/* Contenido textual */}
        <div className="access-denied-content">
          <h1 className="access-denied-title">Acceso no autorizado</h1>
          <p className="access-denied-subtitle">
            No tienes los permisos necesarios para acceder a este recurso
          </p>
          <p className="access-denied-description">
            Por favor verifica tus credenciales o contacta al administrador del
            sistema si crees que esto es un error.
          </p>
        </div>

        {/* Código de error */}
        <div className="error-code">
          <span className="error-code-label">Código de error:</span>
          <span className="error-code-value" aria-label="Error 403">
            403
          </span>
        </div>

        {/* Acciones principales */}
        <div className="action-buttons">
          <button
            onClick={handleGoBack}
            className="secondary-button"
            aria-label="Volver a la página anterior"
          >
            <ArrowLeft size={20} className="button-icon" />
            <span>Volver atrás</span>
          </button>
          <button
            onClick={handleGoHome}
            className="primary-button"
            aria-label="Ir a la página de inicio"
          >
            <Home size={20} className="button-icon" />
            <span>Ir al inicio</span>
          </button>
        </div>

        {/* Soporte técnico */}
        <div className="support-section">
          <button
            onClick={handleContactSupport}
            className="support-link"
            aria-label="Contactar a soporte técnico"
          >
            <Mail size={16} className="support-icon" />
            <span>Contactar soporte técnico</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
