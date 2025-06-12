export const Validator = {
  nombre: {
    required: {
      value: true,
      message: "El nombre es requerido",
    },
    pattern: {
      value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ .,;'"`'Üü]*$/,
      message: "Solo se permiten caracteres alfabeticos",
    },
    maxLength: {
      value: 30,
      message: "El nombre no debe ser mayor a 30 caracteres",
    },
    minLength: {
      value: 2,
      message: "El nombre debe tener al menos 2 caracteres",
    },
    validate: {
      noMultipleSpaces: (value) =>
        !/\s{2,}/.test(value) ||
        "No se permiten múltiples espacios en blanco consecutivos",
    },
  },

  apellido: {
    required: {
      value: true,
      message: "El apellido es requerido",
    },
    pattern: {
      value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ .,;'"`'Üü]*$/,
      message: "Solo se permiten caracteres alfabeticos",
    },
    maxLength: {
      value: 30,
      message: "El apellido no debe ser mayor a 30 caracteres",
    },
    minLength: {
      value: 2,
      message: "El apellido/   debe tener al menos 2 caracteres",
    },
    validate: {
      noMultipleSpaces: (value) =>
        !/\s{2,}/.test(value) ||
        "No se permiten múltiples espacios en blanco consecutivos",
    },
  },

  fechaNacimiento: {
    required: {
      value: true,
      message: "La fecha de nacimiento es requerido",
    },
    min: {
      value: "2005-04-25",
      message: "Debe tener menos de 20 años",
    },
    max: {
      value: "2019-04-25",
      message: "Debe tener al menos 6 años",
    },
  },
  ci: {
    required: {
      value: true,
      message: "El carnet de identidad es requerido",
    },
    pattern: {
      value: /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ .,;'"`'Üü]*$/,
      message: "Solo se permiten caracteres alfanumericos",
    },
    maxLength: {
      value: 12,
      message: "El carnet de identidad no debe ser mayor a 12 caracteres",
    },
    minLength: {
      value: 7,
      message: "El carnet de identidad debe tener al menos 7 caracteres",
    },
    validate: {
      noMultipleSpaces: (value) =>
        !/\s{1,}/.test(value) ||
        "No se permiten espacios en blanco consecutivos",
    },
  },
  colegio: {
    required: {
      value: true,
      message: "El nombre del colegio es requerido",
    },
    pattern: {
      value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ .,;'"`'Üü]*$/,
      message: "Solo se permiten caracteres alfabeticos",
    },
    maxLength: {
      value: 30,
      message: "El nombre del colegio no debe ser mayor a 30 caracteres",
    },
    minLength: {
      value: 2,
      message: "El nombre del colegio debe tener al menos 2 caracteres",
    },
    validate: {
      noMultipleSpaces: (value) =>
        !/\s{2,}/.test(value) ||
        "No se permiten múltiples espacios en blanco consecutivos",
    },
  },

  curso: {
    required: {
      value: true,
      message: "El curso es requerido",
    },
    pattern: {
      value: /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ .,;'"`'Üü]*$/,
      message: "Solo se permiten caracteres alfanumericos",
    },
    maxLength: {
      value: 30,
      message: "El curso no debe ser mayor a 30 caracteres",
    },
    minLength: {
      value: 2,
      message: "El curso debe tener al menos 2 caracteres",
    },
    validate: {
      noMultipleSpaces: (value) =>
        !/\s{2,}/.test(value) ||
        "No se permiten múltiples espacios en blanco consecutivos",
    },
  },

  departamento: {
    required: {
      value: true,
      message: "El departamento es requerido",
    },
    pattern: {
      value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ .,;'"`'Üü]*$/,
      message: "Solo se permiten caracteres alfabeticos",
    },
    maxLength: {
      value: 30,
      message: "El departamento no debe ser mayor a 30 caracteres",
    },
    minLength: {
      value: 2,
      message: "El departamento debe tener al menos 2 caracteres",
    },
    validate: {
      noMultipleSpaces: (value) =>
        !/\s{2,}/.test(value) ||
        "No se permiten múltiples espacios en blanco consecutivos",
    },
  },

  municipio: {
    required: {
      value: true,
      message: "El municipio es requerido",
    },
    maxLength: {
      value: 30,
      message: "El municipio no debe ser mayor a 30 caracteres",
    },
    minLength: {
      value: 2,
      message: "El municipio debe tener al menos 2 caracteres",
    },
  },

  email: {
    required: "Él email es requerido",
    maxLength: {
      value: 100,
      message: "Él email no debe ser mayor a 100 caracteres",
    },
    pattern: {
      value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
      message: "Formato de email inválido",
    },
    validate: {
      noMultipleSpaces: (value) =>
        !/\s{1,}/.test(value) || "No se permiten espacios en blanco",
    },
  },

  area: {
    required: {
      value: true,
      message: "El area es requerido",
    },
    pattern: {
      value: /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ .,;'"`'Üü]*$/,
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
      value: /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ .,;'"`'Üü]*$/,
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

  numero: {
    required: {
      value: true,
      message: "El numero es requerido",
    },
    pattern: {
      value: /^[0-9ñÑáéíóúÁÉÍÓÚ .,;'"`'Üü]*$/,
      message: "Solo se permiten caracteres alfabeticos",
    },
    maxLength: {
      value: 8,
      message: "El número no debe ser mayor a 8 caracteres",
    },
    minLength: {
      value: 8,
      message: "El numero debe tener al menos 8 caracteres",
    },
    validate: {
      noMultipleSpaces: (value) =>
        !/\s{1,}/.test(value) ||
        "No se permiten múltiples espacios en blanco consecutivos",
    },
  },

  pertenece_correo: {
    required: {
      value: true,
      message: "A quien pertenece el correo es requerido",
    },
    pattern: {
      value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ .,;'"`'Üü]*$/,
      message: "Solo se permiten caracteres alfabeticos",
    },
    maxLength: {
      value: 30,
      message: "A quien pertece el correo no debe ser mayor a 30 caracteres",
    },
    minLength: {
      value: 3,
      message: "A quien pertenece el correo debe tener al menos 3 caracteres",
    },
    validate: {
      noMultipleSpaces: (value) =>
        !/\s{2,}/.test(value) ||
        "No se permiten múltiples espacios en blanco consecutivos",
    },
  },

  pertenece_numero: {
    required: {
      value: true,
      message: "A quien pertenece el número es requerido",
    },
    pattern: {
      value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ .,;'"`'Üü]*$/,
      message: "Solo se permiten caracteres alfabeticos",
    },
    maxLength: {
      value: 30,
      message: "A quien pertece el número no debe ser mayor a 30 caracteres",
    },
    minLength: {
      value: 3,
      message: "A quien pertenece el número debe tener al menos 3 caracteres",
    },
    validate: {
      noMultipleSpaces: (value) =>
        !/\s{2,}/.test(value) ||
        "No se permiten múltiples espacios en blanco consecutivos",
    },
  },

  tipo_tutor: {
    required: {
      value: true,
      message: "El tipo de tutor es requerido",
    },
    pattern: {
      value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ .,;'"`'Üü]*$/,
      message: "Solo se permiten caracteres alfabeticos",
    },
    maxLength: {
      value: 30,
      message: "El tipo de tutor no debe ser mayor a 30 caracteres",
    },
    minLength: {
      value: 3,
      message: "A quien pertenece el número debe tener al menos 3 caracteres",
    },
    validate: {
      noMultipleSpaces: (value) =>
        !/\s{2,}/.test(value) ||
        "No se permiten múltiples espacios en blanco consecutivos",
    },
  },
};
