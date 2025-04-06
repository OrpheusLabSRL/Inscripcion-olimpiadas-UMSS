import { Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";

// Components
import { RegisterOlympian } from "./features/registrarion/pages/RegisterOlympian/Register-Olympian";
import Sidebar from "./components/sidebar/Sidebar";
import "./App.css";
import { RegisterTutor } from "./features/registrarion/pages/RegisterTutor/RegisterTutor";
import { TutorForm } from "./features/registrarion/pages/TutorForm/TutorForm"; // Ahora funciona con la exportación nombrada
import { MainHome } from "./features/home/pages/MainHome";

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  return (
    <div className={location.pathname === "/" ? "" : isOpen ? "main active" : "main"}>
      {location.pathname !== "/" && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />}

      <div style={{ gridColumnStart: 2 }}>
        <Routes>
          <Route path="/" element={<MainHome />} />
          <Route path="/register" element={<RegisterOlympian />} />
          <Route path="/register/tutor" element={<RegisterTutor />} />
          <Route path="/register/tutor-form" element={<TutorForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;