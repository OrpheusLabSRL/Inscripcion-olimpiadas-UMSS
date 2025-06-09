export const extractControlBoleta = (text) => {
  const regex = /nro[^a-zA-Z0-9]*control[^a-zA-Z0-9]*[:\\s\\-+´\\{\\}.<>\\w]*?(\\d+)/i;
  const match = text.match(regex);
  return match ? match[1].trim() : null;
};

export const checkControlBoleta = async (control) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/boletaPago/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        numeroControl: control
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { exists: false, paid: false };
  }
};

export const confirmarPago = async (control) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/boletaPago/confirmarPago", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numeroControl: control }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error al confirmar el pago: " + error.message);
  }
};

export const fetchPendingBoletas = async (tutorId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/boletaPago/boletasByTutor/${tutorId}`);
    const data = await response.json();
    if (data.boletas && data.boletas.length > 0) {
      const pendingBoletas = data.boletas.filter(
        (boleta) => boleta.estadoBoletaPago === 1
      );
      return pendingBoletas.length > 0;
    }
    return false;
  } catch {
    return false;
  }
};
