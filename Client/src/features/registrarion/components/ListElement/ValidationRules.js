export const Validator = {
  area: {
    required: {
      value: true,
      message: "El area es requerido",
    },
    pattern: {
      value: /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ .,;'"`’Üü]*$/,
      message: "Solo se permiten caracteres alfanumericos",
    },
    maxLength: {
      value: 30,
      message: "El area no debe ser mayor a 30 caracteres",
    },
    minLength: {
      value: 2,
      message: "El area debe tener al menos 2 caracteres",
    },
    validate: {
      noMultipleSpaces: (value) =>
        !/\s{2,}/.test(value) ||
        "No se permiten múltiples espacios en blanco consecutivos",
    },
  },

  categoria: {
    required: {
      value: true,
      message: "La categoria es requerido",
    },
    pattern: {
      value: /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ .,;'"`’Üü]*$/,
      message: "Solo se permiten caracteres alfanumericos",
    },
    maxLength: {
      value: 30,
      message: "La categoria no debe ser mayor a 30 caracteres",
    },
    minLength: {
      value: 2,
      message: "La categoria debe tener al menos 2 caracteres",
    },
    validate: {
      noMultipleSpaces: (value) =>
        !/\s{2,}/.test(value) ||
        "No se permiten múltiples espacios en blanco consecutivos",
    },
  },
};
