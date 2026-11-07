// Estado global de la aplicación
const state = {
  recetas: [],
  recetasRecientes: JSON.parse(
    localStorage.getItem("recetasRecientes") || "[]"
  ),
  categorias: [],
  areas: [],
  currentPage: "home",
  currentReceta: null,
};

// API Base URL
const API_BASE = "http://localhost:3000/api";

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  loadCategorias();
  loadAreas();
  loadRecetas();
  loadRecetasRecientes();
  setupFilters();
});

// Navegación entre páginas
function initNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.page;
      showPage(page);
      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  document.getElementById("back-btn")?.addEventListener("click", () => {
    showPage("home");
    document
      .querySelector('.nav-btn[data-page="home"]')
      .classList.add("active");
    document
      .querySelector('.nav-btn[data-page="recientes"]')
      .classList.remove("active");
  });
}

function showPage(pageName) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  const pageElement = document.getElementById(`${pageName}-page`);
  if (pageElement) {
    pageElement.classList.add("active");
    state.currentPage = pageName;

    // Si se muestra la página de recientes, recargar desde localStorage
    if (pageName === "recientes") {
      state.recetasRecientes = JSON.parse(
        localStorage.getItem("recetasRecientes") || "[]"
      );
      loadRecetasRecientes();
    }
  }
}

