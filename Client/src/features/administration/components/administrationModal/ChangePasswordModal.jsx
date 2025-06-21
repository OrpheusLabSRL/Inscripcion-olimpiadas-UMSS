// ChangePasswordModal.jsx
import React, { useState } from "react";
import { FiAlertCircle, FiLock } from "react-icons/fi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { updateUsuario } from "../../../../api/Administration.api";
import "../../Styles/ModalGeneral.css";

const MySwal = withReactContent(Swal);

const ChangePasswordModal = ({ isOpen, onClose, usuario }) => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "La nueva contraseña es obligatoria";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Debe tener al menos 6 caracteres";
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword = "Debe contener al menos una mayúscula";
    } else if (!/\d/.test(formData.newPassword)) {
      newErrors.newPassword = "Debe contener al menos un número";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debe confirmar la contraseña";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      await MySwal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Completa todos los campos correctamente.",
        customClass: { container: "swal2Container" },
      });
      return;
    }

    const confirm = await MySwal.fire({
      title: "¿Cambiar contraseña?",
      html: `Vas a cambiar la contraseña del usuario <strong>${usuario.nombreUsuario}</strong>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: { container: "swal2Container" },
    });

    if (!confirm.isConfirmed) return;

    setIsSubmitting(true);

    try {
      await updateUsuario(usuario.idUsuario, {
        password: formData.newPassword,
      });

      await MySwal.fire({
        icon: "success",
        title: "Contraseña actualizada",
        text: "La contraseña fue cambiada exitosamente.",
        timer: 2000,
        showConfirmButton: false,
        customClass: { container: "swal2Container" },
      });

      onClose();
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      await MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo cambiar la contraseña",
        customClass: { container: "swal2Container" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="adminModalOverlay" onClick={onClose}>
      <div
        className="adminModalContent"
        style={{ maxWidth: "500px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="adminModalCloseBtn"
          onClick={onClose}
          aria-label="Cerrar modal"
          disabled={isSubmitting}
        >
          ✖
        </button>
        <div className="adminModalHeader">
          <h3 className="adminModalTitle">Cambiar Contraseña</h3>
        </div>
        <p className="adminModalSubtitle">
          Usuario: <strong>{usuario.nombreUsuario}</strong>
        </p>
        <form onSubmit={handleSubmit} className="adminModalForm">
          <div className="adminFormGroup">
            <label className="adminFormLabel">
              Nueva contraseña <span className="adminRequiredField">*</span>
            </label>
            <input
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              className={`adminFormInput ${
                errors.newPassword ? "adminInputError" : ""
              }`}
              placeholder="Mínimo 6 caracteres, 1 mayúscula y 1 número"
              disabled={isSubmitting}
            />
            {errors.newPassword && (
              <p className="adminErrorMessage">
                <FiAlertCircle /> {errors.newPassword}
              </p>
            )}
          </div>

          <div className="adminFormGroup">
            <label className="adminFormLabel">
              Confirmar contraseña <span className="adminRequiredField">*</span>
            </label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`adminFormInput ${
                errors.confirmPassword ? "adminInputError" : ""
              }`}
              placeholder="Repite la nueva contraseña"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <p className="adminErrorMessage">
                <FiAlertCircle /> {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="adminModalActions">
            <button
              type="button"
              className="adminModalBtnCancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="adminModalBtnSave"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Cambiando..." : "Cambiar Contraseña"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
