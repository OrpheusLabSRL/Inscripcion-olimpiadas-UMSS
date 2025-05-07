import "./input.css";
import { PrimaryButton } from "../Buttons/PrimaryButton";

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
  autofill = null,
  isReadOnly = {},
}) => {
  return (
    <div className="config-input">
      {label && (
        <label htmlFor={id}>
          {label} {mandatory ? <span className="mandatory">*</span> : ""}{" "}
          {autofill && (
            <button type="button" onClick={autofill} className="btn-autofill">
              Autocompletar
            </button>
          )}
        </label>
      )}
      <input
        type={type}
        className={className}
        id={id}
        name={name}
        placeholder={placeholder}
        {...(register ? register(name, validationRules) : {})}
        readOnly={isReadOnly[name] ? true : false}
        autoComplete="off"
      />
      {errors && errors[name] && (
        <span className="error-validation">{errors[name].message}</span>
      )}
    </div>
  );
};
