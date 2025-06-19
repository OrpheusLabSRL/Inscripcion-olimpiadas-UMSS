import { NavLink, Link, useNavigate } from "react-router-dom";
import { GrDocumentDownload } from "react-icons/gr";
import { useState, useEffect } from "react";

//Icons
import { FaHome, FaRegEdit } from "react-icons/fa";
import { IoDocumentTextOutline, IoLogOutOutline } from "react-icons/io5";
import { GrDocumentUpdate } from "react-icons/gr";
import { HiOutlineClipboardDocument, HiOutlineBars3 } from "react-icons/hi2";
import { GiAchievement } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import Logo from "../../assets/images/ohsansi.png";

//css
import "./Sidebar.css";

export default function Sidebar({ isOpen, setIsOpen, admin, userPermissions }) {
  const [usuario, setUsuario] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isMobile, setIsMobile] = useState(false);
  const navigation = useNavigate();

  // Detectar si es móvil (se mantiene igual)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cerrar sidebar al hacer clic en un enlace en móvil (se mantiene igual)
  useEffect(() => {
    if (isMobile && isOpen) {
      const handleResize = () => {
        if (window.innerWidth > 768) {
          setIsOpen(false);
        }
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isMobile, isOpen, setIsOpen]);

  const cerrarSesion = () => {
    if (admin) {
      localStorage.removeItem("user");
      navigation("/admin");
    } else {
      sessionStorage.clear();
      navigation("/");
    }
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Prevenir scroll del body cuando el sidebar está abierto en móvil (se mantiene igual)
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobile, isOpen]);

  return (
    <>
      {/* Overlay que se muestra solo en móvil (se mantiene igual) */}
      {isOpen && isMobile && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsOpen(false);
            }
          }}
          aria-label="Cerrar menú"
        />
      )}

      {/* Sidebar principal */}
      <aside
        className={`sidebar ${isOpen ? "active" : ""}`}
        role="navigation"
        aria-label="Menú principal"
      >
        {/* Header del sidebar (se mantiene igual) */}
        <div className="sidebar-header">
          <img
            src={Logo}
            alt="Logo O SANSI"
            className="logoEncabezado"
            loading="lazy"
          />
          <h2 className="sidebar-title">O! SanSi</h2>
        </div>

        {/* Lista de navegación */}
        <nav>
          <ul role="list">
            {admin ? (
              <>
                <li>
                  <Link
                    to="/admin/home"
                    onClick={handleLinkClick}
                    className="nav-link"
                    aria-label="Ir a inicio"
                  >
                    <FaHome className="sidebar-icons" aria-hidden="true" />
                    <span>Inicio</span>
                  </Link>
                </li>

                {userPermissions?.includes("crear_olimpiadas") && (
                  <li>
                    <Link
                      to="/admin/olimpiadas"
                      onClick={handleLinkClick}
                      className="nav-link"
                      aria-label="Ver olimpiadas"
                    >
                      <GiAchievement
                        className="sidebar-icons"
                        aria-hidden="true"
                      />
                      <span>Olimpiadas</span>
                    </Link>
                  </li>
                )}
                {userPermissions?.includes("gestionar_olimpiadas") && (
                  <li>
                    <Link
                      to="/admin/panelOlympiad"
                      onClick={handleLinkClick}
                      className="nav-link"
                      aria-label="Gestionar olimpiadas"
                    >
                      <FaRegEdit className="sidebar-icons" aria-hidden="true" />
                      <span>Gestionar</span>
                    </Link>
                  </li>
                )}
                {userPermissions?.includes("ver_reportes") && (
                  <li>
                    <Link
                      to="/admin/reports"
                      onClick={handleLinkClick}
                      className="nav-link"
                      aria-label="Ver reportes"
                    >
                      <HiOutlineClipboardDocument
                        className="sidebar-icons"
                        aria-hidden="true"
                      />
                      <span>Reportes</span>
                    </Link>
                  </li>
                )}
              </>
            ) : (
              /* Menú para usuarios normales (se mantiene igual) */
              <>
                <li>
                  <NavLink
                    to={
                      sessionStorage.getItem("pantallaActualRegistro") !== "" &&
                      sessionStorage.getItem("pantallaActualRegistro") !== null
                        ? sessionStorage.getItem("pantallaActualRegistro")
                        : "/register/listRegistered"
                    }
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      isActive ? "active-link" : ""
                    }
                    aria-label="Ir a registro"
                  >
                    <FaHome className="sidebar-icons" aria-hidden="true" />
                    <span className="menu-text">Registro</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/register/generate-order"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      isActive ? "active-link" : ""
                    }
                    aria-label="Generar orden de pago"
                  >
                    <GrDocumentDownload
                      className="sidebar-icons"
                      aria-hidden="true"
                    />
                    <span className="menu-text">Orden de pago</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/register/comprobar-boleta"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      isActive ? "active-link" : ""
                    }
                    aria-label="Subir comprobante de pago"
                  >
                    <GrDocumentUpdate
                      className="sidebar-icons"
                      aria-hidden="true"
                    />
                    <span className="menu-text">Comprobante</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/contacto"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      isActive ? "active-link" : ""
                    }
                    aria-label="Ir a contacto"
                  >
                    <IoDocumentTextOutline
                      className="sidebar-icons"
                      aria-hidden="true"
                    />
                    <span className="menu-text">Contacto</span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Botón toggle - ahora dentro del sidebar en escritorio (se mantiene igual) */}
        {!isMobile && (
          <div className="toggle-container">
            <button
              className="toggle-btn"
              onClick={toggleSidebar}
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isOpen}
              type="button"
            >
              <HiOutlineBars3 style={{ fontSize: "18px" }} aria-hidden="true" />
              <span>{isOpen ? "Ocultar menú" : "Menú"}</span>
            </button>
          </div>
        )}

        {/* Botón cerrar sesión (se mantiene igual) */}
        <div className="btn-logout">
          <button
            onClick={cerrarSesion}
            className="logout-button"
            aria-label="Cerrar sesión"
            type="button"
          >
            <IoLogOutOutline className="sidebar-icons" aria-hidden="true" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Botón toggle para móvil (fuera del sidebar) (se mantiene igual) */}
      {isMobile && (
        <button
          className="toggle-btn"
          onClick={toggleSidebar}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          type="button"
        >
          {isOpen ? (
            <MdClose style={{ fontSize: "20px" }} aria-hidden="true" />
          ) : (
            <HiOutlineBars3 style={{ fontSize: "20px" }} aria-hidden="true" />
          )}
        </button>
      )}
    </>
  );
}
