//css
import "./ListRegistered.css";

//Components
import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";
import { ListElement } from "../../components/ListElement/ListElement";

const estudiantes = [
  {
    id: 1,
    nombre: "John Henry",
    apellidos: "Chavarria Zurita",
    ci: "13067997",
    fechaNacimiento: "08/10/2003",
    colegio: "Nestor Adriazola Menendez",
    curso: "4to Secundaria",
    departamento: "Cochabamba",
    provincia: "Quillacollo",
  },
  {
    id: 2,
    nombre: "María Fernanda",
    apellidos: "Guzmán Rojas",
    ci: "12456789",
    fechaNacimiento: "14/02/2005",
    colegio: "San Antonio de Padua",
    curso: "5to Secundaria",
    departamento: "La Paz",
    provincia: "Murillo",
  },
  {
    id: 3,
    nombre: "Luis Alberto",
    apellidos: "Torrico Mamani",
    ci: "9854321",
    fechaNacimiento: "22/07/2004",
    colegio: "Don Bosco",
    curso: "6to Secundaria",
    departamento: "Oruro",
    provincia: "Cercado",
  },
  {
    id: 4,
    nombre: "Ana Lucía",
    apellidos: "Rivas Calle",
    ci: "14000123",
    fechaNacimiento: "30/03/2006",
    colegio: "Santa María Mazzarello",
    curso: "4to Secundaria",
    departamento: "Santa Cruz",
    provincia: "Andrés Ibáñez",
  },
  {
    id: 5,
    nombre: "Carlos Eduardo",
    apellidos: "Molina Vargas",
    ci: "11234567",
    fechaNacimiento: "19/11/2005",
    colegio: "Cristo Rey",
    curso: "5to Secundaria",
    departamento: "Tarija",
    provincia: "Avilés",
  },
];

export const ListRegistered = () => {
  return (
    <div className="container-list-registered">
      <div className="list-header">
        <h1>Estudiantes Registrados</h1>
        <PrimaryButton value="Agregar Estudiante" />
      </div>
      <div className="container-list">
        {estudiantes.map((estudiante) => (
          <ListElement data={estudiante} key={estudiante.id} />
        ))}
      </div>
    </div>
  );
};
