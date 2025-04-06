// css
import "./ListElement.css";

//components
import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";

//React
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

export const ListElement = ({ data }) => {
  return (
    <div className="container-element-list">
      <div className="list-data-header" key={data.id}>
        <div>
          <p>#</p>
          <p>{data.id}</p>
        </div>
        <div>
          <p>Nombre</p>
          <p>{data.nombre}</p>
        </div>
        <div>
          <p>Apellidos</p>
          <p>{data.apellidos}</p>
        </div>
        <div>
          <p>CI</p>
          <p>{data.ci}</p>
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
          <MdEdit style={{fontSize: "25px", color: "orange", marginRight: "10px"}}/>
          <MdDelete style={{fontSize: "25px", color: "red"}}/>
        </div>
      </div>

      <div className="list-aditional-data-student">
        <div className="containter-registered-area">
          <h5>Areas registradas</h5>
          <div className="registered-area">
            <span className="label-area">Matematicas</span>
            <span className="label-area">Lenguaje</span>
          </div>
          <div className="btn-add-area">
            <PrimaryButton value="Registrar Area" />
          </div>
        </div>

        <div className="containter-registered-area">
          <h5>Tutores registrados</h5>
          <div className="registered-area">
            <span className="label-area">Juan Pablo Perez Lopez</span>
            <span className="label-area">Maria Angel Serrano de la monte</span>
          </div>
          <div className="btn-add-area">
            <PrimaryButton value="Registrar Tutor" />
          </div>
        </div>
      </div>
    </div>
  );
};
