import React, { useState, useRef, useEffect } from "react";
import { FiAlertCircle } from "react-icons/fi";
import "../Styles/Dropdown.css";

const MultiSelectDropdown = ({
  label,
  name,
  options = [],
  selectedValues = [],
  onChange,
  placeholder = "Seleccione una opción",
  error = false,
  errorMessage = "",
  size = "medium",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleOption = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabels = options
    .filter((opt) => selectedValues.includes(opt.value))
    .map((opt) => opt.label)
    .join(", ");

  return (
    <div
      className={`dropdown-container ${error ? "has-error" : ""} ${className}`}
      ref={dropdownRef}
    >
      {label && (
        <label className={`dropdown-label ${size === "large" ? "large" : ""}`}>
          {label}
        </label>
      )}

      <div
        className={`dropdown-wrapper ${size} ${error ? "input-error" : ""} ${
          disabled ? "disabled" : ""
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="dropdown-selected">
          {selectedLabels || placeholder}
        </span>
        <span className="dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && !disabled && (
        <div className="multi-dropdown-options">
          {options.map((option) => (
            <label key={option.value} className="multi-dropdown-item">
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  name={name}
                  value={option.value}
                  checked={selectedValues.includes(option.value)}
                  onChange={() => toggleOption(option.value)}
                  className="hidden-checkbox"
                />
                <span className="custom-checkbox"></span>
              </div>
              <span className="multi-label">{option.label}</span>
            </label>
          ))}
        </div>
      )}

      {error && errorMessage && (
        <p className="error-message">
          <FiAlertCircle style={{ marginRight: "4px" }} />
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
