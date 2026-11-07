export const API_BASE_URL = "http://localhost:3000/api";

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, options);
  const data = await res.json();

  if (!res.ok || data.success === false) {
    const error = new Error(data.message || "Error en el servidor");
    error.status = res.status;
    throw error;
  }

  return data;
}
