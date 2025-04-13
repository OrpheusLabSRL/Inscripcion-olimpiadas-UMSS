import "./input.css";

export const Input = ({
  label,
  name = "",
  className = "",
  id,
  type = "text",
  placeholder = "",
  register,
  validationRules = {},
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

      <input
        type={type}
        className={className}
        id={id}
        name={name}
        placeholder={placeholder}
        {...(register ? register(name, validationRules) : {})}
        autoComplete="off"
      />
      {errors && errors[name] && (
        <span className="error-validation">{errors[name].message}</span>
      )}
    </div>
  );
};
