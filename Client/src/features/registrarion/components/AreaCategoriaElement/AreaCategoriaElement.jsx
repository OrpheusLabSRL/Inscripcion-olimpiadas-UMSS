//css
import "./AreaCategoriaElement.css";

//Components
import { Select } from "../../../../components/inputs/Select";

export const AreaCategoriaElement = ({
  areas,
  categorias,
  onChooseArea,
  register,
  errors,
}) => {
  return (
    <>
      <div className="input-1c">
        <Select
          label={"Área de interés principal"}
          placeholder="Seleccione un area"
          mandatory="true"
          name="Area"
          onChange={onChooseArea}
          options={areas}
          register={register}
          errors={errors}
        />
      </div>

      <div className="input-1c">
        <Select
          label="Categoría de interés principal"
          placeholder={categorias ? "Seleccione una categoría" : ""}
          mandatory="true"
          name="Categoria"
          options={categorias}
          register={register}
          errors={errors}
        />
      </div>

      <div className="input-2c option-add-tutor">
        <p>Elegir un tutor para el area principal(Opcional)</p>
      </div>
    </>
  );
};
