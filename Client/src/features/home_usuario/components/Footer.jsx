import React from "react";
import "../Styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
  <div className="footer-column">
    <h3><i className="bi bi-envelope-fill"></i> Escríbenos</h3>
    <p>ohsansi@umss.edu</p>
    <div className="social-icons">
      <a href="#"><i className="bi bi-facebook"></i></a>
      <a href="#"><i className="bi bi-twitter-x"></i></a>
      <a href="#"><i className="bi bi-instagram"></i></a>
    </div>
  </div>

  <div className="footer-column">
    <h3><i className="bi bi-geo-alt-fill"></i> Ubicación</h3>
    <p>Departamento de Sistemas e Informática - UMSS</p>
    <p>Calle Sucre y Parque La Torre</p>
  </div>

  <div className="footer-column">
    <h3><i className="bi bi-clock-fill"></i> Hora de atención</h3>
    <p>Lunes a Viernes</p>
    <p>8:00 a 16:00</p>
  </div>
</footer>
  );
}

export default Footer;