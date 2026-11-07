import { useEffect, useState } from "react";
import { useRecetas } from "../hooks/useRecetas.js";
import { RecetaCard } from "../components/RecetaCard.jsx";
import { Filtros } from "../components/Filtros.jsx";

export function HomePage() {
  const [filtros, setFiltros] = useState({ categoria: "", area: "", texto: "" });
  const [buscar, setBuscar] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setBuscar(filtros.texto), 500);
    return () => clearTimeout(timer);
  }, [filtros.texto]);

  const { recetas, loading, error } = useRecetas({
    categoria: filtros.categoria,
    area: filtros.area,
    buscar,
  });

  const handleChange = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  return (
    <section>
      <Filtros
        categoria={filtros.categoria}
        area={filtros.area}
        texto={filtros.texto}
        onChange={handleChange}
      />

      {loading && (
        <div className="status">
          <h2>⏳ Cargando recetas...</h2>
        </div>
      )}

      {error && (
        <div className="status">
          <h2>⚠️ Error al cargar las recetas</h2>
          <p>Asegúrate de que el servidor esté corriendo.</p>
        </div>
      )}

      {!loading && !error && recetas.length === 0 && (
        <div className="status">
          <h2>No se encontraron recetas.</h2>
        </div>
      )}

      {!loading && !error && recetas.length > 0 && (
        <div className="games-grid">
          {recetas.map((receta) => (
            <RecetaCard key={receta.idMeal} receta={receta} />
          ))}
        </div>
      )}
    </section>
  );
}
