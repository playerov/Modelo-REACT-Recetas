import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="status">
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>Parece que esta receta se perdió en la cocina 🍳</p>
      <p>La página que buscas no existe o ha sido movida a otro lugar.</p>
      <Link to="/" className="btn-gaming">
        🏠 Volver al Inicio
      </Link>
    </section>
  );
}
