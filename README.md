[Guia-React-Parcial.md](https://github.com/user-attachments/files/34510022/Guia-React-Parcial.md)
**React para el parcial**

Guía completa: cómo pensar, qué saber, qué usar y dónde. Basada en los 7 modelos de examen (Clima, Países, Recetas, GameHub, Eventos, Gym y TrailerFlix).

## **Cómo usar esta guía**

* **Para entender desde cero:** leé las Partes 1 a 5 en orden.
* **En pleno examen:** andá directo a la Parte 2 (método), la Parte 4 (qué falta y en qué orden), la Parte 7 (recetas con código) y la Parte 10 (errores).
* **Para repasar:** la Parte 6 es una tabla maestra de "qué uso y dónde", y la Parte 12 tiene las reglas de oro.

## **Índice**

* Parte 1. El panorama: qué es un modelo, qué se evalúa, las dos familias y los 7 modelos
* Parte 2. El método para encarar cualquier modelo (paso a paso)
* Parte 3. Cómo pensar cada tipo de sección
* Parte 4. Cómo saber qué falta, a qué archivo ir y en qué orden
* Parte 5. La teoría que tenés que saber (React, JavaScript y herramientas)
* Parte 6. Tabla maestra: qué uso y dónde
* Parte 7. Recetas con código listas para adaptar
* Parte 8. Las dos familias, archivo por archivo
* Parte 9. Notas y trampas de cada modelo
* Parte 10. Errores comunes: síntoma, causa y solución
* Parte 11. Pruebas finales, Git y entrega
* Parte 12. Reglas de oro y plan de práctica
* Glosario

# **Parte 1. El panorama**

## **1.1 Qué es un modelo de examen**

Todos los modelos son lo mismo: te dan una aplicación hecha en **JavaScript "vanilla"** (HTML + JS + CSS, en las carpetas js/, css/ y los .html de la raíz) y un **esqueleto de React** (carpeta react/) con archivos vacíos o a medio hacer. Tu trabajo es **migrar** la aplicación vanilla a React, conectándola a una **API Express de práctica** (carpeta server/) que ya funciona.

Tres carpetas, tres roles:

* **Raíz y js/ (vanilla):** es la **guía**. Te dice qué se tiene que ver, en qué orden, con qué textos. No se toca.
* **server/:** la API. No se toca. Se levanta con npm run dev y escucha en el puerto 3000.
* **react/:** lo único que se modifica. Se levanta con npm run dev y se abre en el puerto 5173.

## **1.2 Qué se evalúa (rúbrica típica)**

Las rúbricas son casi iguales en todos los modelos, y te dicen cuánto vale cada cosa:

| **Criterio** | **Puntos** | **Qué piden** |
| --- | --- | --- |
| Routing y SPA | 20 | BrowserRouter, rutas /, /algo/:id y \* (404), useParams, Link, useNavigate |
| Consumo de API | 20 | fetch correcto, useEffect con las dependencias bien puestas, estados de loading y error |
| Páginas y componentes | 20 | Catálogo y detalle, componentes reutilizables (tarjeta), JSX correcto, .map() con key |
| Context y almacenamiento | 25 | Historial/recientes **o** login, con localStorage |
| Hooks y calidad de código | 15 | Custom hooks, código limpio, sin manipular el DOM a mano |

Lo que **descalifica** (aparece en varias rúbricas): usar innerHTML o querySelector en vez de React, no usar React Router, o no conectarse al servidor provisto (cargar JSON a mano).

## **1.3 Las dos familias de modelos**

Los 7 modelos son en realidad **2 modelos distintos** con distinta temática. Lo que los separa es **qué guarda el Context**.

|  | **Familia A: "Recientes"** | **Familia B: "Login"** |
| --- | --- | --- |
| Modelos | Clima, Países (y Recetas, ver más abajo) | GameHub, Eventos, Gym, TrailerFlix |
| El Context guarda | Un historial de lo que consultaste | El usuario que inició sesión |
| Funciones del Context | agregar..., limpiar... | login, logout |
| Pieza especial | Select o filtros, página /recientes | POST /api/login, cabecera que cambia |
| Archivos del esqueleto | Header, Loading, ErrorMessage, Recientes, services/api.js | Layout, LoginForm, AuthContext, useAuth, useGames, client.js |

**Dato clave:** en la familia B, los archivos main.jsx, useAuth.js, client.js, AuthContext.jsx, Layout.jsx, LoginForm.jsx y useGames.js son **idénticos** en los 4 modelos (se verificó comparándolos). Lo único que cambia son App.jsx (nombres de rutas) y las páginas. Si dominás un modelo de la familia B, tenés los otros tres.

## **1.4 Cómo identificar la familia de un modelo nuevo**

Mirá estas señales (con una alcanza, con dos se confirma):

* **rubricas.md**: el punto del Context dice "Autenticación" (familia B) o "Historial / Recientes" (familia A).
* **react/src/context/**: se llama AuthContext (B) o algo como HistorialConsultasContext / PaisesRecientesContext (A).
* **server/**: si tiene app.post("/api/login") es la B. Si tiene filtros (req.query.buscar) y rutas extra (/api/categorias, /api/continentes) es la A.
* **Carpeta js/ del vanilla**: si hay un login.js o auth.js es la B.
* **README o rúbrica con la ruta /recientes**: es la A.

Si las señales se contradicen (pasa con Recetas), **mandan la rúbrica y el servidor**, porque eso es lo que se evalúa y lo que existe de verdad. Los nombres del esqueleto pueden ser sobras de otra plantilla.

## **1.5 Los 7 modelos de un vistazo**

| **Modelo** | **Familia** | **Lista** | **Forma de la respuesta** | **Identificador** | **Lo especial** |
| --- | --- | --- | --- | --- | --- |
| Clima | A | /api/ciudades | { ciudades: [...] } | id numérico | Select + historial sin duplicados. Ids repetidos en los datos |
| Países | A | /api/paises | { success, total, paises } | cca3 (texto, ej. "ARG") | Filtros con debounce, límite de 15 recientes |
| Recetas | A (mixta) | /api/recetas | { success, total, recetas } | id | Filtros por categoría, área y búsqueda; sin login |
| GameHub | B | /api/videojuegos | { PC: [...], Xbox: [...] } (ya agrupado) | id numérico | Detalle con 2 pedidos y datos anidados |
| Eventos | B | /api/eventos | [ ... ] (lista plana) | id numérico | Aviso de tickets, invitados vacíos |
| Gym | B | /api/clases | [ ... ] (lista plana) | id numérico | Agrupar por categoría |
| TrailerFlix | B | /api/contenido | [ ... ] (lista plana) | id numérico | Agrupar por género; login con respuesta distinta |

La forma de la respuesta es lo primero que hay que **verificar siempre abriendo la URL en el navegador**, porque de eso depende todo lo que sigue.

# **Parte 2. El método: cómo encarar cualquier modelo**

Este es el orden de trabajo. Seguilo siempre, en cualquier modelo.

## **Paso 0. Preparar el entorno**

* Descomprimí el zip y abrí en VS Code **la carpeta que contiene react/ y server/** (al descomprimir a veces queda una carpeta dentro de otra con el mismo nombre).
* Abrí **dos terminales** a la vez:

- Terminal 1: cd server, npm install, npm run dev.

- Terminal 2: cd react, npm install, npm run dev.

* La app React se abre en http://localhost:5173. El servidor en http://localhost:3000.
* Si vas a subir el proyecto a GitHub, acordate de que el zip puede traer un .git adentro de react/ que hay que borrar (ver Parte 11).

## **Paso 1. Leer el README y la rúbrica**

Antes de escribir una línea. Buscá:

* Qué páginas y rutas piden.
* Qué funcionalidades (filtros, login, recientes, límite de elementos).
* Cuántos puntos vale cada cosa (para priorizar).
* Cualquier detalle puntual ("ocultar secciones sin datos", "máximo 15", "mostrar mensaje si la búsqueda no da resultados").

## **Paso 2. Mirar el vanilla: es la guía**

Abrí la versión vanilla (el index.html de la raíz y los archivos de js/) y fijate:

* **Qué se muestra** y **en qué orden**.
* **Qué textos** usa (títulos, botones, mensajes). Se copian tal cual.
* **Qué hace cada función**: cada función vanilla se traduce a una pieza de React (tabla en la Parte 3).
* **Qué se guarda en localStorage** y con qué claves.

Ojo: las **clases CSS de React** salen de react/src/index.css, no del css/ del vanilla. Si usás una clase que no existe en ese archivo, no tiene estilos.

## **Paso 3. Mirar el servidor y los datos**

Abrí en el navegador cada endpoint y mirá la respuesta:

* ¿Empieza con { o con [? (objeto o lista).
* Si es un objeto, ¿en qué propiedad está la lista? (ciudades, paises, recetas...).
* ¿Cómo se llaman los campos que tengo que mostrar? (copiá los nombres exactos, con tildes).
* ¿Los id son únicos? (en el Clima no lo eran).
* ¿Qué devuelve un error? (por ejemplo { error: "..." } con código 404).
* Si hay login: ¿qué devuelve y qué usuarios existen? (están en data/usuarios.json o similar).

## **Paso 4. Inspeccionar el esqueleto de React**

Recorré cada archivo de react/src/ y marcá qué viene hecho y qué falta (señales en la Parte 4). Buscá en todo el proyecto la palabra TODO (VS Code: Ctrl + Shift + F).

## **Paso 5. Decidir la familia y hacer las 5 preguntas**

1. ¿Qué familia es?

2. ¿Qué devuelve cada endpoint (objeto o lista, y con qué propiedad)?

3. ¿Los datos vienen agrupados o planos? ¿Cómo los muestra el vanilla?

4. ¿Cómo se llaman los campos que tengo que mostrar?

5. ¿Los export e import y las rutas coinciden entre archivos?

## **Paso 6. Definir el orden de trabajo**

Regla de oro: **primero lo que otros archivos usan, después lo que usa a los demás**. El orden concreto está en la Parte 4.

## **Paso 7. Escribir y probar por bloques**

No escribas todo para probar al final. Después de cada grupo de archivos, probá:

| **Después de...** | **Probás...** |
| --- | --- |
| Rutas, Provider y Layout o Header | Que la app arranque y que /loquesea muestre el 404 |
| Capa de API y catálogo | Que se vean los datos (tarjetas o lista) |
| Detalle | Que abra un elemento y que un id inexistente muestre el error |
| Context | Que se guarde en localStorage (F12, pestaña Application) |
| Login o filtros | El flujo completo, incluidos los casos de error |

## **Paso 8. Revisión final y limpieza**

* Corré las pruebas finales (Parte 11).
* Borrá comentarios de práctica y los bloques TODO ya resueltos.
* Formateá cada archivo (VS Code: clic derecho, Format Document).
* npm run build en react/: si compila, no hay errores de sintaxis.

# **Parte 3. Cómo pensar cada tipo de sección**

## **3.1 Las 4 preguntas que sirven para cualquier pantalla o componente**

Antes de escribir cualquier componente, respondé:

1. **¿Qué datos necesita?** (una lista, un elemento, el usuario, el historial).

2. **¿De dónde vienen?** (API, parámetro de la URL, Context, estado propio).

3. **¿Qué estados tiene?** Casi siempre: cargando, error, vacío y con datos.

4. **¿Qué hace el usuario y qué cambia?** (elige algo, escribe, hace clic, envía un formulario).

De esas respuestas sale el código: lo que viene de la API se pide con fetch en un useEffect; lo que cambia con el usuario va en un useState; lo que comparten varias pantallas va en un Context.

## **3.2 De vanilla a React: cada función se traduce a una pieza**

| **En el vanilla** | **En React** |
| --- | --- |
| fetch(...) al cargar la página | Función en api.js + useEffect con [] |
| forEach + createElement o innerHTML | .map() dentro del JSX |
| Variable global que cambia + actualizar el DOM | useState |
| addEventListener("click", ...) | onClick={...} |
| addEventListener("submit", ...) | onSubmit={...} con preventDefault() |
| input.value | Estado + value + onChange (input controlado) |
| window.location.href = "detalle.html?id=3" | navigate("/detalle/3") o <Link> |
| new URLSearchParams(location.search).get("id") | useParams() |
| element.style.display = "none" | Renderizado condicional (&& o ternario) |
| localStorage leído y escrito en cada función | Context con lectura inicial y useEffect que guarda |
| innerHTML = "Cargando..." | if (loading) return <Loading /> |

## **3.3 El catálogo (lista de elementos)**

**Pensalo así:** necesita una lista, que viene de la API, y tiene los 4 estados. El usuario puede hacer clic en un elemento para ir al detalle.

* Estados: items (empieza en [] o null), loading (empieza en true), error (empieza en null).
* Efecto: useEffect(..., []) que pide la lista una sola vez.
* Dibujo en orden: loading, error, vacío, datos.
* Cada elemento es un componente tarjeta que recibe el objeto por props y tiene un Link o un onClick hacia /algo/:id.
* Si el vanilla agrupa por categoría, hay que agrupar (receta J de la Parte 7). Si no agrupa, un solo .map().

## **3.4 El detalle (un elemento)**

**Pensalo así:** el dato que necesita (el id) viene de la **URL**. Eso lo hace distinto del catálogo.

* const { id } = useParams(): siempre llega como **texto**.
* El efecto depende de ese id: useEffect(..., [id]). Así, si el id cambia, vuelve a pedir.
* Estado del elemento: empieza en null. **No se puede leer item.nombre mientras sea null**, por eso los if de loading y error van antes del return con los datos.
* Orden de los if: loading, error, no encontrado (!item), datos.
* Campos anidados: objeto dentro del objeto se lee con punto (item.requisitos.memoria); lista de textos con .map() y <li>; lista de objetos con .map() y los campos de cada uno.
* Dato opcional: renderizado condicional (si la lista está vacía, mostrar un texto alternativo con ternario).

## **3.5 Formulario con select o inputs**

**Pensalo así:** lo que escribe o elige el usuario tiene que vivir en un **estado** (input controlado).

* Un useState por campo (o un objeto de estado).
* Cada campo tiene value={estado} y onChange={(e) => setEstado(e.target.value)}.
* El formulario tiene onSubmit, que empieza con e.preventDefault().
* Validá antes de seguir (por ejemplo que haya algo seleccionado).
* Después del envío, o navegás (navigate) o llamás a una función del Context.
* Si el select recibe opciones de la API, esas opciones también son un estado con su useEffect.

## **3.6 Filtros con búsqueda (Países, Recetas)**

**Pensalo así:** cada vez que el usuario cambia un filtro, hay que **volver a pedir** los datos al servidor con esos filtros.

* Estado de filtros (objeto): { buscar, continente, idioma }.
* Efecto del catálogo con [filtros]: cuando cambian, vuelve a pedir.
* La URL se arma con URLSearchParams, agregando solo los filtros que tienen valor.
* La búsqueda por texto lleva **debounce**: esperar unos 400 ms después de la última tecla antes de pedir.
* Mostrar el mensaje de "sin resultados" cuando la lista vuelve vacía.
* **Trampa:** el componente de filtros tiene que quedar **siempre visible**. Si el loading reemplaza la página entera, el input se desmonta en cada pedido y pierde el foco. El indicador de carga va solo en la zona de resultados.

## **3.7 El Context de historial o recientes (familia A)**

**Pensalo así:** es una lista compartida por varias pantallas y que sobrevive a recargar.

* Una lista en useState, **inicializada leyendo localStorage** (con función).
* Un useEffect([lista]) que guarda cada vez que cambia.
* Funciones para modificarla **sin mutar** (setLista(prev => ...) con spread o filter).
* **Sin duplicados:** StrictMode ejecuta los efectos dos veces en desarrollo, así que sin ese chequeo cada consulta se agregaría doble.
* Si hay un **límite** (15 en Países): .slice(0, 15).
* Va todo en el value del Provider: la lista y las funciones.
* Quien consulta algo llama a agregar...; quien muestra el historial lee la lista.

## **3.8 El Context de login (familia B)**

**Pensalo así:** guarda **quién está logueado** (o null) y ofrece login y logout.

* Estado user inicializado desde localStorage.
* login(datos): guarda en el estado y en localStorage.
* logout(): pone null y borra de localStorage.
* Se guarda dentro de login y logout (no en un efecto) porque son acciones puntuales.
* El formulario de login hace un POST, y si sale bien, llama a login.
* El Layout decide con un **ternario** qué mostrar: saludo y botón de salir, o el formulario.

## **3.9 Rutas y envoltorios**

**Pensalo así:** hay que "envolver" la app con lo que necesitan los componentes de adentro.

* BrowserRouter por fuera de todo (lo necesitan Link, useNavigate, useParams).
* El Provider del Context por fuera de App (lo necesita quien use el hook).
* App tiene las Route: /, /algo/:id, /recientes (si corresponde) y \* para el 404.
* Si hay un Layout o Header fijo, va **afuera** de Routes, así se ve en todas las páginas.

## **3.10 Layout, Header y 404**

* **Layout o Header:** estructura fija (marca, navegación, pie). Los Link llevan a las rutas. En la familia B además decide entre saludo y formulario de login.
* **404:** un componente simple con un mensaje y un Link de vuelta al inicio. Va en la ruta \*.
* **Loading y ErrorMessage:** componentes "tontos": reciben o no un mensaje por props y lo muestran.

# **Parte 4. Cómo saber qué falta, a qué archivo ir y en qué orden**

## **4.1 Señales de que a un archivo del esqueleto le falta código**

El esqueleto nunca te dice "completá acá" de la misma manera. Estas son las señales que aparecieron en los 7 modelos:

| **Lo que ves en el archivo** | **Qué significa** | **Qué hacer** |
| --- | --- | --- |
| try { } catch ... con el try vacío | Función de API sin hacer | Escribir el fetch, el response.ok y el return |
| const algo = () => {}; | Función vacía | Escribir el cuerpo |
| value={{}} en un Provider | El Context no expone nada | Poner la lista y las funciones |
| <div className="x"></div> sin contenido | Componente sin dibujar | Escribir el JSX |
| Comentario // TODO: o {/\* TODO \*/} | Instrucción de qué falta | Leerla, resolverla y borrarla |
| console.warn("TODO ...") | Lógica pendiente | Reemplazar por la lógica real |
| ) : null} en un ternario | Falta la rama alternativa | Poner lo que corresponde (por ejemplo <LoginForm />) |
| useState(false) en un loading que se usa al montar | Estado inicial equivocado | Cambiarlo a true |
| Constantes como PLATFORMS = ["PC", ...] en un modelo que no es de videojuegos | Sobra de otra plantilla | Cambiarlo o borrarlo según el vanilla |
| import { X } from "./X.jsx" pero el archivo exporta otro nombre | Import y export no coinciden | Renombrar el export (la app no arranca si no) |
| Archivo main.jsx o App.jsx casi vacío | Faltan router y Provider | Armarlos (receta M) |
| Un archivo se importa pero no existe (ej. la página 404) | Hay que crearlo | Crear el archivo |

