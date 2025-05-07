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
}) => {
  return (
    <div className="config-btn-primary">
      {label && <label htmlFor={id}>{label}</label>}
      <button
        className={`btn-primary ${className}`}
        onClick={onClick && onClick}
        type={type}
        style={style}
      >
        {value}
      </button>
    </div>
  );
};
