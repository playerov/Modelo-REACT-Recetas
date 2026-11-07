# Servidor Mock de API

Este servidor mock simula una API REST para desarrollo local.

## 🚀 Inicio Rápido

### Instalar dependencias
```bash
npm install
```

### Ejecutar el servidor
```bash
npm start
```

O también puedes usar:
```bash
npm run dev
```

O directamente con Node:
```bash
node mockServer.js
```

## 📡 Endpoints Disponibles

### GET /api/recetas
Obtiene todas las recetas con filtros opcionales

**Query Parameters:**
- `categoria` (opcional): Filtrar por categoría (ej: "Chicken")
- `area` (opcional): Filtrar por área/país (ej: "Indian")
- `buscar` (opcional): Buscar por nombre de receta

**Ejemplo:**
```bash
curl http://localhost:3000/api/recetas
curl http://localhost:3000/api/recetas?categoria=Chicken
curl http://localhost:3000/api/recetas?area=Indian
curl http://localhost:3000/api/recetas?buscar=chicken
curl http://localhost:3000/api/recetas?categoria=Chicken&area=Indian
```

**Respuesta:**
```json
{
  "success": true,
  "total": 25,
  "recetas": [...]
}
```

### GET /api/recetas/:id
Obtiene una receta específica por ID

**Ejemplo:**
```bash
curl http://localhost:3000/api/recetas/52795
```

**Respuesta:**
```json
{
  "success": true,
  "receta": {
    "idMeal": "52795",
    "strMeal": "Chicken Handi",
    "strCategory": "Chicken",
    "strArea": "Indian",
    ...
  }
}
```

### GET /api/categorias
Obtiene todas las categorías únicas disponibles

**Ejemplo:**
```bash
curl http://localhost:3000/api/categorias
```

**Respuesta:**
```json
{
  "success": true,
  "categorias": ["Chicken", "Beef", "Dessert", ...]
}
```

### GET /api/areas
Obtiene todas las áreas/países únicos disponibles

**Ejemplo:**
```bash
curl http://localhost:3000/api/areas
```

**Respuesta:**
```json
{
  "success": true,
  "areas": ["American", "British", "Chinese", "Indian", ...]
}
```

### GET /api/recetas/categoria/:categoria
Obtiene todas las recetas de una categoría específica

**Ejemplo:**
```bash
curl http://localhost:3000/api/recetas/categoria/Chicken
```

### GET /api/recetas/area/:area
Obtiene todas las recetas de un área/país específico

**Ejemplo:**
```bash
curl http://localhost:3000/api/recetas/area/Indian
```

## 🔧 Configuración

El servidor corre por defecto en `http://localhost:3000`

Puedes cambiar el puerto modificando la constante `PORT` en `mockServer.js`

## 📝 Notas

- Los datos no son persistentes (se resetean al reiniciar el servidor)
- CORS está habilitado para todas las peticiones
- Ideal para desarrollo y testing

