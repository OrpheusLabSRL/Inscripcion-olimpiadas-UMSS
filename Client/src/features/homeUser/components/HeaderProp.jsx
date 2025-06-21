import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../../assets/images/ohsansi.png";
import "../Styles/HeaderProp.css";

function HeaderProp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const closeMenu = () => {
    setMenuOpen(false);
    setDropdownVisible(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeMenu();
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownVisible(!dropdownVisible);
  };

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.classList.contains("menuButton")
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cerrar menú móvil cuando cambia la ruta
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // Cerrar menú al presionar Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="headerContainer">
      <div className="headerContent">
        <div
          className="headerLeft"
          onClick={() => handleNavigation("/")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleNavigation("/")}
        >
          <img
            src={Logo}
            alt="O!Sansi Logo"
            className="headerLogo"
            loading="lazy"
          />
          <h2>O!Sansi</h2>
        </div>

        <button
          className="menuButton"
          onClick={toggleMenu}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav
          ref={menuRef}
          className={`navigationMenu ${menuOpen ? "menuOpen" : ""}`}
          role="navigation"
          aria-label="Navegación principal"
        >
          <ul className="navigationList">
            <li
              onClick={() => handleNavigation("/")}
              className={isActiveRoute("/") ? "active" : ""}
              role="menuitem"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleNavigation("/")}
            >
              <i className="bi bi-house" aria-hidden="true"></i>
              <span>Inicio</span>
            </li>

            <li
              ref={dropdownRef}
              className="dropdownMenu"
              onClick={toggleDropdown}
              role="menuitem"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && toggleDropdown(e)}
              aria-haspopup="true"
              aria-expanded={dropdownVisible}
            >
              <span>
                <i className="bi bi-journal" aria-hidden="true"></i>
                <span>Mis Inscripciones</span>
                <i
                  className={`bi bi-chevron-${dropdownVisible ? "up" : "down"}`}
                  aria-hidden="true"
                ></i>
              </span>

              {dropdownVisible && (
                <ul className="dropdownSubmenu" role="menu">
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigation("/consultar-inscripcion");
                    }}
                    className={
                      isActiveRoute("/consultar-inscripcion") ? "active" : ""
                    }
                    role="menuitem"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.stopPropagation();
                        handleNavigation("/consultar-inscripcion");
                      }
                    }}
                  >
                    <i className="bi bi-clipboard-check" aria-hidden="true"></i>
                    <span>Estado de Inscripción</span>
                  </li>
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigation("/register/tutor-form");
                    }}
                    className={
                      isActiveRoute("/register/tutor-form") ? "active" : ""
                    }
                    role="menuitem"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.stopPropagation();
                        handleNavigation("/register/tutor-form");
                      }
                    }}
                  >
                    <i className="bi bi-clipboard-plus" aria-hidden="true"></i>
                    <span>Continuar Inscripción</span>
                  </li>
                </ul>
              )}
            </li>

            <li
              onClick={() => handleNavigation("/contacto")}
              className={isActiveRoute("/contacto") ? "active" : ""}
              role="menuitem"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && handleNavigation("/contacto")
              }
            >
              <i className="bi bi-telephone" aria-hidden="true"></i>
              <span>Contacto</span>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default HeaderProp;
