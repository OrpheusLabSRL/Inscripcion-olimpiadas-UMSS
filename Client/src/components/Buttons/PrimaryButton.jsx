import "./primaryButton.css";

export const PrimaryButton = ({
  value = "",
  className = "",
  onClick = null,
  label = "",
  id = "",
  type,
}) => {
  return (
    <div className="config-btn-primary">
      {label && <label htmlFor={id}>{label}</label>}
      <button
        className={`btn-primary ${className}`}
        onClick={onClick && onClick}
        type={type}
      >
        {value}
      </button>
    </div>
  );
};
