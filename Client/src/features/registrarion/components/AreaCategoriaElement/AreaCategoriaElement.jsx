//css
import "./AreaCategoriaElement.css";

//Components
import { Select } from "../../../../components/inputs/Select";

import { useNavigate } from "react-router-dom";

export const AreaCategoriaElement = ({
  areas,
  categorias,
  onChooseArea,
  setValue,
  watchedArea,
  watchedCategoria,
  register,
  errors,
}) => {
  const navigation = useNavigate();

  const addTutor = () => {
    navigation("tutorOptional");
  };

  return (
    <>
      <div className="input-1c">
        <Select
          label={"Área de interés principal"}
          placeholder="Seleccione un area"
          mandatory="true"
          name="Area"
          value={watchedArea}
          onChange={onChooseArea}
          options={areas}
          register={register}
          errors={errors}
        />
      </div>

      <div className="input-1c">
        <Select
          label="Categoría de interés principal"
          placeholder={"Seleccione una categoría"}
          mandatory="true"
          name="Categoria"
          value={watchedCategoria}
          onChange={(e) => setValue("Categoria", e.target.value)}
          options={categorias}
          register={register}
          errors={errors}
        />
      </div>

      <div className="input-2c option-add-tutor">
        <p onClick={addTutor}>
          Elegir un tutor para el area principal(Opcional)
        </p>
      </div>
    </>
  );
};
