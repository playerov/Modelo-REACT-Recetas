// Servidor Mock para desarrollo local
// Ejecutar con: node server/mockServer.js
import express from "express";
import cors from "cors";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Cargar datos de recetas
let recetas = [];
try {
  const recetasData = readFileSync(join(__dirname, "../data/recetas.json"), "utf-8");
  recetas = JSON.parse(recetasData).meals || [];
} catch (error) {
  console.error("Error cargando recetas:", error);
}

// Rutas de la API

// GET /api/recetas - Obtener todas las recetas (con filtros opcionales)
app.get("/api/recetas", (req, res) => {
  let resultado = [...recetas];

  // Filtro por categoría
  if (req.query.categoria) {
    resultado = resultado.filter(
      (receta) => receta.strCategory?.toLowerCase() === req.query.categoria.toLowerCase()
    );
  }

  // Filtro por área/país
  if (req.query.area) {
    resultado = resultado.filter(
      (receta) => receta.strArea?.toLowerCase() === req.query.area.toLowerCase()
    );
  }

  // Búsqueda por nombre
  if (req.query.buscar) {
    const terminoBusqueda = req.query.buscar.toLowerCase();
    resultado = resultado.filter((receta) =>
      receta.strMeal?.toLowerCase().includes(terminoBusqueda)
    );
  }

  res.json({
    success: true,
    total: resultado.length,
    recetas: resultado,
  });
});

// GET /api/recetas/:id - Obtener una receta específica por ID
app.get("/api/recetas/:id", (req, res) => {
  const receta = recetas.find((r) => r.idMeal === req.params.id);

  if (!receta) {
    return res.status(404).json({
      success: false,
      message: "Receta no encontrada",
    });
  }

  res.json({
    success: true,
    receta: receta,
  });
});

// GET /api/categorias - Obtener todas las categorías únicas
app.get("/api/categorias", (req, res) => {
  const categorias = [...new Set(recetas.map((r) => r.strCategory).filter(Boolean))];
  res.json({
    success: true,
    categorias: categorias.sort(),
  });
});

// GET /api/areas - Obtener todas las áreas/países únicos
app.get("/api/areas", (req, res) => {
  const areas = [...new Set(recetas.map((r) => r.strArea).filter(Boolean))];
  res.json({
    success: true,
    areas: areas.sort(),
  });
});

// GET /api/recetas/categoria/:categoria - Obtener recetas por categoría
app.get("/api/recetas/categoria/:categoria", (req, res) => {
  const categoria = req.params.categoria;
  const recetasFiltradas = recetas.filter(
    (r) => r.strCategory?.toLowerCase() === categoria.toLowerCase()
  );

  res.json({
    success: true,
    categoria: categoria,
    total: recetasFiltradas.length,
    recetas: recetasFiltradas,
  });
});

// GET /api/recetas/area/:area - Obtener recetas por área/país
app.get("/api/recetas/area/:area", (req, res) => {
  const area = req.params.area;
  const recetasFiltradas = recetas.filter(
    (r) => r.strArea?.toLowerCase() === area.toLowerCase()
  );

  res.json({
    success: true,
    area: area,
    total: recetasFiltradas.length,
    recetas: recetasFiltradas,
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 API Mock Server corriendo en http://localhost:${PORT}`);
  console.log(`📊 Endpoint: http://localhost:${PORT}/api/`);
  console.log(`📝 Total de recetas cargadas: ${recetas.length}`);
});
