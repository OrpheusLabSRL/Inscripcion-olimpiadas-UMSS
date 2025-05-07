import "./primaryButton.css";

export const PrimaryButton = ({
  value = "",
  className = "",
  onClick = null,
  label = "",
  id = "",
  type,
  icon,
  style,
  disabled = false,
}) => {
  return (
    <div className="config-btn-primary">
      {label && <label htmlFor={id}>{label}</label>}
      <button
        className={`btn-primary ${className}`}
        onClick={onClick && onClick}
        type={type}
        style={style}
        disabled={disabled}
      >
        {value}
      </button>
    </div>
  );
};
