import "./input.css";

/* eslint-disable react/prop-types */
export const Select = ({
  label = "",
  name = "",
  className = "",
  value,
  onChange,
  id,
  placeholder = "",
  register,
  options = [],
  errors = null,
  mandatory = false,
}) => {
  return (
    <div className="config-input">
      {label && (
        <label htmlFor={id}>
          {label} {mandatory ? <span className="mandatory">*</span> : ""}{" "}
        </label>
      )}

      <select
        className={className}
        id={id}
        name={name}
        defaultValue={placeholder}
        {...(register &&
          register(name, {
            required: `${label} es requerido`,
          }))}
        value={value}
        onChange={onChange}
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