## **4.2 Cómo buscar lo que falta rápido**

* **Ctrl + Shift + F** en VS Code y buscar TODO: lista todos los pendientes.
* Abrir cada archivo y preguntarse: **¿qué recibe, qué devuelve y quién lo usa?**
* Buscar los imports de cada página: te dicen qué piezas esperan que existan (un hook, un componente, una función de API).
* Ejecutar npm run build en react/: los errores de sintaxis o de imports rotos aparecen en la terminal.
* Mirar la consola del navegador (F12): cada error rojo indica el archivo y la línea.

## **4.3 Cómo saber a cuál archivo ir después: el mapa de dependencias**

La pregunta que decide el orden es: **¿qué necesita este archivo que todavía no existe?** Si necesita algo, se hace primero eso.

**Familia A (Recientes): quién necesita a quién**

| **Archivo** | **Necesita** |
| --- | --- |
| main.jsx y App.jsx | Provider, páginas y componentes (solo los nombres) |
| services/api.js | Nada |
| Context y su hook | Nada |
| Header, Loading, ErrorMessage, NotFound | Nada |
| Home | api.js, Loading, ErrorMessage y, si muestra historial, el Context |
| Detalle | api.js y el Context (para agregar al historial) |
| Recientes | El Context (y api.js si el historial guarda solo códigos) |

