import React, { useState } from "react";
import "../../Styles/Dropdown.css";

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
    onChange({ target: { value: option.value, name } });
  };

  return (
    <div className="dropdownContainer">
      {name && (
        <label
          htmlFor={name}
          className={`dropdownLabel ${size === "large" ? "large" : ""}`}
        >
          {placeholder}
        </label>
      )}
      <div
        className={`dropdownWrapper ${size} ${error ? "errorBorder" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="dropdownDisplay">
          {selectedOption ? selectedOption.label : placeholder}
          <span className="dropdownArrow">▼</span>
        </div>
      </div>

      {isOpen && (
        <div className="dropdownList">
          {options.map((option) => (
            <div
              key={option.value}
              className="dropdownOption"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {error && <div className="errorMessage">{errorMessage}</div>}
    </div>
  );
};

export default Dropdown;
