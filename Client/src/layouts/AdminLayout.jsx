import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { useLocation } from "react-router-dom";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(true); 
  const location = useLocation();
  return (
    <div className="admin-layout">
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