**Familia B (Login): quién necesita a quién**

| **Archivo** | **Necesita** |
| --- | --- |
| client.js | Nada |
| AuthContext | Nada |
| LoginForm | client.js y AuthContext |
| Layout | AuthContext y LoginForm |
| main.jsx y App.jsx | AuthContext, Layout y los nombres de las páginas |
| useGames (hook de datos) | client.js |
| Tarjeta | Nada |
| HomePage | useGames y la tarjeta |
| Detalle | client.js |

## **4.4 Orden de trabajo en una sola pasada (sin volver atrás)**

Cada archivo se escribe **completo** de una vez, empezando por los que nadie necesita.

**Familia A (Recientes):**

1. services/api.js

2. Context y su hook (completo: lista, localStorage, agregar, limpiar)

3. Componentes simples: Header, Loading, ErrorMessage, NotFound

4. Home completo (datos, select o filtros, historial si corresponde)

5. Detalle completo (datos y agregar al historial)

6. Recientes

7. main.jsx y App.jsx (router, Provider y rutas)

**Familia B (Login):**

1. client.js

2. AuthContext.jsx (completo)

3. LoginForm.jsx (completo, con el POST)

4. Layout.jsx (completo, con el ternario)

5. main.jsx, App.jsx y la página 404

6. useGames.js, tarjeta y HomePage

7. Detalle completo (lógica y JSX juntos)

Los modelos con esqueleto casi vacío (Países) conviene arrancarlos por main.jsx y App.jsx, porque sin router la app no muestra nada para probar.

## **4.5 Qué hacer cuando te trabás**

1. Leé el **primer renglón** del error de la consola: dice qué falla.

2. Si no aparece nada y no hay error, sospechá de un **nombre mal escrito** o de una **propiedad equivocada** de la respuesta del servidor.

3. Poné console.log(variable) justo antes del lugar donde falla y mirá qué valor tiene.

4. Abrí F12, pestaña **Network**: mirá si el pedido salió, a qué URL y qué respondió el servidor.

5. Compará con el modelo que ya resolviste: casi siempre es la misma receta con otros nombres.

# **Parte 5. La teoría que tenés que saber**

## **5.1 Componentes, JSX, props, children y fragments**

**Componente:** una función cuyo nombre empieza con **mayúscula** y que **devuelve JSX** (lo que se ve en pantalla). React la vuelve a ejecutar cada vez que cambia su estado o sus props.

**JSX:** HTML escrito dentro de JavaScript. No lo entiende el navegador: Vite lo transforma.

Reglas de JSX:

* Componentes con mayúscula (<Card />), etiquetas HTML con minúscula (<div>).
* Etiquetas sin contenido se cierran con /: <input />, <img />.
* JavaScript dentro de llaves: <p>{nombre}</p>, <p>{2 + 3}</p>. Dentro de las llaves va una **expresión** (no if ni for).
* Un componente devuelve **un solo elemento raíz**. Para devolver varios sin agregar un div se usa un fragment: <> ... </>.
* Atributos en camelCase y con nombres distintos: className (no class), htmlFor (no for), onClick, onChange, onSubmit.
* Estilos en línea: style={{ textAlign: "center" }} (llaves dobles: una de JSX y otra del objeto; propiedades en camelCase).
* Comentarios dentro del JSX: {/\* comentario \*/}. Un // suelto dentro del JSX se muestra como texto o rompe.
* Para mostrar un $ antes de una variable alcanza con escribir ${precio} en JSX (el $ es texto y {precio} es la variable).

**Props:** los datos que un componente recibe de quien lo usa. Funcionan como los parámetros de una función y **fluyen de padre a hijo**, nunca al revés.

function Tarjeta({ nombre, precio }) { return <p>{nombre} {precio}</p>; }

<Tarjeta nombre="Ana" precio={10} />

Texto fijo va entre comillas (nombre="Ana"); cualquier otra cosa (variable, número, objeto) va entre llaves (precio={10}, game={evento}).

**children:** prop especial con lo que se escribe entre las etiquetas de apertura y cierre. La usan los componentes "contenedores" (un Provider o un Layout): function Layout({ children }) { return <main>{children}</main>; }.

## **5.2 Estado: useState**

El estado es un dato que **React recuerda entre renders** y que, al cambiar, **vuelve a dibujar** el componente. Una variable común se reinicia en cada render; el estado no.

const [contador, setContador] = useState(0);

* contador es el valor actual y setContador la función para cambiarlo. El nombre es libre; por convención set + nombre.
* Nunca se modifica directo (contador++ no funciona): siempre con la función set.
* Valor inicial: 0, "", [], {}, null, true... según el tipo de dato.
* Los hooks se llaman **siempre en el nivel superior** del componente: no dentro de if, bucles ni funciones internas, y siempre **antes** de cualquier return temprano.

**Inmutabilidad:** no se modifica el estado existente, se **reemplaza** por uno nuevo.

* Agregar a una lista: setLista([...lista, nuevo]) (nunca lista.push).
* Quitar: setLista(lista.filter(x => x.id !== id)).
* Cambiar un campo de un objeto: setObj({ ...obj, campo: valor }).

**Función actualizadora:** cuando el nuevo valor depende del anterior, se usa setX(prev => ...). Así no se pisan cambios: setLista(prev => [...prev, nuevo]).

**El set no es inmediato:** justo después de llamarlo, la variable todavía tiene el valor viejo dentro de esa misma función.

**Inicialización perezosa:** si el valor inicial requiere un cálculo (leer localStorage), se pasa una **función**: useState(() => ...). Se ejecuta una sola vez al montar. Si se escribe useState(leer()) se ejecutaría en cada render.

**Qué va en estado:** lo que cambia y tiene que redibujar (datos de la API, loading, error, lo que escribe el usuario, la selección). Lo que se puede calcular a partir de otro estado **no** necesita su propio estado.

## **5.3 Efectos: useEffect**

Sirve para **efectos secundarios**: cosas que no son "dibujar" (pedir datos, leer o escribir localStorage, temporizadores, listeners). Nunca se ponen directo en el cuerpo del componente.

useEffect(() => {

// efecto

return () => { /\* limpieza (opcional) \*/ };

}, [dependencias]);

El array de dependencias decide cuándo se ejecuta:

| **Array** | **Cuándo corre** |
| --- | --- |
| sin array | Después de **cada** render (casi nunca se quiere, puede causar bucles) |
| [] | **Una sola vez**, al montar |
| [id, filtros] | Al montar y cada vez que cambie algo de la lista |

Reglas y trampas:

* Poné en el array **todo lo que el efecto lea y pueda cambiar** (el id de la URL, los filtros, la lista).
* El callback **no puede ser async**. Se define una función async adentro y se llama: async function cargar() {...} cargar();.
* **Limpieza:** la función que devolvés corre antes de volver a ejecutar el efecto y al desmontar. Sirve para clearTimeout, clearInterval y removeEventListener.
* **StrictMode:** en desarrollo ejecuta cada efecto **dos veces** al montar. Por eso el historial necesita evitar duplicados.
* Un objeto o una función creados en el cuerpo del componente son "nuevos" en cada render: si los ponés en las dependencias, el efecto corre sin parar.
* Si dentro del efecto llamás un set de algo que está en las dependencias, hay bucle infinito.
* ESLint puede marcar avisos de "missing dependency": no rompen nada.

## **5.4 Eventos y formularios**

* Los eventos van en camelCase con una **función**: onClick={miFuncion} o onClick={() => hacer(id)}.
* Si escribís onClick={hacer(id)} se ejecuta al dibujar, no al hacer clic. Para pasar argumentos, envolvé en una arrow function.
* onSubmit de un formulario **siempre** empieza con e.preventDefault() (si no, la página se recarga).
* onChange de un input recibe el evento: lo escrito está en e.target.value. **Siempre es texto**, incluso en un input numérico.
* El botón que envía un formulario es <button type="submit">.

**Componente controlado:** el valor del campo vive en el estado de React.

const [nombre, setNombre] = useState("");

<input value={nombre} onChange={(e) => setNombre(e.target.value)} />

El <select> funciona igual (value y onChange). Si el estado empieza en "", conviene una primera opción con value="" ("Seleccione..."): sin ella el select muestra la primera opción pero el estado seguiría vacío.

**Validación:** antes de seguir con el envío, chequear lo necesario y, si falla, mostrar el error en pantalla (con un estado error), no con alert.

