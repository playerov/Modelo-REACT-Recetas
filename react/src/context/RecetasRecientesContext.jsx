import { createContext, useState, useEffect, useCallback } from "react";

export const RecetasRecientesContext = createContext(null);

const STORAGE_KEY = "recetasRecientes";
const MAX_RECIENTES = 15;

export function RecetasRecientesProvider({ children }) {
  const [recientes, setRecientes] = useState(() =>
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"),
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recientes));
  }, [recientes]);

  const agregarReciente = useCallback((id) => {
    setRecientes((prev) => [id, ...prev.filter((r) => r !== id)].slice(0, MAX_RECIENTES));
  }, []);

  const limpiarRecientes = useCallback(() => setRecientes([]), []);

  const value = { recientes, agregarReciente, limpiarRecientes };

  return (
    <RecetasRecientesContext.Provider value={value}>
      {children}
    </RecetasRecientesContext.Provider>
  );
}
