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

//css
import "./Sidebar.css";

//assets
import logoOlab from "../../assets/images/logo-olab.png";

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      <div className={` sidebar ${isOpen ? "active" : ""}`}>
        <div
          className={`sidebar-header ${
            isOpen ? "" : "sidebar-header-contrain"
          }`}
        >
          <img src={logoOlab} />
          {isOpen && <h2 className="sidebar-title">Oh! SanSi</h2>}
        </div>
        <ul>
          <li>
            <Link>
              {<FaHome className="sidebar-icons" />}{" "}
              {isOpen ? "Olimpiadas" : ""}
            </Link>
          </li>
          <li>
            <Link>
              {<IoDocumentTextOutline className="sidebar-icons" />}{" "}
              {isOpen ? "Datos base" : ""}
            </Link>
          </li>
          <li>
            <Link>
              {" "}
              {
                <HiOutlineClipboardDocumentList className="sidebar-icons" />
              }{" "}
              {isOpen ? "Exámenes" : ""}
            </Link>
          </li>
          <li>
            <Link>
              {<HiOutlineClipboardDocument className="sidebar-icons" />}{" "}
              {isOpen ? "Reportes" : ""}
            </Link>
          </li>
          <li>
            <Link>
              {<FaRegCalendarAlt className="sidebar-icons" />}{" "}
              {isOpen ? "Calendario" : ""}
            </Link>
          </li>
        </ul>

        <div className="btn-logout">
          <a>
            {<IoLogInOutline className="sidebar-icons" />}{" "}
            {isOpen ? "Cerrar Sesion" : ""}
          </a>
        </div>
      </div>

      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        <FaArrowRightArrowLeft />
      </button>
    </>
  );
}