## **5.5 Renderizado condicional**

Mostrar una cosa u otra según el estado:

* **Return temprano:** if (loading) return <Loading />;. El patrón estándar de las páginas.
* **&&:** {cond && <div>...</div>}: si la condición es verdadera se dibuja, si no, nada. Cuidado: {0 && ...} dibuja un 0.
* **Ternario:** {cond ? <A /> : <B />} cuando hay una alternativa.
* **null:** un componente que devuelve null no dibuja nada.

Orden estándar de una página con datos: **loading, error, vacío, datos**. Se escribe en ese orden porque, mientras cargás o si falló, los datos no existen todavía (leer item.nombre con item en null rompe la página).

## **5.6 Listas y keys**

Para dibujar una lista se usa .map(), que transforma cada elemento en JSX:

{items.map((item) => (<Tarjeta key={item.id} item={item} />))}

* **key** es obligatoria y tiene que ser **única entre hermanos**. Es lo que usa React para saber qué elemento es cuál.
* Lo mejor es un identificador propio (id, cca3). Si los datos tienen ids repetidos, se usa el índice: .map((item, index) => ... key={index}).
* La key va en el elemento **más externo** que devuelve el .map(), no adentro.
* Si la lista contiene textos únicos, el texto mismo sirve de key.
* .map() solo existe en **arrays**. Si lo llamás sobre un objeto o null rompe con "x.map is not a function".

## **5.7 React Router (rutas)**

Se instala con react-router-dom (versión 6).

| **Pieza** | **Para qué** |
| --- | --- |
| BrowserRouter | Conecta React con la URL. Envuelve toda la app |
| Routes | Contenedor de las rutas |
| Route path="..." element={<X />} | Qué componente se muestra para una URL |
| path="/algo/:id" | Ruta con **parámetro** dinámico |
| path="\*" | Comodín: cualquier URL que no coincida (el 404) |
| Link to="/ruta" | Navega sin recargar (el <a> recarga toda la página) |
| useNavigate() | Navegar por código, después de un evento |
| useParams() | Leer los parámetros de la URL |
| Outlet | Dónde se dibuja la ruta hija en una ruta anidada |

* useParams() devuelve **texto**: /clima/3 da id = "3". Si lo comparás con un número hay que convertirlo (Number(id)).
* navigate("/ruta") va a esa ruta; navigate(-1) vuelve atrás; se usa dentro de **funciones de eventos** (submit, clic), no suelto en el cuerpo.
* Usá Link para enlaces visibles y navigate cuando la navegación sigue a una acción (un submit, un login, un clic en una tarjeta que es un div).
* Link y useNavigate solo funcionan **adentro** del BrowserRouter.
* Una ruta con :id coincide con **cualquier** valor (/clima/rojo también). Por eso el detalle tiene que manejar el caso "no encontrado".
* Para filtros en la URL existe useSearchParams (es opcional en estos modelos).

## **5.8 Context: estado global**

**Problema:** sin Context, un dato tiene que pasar por todos los componentes intermedios por props ("prop drilling").

**Tres piezas:**

1. createContext(): crea el "canal".

2. <Contexto.Provider value={...}>: envuelve la parte de la app que va a tener acceso y le da el valor.

3. useContext(Contexto): lo que usa cualquier componente de adentro para leerlo.

Patrón estándar:

* Un componente XProvider({ children }) con su estado y funciones, que devuelve el Provider con {children} adentro.
* Un **hook propio** (useX) que hace el useContext y, si el valor es undefined, lanza un error ("debe usarse dentro de XProvider").
* El Provider se coloca **por fuera de App** (en main.jsx), o por fuera de lo que lo use.
* El value es un objeto con **todo lo que otros componentes necesitan**: el estado y las funciones.

**Persistencia:** el estado de React **se pierde al recargar la página**. Por eso se guarda en localStorage y se lee al iniciar.

## **5.9 Custom hooks**

Una función cuyo nombre **empieza con use** y que usa otros hooks adentro. Sirve para **reutilizar y aislar lógica** (el fetch, el acceso al Context).

* Siguen las mismas reglas que los hooks (nivel superior, solo dentro de componentes u otros hooks).
* Cada componente que lo usa tiene **su propio estado**.
* Los ejemplos de estos modelos: useGames (carga el catálogo), useAuth (el Context de login), usePaisesRecientes, useHistorialConsultas.
* La rúbrica valora que la lógica "impura" (fetch, storage) esté en src/hooks, no mezclada en la página.

## **5.10 fetch y API**

const response = await fetch(url); // GET

if (!response.ok) throw new Error("..."); // chequear el estado HTTP

const data = await response.json(); // convertir a objeto

* fetch **no lanza error** con un 404 o 500: solo falla si no hay conexión. Por eso hay que chequear response.ok (o response.status) y lanzar el error a mano.
* response.json() también es asíncrono, lleva await.
* **POST** (enviar datos):

await fetch(url, {

method: "POST",

headers: { "Content-Type": "application/json" },

body: JSON.stringify({ username, password }),

});

body solo acepta texto: JSON.stringify convierte el objeto. El Content-Type le avisa al servidor que mandás JSON; sin él, el servidor no entiende el cuerpo.

* **Query strings** (filtros en la URL): new URLSearchParams(), con .append("clave", valor) y .toString(). Codifica los caracteres especiales automáticamente. Resultado: ?buscar=arg&continente=Am%C3%A9ricas.
* **La forma de la respuesta** es lo primero que se mira. Si viene { ciudades: [...] } se devuelve data.ciudades; si viene directo una lista, data. Equivocarse acá no da error: da undefined y no aparece nada.
* Si la API devuelve un error con cuerpo ({ error: "..." } y 401), apiFetch o la función de API lanza un error; quien llama lo atrapa y muestra un mensaje.

**async/await y try/catch/finally:**

* async marca una función que hace cosas lentas y devuelve una promesa; await espera el resultado.
* try { ... } catch (err) { ... } finally { ... }: el catch corre si algo falla; el finally corre **siempre** (éxito o error), ideal para apagar el loading.
* Promise.all([...]) espera varias promesas a la vez y devuelve un array con todos los resultados.

## **5.11 localStorage**

| **Función** | **Qué hace** |
| --- | --- |
| localStorage.setItem("clave", "texto") | Guarda |
| localStorage.getItem("clave") | Lee. Devuelve null si no existe |
| localStorage.removeItem("clave") | Borra una clave |
| localStorage.clear() | Borra todo |

* Solo guarda **texto**. Para listas y objetos: JSON.stringify(...) al guardar y JSON.parse(...) al leer. Truco: \*stringify = convertir a string; parse = interpretar ese string\*.
* Persiste aunque cierres el navegador. sessionStorage es igual pero se borra al cerrar la pestaña.
* Patrón con el Context: **leer al iniciar** (función en useState) y **guardar en un useEffect([estado])** (listas), o directo dentro de las funciones login y logout (usuario).
* Se inspecciona en F12, pestaña **Application**, Local Storage.
* Usá siempre **la misma clave** para leer y escribir; si difiere, nunca encuentra lo guardado. Respetá las claves que pide el vanilla o el esqueleto.

## **5.12 Debounce (búsqueda con retardo)**

**Problema:** si por cada tecla se pide al servidor, se hacen muchos pedidos inútiles. **Solución:** esperar a que la persona deje de escribir un momento.

**Cómo funciona:** cada vez que cambia el texto, un efecto arranca un temporizador (setTimeout, unos 400 ms). Si el texto cambia antes de que termine, la **limpieza** del efecto cancela el temporizador anterior (clearTimeout) y arranca uno nuevo. Solo cuando pasan 400 ms sin cambios, el temporizador llega a ejecutarse y dispara el pedido.

useEffect(() => {

const timer = setTimeout(() => { onFilterChange({ buscar, continente, idioma }); }, 400);

return () => clearTimeout(timer);

}, [buscar, continente, idioma]);

Es el uso típico del return de limpieza de useEffect.

## **5.13 JavaScript que se usa todo el tiempo**

* **Destructuring:** sacar campos de un objeto: const { id, nombre } = game;, o del parámetro: function Card({ game }). De un array: const [a, b] = lista;.
* **Spread:** copiar y extender: [...lista, nuevo], { ...obj, campo: 1 }.
* **Template literals** (con acento grave): ${API\_BASE}/ciudades/${id} (escrito entre acentos graves). Se usan para armar URLs y textos con variables. Con comillas comunes no interpolan.
* **Optional chaining ?.:** pais.capital?.[0] no rompe si capital no existe (devuelve undefined).
* **|| y ??:** valor || "N/A" usa "N/A" si el valor es falso (incluye 0 y texto vacío); valor ?? "N/A" solo si es null o undefined.
* **Ternario:** cond ? a : b.
* **Métodos de array:**

| **Método** | **Qué hace** | **Ejemplo típico** |
| --- | --- | --- |
| map | Transforma cada elemento, devuelve array nuevo | Dibujar listas en JSX |
| filter | Deja los que cumplen la condición | Quitar un elemento por id |
| find | Devuelve el primero que cumple (o undefined) | Buscar por id |
| some | true si **algún** elemento cumple | Evitar duplicados en el historial |
| includes | true si contiene un valor | Buscar texto en un nombre |
| reduce | Acumula en un solo valor | Agrupar una lista por campo |
| slice(0, n) | Copia los primeros n | Límite de 15 recientes |
| sort | Ordena (modifica el array: copiá antes) | Ordenar nombres o fechas |
| length | Cantidad | Chequear si la lista está vacía |

