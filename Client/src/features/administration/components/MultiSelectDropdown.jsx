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
      className={`dropdownContainer ${error ? "hasError" : ""} ${className}`}
      ref={dropdownRef}
    >
      {label && (
        <label className={`dropdownLabel ${size === "large" ? "large" : ""}`}>
          {label}
        </label>
      )}

      <div
        className={`dropdownWrapper ${size} ${error ? "inputError" : ""} ${
          disabled ? "disabled" : ""
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="dropdownSelected">
          {selectedLabels || placeholder}
        </span>
        <span className="dropdownArrow">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && !disabled && (
        <div className="multiDropdownOptions">
          {options.map((option) => (
            <label key={option.value} className="multiDropdownItem">
              <div className="checkboxContainer">
                <input
                  type="checkbox"
                  name={name}
                  value={option.value}
                  checked={selectedValues.includes(option.value)}
                  onChange={() => toggleOption(option.value)}
                  className="hiddenCheckbox"
                />
                <span className="customCheckbox"></span>
              </div>
              <span className="multiLabel">{option.label}</span>
            </label>
          ))}
        </div>
      )}

      {error && errorMessage && (
        <p className="errorMessage">
          <FiAlertCircle style={{ marginRight: "4px" }} />
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
