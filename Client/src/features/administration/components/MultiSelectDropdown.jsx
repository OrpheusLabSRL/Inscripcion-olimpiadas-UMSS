import React, { useState, useRef, useEffect } from "react";
import "../Styles/MultiSelectDropdown.css";

const MultiSelectDropdown = ({
  label,
  name,
  options = [],
  selectedValues = [],
  onChange,
  placeholder = "Seleccione una opción",
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
    <div className="multi-dropdown-container" ref={dropdownRef}>
      {label && <label className="multi-dropdown-label">{label}</label>}

      <div className="multi-dropdown-header" onClick={() => setIsOpen(!isOpen)}>
        {selectedLabels || placeholder}
        <span className="dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <div className="multi-dropdown-options">
          {options.map((option) => (
            <label key={option.value} className="multi-dropdown-item">
              <span className="custom-circle">
                <input
                  type="checkbox"
                  name={name}
                  value={option.value}
                  checked={selectedValues.includes(option.value)}
                  onChange={() => toggleOption(option.value)}
                />
              </span>
              <span className="multi-label">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