* **Object.entries / keys / values:** Object.entries(obj) da pares [clave, valor]; Object.keys(obj) las claves; Object.values(obj) los valores. Sirven para recorrer objetos agrupados ({ PC: [...], Xbox: [...] }) o mostrar idiomas.
* **Conversión:** Number("3"), parseInt("3"), String(3). Los ids de la URL son texto, los de los datos suelen ser número.
* **Fechas y números:** new Date().toLocaleString() para la fecha actual; numero.toLocaleString() para separar miles.
* **Acceso a propiedades con tilde o espacio:** pais.nombre.común funciona con punto; si hay espacio, pais.nombre["nombre nativo"] va con corchetes.

## **5.14 Módulos: import y export**

* **Export por defecto:** export default Home; se importa **sin llaves** y con cualquier nombre: import Home from "./Home".
* **Export con nombre:** export function HomePage() {} se importa **con llaves y el nombre exacto**: import { HomePage } from "./HomePage.jsx".
* Cada archivo usa uno de los dos estilos y los imports tienen que coincidir. Familia A suele usar export default; familia B, export function.
* Si el import no coincide con el export (nombre distinto, llaves de más o de menos), la app no arranca y la consola lo dice: "does not provide an export named...".

## **5.15 Estructura y comandos de un proyecto Vite**

* index.html tiene un <div id="root">; main.jsx lo toma con ReactDOM.createRoot(...).render(<App />). Todo lo que no esté dentro de App no se ve.
* npm install: instala las dependencias (una vez por carpeta). npm run dev: levanta el servidor de desarrollo con recarga automática. npm run build: compila para producción y delata errores de sintaxis.
* node\_modules es la carpeta de dependencias: pesa mucho y **nunca se sube a Git**.

# **Parte 6. Tabla maestra: qué uso y dónde**

| **Si necesito...** | **Uso...** | **Típicamente en...** |
| --- | --- | --- |
| Pedir datos al abrir una pantalla | 3 useState + useEffect(..., []) + try/catch/finally | Catálogo (Home, HomePage) o en un hook |
| Pedir datos que dependen de la URL | useParams + useEffect(..., [id]) | Página de detalle |
| Volver a pedir cuando cambian filtros | useEffect(..., [filtros]) | Home de Países y Recetas |
| Pedir con filtros en la URL | URLSearchParams | services/api.js |
| Enviar datos al servidor | fetch con method, headers, body | LoginForm |
| Lo que escribe o elige el usuario | useState + value + onChange | Selects, inputs, filtros, login |
| Ir a otra pantalla tras una acción | useNavigate | Submit del select, clic en una tarjeta div |
| Un enlace visible | Link | Menú, tarjetas, historial, 404 |
| Leer el id de la URL | useParams | Detalle |
| Dato compartido entre pantallas | Context + Provider + hook | Historial, recientes, usuario |
| Que sobreviva a recargar | localStorage (leer al iniciar, guardar al cambiar) | Dentro del Provider |
| Mostrar una lista | .map() con key | Catálogo, historial, opciones de un select |
| Mostrar algo solo a veces | && o ternario o return temprano | Aviso, bloque opcional, loading, error |
| Evitar elementos repetidos | some o filter | agregar del Context |
| Limitar la cantidad | slice(0, n) | agregar del historial (Países: 15) |
| Agrupar una lista por campo | reduce + Object.entries | Gym y TrailerFlix |
| Pedir varios elementos a la vez | Promise.all + map | Recientes de Países |
| Retrasar una búsqueda | setTimeout + limpieza en useEffect | Componente de filtros |
| Reutilizar lógica de datos | Custom hook | useGames y similares |
| Cambiar la cabecera según el usuario | Ternario con user | Layout |
| Página para URLs inexistentes | Route path="\*" | App.jsx |
| Mensaje para el usuario si falla | Estado error + componente de error | Toda página con datos |

# **Parte 7. Recetas con código listas para adaptar**

Cada receta es una plantilla genérica. Se adapta cambiando nombres (el recurso, los campos, las rutas) y mirando la forma real de la respuesta del servidor. La idea es que **las entiendas**, no que las copies a ciegas: al lado de cada una explico qué hace cada parte.

## **Receta A. Capa de API**

**Familia A (una función por endpoint)**, con try/catch y la forma de la respuesta:

const API\_BASE = "http://localhost:3000/api";

export async function getItems(filtros = {}) {

try {

const params = new URLSearchParams();

if (filtros.buscar) params.append("buscar", filtros.buscar);

if (filtros.categoria) params.append("categoria", filtros.categoria);

const response = await fetch(`${API\_BASE}/items?${params.toString()}`);

if (!response.ok) throw new Error("No se pudieron obtener los items");

const data = await response.json();

return data.items; // según la forma de la respuesta

} catch (error) {

console.error("Error al cargar items:", error);

throw error; // la página lo atrapa y muestra el error

}

}

export async function getItem(id) {

try {

const response = await fetch(`${API\_BASE}/items/${id}`);

if (!response.ok) throw new Error("No se pudo obtener el item");

return await response.json(); // o data.item si viene envuelto

} catch (error) {

console.error("Error al cargar item:", error);

throw error;

}

}

* Los filtros sin valor no se agregan a la URL.
* throw error en el catch es lo que permite que la página muestre el error.

**Familia B (un helper genérico apiFetch):**

export const API\_BASE\_URL = "http://localhost:3000/api";

export async function apiFetch(path, options = {}) {

const response = await fetch(`${API\_BASE\_URL}${path}`, options);

if (!response.ok) {

throw new Error(`Error ${response.status}`);

}

return await response.json();

}

* No tiene try/catch: el error sube y lo atrapa quien la llama (el hook o el formulario).
* options es el segundo parámetro de fetch (método, headers, body); en un GET no se pasa.

## **Receta B. Cargar datos al montar (catálogo)**

import { useState, useEffect } from "react";

import Loading from "../components/Loading";

import ErrorMessage from "../components/ErrorMessage";

import { getItems } from "../services/api";

function Catalogo() {

const [items, setItems] = useState([]);

const [loading, setLoading] = useState(true);

const [error, setError] = useState(null);

useEffect(() => {

async function cargar() {

try {

const data = await getItems();

setItems(data);

} catch (err) {

setError("No se pudieron cargar los datos");

} finally {

setLoading(false);

}

}

cargar();

}, []);

if (loading) return <Loading />;

if (error) return <ErrorMessage message={error} />;

if (items.length === 0) return <p>No hay resultados</p>;

return (

<div>

{items.map((item) => (

<Tarjeta key={item.id} item={item} />

))}

</div>

);

}

export default Catalogo;

* loading empieza en true: es lo primero que se ve.
* finally apaga el loading tanto si salió bien como si falló.
* En la familia B, error suele guardarse como **objeto Error** (setError(err)) porque la página muestra error.message. Mirá cómo lo usa el esqueleto.

## **Receta C. Hook de datos (custom hook)**

import { useEffect, useState } from "react";

import { apiFetch } from "../api/client.js";

export function useItems() {

const [data, setData] = useState(null);

const [loading, setLoading] = useState(true);

const [error, setError] = useState(null);

useEffect(() => {

async function cargar() {

try {

const resultado = await apiFetch("/items");

setData(resultado);

} catch (err) {

setError(err);

} finally {

setLoading(false);

}

}

cargar();

}, []);

return { data, loading, error };

}

La página queda limpia: const { data, loading, error } = useItems();. Atención: en los esqueletos de la familia B, loading viene en false y hay que ponerlo en true.

## **Receta D. Detalle por id**

