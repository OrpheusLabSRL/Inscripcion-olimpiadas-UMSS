export const Validator = {
  nombre: {
    required: {
      value: true,
      message: "El nombre es requerido",
    },
    pattern: {
      value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ .,;'"`’Üü]*$/,
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
      value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ .,;'"`’Üü]*$/,
      message: "Solo se permiten caracteres alfabeticos",
    },
    maxLength: {
      value: 30,
      message: "El apellido no debe ser mayor a 30 caracteres",
    },
    minLength: {
      value: 2,
      message: "El apellido debe tener al menos 2 caracteres",
    },
    validate: {
      noMultipleSpaces: (value) =>
        !/\s{2,}/.test(value) ||
        "No se permiten múltiples espacios en blanco consecutivos",
    },
  },

  email: {
    required: "Él correo electronico es requerido",
    maxLength: {
      value: 50,
      message: "El correo electronico no debe ser mayor a 50 caracteres",
    },
    // minLength: {
    //   value: 4,
    //   message: "El correo electronico debe tener al menos 4 caracteres",
    // },
    pattern: {
      value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
      message: "Formato de email inválido",
    },
    validate: {
      noMultipleSpaces: (value) =>
        !/\s{1,}/.test(value) || "No se permiten espacios en blanco",
    },
  },

  numero: {
    required: {
      value: true,
      message: "El numero es requerido",
    },
    pattern: {
      value: /^[0-9ñÑáéíóúÁÉÍÓÚ .,;'"`’Üü]*$/,
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
      value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ .,;'"`’Üü]*$/,
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
      value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ .,;'"`’Üü]*$/,
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
      value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ .,;'"`’Üü]*$/,
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

  ci: {
    required: {
      value: true,
      message: "El carnet de identidad es requerido",
    },
    pattern: {
      value: /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ .,;'"`’Üü]*$/,
      message: "Solo se permiten caracteres alfanumericos",
    },
    maxLength: {
      value: 12,
      message: "El carnet de identidad no debe ser mayor a 12 caracteres",
    },
    minLength: {
      value: 8,
      message: "El carnet de identidad debe tener al menos 8 caracteres",
    },
    validate: {
      noMultipleSpaces: (value) =>
        !/\s{1,}/.test(value) ||
        "No se permiten espacios en blanco consecutivos",
    },
  },
};
