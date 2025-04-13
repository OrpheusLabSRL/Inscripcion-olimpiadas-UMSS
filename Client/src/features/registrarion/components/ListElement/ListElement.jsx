// css
import "./ListElement.css";

//components
import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";
import { NextPage } from "../../../../components/Buttons/NextPage";
import { GenericModal } from "../../../../components/modals/GenericModal";
import { Select } from "../../../../components/inputs/Select";

//React
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { useEffect } from "react";
import swal from "sweetalert";

//utils
import { filtrarAreasPorCurso, filtrarCategoriasPorCursoYArea } from "./util";

//api
import {
  setNewInscription,
  getAreasOlimpista,
  getTutoresOlimpista,
} from "../../../../api/inscription.api";

export const ListElement = ({ data, catalogo }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [areaInteres, setAreaInteres] = useState([]);
  const [categoriasInteres, setCategoriasInteres] = useState(null);
  const [areasOlimpista, setAreasOlimpista] = useState([]);
  const [tutoresOlimpista, setTutoresOlimpista] = useState([]);
  const [categoriasInteresOpcional, setCategoriasInteresOpcional] =
    useState(null);


  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({});

  useEffect(() => {
    const areasFiltradas = filtrarAreasPorCurso(data.curso, catalogo);
    setAreaInteres(areasFiltradas);
  }, [data]);

  useEffect(() => {
    const areasOlimpistas = async () => {
      const res = await getAreasOlimpista(data.id_olimpista);
      console.log(res.data.data.areas);
      setAreasOlimpista(res.data.data.areas);
    };

    const tutoresOlimpistas = async () => {
      const res = await getTutoresOlimpista(data.id_olimpista);
      setTutoresOlimpista(res.data.data);
    };

    areasOlimpistas();
    tutoresOlimpistas();
  }, []);

  const openModal = (e) => {
    e.preventDefault();
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const onChooseArea = (e) => {
    if (e.target.value !== "") {
      const categoriasFiltradas = filtrarCategoriasPorCursoYArea(
        data.curso,
        e.target.value,
        catalogo
      );
      setCategoriasInteres(categoriasFiltradas);
      setAreaElegida(e.target.value);
    } else {
      setCategoriasInteres(null);
    }
  };
  const onChooseAreaOptional = (e) => {
    if (e.target.value !== "") {
      const categoriasFiltradas = filtrarCategoriasPorCursoYArea(
        data.curso,
        e.target.value,
        catalogo
      );
      setCategoriasInteresOpcional(categoriasFiltradas);
    } else {
      setCategoriasInteresOpcional(null);
    }
  };

  const onSubmit = async (dataAreas) => {
    try {
      dataAreas.id_olimpista = data.id_olimpista;
      dataAreas.estado = false;

      if (dataAreas.AreaOpcional == "" || dataAreas.CategoriaOpcional == "") {
        delete dataAreas.AreaOpcional;
        delete dataAreas.CategoriaOpcional;
      }

      if (dataAreas.Area == dataAreas.AreaOpcional && dataAreas.Area !== "4") {
        swal("No se puede seleccionar la misma área", "No es posible registrarse en la misma area, a menos que se trate de el área de INFORMÁTICA ", "warning");
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

      if (areasOlimpista.length == 2) {
        swal(
          "No se puede registrar mas de 2 áreas",
          "Ya se registro en 2 áreas",
          "warning"
        );
        return;
      }

      await setNewInscription(dataAreas);
      const updatedAreas = await getAreasOlimpista(data.id_olimpista);
      setAreasOlimpista(updatedAreas.data.data.areas);

      setModalIsOpen(false);
      swal("Inscripción registrada correctamente", "", "success");
    } catch (error) {
      console.log(error);
      swal("Error al registrar los datos");
    }
  };

  return (
    <div className="container-element-list">
      <div className="list-data-header" key={data.id_olimpista}>
        <div>
          <p>#</p>
          <p>{data.id_olimpista}</p>
        </div>
        <div>
          <p>Nombre</p>
          <p>{data.nombre}</p>
        </div>
        <div>
          <p>Apellidos</p>
          <p>{data.apellido}</p>
        </div>
        <div>
          <p>CI</p>
          <p>{data.carnetIdentidad}</p>
        </div>
        <div>
          <p>Fecha nacimiento</p>
          <p>{data.fechaNacimiento}</p>
        </div>
        <div>
          <p>Colegio</p>
          <p>{data.colegio}</p>
        </div>
        <div>
          <p>Curso</p>
          <p>{data.curso}</p>
        </div>
        <div>
          <p>Departamento</p>
          <p>{data.departamento}</p>
        </div>
        <div>
          <p>Provincia</p>
          <p>{data.provincia}</p>
        </div>
        <div>
          <p>Acciones</p>
          <MdEdit
            style={{ fontSize: "25px", color: "orange", marginRight: "10px" }}
          />
          <MdDelete style={{ fontSize: "25px", color: "red" }} />
        </div>
      </div>

      <div className="list-aditional-data-student">
        <div className="containter-registered-area">
          <h5>Areas registradas</h5>
          <div className="registered-area">
            {areasOlimpista.map((area, index) => (
              <span key={index} className="label-area">
                {area.nombreArea}
              </span>
            ))}
          </div>

          <div className="btn-add-area">
            <PrimaryButton value="Registrar Area(s)" onClick={openModal} />
          </div>
        </div>

        <div className="containter-registered-area">
          <h5>Tutores registrados</h5>
          <div className="registered-area">
            {tutoresOlimpista.map((tutor, index) => (
              <span key={index} className="label-area">
                {tutor.nombre} {tutor.apellido}
              </span>
            ))}
          </div>
          <div className="btn-add-area">
            <NextPage
              value="Registrar Tutor"
              to="/listRegistered/tutor"
              state={{ id_olimpista: data.id_olimpista }}
            />
          </div>
        </div>
      </div>
      <GenericModal modalIsOpen={modalIsOpen} closeModal={closeModal}>
        <form
          className="container-form-areas"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="input-2c">
            <h2>Áreas y Categorías de interés</h2>
          </div>

          <div className="input-1c">
            <Select
              label={"Área de interés principal"}
              placeholder="Seleccione un area"
              mandatory="true"
              name="Area"
              onChange={onChooseArea}
              options={areaInteres}
              register={register}
              errors={errors}
            />
          </div>

          <div className="input-1c">
            <Select
              label="Categoría de interés principal"
              placeholder={categoriasInteres ? "Seleccione una categoría" : ""}
              mandatory="true"
              name="Categoria"
              options={categoriasInteres}
              register={register}
              errors={errors}
            />
          </div>

          <div className="input-1c">
            <Select
              label={"Área de interés secundaria"}
              placeholder="Seleccione un area"
              onChange={onChooseAreaOptional}
              options={areaInteres}
              name="AreaOpcional"
              register={register}
              mandatory={false}
              errors={errors}
            />
          </div>

          <Select
            label={"Categoría de interés secundaria"}
            placeholder={
              categoriasInteresOpcional ? "Seleccione una categoría" : ""
            }
            options={categoriasInteresOpcional}
            name="CategoriaOpcional"
            {...(categoriasInteresOpcional && {
              register: register,
              errors: errors,
            })}
          />
          <div className="container-btn-modal-area">
            <PrimaryButton
              value="Cancelar"
              className="btn-modal-area"
              onClick={closeModal}
            />
            <PrimaryButton
              type="submit"
              value="Registrar"
              className="btn-modal-area"
            />
          </div>
        </form>
      </GenericModal>
    </div>
  );
};
