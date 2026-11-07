import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

export function Filtros({ categoria, area, texto, onChange }) {
  const [categorias, setCategorias] = useState([]);
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [cats, ars] = await Promise.all([
          apiFetch("/categorias"),
          apiFetch("/areas"),
        ]);
        setCategorias(cats.categorias);
        setAreas(ars.areas);
      } catch (err) {
        console.error("Error cargando filtros:", err);
      }
    };
    cargar();
  }, []);

  return (
    <div
      className="filters"
      style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}
    >
      <select value={categoria} onChange={(e) => onChange("categoria", e.target.value)}>
        <option value="">Todas las categorías</option>
        {categorias.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select value={area} onChange={(e) => onChange("area", e.target.value)}>
        <option value="">Todas las áreas</option>
        {areas.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Buscar receta..."
        value={texto}
        onChange={(e) => onChange("texto", e.target.value)}
      />
    </div>
  );
}
