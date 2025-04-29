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
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminLayout from "./layouts/AdminLayout";
import { RegisterResponsible } from "./features/registrarion/pages/RegisterResponsible";
import { RegisterOlympianArea } from "./features/registrarion/pages/RegisterOlympianArea";
import { RegisterTutorOptional } from "./features/registrarion/pages/RegisterTutorOptional";
import RegisterExcel from "./features/registrarion/pages/RegisterExcel";

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const showSidebar =
    location.pathname !== "/" &&
    location.pathname !== "/register/tutor-form" &&
    location.pathname !== "/register/excel";

  const user = {
    role: "admin",
  };

  return (
    <div className="app-container">
      <div
        className={
          location.pathname === "/" ||
          location.pathname === "/register/tutor-form" ||
          location.pathname === "/register/excel"
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
            <Route path="/register/excel" element={<RegisterExcel />} />
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

            {/* Rutas bajo Admin */}
            <Route path="/admin">
              <Route
                path="base-data"
                element={
                  <PrivateRoute
                    element={<ManageViewBase />}
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
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
