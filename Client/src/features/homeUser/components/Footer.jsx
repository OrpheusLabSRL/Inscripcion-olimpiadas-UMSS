import React from "react";
import "../Styles/Footer.css";

function Footer() {
  return (
    <footer className="footerMain">
      <div className="footerContainer">
        <div className="footerGrid">
          <div className="footerColumn">
            <div className="columnHeader">
              <i className="bi bi-envelope-fill"></i>
              <h3>Escríbenos</h3>
            </div>
            <p className="contactEmail">ohsansi@umss.edu</p>
            <div className="socialIcons">
              <a href="#" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>

          <div className="footerColumn">
            <div className="columnHeader">
              <i className="bi bi-geo-alt-fill"></i>
              <h3>Ubicación</h3>
            </div>
            <p>Departamento de Sistemas e Informática - UMSS</p>
            <p>Calle Sucre y Parque La Torre</p>
          </div>

          <div className="footerColumn">
            <div className="columnHeader">
              <i className="bi bi-clock-fill"></i>
              <h3>Horario de Atención</h3>
            </div>
            <p>Lunes a Viernes</p>
            <p className="hours">8:00 - 16:00</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
