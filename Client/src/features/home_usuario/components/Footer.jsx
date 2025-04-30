import React from "react";
import "../Styles/Footer.css";

function Footer() {
  return (
    <footer className="ohsansi-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h1>O! SanSi</h1>
            <p>Fomentando la excelencia científica y el desarrollo del talento juvenil en Bolivia desde 2020.</p>
          </div>

          <div className="footer-grid">
            <div className="footer-column">
              <h3>Áreas Científicas</h3>
              <ul>
                <li>Matemáticas</li>
                <li>Física</li>
                <li>Química</li>
                <li>Astronomía-Astrofísica</li>
                <li>Biología</li>
                <li>Informática</li>
                <li>Robótica</li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Enlaces Útiles</h3>
              <ul>
                <li>Proceso de Inscripción</li>
                <li>Calendario 2024</li>
                <li>Reglamento</li>
                <li>Preguntas Frecuentes</li>
                <li>Resultados</li>
                <li>Galería de Ganadores</li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Contacto</h3>
              <div className="contact-info">
                <p><strong>Dirección Principal:</strong></p>
                <p>Universidad Mayor de San Simón</p>
                <p>Cochabamba, Bolivia</p>
                
                <p><strong>Teléfonos:</strong></p>
                <p>+591 4 4525252</p>
                <p>+591 4 4525253</p>
                
                <p><strong>Email:</strong></p>
                <p>info@ohsansi.edu.bo</p>
                <p>soporte@ohsansi.edu.bo</p>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2024 O! SanSi - Olimpiadas Científicas. Todos los derechos reservados.
            <a href="#">Política de Privacidad</a>
            <a href="#">Términos y Condiciones</a>
            <a href="#">Mapa del Sitio</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;