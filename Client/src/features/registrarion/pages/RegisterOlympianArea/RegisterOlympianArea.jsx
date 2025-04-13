//css
import "./RegisterOlympianArea.css";

//components
import { AreaCategoriaElement } from "../../components/AreaCategoriaElement/AreaCategoriaElement";
import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";
import { NextPage } from "../../../../components/Buttons/NextPage";

//react
import { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import swal from "sweetalert";
import { useForm } from "react-hook-form";

//api
import { getCatalogoCompleto } from "../../../../api/inscription.api";

//util
import { filtrarAreasPorCurso, filtrarCategoriasPorCursoYArea } from "./util";

export const RegisterOlympianArea = () => {
  const [catalogo, setCatalogo] = useState([]);
  const [areaInteres, setAreaInteres] = useState([]);
  const [categoriasInteres, setCategoriasInteres] = useState(null);
  const [areaElements, setAreaElements] = useState([0]); // Estado para controlar cuántos elementos hay
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({});

  useEffect(() => {
    const allCatalogo = async () => {
      try {
        const catalogo = await getCatalogoCompleto();
        setCatalogo(catalogo.data);
      } catch (error) {
        console.log("Ocurrio un error");
      }
    };
    allCatalogo();
  }, []);

  useEffect(() => {
    const areasFiltradas = filtrarAreasPorCurso("2° Secundaria", catalogo);
    setAreaInteres(areasFiltradas);
  }, [catalogo]);

  const onChooseArea = (index) => (e) => {
    if (e.target.value !== "") {
      const categoriasFiltradas = filtrarCategoriasPorCursoYArea(
        "2° Secundaria",
        e.target.value,
        catalogo
      );

      // Si quieres manejar múltiples selecciones de categorías, necesitarás
      // un estado más complejo, como un objeto con índices
      setCategoriasInteres(categoriasFiltradas);
    } else {
      setCategoriasInteres(null);
    }
  };

  // Función para agregar un nuevo elemento AreaCategoriaElement
  const addArea = () => {
    // Añade un nuevo índice al array de elementos
    setAreaElements([...areaElements, areaElements.length]);
  };

  const onSubmit = async (dataAreas) => {
    try {
      // dataAreas.id_olimpista = data.id_olimpista;
      dataAreas.estado = false;

      if (dataAreas.AreaOpcional == "" || dataAreas.CategoriaOpcional == "") {
        delete dataAreas.AreaOpcional;
        delete dataAreas.CategoriaOpcional;
      }

      if (dataAreas.Area == dataAreas.AreaOpcional && dataAreas.Area !== "4") {
        swal(
          "No se puede seleccionar la misma área",
          "No es posible registrarse en la misma area, a menos que se trate de el área de INFORMÁTICA ",
          "warning"
        );
        return;
      }

      if (
        dataAreas.Area == 4 &&
        dataAreas.AreaOpcional == 4 &&
        dataAreas.Categoria == dataAreas.CategoriaOpcional
      ) {
        swal(
          "No se puede seleccionar la misma categoría",
          "Seleccione otra categoría",
          "warning"
        );
        return;
      }

      // if (areasOlimpista.length == 2) {
      //   swal(
      //     "No se puede registrar mas de 2 áreas",
      //     "Ya se registro en 2 áreas",
      //     "warning"
      //   );
      //   return;
      // }

      // await setNewInscription(dataAreas);
      // const updatedAreas = await getAreasOlimpista(data.id_olimpista);
      // setAreasOlimpista(updatedAreas.data.data.areas);

      swal("Inscripción registrada correctamente", "", "success");
    } catch (error) {
      console.log(error);
      swal("Error al registrar los datos");
    }
  };

  return (
    <form
      className="container-area-form-register"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="input-2c">
        <h1>Datos de competición</h1>
      </div>
      {areaElements.map((index) => (
        <AreaCategoriaElement
          key={index}
          areas={areaInteres}
          categorias={categoriasInteres}
          onChooseArea={onChooseArea(index)}
          register={register}
          errors={errors}
        />
      ))}
      <div className="input-2c add-new-area-olympian">
        <IoIosAddCircleOutline style={{ fontSize: "30px" }} />
        <p onClick={addArea}>Agregar una nueva Area de Competencia</p>
      </div>

      <div className="container-btn-back-olympian input-1c">
        <NextPage to={"/"} value="Cancelar" />
      </div>

      <div className="container-btn-next-olympian input-1c">
        <PrimaryButton type="submit" value="Siguiente" />
      </div>
    </form>
  );
};
