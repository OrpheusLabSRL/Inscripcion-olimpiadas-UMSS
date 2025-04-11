import { Link } from "react-router-dom";

// Icons
import { FaHome } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { HiOutlineClipboardDocument } from "react-icons/hi2";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoLogInOutline } from "react-icons/io5";
import { FaArrowRightArrowLeft } from "react-icons/fa6";

// css
import "./AdminSidebar.css";

// assets
import logoOlab from "../../assets/images/logo-olab.png";

export default function AdminSidebar({ isOpen, setIsOpen }) {
  return (
    <>
      <div className={`sidebar ${isOpen ? "active" : ""}`}>
        <div
          className={`sidebar-header ${
            isOpen ? "" : "sidebar-header-contrain"
          }`}
        >
          <img src={logoOlab} alt="Logo Oh! SanSi" />
          {isOpen && <h2 className="sidebar-title">Oh! SanSi</h2>}
        </div>
        <ul>
          <li>
            <Link to="/admin/olimpiadas">
              <FaHome className="sidebar-icons" />
              {isOpen ? "Olimpiadas" : ""}
            </Link>
          </li>
          <li>
            <Link to="/admin/base-data">
              <IoDocumentTextOutline className="sidebar-icons" />
              {isOpen ? "Datos base" : ""}
            </Link>
          </li>
        </ul>

        <div className="btn-logout">
          <a href="#">
            <IoLogInOutline className="sidebar-icons" />
            {isOpen ? "Cerrar Sesión" : ""}
          </a>
        </div>
      </div>

      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        <FaArrowRightArrowLeft />
      </button>
    </>
  );
}
