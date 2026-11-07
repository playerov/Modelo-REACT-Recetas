import { Link } from "react-router-dom";

export function Layout({ children }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="app-shell">
      <header>
        <div className="brand">
          <span className="brand-title">🍳 Recetario Estrafalario</span>
          <span className="brand-subtitle">
            Sabor garantizado... o te devolvemos tu dinero
          </span>
        </div>
        <nav className="layout-nav">
          <Link to="/">Inicio</Link>
          <Link to="/recientes">Recientes</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>© {currentYear} Recetario Estrafalario - Tu Cocina Digital</p>
      </footer>
    </div>
  );
}
