import "./primaryButton.css";

export const Tag = ({
  value = "",
  className = "",
  onClick = "",
  id = "",
  Icon,
}) => {
  return (
    <div className="config-btn-primary">
      <button className={`btn-tag ${className}`} onClick={onClick}>
        {Icon && <Icon />} {value}
      </button>
    </div>
  );
};
