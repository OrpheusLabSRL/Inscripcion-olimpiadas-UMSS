import { Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import { RegisterOlympian } from "./features/registrarion/pages/RegisterOlympian/Register-Olympian";
import Sidebar from "./components/sidebar/Sidebar";
import "./App.css";
import { RegisterTutor } from "./features/registrarion/pages/RegisterTutor/RegisterTutor";
import { TutorForm } from "./features/registrarion/pages/TutorForm/TutorForm";
import { MainHome } from "./features/home/pages/MainHome";
import { ListRegistered } from "./features/registrarion/pages/ListRegistered/ListRegistered";
import ManageBaseData from "./features/administration/pages/ManageBaseData";
import ManageArea from "./features/administration/pages/ManageArea";
import ManageCategoria from "./features/administration/pages/ManageCategoria";
import ManageOlympiads from "./features/administration/pages/ManageOlympiads";
import ManageBaseGeneral from "./features/administration/pages/ManageBaseDataGeneral";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminLayout from "./layouts/AdminLayout";
import { RegisterResponsible } from "./features/registrarion/pages/RegisterReponsible/RegisterResponsible";
import { RegisterOlympianArea } from "./features/registrarion/pages/RegisterOlympianArea/RegisterOlympianArea";
import { RegisterTutorOptional } from "./features/registrarion/pages/RegisterTutorOptional/RegisterTutorOptional";

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const showSidebar =
    location.pathname !== "/" && location.pathname !== "/register/tutor-form";

  // Simular usuario logueado
  const user = {
    role: "admin", // Cambia a "user" para probar restricciones
  };

  return (
    <div className="app-container">
      <div
        className={
          location.pathname === "/" ||
          location.pathname == "/register/tutor-form"
            ? ""
            : isOpen
            ? "main active"
            : "main"
        }
      >
        {showSidebar && (
          <Sidebar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            admin={!location.pathname.startsWith("/admin") ? false : true}
          />
        )}

        <div className="content-area">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<MainHome />} />
            <Route path="register/olympian" element={<RegisterOlympian />} />
            <Route path="register/tutor-legal" element={<RegisterTutor />} />
            <Route path="listRegistered" element={<ListRegistered />} />
            <Route path="/register/tutor-form" element={<TutorForm />} />
            <Route
              path="/register/responsible"
              element={<RegisterResponsible />}
            />
            <Route
              path="/Register/OlympianArea"
              element={<RegisterOlympianArea />}
            />
            <Route
              path="/Register/OlympianArea/tutorOptional"
              element={<RegisterTutorOptional />}
            />

            {/* Rutas bajo AdminLayout */}
            <Route path="/admin">
              <Route
                path="register-base"
                element={
                  <PrivateRoute
                    element={<ManageBaseData />}
                    allowedRoles={["admin"]}
                    userRole={user.role}
                  />
                }
              />
              <Route
                path="areas"
                element={
                  <PrivateRoute
                    element={<ManageArea />}
                    allowedRoles={["admin"]}
                    userRole={user.role}
                  />
                }
              />
              <Route
                path="categorias"
                element={
                  <PrivateRoute
                    element={<ManageCategoria />}
                    allowedRoles={["admin"]}
                    userRole={user.role}
                  />
                }
              />
              <Route
                path="olimpiadas"
                element={
                  <PrivateRoute
                    element={<ManageOlympiads />}
                    allowedRoles={["admin"]}
                    userRole={user.role}
                  />
                }
              />
              <Route
                path="base-data"
                element={
                  <PrivateRoute
                    element={<ManageBaseGeneral />}
                    allowedRoles={["admin"]}
                    userRole={user.role}
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
