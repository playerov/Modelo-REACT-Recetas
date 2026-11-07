import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";
import { useRecetasRecientes } from "../hooks/useRecetasRecientes.js";
import { RecetaCard } from "../components/RecetaCard.jsx";

export function RecientesPage() {
  const { recientes } = useRecetasRecientes();
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      setLoading(true);
      const resultados = await Promise.all(
        recientes.map((id) => apiFetch(`/recetas/${id}`).catch(() => null)),
      );
      if (activo) {
        setRecetas(resultados.filter(Boolean).map((r) => r.receta));
        setLoading(false);
      }
    };

    cargar();
    return () => {
      activo = false;
    };
  }, [recientes]);

  return (
    <section>
      <h1>Recetas Recientes</h1>

      {loading && (
        <div className="status">
          <h2>⏳ Cargando...</h2>
        </div>
      )}

      {!loading && recetas.length === 0 && (
        <div className="status">
          <h2>No has visto ninguna receta aún.</h2>
        </div>
      )}

      {!loading && recetas.length > 0 && (
        <div className="games-grid">
          {recetas.map((receta) => (
            <RecetaCard key={receta.idMeal} receta={receta} />
          ))}
        </div>
      )}
    </section>
  );
}