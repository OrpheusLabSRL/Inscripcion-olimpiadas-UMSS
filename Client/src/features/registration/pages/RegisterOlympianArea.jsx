//css
import "../Styles/RegisterOlympianArea.css";

//components
import { AreaCategoriaElement } from "../components/AreaCategoriaElement/AreaCategoriaElement";
import { PrimaryButton } from "../../../components/Buttons/PrimaryButton";
import { NextPage } from "../../../components/Buttons/NextPage";
import ProgressBar from "../components/ProgressBar/ProgressBar";

//react
import { useMemo } from "react";
import { MdCleaningServices } from "react-icons/md";

//Hooks
import { useRegisterOlympianArea } from "../hooks/useRegisterOlympianArea";
import { useSessionStorageOlympianArea } from "../hooks/useSessionStorageOlympianArea";
import { useCatalog } from "../hooks/useCatalog";

export const RegisterOlympianArea = () => {
  const {
    currentStep,
    totalSteps,
    location,
    register,
    handleSubmit,
    errors,
    setValue,
    watchedFields,
    cleanFlieds,
    cancelInscription,
    onSubmit,
  } = useRegisterOlympianArea();

  const {
    onChooseArea,
    areaInteres,
    categoriasInteres,
    categoriasInteresSecundaria,
    setCategoriasInteres,
    setCategoriasInteresSecundaria,
  } = useCatalog(watchedFields);

  useSessionStorageOlympianArea(watchedFields, location);

  const titleOlimpian = useMemo(() => {
    const dataOlimpian = JSON.parse(sessionStorage.getItem("OlympicData"));
    return `${dataOlimpian.nombreOlimpiada} versión ${dataOlimpian.version}`;
  }, []);
  
  return (
    <div className="container-form">
      <h1 className="title-register">{titleOlimpian}</h1>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <form className="container-form-inputs" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-2c">
          <h2>Datos de competición</h2>
          <h5 className="message-recomendation">
            Un olimpista puede participar en hasta dos áreas. Si desea
            participar solo en una, deje sin seleccionar el campo de 'área de
            interés secundaria'.
          </h5>
        </div>

        <div className="container-clean-fields input-2c">
          <p>Limpiar campos</p>
          <MdCleaningServices
            className="icon-clean-fields"
            onClick={() =>
              cleanFlieds(setCategoriasInteres, setCategoriasInteresSecundaria)
            }
          />
        </div>

        <AreaCategoriaElement
          labelArea={"Área de interés principal"}
          placeholderArea={"Seleccione un área"}
          labelCategoria={"Categoria de interés principal"}
          placeholderCategoria={"Seleccione una categoria"}
          nameArea={"AreaPrincipal"}
          nameCategoria={"CategoriaPrincipal"}
          areas={areaInteres}
          mandatory={true}
          categorias={categoriasInteres}
          onChooseArea={(e) => onChooseArea(e, setValue)}
          setValue={setValue}
          watchedArea={watchedFields.areaPrincipal}
          watchedCategoria={watchedFields.categoriaPrincipal}
          register={register}
          errors={errors}
        />
        <AreaCategoriaElement
          labelArea={"Área de interés secundaria"}
          placeholderArea={"Seleccione un secundaria"}
          labelCategoria={"Categoria de interés secundaria"}
          placeholderCategoria={"Seleccione una categoria"}
          nameArea={"AreaSecundaria"}
          nameCategoria={"CategoriaSecundaria"}
          areas={areaInteres}
          categorias={categoriasInteresSecundaria}
          mandatory={
            categoriasInteresSecundaria &&
            categoriasInteresSecundaria.length !== 0
              ? true
              : false
          }
          asterisk={false}
          onChooseArea={(e) => onChooseArea(e, setValue)}
          setValue={setValue}
          watchedArea={watchedFields.areaSecundaria}
          watchedCategoria={watchedFields.categoriaSecundaria}
          register={register}
          errors={errors}
        />

        <div className="container-btn-next-back input-2c">
          <NextPage
            type="button"
            value="Anterior"
            to={"/register/olympian"}
            className="btn-back-register"
          />
          <NextPage
            value="Cancelar"
            onClick={cancelInscription}
            className="btn-cancel-register"
          />
          <PrimaryButton type="submit" value="Siguiente" />
        </div>
      </form>
    </div>
  );
};
