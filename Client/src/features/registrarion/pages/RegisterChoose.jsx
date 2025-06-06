//css
import "../Styles/RegisterResponsible.css";

import "../Styles/RegisterChoose.css";

//react
import { LuFilePen } from "react-icons/lu";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { useEffect } from "react";

//components
import { CardInscription } from "../components/CardInscription/CardInscription";

export const RegisterChoose = () => {
  useEffect(() => {
    sessionStorage.setItem("pantallaActualRegistro", location.pathname);
  }, []);

  const titleOlimpian = () => {
    const dataOlimpian = JSON.parse(sessionStorage.getItem("OlympicData"));
    console.log(dataOlimpian);
    return dataOlimpian.nombreOlimpiada + " versión " + dataOlimpian.version;
  };

  return (
    <div className="container-form">
      <h1 className="title-register">{titleOlimpian()}</h1>
      <div className="title-information">
        <h2>Tipo de Inscripción</h2>
        <p>Seleccione el método de inscripcion de desea utilizar</p>
      </div>

      <div className="container-cards-choose">
        <CardInscription
          Icon={LuFilePen}
          title={"Inscripción Manual"}
          description={
            "Inscribe uno o más postulantes mediante un formulario detallado. Ideal para inscripciones individuales o pequeños grupos."
          }
          advantages={[
            "Proceso paso a paso",
            "Validación en tiempo real",
            "Confirmación inmediata",
          ]}
          btnText={"Inscripción Manual"}
        />
        <CardInscription
          Icon={PiMicrosoftExcelLogoFill}
          title={"Inscripción por Excel"}
          description={
            "Inscribe múltiples postulantes mediante una planilla de Excel. Recomendado para inscripciones grupales o institucionales."
          }
          advantages={[
            "Inscripción masiva",
            "Plantilla predefinida",
            "Validación automática",
          ]}
          btnText={"Inscripción por Excel"}
        />
      </div>
    </div>
  );
};
