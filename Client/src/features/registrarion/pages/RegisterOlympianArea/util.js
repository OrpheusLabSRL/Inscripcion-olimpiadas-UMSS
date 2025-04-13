// Datos completos del programa
// const programaCompleto = [
//   { area: "ASTRONOMÍA - ASTROFÍSICA", nivel: "3P", grados: "3ro Primaria", area_id: 1, categoria_id: 1 },
//   { area: "ASTRONOMÍA - ASTROFÍSICA", nivel: "4P", grados: "4to Primaria", area_id: 1, categoria_id: 2 },
//   { area: "ASTRONOMÍA - ASTROFÍSICA", nivel: "5P", grados: "5to Primaria", area_id: 1, categoria_id: 3 },
//   { area: "ASTRONOMÍA - ASTROFÍSICA", nivel: "6P", grados: "6to Primaria", area_id: 1, categoria_id: 4 },
//   { area: "ASTRONOMÍA - ASTROFÍSICA", nivel: "1S", grados: "1ro Secundaria", area_id: 1, categoria_id: 5 },
//   { area: "ASTRONOMÍA - ASTROFÍSICA", nivel: "2S", grados: "2do Secundaria", area_id: 1, categoria_id: 6 },
//   { area: "ASTRONOMÍA - ASTROFÍSICA", nivel: "3S", grados: "3ro Secundaria", area_id: 1, categoria_id: 7 },
//   { area: "ASTRONOMÍA - ASTROFÍSICA", nivel: "4S", grados: "4to Secundaria", area_id: 1, categoria_id: 8 },
//   { area: "ASTRONOMÍA - ASTROFÍSICA", nivel: "5S", grados: "5to Secundaria", area_id: 1, categoria_id: 9 },
//   { area: "ASTRONOMÍA - ASTROFÍSICA", nivel: "6S", grados: "6to Secundaria", area_id: 1, categoria_id: 10 },

//   { area: "BIOLOGÍA", nivel: "2S", grados: "2do Secundaria", area_id: 2, categoria_id: 6 },
//   { area: "BIOLOGÍA", nivel: "3S", grados: "3ro Secundaria", area_id: 2, categoria_id: 7 },
//   { area: "BIOLOGÍA", nivel: "4S", grados: "4to Secundaria", area_id: 2, categoria_id: 8 },
//   { area: "BIOLOGÍA", nivel: "5S", grados: "5to Secundaria", area_id: 2, categoria_id: 9 },
//   { area: "BIOLOGÍA", nivel: "6S", grados: "6to Secundaria", area_id: 2, categoria_id: 10 },

//   { area: "FÍSICA", nivel: "4S", grados: "4to Secundaria", area_id: 3, categoria_id: 8 },
//   { area: "FÍSICA", nivel: "5S", grados: "5to Secundaria", area_id: 3, categoria_id: 9 },
//   { area: "FÍSICA", nivel: "6S", grados: "6to Secundaria", area_id: 3, categoria_id: 10 },

//   { area: "INFORMÁTICA", nivel: "Guacamayo", grados: "5to a 6to Primaria", area_id: 4, categoria_id: 11 },
//   { area: "INFORMÁTICA", nivel: "Guanaco", grados: "1ro a 3ro Secundaria", area_id: 4, categoria_id: 12 },
//   { area: "INFORMÁTICA", nivel: "Londra", grados: "1ro a 3ro Secundaria", area_id: 4, categoria_id: 13 },
//   { area: "INFORMÁTICA", nivel: "Jucumari", grados: "4to a 6to Secundaria", area_id: 4, categoria_id: 14 },
//   { area: "INFORMÁTICA", nivel: "Bufeo", grados: "4to a 6to Secundaria", area_id: 4, categoria_id: 15 },
//   { area: "INFORMÁTICA", nivel: "Puma", grados: "4to a 6to Secundaria", area_id: 4, categoria_id: 16 },

