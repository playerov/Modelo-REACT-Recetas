import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../api/client.js";
import { useRecetasRecientes } from "../hooks/useRecetasRecientes.js";

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return null;
}

function getIngredientes(receta) {
  const lista = [];
  for (let i = 1; i <= 20; i++) {
    const nombre = receta[`strIngredient${i}`];
    const medida = receta[`strMeasure${i}`];
    if (nombre && nombre.trim()) {
      lista.push({ nombre, medida: medida || "" });
    }
  }
  return lista;
}

export function RecetaDetailPage() {
  const { id } = useParams();
  const { agregarReciente } = useRecetasRecientes();
  const [receta, setReceta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      setLoading(true);
      setError(null);
      setReceta(null);
      try {
        const data = await apiFetch(`/recetas/${id}`);
        if (activo) {
          setReceta(data.receta);
          agregarReciente(id);
        }
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
  }, [id, agregarReciente]);

  const volver = (
    <Link to="/" className="btn-gaming btn-secondary">
      ← Volver al catálogo
    </Link>
  );

  if (loading) {
    return (
      <section className="status">
        <h2>⏳ Cargando receta...</h2>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        {volver}
        <div className="status">
          <h2>{error.status === 404 ? "Receta no encontrada" : "Error al cargar la receta."}</h2>
        </div>
      </section>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(receta.strYoutube);
  const ingredientes = getIngredientes(receta);

  return (
    <section>
      {volver}

      <div className="detail-layout" style={{ marginTop: "1rem" }}>
        <img className="detail-image" src={receta.strMealThumb} alt={receta.strMeal} />
        <div>
          <h1>{receta.strMeal}</h1>
          <p>
            📁 <strong>Categoría:</strong> {receta.strCategory || "N/A"}
          </p>
          <p>
            🌍 <strong>Área:</strong> {receta.strArea || "N/A"}
          </p>
        </div>
      </div>

      {embedUrl && (
        <div className="detail-section">
          <h3>Video Tutorial</h3>
          <iframe
            width="560"
            height="315"
            src={embedUrl}
            title={`Video tutorial de ${receta.strMeal}`}
            style={{ maxWidth: "100%" }}
            allowFullScreen
          />
        </div>
      )}

      {ingredientes.length > 0 && (
        <div className="detail-section">
          <h3>Ingredientes</h3>
          <ul className="pill-list">
            {ingredientes.map((ing, i) => (
              <li key={i}>
                <strong>{ing.nombre}</strong>
                {ing.medida ? ` - ${ing.medida}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {receta.strInstructions && (
        <div className="detail-section">
          <h3>Instrucciones</h3>
          <p style={{ whiteSpace: "pre-line" }}>{receta.strInstructions}</p>
        </div>
      )}
    </section>
  );
}