import { useParams, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

function Detalle() {

const { id } = useParams();

const navigate = useNavigate();

const [item, setItem] = useState(null);

const [loading, setLoading] = useState(true);

const [error, setError] = useState(null);

useEffect(() => {

async function cargar() {

try {

setLoading(true);

setError(null);

const data = await getItem(id);

setItem(data);

} catch (err) {

setError("No se pudo cargar el elemento");

} finally {

setLoading(false);

}

}

cargar();

}, [id]);

if (loading) return <Loading />;

if (error) return <ErrorMessage message={error} />;

if (!item) return <p>No encontrado</p>;

return (

<div>

<h2>{item.nombre}</h2>

<button onClick={() => navigate("/")}>Volver</button>

</div>

);

}

* Dependencia [id]: si cambia el id de la URL, vuelve a pedir.
* setLoading(true) al empezar sirve cuando se navega de un detalle a otro dentro de la misma página.
* Si necesitás comparar el id con un número de los datos: Number(id).

## **Receta E. Select controlado que navega**

const navigate = useNavigate();

const [seleccion, setSeleccion] = useState("");

const handleSubmit = (e) => {

e.preventDefault();

if (!seleccion) return;

navigate(`/detalle/${seleccion}`);

};

<form onSubmit={handleSubmit}>

<select value={seleccion} onChange={(e) => setSeleccion(e.target.value)}>

<option value="">Seleccione una opción</option>

{items.map((it, index) => (

<option key={index} value={it.id}>{it.nombre}</option>

))}

</select>

<button type="submit">Consultar</button>

</form>

* Estos useState y el handleSubmit van **antes** de los if (loading).
* La ruta del navigate tiene que coincidir con la de App.jsx: una barra / y el parámetro; un carácter de más o de menos lleva al 404.

## **Receta F. Context de historial o recientes**

import { createContext, useState, useEffect } from "react";

export const HistorialContext = createContext();

const CLAVE = "historial";

const LIMITE = 15;

export function HistorialProvider({ children }) {

const [historial, setHistorial] = useState(() => {

const guardado = localStorage.getItem(CLAVE);

return guardado ? JSON.parse(guardado) : [];

});

useEffect(() => {

localStorage.setItem(CLAVE, JSON.stringify(historial));

}, [historial]);

const agregar = (id) => {

setHistorial((prev) => {

const sinRepetido = prev.filter((x) => x !== id);

return [id, ...sinRepetido].slice(0, LIMITE);

});

};

const limpiar = () => {

setHistorial([]);

};

return (

<HistorialContext.Provider value={{ historial, agregar, limpiar }}>

{children}

</HistorialContext.Provider>

);

}

Hook para usarlo:

import { useContext } from "react";

import { HistorialContext } from "../context/HistorialContext";

export function useHistorial() {

const context = useContext(HistorialContext);

if (!context) {

throw new Error("useHistorial debe usarse dentro de HistorialProvider");

}

return context;

}

**Dos variantes de agregar:**

* **Clima (guarda objetos, no repite):** si ya existe, no hace nada.

const agregarConsulta = (id, nombre) => {

setHistorial((prev) => {

if (prev.some((c) => c.id === id)) return prev;

return [...prev, { id, ciudad: nombre, fecha: new Date().toLocaleString() }];

});

};

* **Países (guarda códigos, el más reciente primero, máximo 15):** quita el repetido, lo pone al principio y corta en 15 (receta de arriba).

Cómo se usa: la pantalla de detalle llama a agregar cuando ya cargó el elemento (dentro de cargar, después del set). Guardá el identificador **que vino del servidor** (pais.cca3) y no el de la URL, para que no se dupliquen entradas por mayúsculas y minúsculas.

## **Receta G. Context de login**

import { createContext, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {

const [user, setUser] = useState(() => {

const fullName = localStorage.getItem("usuario");

const rol = localStorage.getItem("rol");

return fullName ? { fullName, rol } : null;

});

const login = (userData) => {

setUser(userData);

localStorage.setItem("usuario", userData.fullName);

localStorage.setItem("rol", userData.rol);

};

const logout = () => {

setUser(null);

localStorage.removeItem("usuario");

localStorage.removeItem("rol");

};

return (

<AuthContext.Provider value={{ user, login, logout }}>

{children}

</AuthContext.Provider>

);

}

* Mismas claves de localStorage que el vanilla (en estos modelos, usuario y rol).
* **Atención al setUser(userData):** sin comillas. Con comillas guarda el texto "userData".

## **Receta H. Formulario de login con POST**

const handleSubmit = async (event) => {

event.preventDefault();

setError(null);

setLoading(true);

try {

const usuario = await apiFetch("/login", {

method: "POST",

headers: { "Content-Type": "application/json" },

body: JSON.stringify({ username, password }),

});

login({

fullName: `${usuario.firstName} ${usuario.lastName}`,

rol: usuario.rol,

});

} catch (err) {

setError(new Error("Usuario o contraseña incorrectos"));

} finally {

setLoading(false);

}

};

* Los **nombres de los campos** que devuelve el servidor (firstName, lastName, rol) se confirman mirando la respuesta o el archivo de usuarios.
* El esqueleto muestra error.message, así que error tiene que ser un **objeto Error**, no un texto.
* Se arma el nombre completo acá porque el Context espera { fullName, rol }.

## **Receta I. Filtros con debounce (Países y Recetas)**

El componente de filtros:

function Filtros({ onFilterChange }) {

const [buscar, setBuscar] = useState("");

const [continente, setContinente] = useState("");

const [idioma, setIdioma] = useState("");

const [continentes, setContinentes] = useState([]);

const [idiomas, setIdiomas] = useState([]);

useEffect(() => {

getContinentes().then(setContinentes).catch(() => setContinentes([]));

getIdiomas().then(setIdiomas).catch(() => setIdiomas([]));

}, []);

useEffect(() => {

const timer = setTimeout(() => {

onFilterChange({ buscar, continente, idioma });

}, 400);

return () => clearTimeout(timer);

}, [buscar, continente, idioma]);

return (

<div className="filters">

<input value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Buscar..." />

<select value={continente} onChange={(e) => setContinente(e.target.value)}>

<option value="">Todos los continentes</option>

{continentes.map((c) => (<option key={c} value={c}>{c}</option>))}

</select>

</div>

);

}

La página que lo usa:

function Home() {

const [paises, setPaises] = useState([]);

const [filtros, setFiltros] = useState({});

const [loading, setLoading] = useState(true);

const [error, setError] = useState(null);

useEffect(() => {

async function cargar() {

try {

setLoading(true);

setError(null);

const data = await getPaises(filtros);

setPaises(data);

} catch (err) {

setError("No se pudieron cargar los países");

} finally {

setLoading(false);

}

}

cargar();

}, [filtros]);

return (

<div className="home">

<div className="container">

<Filtros onFilterChange={setFiltros} />

{loading && <Loading />}

{error && <ErrorMessage message={error} />}

{!loading && !error && paises.length === 0 && <p>No se encontraron países</p>}

{!loading && !error && paises.map((p) => <PaisCard key={p.cca3} pais={p} />)}

</div>

</div>

);

}

* **Filtros siempre visible:** el loading se muestra solo en la zona de resultados (con &&), no con un return temprano. Si reemplazás toda la página, el input se desmonta y pierde el foco en cada tecla.
* Al montar, el debounce dispara una vez con los valores vacíos, y la página hace un segundo pedido: es normal.
* PaisCard es un div con onClick que hace navigate("/pais/" + pais.cca3), porque el esqueleto lo plantea así.

## **Receta J. Agrupar una lista plana por campo (Gym y TrailerFlix)**

const porCategoria = items.reduce((acc, item) => {

const clave = item.categoria;

if (!acc[clave]) acc[clave] = [];

acc[clave].push(item);

return acc;

}, {});

Resultado: { Fuerza: [...], Cardio: [...] }. Para dibujarlo:

{Object.entries(porCategoria).map(([categoria, lista]) => (

<section key={categoria}>

<h2>{categoria}</h2>

<div className="games-grid">

{lista.map((item) => (<Tarjeta key={item.id} item={item} />))}

</div>

</section>

))}

* reduce recorre la lista y va armando un objeto con una clave por categoría.
* Si el vanilla ordena las secciones alfabéticamente, ordená las claves: Object.keys(porCategoria).sort().
* Las secciones sin elementos no se dibujan (el agrupado solo crea claves que existen).
* Cuando el servidor **ya manda agrupado** (GameHub), se recorre una lista fija de claves y se omiten las vacías.

## **Receta K. Recientes que pide cada elemento (Países)**

El Context guarda solo códigos; para dibujar tarjetas hay que pedir cada país.

useEffect(() => {

async function cargar() {

try {

setLoading(true);

setError(null);

const lista = await Promise.all(historial.map((cca3) => getPais(cca3)));

setPaises(lista);

} catch (err) {

setError("No se pudieron cargar los países recientes");

} finally {

setLoading(false);

}

}

cargar();

}, [historial]);

* historial.map(...) crea una lista de promesas (un pedido por código) y Promise.all las espera todas.
* Si el historial está vacío, devuelve []: mostrá "Todavía no visitaste países".
* Incluí un botón que llame a limpiarRecientes.

## **Receta L. Layout con login**

export function Layout({ children }) {

const { user, logout } = useAuth();

const navigate = useNavigate();

const handleLogout = () => {

logout();

navigate("/");

};

return (

<div className="app-shell">

<header>

<nav>

<Link to="/">Inicio</Link>

{user ? (

<>

<span>Bienvenido, {user.fullName} - {user.rol}</span>

<button onClick={handleLogout}>Cerrar sesión</button>

</>

) : (

<LoginForm />

)}

</nav>

</header>

<main>{children}</main>

<footer>...</footer>

</div>

);

}

Los **textos** (marca, pie, botones) salen del index.html del vanilla.

## **Receta M. main.jsx y App.jsx**

main.jsx (los envoltorios):

ReactDOM.createRoot(document.getElementById("root")).render(

<React.StrictMode>

<BrowserRouter>

<MiProvider>

<App />

</MiProvider>

</BrowserRouter>

</React.StrictMode>,

);

App.jsx familia B (el Layout envuelve las rutas):

export default function App() {

return (

<Layout>

<Routes>

<Route path="/" element={<HomePage />} />

<Route path="/eventos/:id" element={<EventoDetailPage />} />

<Route path="\*" element={<NotFoundPage />} />

</Routes>

</Layout>

);

}

App.jsx familia A (cabecera y rutas, con /recientes):

function App() {

return (

<>

<Header />

<Routes>

<Route path="/" element={<Home />} />

<Route path="/pais/:cca3" element={<PaisDetail />} />

<Route path="/recientes" element={<Recientes />} />

<Route path="\*" element={<NotFound />} />

</Routes>

</>

);

}

* El Provider va por fuera de App para que Layout o Header y las páginas puedan usarlo.
* La ruta \* va **al final**.
* Los path tienen que coincidir con los navigate y Link del resto del proyecto.

## **Receta N. Página 404**

export function NotFoundPage() {

return (

<section className="status">

<h2>404 - Página no encontrada</h2>

<Link to="/">Volver al inicio</Link>

</section>

);

}

## **Receta O. Renderizado de datos de distinto tipo (detalle completo)**

| **Tipo de dato** | **Ejemplo** | **Cómo se dibuja** |
| --- | --- | --- |
| Valor simple | game.nombre | {game.nombre} |
| Objeto anidado | requisitos\_sistema | {game.requisitos\_sistema.memoria} |
| Lista de textos | modos\_juego | .map() con <li key={modo}> |
| Lista de objetos | dlcs\_incluidos | .map() y se usa cada campo del objeto |
| Lista opcional | invitados (puede estar vacía) | Ternario: si hay elementos, lista; si no, texto alternativo |
| Bloque condicional | tickets\_disponibles < 500 | {cond && (<div>...</div>)} |
| Lista de un campo array | capital (array) | pais.capital?.join(", ") |
| Objeto de valores | idiomas ({ eng: "Inglés" }) | Object.values(pais.idiomas).join(", ") |

# **Parte 8. Las dos familias, archivo por archivo**

## **8.1 Familia A (Recientes): qué hace cada archivo**

| **Archivo** | **Qué hace** | **Qué cambia entre modelos** |
| --- | --- | --- |
| main.jsx | Monta la app; a veces trae el router y el Provider | El nombre del Provider |
| App.jsx | Rutas: /, detalle, /recientes, \* | Los paths y los nombres de las páginas |
| services/api.js | Funciones que piden datos al servidor | Endpoints, filtros y la propiedad de la respuesta |
| context/...Context.jsx | Guarda el historial y lo persiste | La clave de localStorage, qué se guarda (objeto o código), límite |
| hooks/use...js | useContext con error si falta el Provider | El nombre |
| components/Header.jsx | Marca y navegación | Los textos |
| components/Loading.jsx | Indicador de carga | Casi nada |
| components/ErrorMessage.jsx | Muestra la prop message | Nada |
| pages/Home.jsx | Catálogo con select o filtros y, a veces, historial | Campos, filtros |
| pages/...Detail.jsx | Detalle por id y registro en el historial | Campos |
| pages/Recientes.jsx | Lista el historial | Si pide cada elemento a la API o no |
| pages/NotFound.jsx | Mensaje 404 | Los textos |

## **8.2 Familia B (Login): qué hace cada archivo**

| **Archivo** | **Qué hace** | **Qué cambia entre modelos** |
| --- | --- | --- |
| main.jsx | Monta BrowserRouter, AuthProvider y App | Nada |
| App.jsx | Layout y las 3 rutas | Path del detalle y nombres de páginas |
| api/client.js | apiFetch: helper genérico para GET y POST | Nada |
| hooks/useGames.js | Carga el catálogo | El endpoint |
| hooks/useAuth.js | useContext del login | Nada |
| context/AuthContext.jsx | Guarda al usuario y lo persiste | Nada (claves usuario y rol) |
| components/LoginForm.jsx | Formulario con el POST a /login | Nombres de campos de la respuesta |
| components/Layout.jsx | Cabecera con saludo o login, pie | Los textos |
| components/...Card.jsx | Tarjeta de un elemento | Campos y clases usadas |
| pages/HomePage.jsx | Catálogo (agrupado o plano) | Cómo se dibuja la lista |
| pages/...DetailPage.jsx | Detalle | Campos, cantidad de pedidos, nombre del export |
| pages/NotFoundPage.jsx | 404 | Nada (a veces hay que crearlo) |

# **Parte 9. Notas y trampas de cada modelo**

## **Clima (familia A)**

* Servidor: /api/ciudades devuelve { ciudades: [...] }; /api/ciudades/:id devuelve la ciudad directa (404 con { error }).
* Campos: nombre, temperatura, humedad, condicion.
* Rutas, Header, Loading, NotFound y el hook del historial vienen hechos; hay que completar api.js, Home, el detalle, el Context, Recientes y ErrorMessage.
* **Ids repetidos en los datos:** Lima y Ciudad de México comparten el id 3, y Lima aparece dos veces. Con ese value, elegir Ciudad de México lleva a Lima. Para la key del select usá el índice.
* El historial guarda { id, ciudad, fecha } y no repite por id.
* Recientes importa Loading y ErrorMessage pero no los necesita (el historial sale del Context, sin pedir nada).

## **Países (familia A, con filtros)**

* Esqueleto casi vacío: faltan main.jsx (router y Provider), App.jsx, Header, Home, Filtros, PaisCard, PaisDetail, NotFound, el Context y api.js.
* Endpoints: /api/paises (acepta buscar, continente e idioma), /api/paises/:cca3, /api/continentes y /api/idiomas. Cada uno con su propia clave en la respuesta (paises, pais, continentes, idiomas).
* El identificador es el código **cca3** (texto, ej. ARG); el servidor lo compara sin importar mayúsculas.
* Datos con tildes y estructuras raras: nombre.común, región, población; capital es un array; idiomas y monedas son objetos; banderas.png es la imagen.
* El Context guarda **solo cca3**, máximo **15**, el más reciente primero. Recientes pide cada país con getPais (receta K).
* Debounce en la búsqueda de texto; mensaje cuando la búsqueda no da resultados (la rúbrica lo pide).
* Usa export default en todos los archivos.

## **Recetas (familia A mixta)**

* La rúbrica y el servidor piden: filtros por categoría, área y búsqueda, y recientes. **No hay /login** en el servidor.
* El esqueleto trae archivos de la familia B (AuthContext, LoginForm, tarjetas de GameHub): son sobras de plantilla. Confirmá con el docente si hay dudas.
* Endpoints: /api/recetas (con filtros), /api/recetas/:id, /api/categorias, /api/areas, /api/recetas/categoria/:categoria y /api/recetas/area/:area. La lista viene como { success, total, recetas }.
* El export del detalle (RecetaDetailPage.jsx) sigue llamándose GameDetailPage: renombrarlo.

## **GameHub (familia B)**

* /api/videojuegos ya viene **agrupado por plataforma** ({ PC: [...], PlayStation: [...], ... }): se recorre una lista fija de plataformas y se omiten las vacías.
* Ids únicos (1 a 12).
* El detalle hace **dos pedidos**: el juego (/api/videojuegos/:id) y la lista completa, para descubrir su plataforma. Se recorre con Object.entries y se compara con Number(id).
* Datos anidados: requisitos\_sistema (objeto), modos\_juego y caracteristicas (listas de texto), dlcs\_incluidos (lista de objetos).
* Login: /api/login con username y password; devuelve firstName, lastName y rol. Los usuarios están en data/usuarios.json.

## **Eventos (familia B)**

* /api/eventos devuelve una **lista plana** y el vanilla la muestra en una **grilla plana** (no se agrupa por género). PLATFORMS del esqueleto es una sobra.
* Detalle: **un solo pedido** (no hay plataforma que descubrir).
* Tarjeta: si tickets\_disponibles < 500 muestra el aviso "Solo X restantes".
* Detalle: si invitados está vacío, mostrar "Sin invitados confirmados" (hay un evento así).
* Login con vipuser / vipuser123 o admin / adminpassword.
* El detalle exporta GameDetailPage pero App.jsx importa EventoDetailPage: renombrarlo.
* Las imágenes se sirven desde el servidor: se ven solo si está corriendo.

## **Gym (familia B)**

* /api/clases devuelve una lista plana; la rúbrica pide el catálogo **agrupado por categoria** (receta J).
* Campos: nombre, instructor, imagen, resumen, duracion, nivel, categoria, calorias\_quemadas, birra\_incluida (objeto con nombre, tipo, graduacion, origen).
* Los administradores están en data/administradores.json (robertoc / robertocpass).
* Ruta del detalle: /clases/:id. El export del detalle (ClaseDetailPage.jsx) hay que renombrarlo.

## **TrailerFlix (familia B)**

* /api/contenido devuelve una lista plana; el vanilla la muestra **agrupada por género** (campo categoria) (receta J).
* El **login responde distinto** (revisá el servidor: devuelve ok y username, sin nombre ni apellido), así que el Layout y el login(...) hay que adaptarlos a lo que realmente llega.
* El export del detalle (PeliculaDetailPage.jsx) hay que renombrarlo.

## **Trampas que se repiten en todos los esqueletos**

1. **El export del detalle no coincide con el import de App.jsx** (se llama GameDetailPage en todos). La app no arranca hasta renombrarlo.

2. **loading arranca en false** en algunos hooks y páginas de detalle: se ve un instante "Sin datos".

3. **Falta envolver con BrowserRouter y el Provider** (familia B y Países).

4. **Sobras de plantilla:** PLATFORMS, textos de "GameHub" o "videojuegos".

5. **Las clases CSS** hay que tomarlas de react/src/index.css.

# **Parte 10. Errores comunes: síntoma, causa y solución**

## **10.1 Cómo diagnosticar**

* **F12, pestaña Console:** muestra los errores. El primer renglón dice qué falla y el archivo y la línea.
* **F12, pestaña Network:** muestra cada pedido: la URL, el estado (200, 404...) y la respuesta. Sirve para ver si el pedido salió y qué devolvió el servidor.
* **F12, pestaña Application:** muestra el contenido de localStorage.
* **console.log(variable)** justo antes del lugar donde falla.
* **npm run build** en react/ delata errores de sintaxis e imports rotos sin abrir el navegador.

## **10.2 Tabla de errores**

| **Síntoma** | **Causa más común** | **Solución** |
| --- | --- | --- |
| Pantalla en blanco | Error al dibujar | Mirar la Console: el primer renglón dice cuál |
| x is not defined | Nombre mal escrito (img en vez de imagen, ciudadesId en vez de ciudadId) o variable no declarada | Comparar el nombre con el de la declaración |
| Cannot read properties of null (reading 'x') | Usás un dato antes de que cargue (el estado es null) | Poner los if de loading, error y !item antes del return con datos |
| x.map is not a function | x no es un array (es un objeto envuelto o null) | Mirar la forma de la respuesta y devolver la propiedad correcta (data.ciudades) |
| No aparece nada y no hay error | Propiedad equivocada de la respuesta (undefined) o lista vacía | Probar la URL en el navegador y revisar el nombre |
| El catálogo muestra "Error 404" | Endpoint mal escrito o de otro modelo | Revisar la ruta del fetch (/videojuegos vs /eventos) |
| El catálogo muestra "Failed to fetch" | El servidor está apagado | Levantar server con npm run dev |
| Pedidos infinitos | useEffect sin array, o un objeto o función en las dependencias, o un set de algo que está en las dependencias | Corregir las dependencias |
| Each child in a list should have a unique key | key repetida (ids duplicados) o ausente | key={index} o un campo único |
| Al navegar aparece el 404 | Ruta mal escrita en navigate o Link (/clima( en vez de /clima/) | Igualar con el path de App.jsx |
| La app no arranca: does not provide an export named X | Import y export no coinciden (llaves, nombre) | Igualarlos (renombrar el export) |
| useAuth debe usarse dentro de un AuthProvider | Falta envolver con el Provider | Envolver App en main.jsx |
| Objects are not valid as a React child | Dibujás un objeto ({error} en vez de {error.message}, o {pais.nombre} que es un objeto) | Mostrar un campo de texto |
| Las imágenes no cargan | El servidor está apagado (las sirve él) o la URL está mal | Levantar el servidor y revisar la ruta |
| El input pierde el foco al escribir | El componente se desmonta (el loading reemplaza la página entera, o definís un componente dentro de otro) | Mostrar el loading solo en la zona de resultados |
| El historial se duplica | StrictMode ejecuta los efectos dos veces | Evitar duplicados en agregar |
| El estado no se actualiza | Mutaste (push, lista[0] = ...) o leíste el valor viejo justo después del set | Crear un array o un objeto nuevo; usar prev => |
| La sesión no persiste | No guardaste en localStorage o usaste otra clave | Misma clave al leer y escribir |
| El login siempre falla | Content-Type ausente, campos con otro nombre o credenciales mal | Revisar headers, body y el archivo de usuarios |
| Muestra "undefined" en el saludo | setUser("userData") con comillas, o campos con nombre equivocado | setUser(userData) y revisar firstName y lastName |
| npm error ENOENT package.json | Estás en la carpeta equivocada | Entrar a react/ o a server/ |
| Una clase CSS no tiene estilos | Usaste una clase que no está en react/src/index.css | Usar las clases de ese archivo |
| El detalle muestra el error aunque el elemento existe | Lógica sobrante (otro fetch o Object.entries sobre un array) | Dejar solo el pedido que corresponde |

# **Parte 11. Pruebas finales, Git y entrega**

## **11.1 Pruebas finales (checklist)**

1. La app arranca sin errores en la consola.

2. Catálogo: se ven los datos con todos sus campos y las imágenes.

3. Detalle: abre cada elemento y muestra todos los datos (probá 2 o 3).

4. Detalle con un id inexistente (/algo/999): muestra el error, no una pantalla en blanco.

5. Ruta inexistente (/loquesea): muestra el 404 con el link de vuelta.

6. Servidor apagado: el catálogo muestra un error legible.

7. Si hay login: credenciales incorrectas muestran un mensaje; las correctas cambian la cabecera; recargar (F5) mantiene la sesión; cerrar sesión vuelve al formulario y borra usuario y rol de localStorage.

8. Si hay historial: consultar varios elementos, recargar (sigue ahí), repetir uno (no se duplica), límite si existe, y botón de limpiar.

9. Si hay filtros: cada filtro cambia el resultado, la búsqueda espera (debounce) y una búsqueda sin resultados muestra el mensaje.

10. npm run build en react/ compila sin errores.

## **11.2 Limpieza antes de entregar**

* Borrar comentarios de práctica y los bloques TODO resueltos.
* Cambiar los textos de plantilla (marca, pie, títulos) por los del vanilla.
* Formatear cada archivo (clic derecho, Format Document).
* Revisar que no queden imports sin usar ni console.log de depuración.

## **11.3 Comandos para correr el proyecto**

# Terminal 1: servidor (puerto 3000)

cd server

npm install # solo la primera vez

npm run dev

# Terminal 2: app React (puerto 5173)

cd react

npm install # solo la primera vez

npm run dev

# Para detectar errores sin abrir el navegador

npm run build # dentro de react/

Para frenar un servidor: Ctrl + C en su terminal. Para subir una carpeta, escribí cd .. (con dos puntos). En la consola del navegador, localStorage.clear() borra la sesión guardada.

## **11.4 Subir el proyecto a GitHub**

Creá el repositorio vacío en GitHub (sin README) y, **parado en la raíz del proyecto** (donde están react/ y server/):

echo "node\_modules" > .gitignore

rm -rf react/.git server/.git

git init

git add .

git status

git commit -m "Modelo React resuelto"

git branch -M main

git remote add origin https://github.com/USUARIO/NOMBRE-DEL-REPO.git

git push -u origin main

* .gitignore con node\_modules evita subir la carpeta de dependencias.
* rm -rf react/.git elimina el repositorio anidado que traen los zips (si existe, sin eso git add falla con "does not have a commit checked out").
* Antes del commit, git status no debe mostrar ninguna línea con node\_modules.

Cambios futuros:

git add .

git commit -m "describí qué cambiaste"

git push

| **Error de Git** | **Solución** |
| --- | --- |
| remote origin already exists | git remote set-url origin URL\_DEL\_REPO |
| push rechazado ("fetch first" o "unrelated histories") | git pull origin main --allow-unrelated-histories y luego git push -u origin main |
| Se subió node\_modules | git rm -r --cached react/node\_modules server/node\_modules, commit y push |
| Avisos de LF will be replaced by CRLF | Ignorarlos (normales en Windows) |

# **Parte 12. Reglas de oro y plan de práctica**

## **12.1 Diez reglas de oro**

1. **Mirá siempre la respuesta real del servidor** antes de escribir el código ({ o [, y el nombre de cada propiedad).

2. **Primero lo que otros usan, después lo que usa a los demás** (API y Context antes que las páginas).

3. **Terminá cada archivo completo** de una vez, y probá por bloques.

4. **El vanilla es la guía** para los textos, el orden y el comportamiento; el CSS de React está en react/src/index.css.

5. **Los hooks siempre arriba**, antes de cualquier if o return.

6. **Orden de las pantallas con datos:** loading, error, vacío, datos.

7. **No se muta el estado:** se crea uno nuevo ([...lista, x], { ...obj, campo }, prev =>).

8. **Revisá que coincidan** los nombres de variables, claves de localStorage, rutas, imports y exports.

9. **Un error "no definido" casi siempre es un typo.** Comparalo con el nombre declarado.

10. **Cuando el modelo es nuevo, buscá la receta que ya conocés** y cambiá solo lo que difiere: nombres, forma de la respuesta y trampas del esqueleto.

## **12.2 Cómo repartir el tiempo en un examen**

* **Primero (unos minutos):** README, rúbrica, vanilla, servidor y esqueleto. Identificá la familia y anotá las 5 preguntas.
* **Después:** ruteo y envoltorios para que algo se vea cuanto antes; luego API, catálogo, detalle y Context, probando cada bloque.
* **Último:** pruebas finales, limpieza y subida a Git.
* Priorizá según los puntos de la rúbrica: Context vale 25, y routing, API y páginas valen 20 cada uno. Ninguna parte debería quedar sin intentar.

## **12.3 Plan de práctica**

1. Resolvé **GameHub completo** (familia B) siguiendo el orden de una pasada, sin copiar.

2. Resolvé **Clima** (familia A) en un proyecto nuevo, con un dominio inventado (películas, libros).

3. Resolvé **Países**: es el más largo y suma debounce, filtros y recientes con Promise.all.

4. Con Eventos, Gym, TrailerFlix y Recetas, **identificá qué cambia respecto a lo que ya hiciste** y resolvelos con la tabla de trampas al lado.

5. Para cada uno, anotá **qué te trabó**. Eso es lo que hay que repasar.

6. Meta final: poder escribir cada receta de la Parte 7 sin mirarla.

# **Glosario**

| **Término** | **Qué significa** |
| --- | --- |
| SPA | Aplicación de una sola página: cambia lo que se ve sin recargar |
| Componente | Función con nombre en mayúscula que devuelve JSX |
| JSX | HTML dentro de JavaScript |
| Props | Datos que un componente recibe de su padre |
| children | Lo que va entre las etiquetas de apertura y cierre de un componente |
| Estado | Dato que React recuerda y que, al cambiar, vuelve a dibujar |
| Hook | Función use... que da estado o efectos a un componente |
| Render | Cada vez que React ejecuta un componente para dibujarlo |
| Efecto | Código que se ejecuta después de dibujar (pedir datos, guardar) |
| Dependencias | El array de useEffect que dice cuándo se vuelve a ejecutar |
| Controlado | Campo cuyo valor vive en el estado de React |
| Context | Estado compartido por muchos componentes sin pasar props |
| Provider | Componente que da el valor del Context a lo que lo rodea |
| Custom hook | Hook propio que reutiliza lógica |
| Montar y desmontar | Aparecer y desaparecer un componente de la pantalla |
| Prop drilling | Pasar un dato por muchos componentes intermedios |
| Debounce | Esperar a que el usuario deje de escribir antes de actuar |
| Query string | Parte de la URL después de ? (?buscar=arg) |
| Parámetro de ruta | Parte variable de la URL (:id) |
| Mock server | Servidor de práctica que simula una API |
| Vanilla | JavaScript sin librerías ni frameworks |
| Esqueleto | Proyecto base con archivos vacíos que hay que completar |
| StrictMode | Modo de desarrollo que ejecuta ciertos efectos dos veces para detectar errores |
| localStorage | Almacenamiento del navegador que persiste entre recargas |
| Inmutabilidad | No modificar un dato existente: crear uno nuevo |
