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
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import swal from "sweetalert";

//utils
import { filtrarAreasPorCurso, filtrarCategoriasPorCursoYArea } from "./util";

//api
import {
  setNewInscription,
  getAreasOlimpista,
} from "../../../../api/inscription.api";

export const ListElement = ({ data, catalogo }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [areaInteres, setAreaInteres] = useState([]);
  const [categoriasInteres, setCategoriasInteres] = useState(null);
  const [areasOlimpista, setAreasOlimpista] = useState([]);
  // const [areasTemporales, setAreasTemporales] = useState([]);
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
      console.log(res);
      setAreasOlimpista(res.data.data.areas);
      // setAreasTemporales(res.data.data.areas.nombreArea);
    };
    areasOlimpistas();
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

      console.log(dataAreas);
      const res = await setNewInscription(dataAreas);
      setModalIsOpen(false);
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
            <PrimaryButton value="Registrar Area" onClick={openModal} />
          </div>
        </div>

        <div className="containter-registered-area">
          <h5>Tutores registrados</h5>
          <div className="registered-area">
            <span className="label-area">Juan Pablo Perez Lopez</span>
            <span className="label-area">Maria Angel Serrano de la monte</span>
          </div>
          <div className="btn-add-area">
            <NextPage value="Registrar Tutor" to="/listRegistered/tutor" />
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
              label={"Área de interés"}
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
              label="Categoría de interés"
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
              label={"Segunda Área de interés"}
              placeholder="Seleccione un area"
              onChange={onChooseAreaOptional}
              options={areaInteres}
              name="AreaOpcional"
              register={register}
            />
          </div>

          <div className="input-1c">
            <Select
              label={"Categoría de interés"}
              placeholder={
                categoriasInteresOpcional ? "Seleccione una categoría" : ""
              }
              options={categoriasInteresOpcional}
              name="CategoriaOpcional"
              register={register}
              errors={errors}
            />
          </div>
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