//   { area: "MATEMÁTICAS", nivel: "Primer Nivel", grados: "1ro Secundaria", area_id: 5, categoria_id: 17 },
//   { area: "MATEMÁTICAS", nivel: "Segundo Nivel", grados: "2do Secundaria", area_id: 5, categoria_id: 18 },
//   { area: "MATEMÁTICAS", nivel: "Tercer Nivel", grados: "3ro Secundaria", area_id: 5, categoria_id: 19 },
//   { area: "MATEMÁTICAS", nivel: "Cuarto Nivel", grados: "4to Secundaria", area_id: 5, categoria_id: 20 },
//   { area: "MATEMÁTICAS", nivel: "Quinto Nivel", grados: "5to Secundaria", area_id: 5, categoria_id: 21 },
//   { area: "MATEMÁTICAS", nivel: "Sexto Nivel", grados: "6to Secundaria", area_id: 5, categoria_id: 22 },

//   { area: "QUÍMICA", nivel: "2S", grados: "2do Secundaria", area_id: 6, categoria_id: 6 },
//   { area: "QUÍMICA", nivel: "3S", grados: "3ro Secundaria", area_id: 6, categoria_id: 7 },
//   { area: "QUÍMICA", nivel: "4S", grados: "4to Secundaria", area_id: 6, categoria_id: 8 },
//   { area: "QUÍMICA", nivel: "5S", grados: "5to Secundaria", area_id: 6, categoria_id: 9 },
//   { area: "QUÍMICA", nivel: "6S", grados: "6to Secundaria", area_id: 6, categoria_id: 10 },

//   { area: "ROBÓTICA", nivel: "Builders P", grados: "5to a 6to Primaria", area_id: 7, categoria_id: 23 },
//   { area: "ROBÓTICA", nivel: "Builders S", grados: "1ro a 6to Secundaria", area_id: 7, categoria_id: 24 },
//   { area: "ROBÓTICA", nivel: "Lego P", grados: "5to a 6to Primaria", area_id: 7, categoria_id: 25 },
//   { area: "ROBÓTICA", nivel: "Lego S", grados: "1ro a 6to Secundaria", area_id: 7, categoria_id: 26 },
// ];

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

const obtenerValue = (area) => {
  return normalizarTexto(area.split(" - ")[0]);
};

const obtenerValueNivel = (nivel) => {
  return normalizarTexto(nivel).replace(/ /g, "_");
};

// 🔍 Filtra las áreas disponibles según el curso actual
export const filtrarAreasPorCurso = (curso, programaCompleto) => {
  const cursoNormalizado = normalizarTexto(curso.replace("_", " "));

  const [grado, nivel] = cursoNormalizado.split(" ");
  const esSecundaria = nivel.includes("secundaria");
  const numeroCurso = parseInt(grado.replace(/[^\d]/g, ""));

  const areasDisponibles = [];

  programaCompleto.forEach((item) => {
    const gradosItem = normalizarTexto(item.grados);

    // Coincidencia directa
    if (gradosItem.includes(cursoNormalizado)) {
      areasDisponibles.push({ area: item.area, area_id: item.area_id });
    }

    // Coincidencia por rango
    else if (gradosItem.includes(" a ")) {
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

  // Filtrar áreas duplicadas por area_id
  const unicas = Object.values(
    areasDisponibles.reduce((acc, curr) => {
      acc[curr.area_id] = curr;
      return acc;
    }, {})
  );

  // Formato final
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
    .replace(/°/g, ""); // Quita símbolo de grado
};

export const filtrarCategoriasPorCursoYArea = (
  curso,
  areaIdSeleccionada, // numérico
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

    // Verificar si el curso exacto está en los grados
    if (gradosItem.includes(cursoNormalizado)) {
      disponible = true;
    }
    // Verificar rangos
    else if (gradosItem.includes(" a ")) {
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
