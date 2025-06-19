import { Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import { RegisterOlympian } from "./features/registration/pages/RegisterOlympian";
import Sidebar from "./components/sidebar/Sidebar";
import "./App.css";
import { RegisterTutor } from "./features/registration/pages/RegisterTutor";
import { TutorForm } from "./features/registration/pages/TutorForm";
import { MainHome } from "./features/homeUser/pages/MainHome";
import { ListRegistered } from "./features/registration/pages/ListRegistered";
import ManageArea from "./features/administration/pages/ManageArea";
import ManageCategoria from "./features/administration/pages/ManageCategories";
import ManageOlympiads from "./features/administration/pages/ManageOlympiads";
import ManageViewBase from "./features/administration/pages/ManageViewBaseData";
import HomeAdministration from "./features/administration/pages/Home";
import PanelOlympiad from "./features/administration/pages/ManagePanelOlympiad";
import Login from "./features/administration/pages/Login";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminLayout from "./layouts/AdminLayout";
import { RegisterResponsible } from "./features/registration/pages/RegisterResponsible";
import { RegisterOlympianArea } from "./features/registration/pages/RegisterOlympianArea";
import { RegisterTutorOptional } from "./features/registration/pages/RegisterTutorOptional";
import Reports from "./features/administration/pages/Reports";
import Unauthorized from "./features/administration/pages/Unauthorized";

import ManageViewUser from "./features/administration/pages/ManageViewUser";

import ContactPage from "./features/contact/pages/ContactPage";
import CheckRegistration from "./features/checkRegistration/pages/CheckRegistration";
import ResultadoConsulta from "./features/checkRegistration/pages/QueryResult_Olimpian";
import ResultadoConsulta_Tutor from "./features/checkRegistration/pages/QueryResult_Tutor";
import RegisterExcel from "./features/registration/pages/RegisterExcel";
import { RegisterChoose } from "./features/registration/pages/RegisterChoose";
import { OCRValidation } from "./features/registration/pages/OCRValidation";
import { GenerateOrder } from "./features/registration/pages/GenerateOrder";
import OlimpiadaDetallada from "./features/detallesOlimpiada/pages/olympicDetail";
import { Ticket } from "./features/Cashier/pages/Ticket";

import { useEffect } from "react";

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const [userPermissions, setUserPermissions] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    // Obtener permisos del usuario
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const permissions = user.rol?.permisos?.map((p) => p.nombrePermiso) || [];
      setUserPermissions(permissions);
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [location.pathname]);

  // Rutas donde NO mostrar sidebar (se mantiene igual)
  const hideSidebarRoutes = [
    "/",
    "/register/tutor-form",
    "/admin",
    "/no-autorizado",
    "no-autorizado",
    "/contacto",
    "/consultar-inscripcion",
    "/consultar-inscripcion/resultado",
    "/consultar-inscripcion/resultado-tutor",
    "/olimpiada/:id",
    "/cajero/:token/boleta/:id",
  ];

  const hideSidebar =
    hideSidebarRoutes.some((ruta) => location.pathname === ruta) ||
    location.pathname.startsWith("/olimpiada/") ||
    location.pathname.startsWith("/cajero/");

  const showSidebar = !hideSidebar;

  return (
    <div className="app-container">
      <div
        className={
          hideSidebar ? "page-no-sidebar" : isOpen ? "main active" : "main"
        }
      >
        {showSidebar && (
          <Sidebar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            admin={location.pathname.startsWith("/admin")}
            userPermissions={userPermissions} // Pasamos los permisos al Sidebar
          />
        )}

        <div
          className={`content-area ${
            hideSidebarRoutes.includes(location.pathname) ||
            location.pathname.startsWith("/olimpiada/")
              ? "no-margin"
              : ""
          }`}
        >
          <Routes>
            <Route path="/" element={<MainHome />} />
            <Route path="/olimpiada/:id" element={<OlimpiadaDetallada />} />
            <Route path="/register" element={<RegisterChoose />} />
            <Route path="/register/olympian" element={<RegisterOlympian />} />
            <Route path="/register/tutor-legal" element={<RegisterTutor />} />
            <Route path="/register/tutor-form" element={<TutorForm />} />
            <Route path="/register/excel" element={<RegisterExcel />} />
            <Route
              path="/register/comprobar-boleta"
              element={<OCRValidation />}
            />
            <Route
              path="/register/generate-order"
              element={<GenerateOrder />}
            />
            <Route
              path="/register/responsible"
              element={<RegisterResponsible />}
            />
            <Route
              path="/register/olympian-area"
              element={<RegisterOlympianArea />}
            />
            <Route
              path="/register/tutor-optional"
              element={<RegisterTutorOptional />}
            />
            <Route
              path="/register/listRegistered"
              element={<ListRegistered />}
            />
            <Route path="/contacto" element={<ContactPage />} />
            <Route
              path="/consultar-inscripcion"
              element={<CheckRegistration />}
            />
            <Route
              path="/consultar-inscripcion/resultado"
              element={<ResultadoConsulta />}
            />
            <Route path="/no-autorizado" element={<Unauthorized />} />
            <Route
              path="/consultar-inscripcion/resultado-tutor"
              element={<ResultadoConsulta_Tutor />}
            />
            <Route path="/cajero/:token/boleta/:id" element={<Ticket />} />

            {/* Admin Layout con rutas anidadas */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Login />} />

              <Route
                path="home"
                element={
                  <PrivateRoute
                    element={<HomeAdministration />}
                    withoutAllowed={true}
                  />
                }
              />

              <Route
                path="manageUser"
                element={
                  <PrivateRoute
                    element={<ManageViewUser />}
                    allowedPermiso={"crear_usuarios"}
                  />
                }
              />

              <Route
                path="areas"
                element={
                  <PrivateRoute
                    element={<ManageArea />}
                    allowedPermiso={"gestionar_areas"}
                  />
                }
              />
              <Route
                path="categorias"
                element={
                  <PrivateRoute
                    element={<ManageCategoria />}
                    allowedPermiso={"gestionar_categorias"}
                  />
                }
              />
              <Route
                path="olimpiadas"
                element={
                  <PrivateRoute
                    element={<ManageOlympiads />}
                    allowedPermiso={"crear_olimpiadas"}
                  />
                }
              />
              <Route
                path="view-base"
                element={
                  <PrivateRoute
                    element={<ManageViewBase />}
                    allowedPermiso={"gestionar_datos_base"}
                  />
                }
              />
              <Route
                path="panelOlympiad"
                element={
                  <PrivateRoute
                    element={<PanelOlympiad />}
                    allowedPermiso={"gestionar_olimpiadas"}
                  />
                }
              />
              <Route
                path="reports"
                element={
                  <PrivateRoute
                    element={<Reports />}
                    allowedPermiso={"ver_reportes"}
                  />
                }
              />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
