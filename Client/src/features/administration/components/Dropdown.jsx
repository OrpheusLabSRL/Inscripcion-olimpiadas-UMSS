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
      {label && <label className={`dropdown-label ${size}`}>{label}</label>}

      <div className={`dropdown-wrapper ${size}`}>
        <div
          className="dropdown-display"
          onClick={() => setIsOpen((prev) => !prev)}
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
    </div>
  );
};

export default Dropdown;
