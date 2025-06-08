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
    <div className="accessDeniedContainer">
      <div className="accessDeniedContent">
        {/* Icono principal animado */}
        <div className="accessDeniedIconWrapper">
          <div className="accessDeniedShieldBg">
            <Shield className="accessDeniedShieldIcon" size={80} />
          </div>
          <div className="accessDeniedLockOverlay">
            <Lock className="accessDeniedLockIcon" size={32} />
          </div>
        </div>

        {/* Contenido principal */}
        <div className="accessDeniedTextSection">
          <h1 className="accessDeniedTitle">Acceso Denegado</h1>
          <p className="accessDeniedSubtitle">
            No tienes los permisos necesarios para acceder a esta página
          </p>
          <p className="accessDeniedDescription">
            Si crees que esto es un error, por favor contacta al administrador
            del sistema o verifica que tu cuenta tenga los permisos adecuados.
          </p>
        </div>

        {/* Código de error */}
        <div className="accessDeniedErrorCode">
          <span className="accessDeniedCodeLabel">Código de Error:</span>
          <span className="accessDeniedCodeNumber">403</span>
        </div>

        {/* Botones de acción */}
        <div className="accessDeniedActions">
          <button
            onClick={handleGoBack}
            className="accessDeniedBtn accessDeniedBtnSecondary"
          >
            <ArrowLeft size={20} />
            Volver Atrás
          </button>
          <button
            onClick={handleGoHome}
            className="accessDeniedBtn accessDeniedBtnPrimary"
          >
            <Home size={20} />
            Ir al Inicio
          </button>
        </div>

        {/* Información adicional */}
        <div className="accessDeniedHelp">
          <p className="accessDeniedHelpText">
            ¿Necesitas ayuda?
            <a href="/contacto" className="accessDeniedHelpLink">
              Contacta soporte técnico
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
