## Rúbrica - Examen React Recetas

Puntaje total sugerido: **100 puntos**.  

---

### 1. Routing y Navegación (20 pts)
- Setup inicial correcto de `react-router-dom`.
- Estructuración de rutas dinámicas (para IDs de recetas).
- Enlaces sin recarga (eliminación de los `<a href>` puros del header y home).

---

### 2. Peticiones de Red (API Fetchings) (20 pts)
- Comunicación total con servidor expres. 
- Filtros parametrizados correctamente parseados y pasados a las Query Strings de la URL.
- Control de carga paralela (`Loaders/Spinners`) y caídas de request.

---

### 3. Maquetado en React (Componentes) (20 pts)
- Uso de componentes segregados en UI y Controladores (Layout Component vs Logic/Fetch component).
- Incrustación validada y segura de los Iframe videos.
- Extensión HTML llevada por completo a JSX.

---

### 4. Flujo Historial Global (25 pts)
- Desarrollo de un `RecetasRecientesContext`.
- Operaciones Push seguras (`slice` de antiguos y limiters lógicos para evitar crecimiento infinito).
- Reflejo efectivo en `/recientes` mediante un Grid de tarjetas en base a los IDs recolectados localmente cruzados con el API local.

---

### 5. Código Reactivo y Estándares (15 pts)
- Aprovechamiento completo de `useEffect` (dependencias bien delimitadas).
- Sin código residual ni copy-pastes literales orientados a Vanilla JS.

---

### 6. Desaprobación automática (orientativa)
- Compilación de Vite fallida de forma recurrente.
- Componentes monolíticos sin partición modular alguna que alberguan la totalidad de la aplicación.
- Lecturas de datos harcodeados o apuntando a archivos JS locales JSON directamente desde subcarpetas sin pasar por Express.
