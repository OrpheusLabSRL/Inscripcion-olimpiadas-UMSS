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
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminLayout from "./layouts/AdminLayout";

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const user = {
    role: "admin", // Cambia a "user" para probar restricciones
  };

  const showSidebar =
    location.pathname !== "/" && location.pathname !== "/register/tutor-form";
  return (
    <div className="app-container">
      <div
        className={
          location.pathname === "/" ? "" : isOpen ? "main active" : "main"
        }
      >
        {showSidebar && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />}

        <div className="content-area">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<MainHome />} />
            <Route
              path="listRegistered/register"
              element={<RegisterOlympian />}
            />
            <Route path="listRegistered/tutor" element={<RegisterTutor />} />
            <Route path="listRegistered" element={<ListRegistered />} />
            <Route path="/register/tutor-form" element={<TutorForm />} />

            {/* Rutas bajo AdminLayout */}
            <Route path="/admin">
              <Route
                path="base-data"
                element={
                  <PrivateRoute
                    element={<ManageBaseData />}
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
