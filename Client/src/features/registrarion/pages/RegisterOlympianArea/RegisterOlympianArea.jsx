//css
import "./RegisterOlympianArea.css";

//components
import { AreaCategoriaElement } from "../../components/AreaCategoriaElement/AreaCategoriaElement";
import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";
import { NextPage } from "../../../../components/Buttons/NextPage";

//react
import { useEffect, useState } from "react";
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
  const [categoriasInteresSecundaria, setCategoriasInteresSecundaria] =
    useState(
      JSON.parse(localStorage.getItem("CategoriasFiltradasSecundaria")) || null
    );
  const navigation = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      AreaPrincipal: localStorage.getItem("AreaPrincipal") || "",
      CategoriaPrincipal: localStorage.getItem("CategoriaPrincipal") || "",
      AreaSecundaria: localStorage.getItem("AreaSecundaria") || "",
      CategoriaSecundaria: localStorage.getItem("CategoriaSecundaria") || "",
    },
    mode: "onChange",
  });

  const watchedAreaPrincipal = watch("AreaPrincipal");
  const watchedCategoriaPrincipal = watch("CategoriaPrincipal");
  const watchedAreaSecundaria = watch("AreaSecundaria");
  const watchedCategoriaSecundaria = watch("CategoriaSecundaria");

  useEffect(() => {
    localStorage.setItem("AreaPrincipal", watchedAreaPrincipal);
  }, [watchedAreaPrincipal]);

  useEffect(() => {
    localStorage.setItem("CategoriaPrincipal", watchedCategoriaPrincipal);
  }, [watchedCategoriaPrincipal]);
  useEffect(() => {
    localStorage.setItem("AreaSecundaria", watchedAreaSecundaria);
  }, [watchedAreaSecundaria]);

  useEffect(() => {
    localStorage.setItem("CategoriaSecundaria", watchedCategoriaSecundaria);
  }, [watchedCategoriaSecundaria]);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("AreaPrincipal");
      localStorage.removeItem("CategoriaPrincipal");
      localStorage.removeItem("AreaSecundaria");
      localStorage.removeItem("CategoriaSecundaria");
      localStorage.removeItem("CategoriasFiltradas");
      localStorage.removeItem("CategoriasFiltradasSecundaria");
      localStorage.removeItem("TutorArea1");
      localStorage.removeItem("TutorArea2");
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

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
    const areasFiltradas = filtrarAreasPorCurso(
      localStorage.getItem("CursoOlympian"),
      catalogo
    );
    setAreaInteres(areasFiltradas);
  }, [catalogo]);

  const onChooseArea = () => (e) => {
    if (e.target.value !== "") {
      const categoriasFiltradas = filtrarCategoriasPorCursoYArea(
        localStorage.getItem("CursoOlympian"),
        e.target.value,
        catalogo
      );

      if (e.target.name == "AreaPrincipal") {
        localStorage.setItem(
          "CategoriasFiltradas",
          JSON.stringify(categoriasFiltradas)
        );
        setCategoriasInteres(categoriasFiltradas);
      } else {
        localStorage.setItem(
          "CategoriasFiltradasSecundaria",
          JSON.stringify(categoriasFiltradas)
        );
        setCategoriasInteresSecundaria(categoriasFiltradas);
      }

      setValue(e.target.name, e.target.value);
    } else {
      setCategoriasInteres(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      data.estado = false;

      if (data.AreaSecundaria == "" || data.CategoriaSecundaria == "") {
        delete data.AreaSecundaria;
        delete data.CategoriaSecundaria;
      }

      if (
        data.AreaPrincipal == data.AreaSecundaria &&
        data.AreaPrincipal !== "4"
      ) {
        swal(
          "No se puede seleccionar la misma área",
          "No es posible registrarse en la misma area, a menos que se trate de el área de INFORMÁTICA ",
          "warning"
        );
        return;
      }

      if (
        data.AreaPrincipal == 4 &&
        data.AreaSecundaria == 4 &&
        data.CategoriaPrincipal == data.CategoriaSecundaria
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
          onChooseArea={onChooseArea()}
          setValue={setValue}
          watchedArea={watchedAreaPrincipal}
          watchedCategoria={watchedCategoriaPrincipal}
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
          mandatory={categoriasInteresSecundaria ? true : false}
          asterisk={false}
          onChooseArea={onChooseArea()}
          setValue={setValue}
          watchedArea={watchedAreaSecundaria}
          watchedCategoria={watchedCategoriaSecundaria}
          register={register}
          errors={errors}
        />

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