// Cargar categorías
async function loadCategorias() {
  try {
    const response = await fetch(`${API_BASE}/categorias`);
    const data = await response.json();
    if (data.success) {
      state.categorias = data.categorias;
      const select = document.getElementById("filter-categoria");
      data.categorias.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error cargando categorías:", error);
  }
}

// Cargar áreas
async function loadAreas() {
  try {
    const response = await fetch(`${API_BASE}/areas`);
    const data = await response.json();
    if (data.success) {
      state.areas = data.areas;
      const select = document.getElementById("filter-area");
      data.areas.forEach((area) => {
        const option = document.createElement("option");
        option.value = area;
        option.textContent = area;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error cargando áreas:", error);
  }
}

// Cargar recetas
async function loadRecetas() {
  const loading = document.getElementById("loading");
  const errorMsg = document.getElementById("error-message");
  const container = document.getElementById("recetas-container");

  loading.style.display = "block";
  errorMsg.style.display = "none";
  container.innerHTML = "";

  try {
    const categoria = document.getElementById("filter-categoria").value;
    const area = document.getElementById("filter-area").value;
    const buscar = document.getElementById("search-input").value;

    let url = `${API_BASE}/recetas?`;
    const params = [];
    if (categoria) params.push(`categoria=${encodeURIComponent(categoria)}`);
    if (area) params.push(`area=${encodeURIComponent(area)}`);
    if (buscar) params.push(`buscar=${encodeURIComponent(buscar)}`);

    url += params.join("&");

    const response = await fetch(url);
    const data = await response.json();

    if (data.success) {
      state.recetas = data.recetas;
      renderRecetas(data.recetas, container);
    } else {
      throw new Error("Error al cargar recetas");
    }
  } catch (error) {
    console.error("Error:", error);
    errorMsg.textContent =
      "Error al cargar las recetas. Asegúrate de que el servidor esté corriendo.";
    errorMsg.style.display = "block";
  } finally {
    loading.style.display = "none";
  }
}

// Renderizar recetas
function renderRecetas(recetas, container) {
  if (recetas.length === 0) {
    container.innerHTML =
      '<p class="empty-message">No se encontraron recetas.</p>';
    return;
  }

  container.innerHTML = recetas
    .map(
      (receta) => `
        <div class="receta-card" onclick="showDetalle('${receta.idMeal}')">
            <img src="${receta.strMealThumb}" alt="${
        receta.strMeal
      }" onerror="this.src='https://via.placeholder.com/300x200?text=Sin+Imagen'">
            <div class="receta-card-content">
                <h3>${receta.strMeal}</h3>
                <div class="receta-meta">
                    <span>📁 ${receta.strCategory || "Sin categoría"}</span>
                    <span>🌍 ${receta.strArea || "Sin área"}</span>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

// Mostrar detalle de receta
async function showDetalle(id) {
  // Agregar a recetas recientes
  addToRecientes(id);

  const loading = document.getElementById("loading");
  const container = document.getElementById("detalle-container");

  loading.style.display = "block";
  container.innerHTML = "";

  try {
    const response = await fetch(`${API_BASE}/recetas/${id}`);
    const data = await response.json();

    if (data.success) {
      state.currentReceta = data.receta;
      renderDetalle(data.receta, container);
      showPage("detalle");
    } else {
      throw new Error("Receta no encontrada");
    }
  } catch (error) {
    console.error("Error:", error);
    container.innerHTML =
      '<p class="error-message">Error al cargar la receta.</p>';
  } finally {
    loading.style.display = "none";
  }
}

// Convertir URL de YouTube a formato embed
function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return null;
}

// Renderizar detalle
function renderDetalle(receta, container) {
  // Procesar ingredientes
  const ingredientes = [];
  for (let i = 1; i <= 20; i++) {
    const ingrediente = receta[`strIngredient${i}`];
    const medida = receta[`strMeasure${i}`];
    if (ingrediente && ingrediente.trim()) {
      ingredientes.push({
        nombre: ingrediente,
        medida: medida || "",
      });
    }
  }

  // Obtener URL de embed de YouTube
  const youtubeEmbedUrl = getYouTubeEmbedUrl(receta.strYoutube);

  container.innerHTML = `
        <div class="detalle-header">
            <div class="detalle-image">
                <img src="${receta.strMealThumb}" alt="${
    receta.strMeal
  }" onerror="this.src='https://via.placeholder.com/400x300?text=Sin+Imagen'">
            </div>
            <div class="detalle-info">
                <h2>${receta.strMeal}</h2>
                <div class="detalle-meta">
                    <span>📁 <strong>Categoría:</strong> ${
                      receta.strCategory || "N/A"
                    }</span>
                    <span>🌍 <strong>Área:</strong> ${
                      receta.strArea || "N/A"
                    }</span>
                </div>
            </div>
        </div>

        ${
          youtubeEmbedUrl
            ? `
        <div class="detalle-section">
            <h3>Video Tutorial</h3>
            <div class="video-container">
                <iframe 
                    src="${youtubeEmbedUrl}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    title="Video tutorial de ${receta.strMeal}">
                </iframe>
            </div>
        </div>
        `
            : ""
        }

        ${
          ingredientes.length > 0
            ? `
        <div class="detalle-section">
            <h3>Ingredientes</h3>
            <ul class="ingredientes-list">
                ${ingredientes
                  .map(
                    (ing) => `
                    <li><strong>${ing.nombre}</strong> ${
                      ing.medida ? `- ${ing.medida}` : ""
                    }</li>
                `
                  )
                  .join("")}
            </ul>
        </div>
        `
            : ""
        }

        ${
          receta.strInstructions
            ? `
        <div class="detalle-section">
            <h3>Instrucciones</h3>
            <div class="instrucciones">${receta.strInstructions}</div>
        </div>
        `
            : ""
        }
    `;
}

// Agregar a recetas recientes
function addToRecientes(id) {
  // Remover si ya existe
  state.recetasRecientes = state.recetasRecientes.filter((r) => r !== id);
  // Agregar al inicio
  state.recetasRecientes.unshift(id);
  // Limitar a 15 recetas
  state.recetasRecientes = state.recetasRecientes.slice(0, 15);
  // Guardar en localStorage
  localStorage.setItem(
    "recetasRecientes",
    JSON.stringify(state.recetasRecientes)
  );
}

// Cargar recetas recientes
async function loadRecetasRecientes() {
  const container = document.getElementById("recientes-container");

  // Actualizar estado desde localStorage antes de cargar
  state.recetasRecientes = JSON.parse(
    localStorage.getItem("recetasRecientes") || "[]"
  );

  if (state.recetasRecientes.length === 0) {
    container.innerHTML =
      '<p class="empty-message">No has visto ninguna receta aún.</p>';
    return;
  }

  try {
    // Cargar cada receta reciente
    const recetasPromises = state.recetasRecientes.map((id) =>
      fetch(`${API_BASE}/recetas/${id}`)
        .then((r) => r.json())
        .catch((err) => {
          console.error(`Error cargando receta ${id}:`, err);
          return { success: false };
        })
    );

    const resultados = await Promise.all(recetasPromises);
    const recetas = resultados.filter((r) => r.success).map((r) => r.receta);

    if (recetas.length === 0) {
      container.innerHTML =
        '<p class="empty-message">No se pudieron cargar las recetas recientes.</p>';
      return;
    }

    renderRecetas(recetas, container);
  } catch (error) {
    console.error("Error cargando recetas recientes:", error);
    container.innerHTML =
      '<p class="empty-message">Error al cargar las recetas recientes.</p>';
  }
}

// Configurar filtros
function setupFilters() {
  document
    .getElementById("filter-categoria")
    .addEventListener("change", loadRecetas);
  document
    .getElementById("filter-area")
    .addEventListener("change", loadRecetas);
  document
    .getElementById("search-input")
    .addEventListener("input", debounce(loadRecetas, 500));
}

// Función debounce para búsqueda
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Hacer showDetalle disponible globalmente
window.showDetalle = showDetalle;

