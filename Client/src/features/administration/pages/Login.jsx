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
    <div className="loginContainer">
      <div className="loginCard">
        <div className="loginHeader">
          <h2 className="loginTitle">Bienvenido al Sistema</h2>
          <p className="loginSubtitle">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {error && (
          <div className="loginError">
            <MdErrorOutline className="loginErrorIcon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="loginForm">
          <div className="loginFormGroup">
            <label htmlFor="email" className="loginFormLabel">
              <FaEnvelope className="loginInputIcon" />
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="loginFormInput"
              placeholder="tu@email.com"
            />
          </div>

          <div className="loginFormGroup">
            <label htmlFor="password" className="loginFormLabel">
              <FaLock className="loginInputIcon" />
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="loginFormInput"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="loginSubmitButton"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loginSpinner"></span>
            ) : (
              <>
                <FaSignInAlt className="loginButtonIcon" />
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
