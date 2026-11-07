import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

export function useRecetas({ categoria, area, buscar }) {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (categoria) params.set("categoria", categoria);
        if (area) params.set("area", area);
        if (buscar) params.set("buscar", buscar);

        const data = await apiFetch(`/recetas?${params.toString()}`);
        if (activo) setRecetas(data.recetas);
      } catch (err) {
        if (activo) setError(err);
      } finally {
        if (activo) setLoading(false);
      }
    };

    cargar();
    return () => {
      activo = false;
    };
  }, [categoria, area, buscar]);

  return { recetas, loading, error };
}
