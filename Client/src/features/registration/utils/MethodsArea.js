const normalizarTexto = (texto) => {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/1°|1º/g, "1ro")
    .replace(/2°|2º/g, "2do")
    .replace(/3°|3º/g, "3ro")
    .replace(/4°|4º/g, "4to")
    .replace(/5°|5º/g, "5to")
    .replace(/6°|6º/g, "6to");
};

export const filtrarAreasPorCurso = (curso, programaCompleto) => {
  const cursoNormalizado = normalizarTexto(curso.replace("_", " "));

  const [grado, nivel] = cursoNormalizado.split(" ");
  const esSecundaria = nivel.includes("secundaria");
  const numeroCurso = parseInt(grado.replace(/[^\d]/g, ""));

  const areasDisponibles = [];

  programaCompleto.forEach((item) => {
    const gradosItem = normalizarTexto(item.grados);
    if (gradosItem.includes(cursoNormalizado)) {
      areasDisponibles.push({ area: item.area, area_id: item.area_id });
    } else if (gradosItem.includes(" a ")) {
      const [inicio, fin] = gradosItem.split(" a ");
      const inicioNumero = parseInt(inicio.replace(/[^\d]/g, ""));
      const finNumero = parseInt(fin.split(" ")[0].replace(/[^\d]/g, ""));
      const finNivel = fin.includes("secundaria") ? "secundaria" : "primaria";

      if (
        esSecundaria &&
        finNivel === "secundaria" &&
        numeroCurso >= inicioNumero &&
        numeroCurso <= finNumero
      ) {
        areasDisponibles.push({ area: item.area, area_id: item.area_id });
      } else if (
        !esSecundaria &&
        finNivel === "primaria" &&
        numeroCurso >= inicioNumero &&
        numeroCurso <= finNumero
      ) {
        areasDisponibles.push({ area: item.area, area_id: item.area_id });
      }
    }
  });

  const unicas = Object.values(
    areasDisponibles.reduce((acc, curr) => {
      acc[curr.area_id] = curr;
      return acc;
    }, {})
  );

  return unicas.map((item) => ({
    value: item.area_id,
    label: item.area,
  }));
};

const normalizarTexto2 = (texto) => {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/°/g, "");
};

export const filtrarCategoriasPorCursoYArea = (
  curso,
  areaIdSeleccionada,
  programaCompleto
) => {
  const cursoNormalizado = normalizarTexto2(curso.replace("_", " "));

  const [grado, nivel] = cursoNormalizado.split(" ");
  const esSecundaria = nivel.includes("secundaria");
  const numeroCurso = parseInt(grado.replace(/[^\d]/g, ""));

  const categoriasDisponibles = [];

  programaCompleto.forEach((item) => {
    if (Number(item.area_id) !== Number(areaIdSeleccionada)) return;

    const gradosItem = normalizarTexto2(item.grados);

    let disponible = false;

    if (gradosItem.includes(cursoNormalizado)) {
      disponible = true;
    } else if (gradosItem.includes(" a ")) {
      const [inicio, fin] = gradosItem.split(" a ");

      const inicioNumero = parseInt(inicio.replace(/[^\d]/g, ""));
      const finNumero = parseInt(fin.split(" ")[0].replace(/[^\d]/g, ""));
      const finNivel = fin.includes("secundaria") ? "secundaria" : "primaria";

      if (
        esSecundaria &&
        finNivel === "secundaria" &&
        numeroCurso >= inicioNumero &&
        numeroCurso <= finNumero
      ) {
        disponible = true;
      } else if (
        !esSecundaria &&
        finNivel === "primaria" &&
        numeroCurso >= inicioNumero &&
        numeroCurso <= finNumero
      ) {
        disponible = true;
      }
    }

    if (disponible) {
      categoriasDisponibles.push({
        value: item.categoria_id,
        label: `${item.nivel} - ${item.grados}`,
        categoria_id: item.categoria_id,
      });
    }
  });

  return categoriasDisponibles;
};
