//React
import { NavLink, Link, useNavigate } from "react-router-dom";
import { GrDocumentDownload } from "react-icons/gr";
import { useState } from "react";

//Icons
import { FaHome, FaRegEdit } from "react-icons/fa";
import { IoDocumentTextOutline, IoLogInOutline } from "react-icons/io5";
import { GrDocumentUpdate } from "react-icons/gr";
import { HiOutlineClipboardDocument } from "react-icons/hi2";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { GiAchievement } from "react-icons/gi";
import Logo from "../../assets/images/ohsansi.png";
//css
import "./Sidebar.css";

export default function Sidebar({ isOpen, setIsOpen, admin }) {
  const [usuario, setUsuario] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigation = useNavigate();

  const cerrarSesion = () => {
    if (admin) {
      localStorage.removeItem("user");
      navigation("/admin");
    } else {
      sessionStorage.clear();
      navigation("/");
    }
  };

  const permisos = usuario?.rol?.permisos?.map((p) => p.nombrePermiso) || [];
  const tienePermiso = (permiso) => permisos.includes(permiso);

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>
      )}
      <div className={` sidebar ${isOpen ? "active" : ""}`}>
        <div
          className={`sidebar-header ${
            isOpen ? "" : "sidebar-header-contrain"
          }`}
        >
          <img src={Logo} alt="LOGO O SANSI" className="logoEncabezado" />
          {isOpen && <h2 className="sidebar-title">O! SanSi</h2>}
        </div>
        <ul>
          {admin ? (
            <>
              <li>
                <Link to="/admin/home">
                  <FaHome className="sidebar-icons" />
                  {isOpen ? " Inicio" : ""}
                </Link>
              </li>
              <li>
                <Link to="/admin/olimpiadas">
                  <GiAchievement className="sidebar-icons" />
                  {isOpen ? " Olimpiadas" : ""}
                </Link>
              </li>
              <li>
                <Link to="/admin/panelOlympiad">
                  <FaRegEdit className="sidebar-icons" />
                  {isOpen ? " Gestionar" : ""}
                </Link>
              </li>

              <li>
                <Link to="/admin/reports">
                  <HiOutlineClipboardDocument className="sidebar-icons" />
                  {isOpen ? " Reportes" : ""}
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to={
                    sessionStorage.getItem("pantallaActualRegistro") != ""
                      ? sessionStorage.getItem("pantallaActualRegistro")
                      : "/register/listRegistered"
                  }
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <FaHome className="sidebar-icons" />
                  {isOpen ? " Registro" : ""}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/register/generate-order"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <GrDocumentDownload className="sidebar-icons" />
                  {isOpen ? " Generar orden de pago" : ""}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/register/comprobar-boleta"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <GrDocumentUpdate className="sidebar-icons" />
                  {isOpen ? " Subir comprobante" : ""}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/contacto"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <IoDocumentTextOutline className="sidebar-icons" />
                  {isOpen ? " Contacto" : ""}
                </NavLink>
              </li>
            </>
          )}
        </ul>

        <div className="btn-logout">
          <a>
            <IoLogInOutline
              style={{ fontSize: "25px" }}
              className="sidebar-icons"
              onClick={cerrarSesion}
            />
            {isOpen ? <span onClick={cerrarSesion}>Cerrar Sesion</span> : ""}
          </a>
        </div>
      </div>

      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        <FaArrowRightArrowLeft style={{ fontSize: "18px" }} />
        {isOpen ? <span style={{ margin: "10px" }}>Contraer menú</span> : ""}
      </button>
    </>
  );
}
