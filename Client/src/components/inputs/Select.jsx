import "./input.css";

/* eslint-disable react/prop-types */
export const Select = ({
  label = "",
  name = "",
  className = "",
  value,
  onChange,
  asterisk = true,
  id,
  placeholder = "",
  register,
  options = [],
  errors = null,
  mandatory = false,
  isReadOnly = {},
}) => {
  return (
    <div className="config-input">
      {label && (
        <label htmlFor={id}>
          {label}{" "}
          {mandatory && asterisk ? <span className="mandatory">*</span> : ""}{" "}
        </label>
      )}

      <select
        className={className}
        id={id}
        name={name}
        defaultValue={placeholder}
        {...(register &&
          (mandatory
            ? register(name, { required: `${label} es requerido` })
            : register(name, { required: false })))}
        value={value}
        onChange={onChange}
        disabled={isReadOnly?.Nombre ? true : false}
      >
        {placeholder && <option value={""}>{placeholder}</option>}

        {options &&
          options.map((optionElement, index) => {
            return (
              <option key={index} value={optionElement.value}>
                {optionElement.label}
              </option>
            );
          })}
      </select>

      {errors && errors[name] && (
        <span className="error-validation">{errors[name].message}</span>
      )}
    </div>
  );
};
