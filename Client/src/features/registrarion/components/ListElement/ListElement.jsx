// css
import "./ListElement.css";

//React
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { useEffect } from "react";

//api
import {
  getAreasOlimpista,
  getTutoresOlimpista,
} from "../../../../api/inscription.api";

export const ListElement = ({ data }) => {
  const [areasOlimpista, setAreasOlimpista] = useState([]);
  const [tutoresOlimpista, setTutoresOlimpista] = useState([]);

  useEffect(() => {
    const areasOlimpistas = async () => {
      const res = await getAreasOlimpista(data.id_olimpista);
      setAreasOlimpista(res.data.data.areas);
    };

    const tutoresOlimpistas = async () => {
      const res = await getTutoresOlimpista(data.id_olimpista);
      setTutoresOlimpista(res.data.data);
    };

    areasOlimpistas();
    tutoresOlimpistas();
  }, []);

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
        </div>
      </div>
    </div>
  );
};
