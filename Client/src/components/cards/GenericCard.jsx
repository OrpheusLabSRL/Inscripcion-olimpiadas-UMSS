import { PrimaryButton } from "../Buttons/PrimaryButton";

//css
import "./genericCard.css";

//react
import { Link } from "react-router-dom";

export const GenericCard = ({
  image = null,
  description = "",
  value = "",
  title = "",
  className = "",
  to = "",
}) => {
  return (
    <div className="container-main-card">
      {title ? <h1>{title}</h1> : ""}

      <div className={`container-card ${className}`}>
        <div className="image-card">
          <img src={image} alt="Image card" />
        </div>

        <p>{description}</p>

        <Link to={to} className="link-card">
          <PrimaryButton value={value} />
        </Link>
      </div>
    </div>
  );
};
