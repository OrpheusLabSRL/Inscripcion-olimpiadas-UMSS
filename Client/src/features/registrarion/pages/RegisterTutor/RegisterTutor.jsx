//css
import "./RegisterTutor.css";

//components
import { Input } from "../../../../components/inputs/Input";
import { Select } from "../../../../components/inputs/Select";
import { NextPage } from "../../../../components/Buttons/NextPage";
import ProgressBar from "../../components/ProgressBar/ProgressBar";

//react
import { useState, useEffect } from "react";

export const RegisterTutor = () => {
  const [currentStep, setCurrentStep] = useState(2);
  const totalSteps = 4;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container-form">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <form className="container-form-inputs">
        <div className="input-2c">
          <h1>Datos de contacto y tutores</h1>
        </div>

        <div className="input-2c">
          <h2>Información de contacto</h2>
        </div>

        <div className="input-1c">
          <Input
            label={"Correo electrónico de contacto"}
            placeholder="ejemplo@correo.com"
            mandatory="true"
          />
        </div>

        <div className="input-1c">
          <Select
            label={"¿A quién pertenece el correo?"}
            placeholder="Seleccione una opción"
            mandatory="true"
          />
        </div>

        <div className="input-1c">
          <Input
            label={"Número de celular de contacto"}
            placeholder="Ingrese número de celular"
            mandatory="true"
          />
        </div>

        <div className="input-1c">
          <Select
            label={"¿A quién pertenece el número?"}
            placeholder="Seleccione una opción"
            mandatory="true"
          />
        </div>

        <div className="input-2c">
          <h2>Datos del tutor</h2>
        </div>

        <div className="input-1c">
          <Input
            label={"Nombres"}
            placeholder="Ingrese nombres"
            mandatory="true"
          />
        </div>

        <div className="input-1c">
          <Input
            label={"Apellidos"}
            placeholder="Ingrese apellidos"
            mandatory="true"
          />
        </div>

        <div className="input-1c">
          <Select
            label={"Tipo de tutor"}
            placeholder="Seleccione tipo"
            mandatory="true"
          />
        </div>

        <div className="input-1c">
          <Input
            label={"Número de celular"}
            placeholder="Ingrese número de celular"
            mandatory="true"
          />
        </div>

        <div className="input-1c">
          <Input
            label={"Correo Electronico"}
            placeholder="ejemplo@correo.com"
            mandatory="true"
          />
        </div>

        <div className="input-1c">
          <Input
            label={"Carnet de identidad"}
            placeholder="Ingrese CI"
            mandatory="true"
          />
        </div>

        <div>
          <NextPage value="Atrás" to="/" />
        </div>

        <div className="container-btn-next">
          <NextPage value="Siguiente" to="/register/tutor" />
        </div>
      </form>
    </div>
  );
};
