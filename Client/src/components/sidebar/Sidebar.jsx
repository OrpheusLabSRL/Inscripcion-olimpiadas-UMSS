//React
import { Link } from "react-router-dom";

//Icons
import { FaHome } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { HiOutlineClipboardDocument } from "react-icons/hi2";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoLogInOutline } from "react-icons/io5";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { GiAchievement } from "react-icons/gi";

//css
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ isOpen, setIsOpen, admin }) {
  const navigation = useNavigate();

  const cerrarSesion = () => {
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
                  <GiAchievement className="sidebar-icons" />{" "}
                  {isOpen ? "Olimpiadas" : ""}
                </Link>
              </li>
              {/*<li>
                <Link to="/admin/base-data">
                  <IoDocumentTextOutline className="sidebar-icons" />{" "}
                  {isOpen ? "Datos base" : ""}
                </Link>
              </li>*/}
              <li>
                <Link>
                  <HiOutlineClipboardDocumentList className="sidebar-icons" />{" "}
                  {isOpen ? "Exámenes" : ""}
                </Link>
              </li>
              <li>
                <Link>
                  <HiOutlineClipboardDocument className="sidebar-icons" />{" "}
                  {isOpen ? "Reportes" : ""}
                </Link>
              </li>
              <li>
                <Link>
                  <FaRegCalendarAlt className="sidebar-icons" />{" "}
                  {isOpen ? "Calendario" : ""}
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link>
                  <FaHome className="sidebar-icons" /> {isOpen ? "Inicio" : ""}
                </Link>
              </li>
              <li>
                <Link>
                  <IoDocumentTextOutline className="sidebar-icons" />{" "}
                  {isOpen ? "Contacto" : ""}
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="btn-logout">
          <a>
            {
              <IoLogInOutline
                style={{ fontSize: "25px" }}
                className="sidebar-icons"
                onClick={cerrarSesion}
              />
            }{" "}
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
