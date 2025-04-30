import React, { useState } from "react";
import "../Styles/Dropdown.css";

const Dropdown = ({
  options = [],
  value = "",
  onChange,
  placeholder = "Seleccione una opción",
  name = "",
  error = false,
  errorMessage = "",
  size = "small",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (option) => {
    setIsOpen(false);
    // Simula un evento onChange nativo
    onChange({ target: { value: option.value, name } });
  };

  return (
    <div className="dropdown-container">
      {name && (
        <label
          htmlFor={name}
          className={`dropdown-label ${size === "large" ? "large" : ""}`}
        >
          {placeholder}
        </label>
      )}
      <div
        className={`dropdown-wrapper ${size} ${error ? "error-border" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="dropdown-display">
          {selectedOption ? selectedOption.label : placeholder}
          <span className="dropdown-arrow">▼</span>
        </div>
      </div>

      {isOpen && (
        <div className="dropdown-list">
          {options.map((option) => (
            <div
              key={option.value}
              className="dropdown-option"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {error && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default Dropdown;
