import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../components/sidebar/AdminSidebar";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(true); // ✅ el estado está definido acá

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />{" "}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
