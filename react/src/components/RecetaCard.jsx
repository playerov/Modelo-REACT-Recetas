import { Link } from "react-router-dom";

export function RecetaCard({ receta }) {
  return (
    <article className="card">
      <Link to={`/recetas/${receta.idMeal}`}>
        <div className="card-image-wrapper">
          <img src={receta.strMealThumb} alt={receta.strMeal} />
        </div>
        <div className="card-body">
          <h3 className="card-title">{receta.strMeal}</h3>
          <div className="card-meta">
            <span>📁 {receta.strCategory || "Sin categoría"}</span>
            <span>🌍 {receta.strArea || "Sin área"}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
