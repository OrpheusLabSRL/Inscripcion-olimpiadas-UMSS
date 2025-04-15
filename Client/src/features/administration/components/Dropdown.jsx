import React from "react";

const Dropdown = ({
  label,
  options,
  onChange,
  placeholder,
  size = "small",
}) => {
  return (
    <div className="dropdown-container">
      {label && (
        <label className={size === "small" ? "field-label" : ""}>{label}</label>
      )}
      <select
        onChange={onChange}
        className={`dropdown ${
          size === "large" ? "select-large" : "select-small"
        }`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
