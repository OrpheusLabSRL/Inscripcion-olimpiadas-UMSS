//React
import { NavLink, Link, useNavigate } from "react-router-dom";

//Icons
import { FaHome, FaRegCalendarAlt, FaRegEdit } from "react-icons/fa";
import { IoDocumentTextOutline, IoLogInOutline } from "react-icons/io5";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineClipboardDocument,
} from "react-icons/hi2";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { GiAchievement } from "react-icons/gi";

//css
import "./Sidebar.css";

export default function Sidebar({ isOpen, setIsOpen, admin }) {
  const navigation = useNavigate();

  const cerrarSesion = () => {
    sessionStorage.clear();
    navigation("/");
  };

  return (
    <>
      <div className={` sidebar ${isOpen ? "active" : ""}`}>
        <div
          className={`sidebar-header ${
            isOpen ? "" : "sidebar-header-contrain"
          }`}
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/7330cc38170480eadf5800dd915ae76c4a5737cb"
            alt="LOGO O SANSI"
          />
          {isOpen && <h2 className="sidebar-title">Oh! SanSi</h2>}
        </div>
        <ul>
          {admin ? (
            <>
              <li>
                <Link to="/admin/home">
                  <FaHome className="sidebar-icons" />
                  {isOpen ? "Inicio" : ""}
                </Link>
              </li>
              <li>
                <Link to="/admin/olimpiadas">
                  <GiAchievement className="sidebar-icons" />
                  {isOpen ? "Olimpiadas" : ""}
                </Link>
              </li>
              <li>
                <Link to="/admin/panelOlympiad">
                  <FaRegEdit className="sidebar-icons" />
                  {isOpen ? "Gestionar" : ""}
                </Link>
              </li>
              <li>
                <NavLink>
                  <HiOutlineClipboardDocumentList className="sidebar-icons" />
                  {isOpen ? "Exámenes" : ""}
                </NavLink>
              </li>
              <li>
                <Link to="/admin/reports">
                  <HiOutlineClipboardDocument className="sidebar-icons" />
                  {isOpen ? "Reportes" : ""}
                </Link>
              </li>
              <li>
                <NavLink>
                  <FaRegCalendarAlt className="sidebar-icons" />
                  {isOpen ? "Calendario" : ""}
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to={
                    sessionStorage.getItem("pantallaActualRegistro")
                      ? sessionStorage.getItem("pantallaActualRegistro")
                      : "/register"
                  }
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <FaHome className="sidebar-icons" />
                  {isOpen ? "Inscripción" : ""}
                </NavLink>
              </li>
              <li>
                <NavLink to="/contacto">
                  <IoDocumentTextOutline className="sidebar-icons" />
                  {isOpen ? "Contacto" : ""}
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
