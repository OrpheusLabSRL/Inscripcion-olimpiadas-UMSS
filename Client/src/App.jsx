import { Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import { RegisterOlympian } from "./features/registrarion/pages/Register-Olympian";
import Sidebar from "./components/sidebar/Sidebar";
import "./App.css";
import { RegisterTutor } from "./features/registrarion/pages/RegisterTutor";
import { TutorForm } from "./features/registrarion/pages/TutorForm";
import { MainHome } from "./features/home_usuario/pages/MainHome";
import { ListRegistered } from "./features/registrarion/pages/ListRegistered";
import ManageArea from "./features/administration/pages/ManageArea";
import ManageCategoria from "./features/administration/pages/ManageCategoria";
import ManageOlympiads from "./features/administration/pages/ManageOlympiads";
import ManageViewBase from "./features/administration/pages/ManageViewBaseData";
import HomeAdministration from "./features/administration/pages/Home";
import PanelOlympiad from "./features/administration/pages/PanelOlympiad";
import Login from "./features/administration/pages/Login";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminLayout from "./layouts/AdminLayout";
import { RegisterResponsible } from "./features/registrarion/pages/RegisterResponsible";
import { RegisterOlympianArea } from "./features/registrarion/pages/RegisterOlympianArea";
import { RegisterTutorOptional } from "./features/registrarion/pages/RegisterTutorOptional";
import Reports from "./features/administration/pages/Reports";

import PaginaContacto from "./features/contacto/pages/PaginaContacto";
import ConsultarInscripcion from "./features/consultar_inscripcion/pages/ConsultarInscripcion";
import ResultadoConsulta from "./features/consultar_inscripcion/pages/ResultadoConsulta";
import ResultadoConsulta_Tutor from "./features/consultar_inscripcion/pages/ResultadoConsulta_Tutor";
import RegisterExcel from "./features/registrarion/pages/RegisterExcel";
import { RegisterChoose } from "./features/registrarion/pages/RegisterChoose";
import { OCRValidation } from "./features/registrarion/pages/ocrvalidation";
import { GenerateOrder } from "./features/registrarion/pages/GenerateOrder";
import OlympiadDetail from "./features/detallesOlimpiada/OlympiadDetail";

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  // Rutas donde NO mostrar sidebar
  const hideSidebarRoutes = [
    "/",
    "/register/tutor-form",
    "/admin",
    "/contacto",
    "/consultar-inscripcion",
    "/consultar-inscripcion/resultado",
    "/consultar-inscripcion/resultado-tutor",
  ];

  const hideSidebar = hideSidebarRoutes.some((ruta) => location.pathname === ruta) || location.pathname.startsWith("/olimpiada/");

  const showSidebar = !hideSidebar;
  return (
    <div className="app-container">
      <div
        className={
          hideSidebar
            ? "page-no-sidebar"
            : isOpen
              ? "main active"
              : "main"
        }
      >
        {showSidebar && (
          <Sidebar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            admin={location.pathname.startsWith("/admin")}
          />
        )}

        <div className={`content-area ${hideSidebar ? "no-content-style" : ""}`}>
          <Routes>
            <Route path="/" element={<MainHome />} />
            <Route path="/olimpiada/:id" element={<OlympiadDetail />} />
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
            <Route path="/contacto" element={<PaginaContacto />} />
            <Route
              path="/consultar-inscripcion"
              element={<ConsultarInscripcion />}
            />
            <Route
              path="/consultar-inscripcion/resultado"
              element={<ResultadoConsulta />}
            />
            <Route
              path="/consultar-inscripcion/resultado-tutor"
              element={<ResultadoConsulta_Tutor />}
            />

            {/* Admin Layout con rutas anidadas */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Login />} />
              <Route
                path="home"
                element={
                  <PrivateRoute
                    element={<HomeAdministration />}
                    allowedRoles={[1]}
                  />
                }
              />
              <Route
                path="areas"
                element={
                  <PrivateRoute element={<ManageArea />} allowedRoles={[1]} />
                }
              />
              <Route
                path="categorias"
                element={
                  <PrivateRoute
                    element={<ManageCategoria />}
                    allowedRoles={[1]}
                  />
                }
              />
              <Route
                path="olimpiadas"
                element={
                  <PrivateRoute
                    element={<ManageOlympiads />}
                    allowedRoles={[1]}
                  />
                }
              />
              <Route
                path="view-base"
                element={
                  <PrivateRoute
                    element={<ManageViewBase />}
                    allowedRoles={[1]}
                  />
                }
              />
              <Route
                path="panelOlympiad"
                element={
                  <PrivateRoute
                    element={<PanelOlympiad />}
                    allowedRoles={[1]}
                  />
                }
              />
              <Route
                path="reports"
                element={
                  <PrivateRoute element={<Reports />} allowedRoles={[1]} />
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
