//css
import "./AreaCategoriaElement.css";

//Components
import { Select } from "../../../../components/inputs/Select";

//react
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const AreaCategoriaElement = ({
  labelArea,
  labelCategoria,
  placeholderArea,
  placeholderCategoria,
  nameArea,
  nameCategoria,
  areas,
  mandatory,
  asterisk,
  categorias,
  onChooseArea,
  setValue,
  watchedArea,
  watchedCategoria,
  register,
  errors,
}) => {
  const navigation = useNavigate();
  const [tutorArea, setTutorArea] = useState(
    nameArea == "AreaPrincipal"
      ? localStorage.getItem("TutorArea1")
      : localStorage.getItem("TutorArea2")
  );

  const addTutor = () => {
    navigation("tutorOptional", { state: { area: nameArea } });
  };

  return (
    <>
      <div className="input-1c">
        <Select
          label={labelArea}
          placeholder={placeholderArea}
          mandatory={mandatory}
          name={nameArea}
          value={watchedArea}
          asterisk={asterisk}
          onChange={onChooseArea}
          options={areas}
          register={register}
          errors={errors}
        />
      </div>
      <div className="input-1c">
        <Select
          label={labelCategoria}
          placeholder={categorias ? placeholderCategoria : ""}
          mandatory={mandatory}
          name={nameCategoria}
          value={watchedCategoria}
          asterisk={asterisk}
          onChange={(e) => setValue(nameCategoria, e.target.value)}
          options={categorias}
          register={register}
          errors={errors}
        />
      </div>
      {tutorArea && (
        <div className="nombre-tutor">
          <span>Tutor: </span>
          {nameArea === "AreaPrincipal"
            ? `${localStorage.getItem("NombrePrincipal") || ""} ${
                localStorage.getItem("ApellidoPrincipal") || ""
              }`
            : `${localStorage.getItem("NombreSecundaria") || ""} ${
                localStorage.getItem("ApellidoSecundaria") || ""
              }`}
        </div>
      )}
      {watchedArea && watchedCategoria && (
        <div className="input-2c option-add-tutor">
          <p onClick={addTutor}>Elegir un tutor para el area (Opcional)</p>
        </div>
      )}
    </>
  );
};
