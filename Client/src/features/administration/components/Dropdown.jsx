import React, { useState } from "react";
import "../Styles/Dropdown.css";

const Dropdown = ({
  label,
  options = [],
  onChange,
  placeholder = "Seleccione una opción",
  size = "small",
  value,
  name = "dropdown",
  error = false,
  errorMessage = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedValue) => {
    const fakeEvent = {
      target: {
        name,
        value: selectedValue,
      },
    };
    onChange(fakeEvent);
    setIsOpen(false);
  };

  const selectedLabel =
    options.find((opt) => (opt.value || opt) === value)?.label || value;

  return (
    <div className={`dropdown-container ${size}`}>
      {label && (
        <label
          className={`dropdown-label ${size}`}
          style={error ? { color: "#dc2626" } : {}}
        >
          {label}
        </label>
      )}

      <div
        className={`dropdown-wrapper ${size} ${error ? "error-border" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div
          className="dropdown-display"
          style={{
            color: !value && error ? "#dc2626" : undefined,
          }}
        >
          {value ? selectedLabel : placeholder}
          <span className="dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
        </div>

        {isOpen && (
          <div className="dropdown-list">
            {options.map((option, index) => {
              const optionValue = option.value || option;
              const optionLabel = option.label || option;
              return (
                <div
                  key={index}
                  className="dropdown-option"
                  onClick={() => handleSelect(optionValue)}
                >
                  {optionLabel}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {error && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default Dropdown;
