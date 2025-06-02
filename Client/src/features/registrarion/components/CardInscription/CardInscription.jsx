import "./CardInscription.css";

//components
import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";
import { NextPage } from "../../../../components/Buttons/NextPage";

//react
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const CardInscription = ({
  Icon,
  title,
  description,
  advantages = [],
  btnText,
}) => {
  const navigation = useNavigate();

  const goInscription = () => {
    sessionStorage.setItem(
      "inscripcionManual",
      title == "Inscripción Manual" ? true : false
    );
    navigation("/register/responsible");
  };

  return (
    <div className="card-choose">
      <Icon style={{ fontSize: "70px" }} />
      <h3>{title}</h3>
      <p>{description}</p>
      <ul className="advantages">
        {advantages.map((advantage, index) => (
          <li key={index}>
            <FaCheck style={{ color: "green", marginRight: "5px" }} />{" "}
            {advantage}
          </li>
        ))}
      </ul>
      <PrimaryButton
        value={btnText}
        className="btn-card-inscription"
        onClick={goInscription}
      />
    </div>
  );
};
