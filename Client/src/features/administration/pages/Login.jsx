import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../api/Administration.api";
import { FaSignInAlt, FaEnvelope, FaLock } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import "../Styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Si ya está logueado, redirige automáticamente
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.role === "admin") {
      navigate("/admin/home");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await login({ email, password });
      const userData = data.usuario || data.user || data;
      if (!userData) throw new Error("No se recibió usuario");

      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/admin/home");
    } catch (err) {
      console.error("Error en login:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al conectar con el servidor"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Bienvenido al Sistema</h2>
          <p className="login-subtitle">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {error && (
          <div className="login-error">
            <MdErrorOutline className="login-error-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="login-form-group">
            <label htmlFor="email" className="login-form-label">
              <FaEnvelope className="login-input-icon" />
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-form-input"
              placeholder="tu@email.com"
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password" className="login-form-label">
              <FaLock className="login-input-icon" />
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-form-input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="login-submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="login-spinner"></span>
            ) : (
              <>
                <FaSignInAlt className="login-button-icon" />
                Iniciar Sesión
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
