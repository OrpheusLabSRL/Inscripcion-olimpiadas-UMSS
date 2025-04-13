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
import { IoArrowBackCircle } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";

//api
import { getCatalogoCompleto } from "../../../../api/inscription.api";

//util
import { filtrarAreasPorCurso, filtrarCategoriasPorCursoYArea } from "./util";

export const RegisterOlympianArea = () => {
  const [catalogo, setCatalogo] = useState([]);
  const [areaInteres, setAreaInteres] = useState([]);
  const [categoriasInteres, setCategoriasInteres] = useState(
    JSON.parse(localStorage.getItem("CategoriasFiltradas")) || null
  );
  const [areaElements, setAreaElements] = useState([0]);
  const navigation = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      Area: localStorage.getItem("Area") || "",
      Categoria: localStorage.getItem("Categoria") || "",
    },
    mode: "onChange",
  });

  const watchedArea = watch("Area");
  const watchedCategoria = watch("Categoria");

  useEffect(() => {
    localStorage.setItem("Area", watchedArea);
  }, [watchedArea]);

  useEffect(() => {
    localStorage.setItem("Categoria", watchedCategoria);
  }, [watchedCategoria]);

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
      localStorage.setItem(
        "CategoriasFiltradas",
        JSON.stringify(categoriasFiltradas)
      );
      setCategoriasInteres(categoriasFiltradas);
      setValue("Area", e.target.value);
    } else {
      setCategoriasInteres(null);
    }
  };

  const addArea = () => {
    setAreaElements([...areaElements, areaElements.length]);
  };

  const onSubmit = async (data) => {
    try {
      data.estado = false;

      if (data.AreaOpcional == "" || data.CategoriaOpcional == "") {
        delete data.AreaOpcional;
        delete data.CategoriaOpcional;
      }

      if (data.Area == data.AreaOpcional && data.Area !== "4") {
        swal(
          "No se puede seleccionar la misma área",
          "No es posible registrarse en la misma area, a menos que se trate de el área de INFORMÁTICA ",
          "warning"
        );
        return;
      }

      if (
        data.Area == 4 &&
        data.AreaOpcional == 4 &&
        data.Categoria == data.CategoriaOpcional
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

      navigation("/register/tutor-legal", data);
    } catch (error) {
      console.log(error);
      swal("Error al registrar los datos");
    }
  };

  return (
    <>
      <NavLink to={"/register/olympian"}>
        <IoArrowBackCircle className="btn-back" />
      </NavLink>
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
            setValue={setValue}
            watchedArea={watchedArea}
            watchedCategoria={watchedCategoria}
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
    </>
  );
};
