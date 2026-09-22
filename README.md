# ModerAI — Suite de Investigación de Usuarios

Suite de 6 interfaces web funcionales para capturar, estructurar y exportar la investigación de usuarios realizada en torno a **ModerAI**, una extensión de navegador que detecta y difumina en tiempo real spoilers, spam y contenido no deseado en el feed de redes sociales (Facebook, Instagram y X).

Proyecto para la unidad de **Ingeniería Centrada en el Humano — Investigación de Usuarios (1.1.1)**, carrera de Ingeniería en Software y Tecnologías Emergentes, UABC.

## Problema investigado

Cómo devolverle a distintos perfiles de usuario el control sobre lo que ven en su feed (spoilers, spam, temas específicos) sin tener que bloquear cuentas completas, desactivar redes sociales o configurar reglas técnicamente complejas.

## Métodos incluidos

La suite implementa un instrumento digital por cada método de investigación visto en clase:

1. **Entrevista a Expertos** — perfil, guion dinámico pregunta→respuesta, mapa de complejidad técnica, riesgos y citas clave.
2. **Usuarios Extremos** — clasificación súper-experto / inexperto / mainstream, tareas observadas, workarounds y necesidad extrema generalizable.
3. **Observación Directa / Needfinding ("El Iceberg")** — separación explícita entre necesidades obvias (superficie) y ocultas (profundidad), y entre dato crudo e interpretación.
4. **Empathy Map ("The Parser")** — cuadrícula 2×2 (Dice / Hace / Piensa / Siente) con asignación de fragmentos y generador de insights estructurados.
5. **Roper Dynagram** — segmentación por valores/estilos de vida, rueda de segmentos con recálculo automático de cuotas, y panel dinámico de requisito UX por segmento.
6. **Mapeo de Requerimientos (Dynagram interactivo)** — backlog de requisitos vinculado a insights/segmentos, con recálculo de prioridades relativas ("ley embebida") y trazabilidad insight → requisito → decisión de arquitectura.

Todas las interfaces comparten: CRUD completo, validación de campos, persistencia local en IndexedDB, y exportación a JSON y CSV.

## Stack técnico

- **React + Vite + TypeScript**
- **Tailwind CSS** para estilos
- **IndexedDB** (vía `idb`) para persistencia local, sin backend
- **Recharts** para la rueda de segmentos del Roper Dynagram
- Componentes compartidos: formulario dinámico con validación, tabla/lista CRUD, exportador JSON/CSV, modal de confirmación

## Estructura del proyecto

```
moderai-suite/
├── src/
│   ├── features/
│   │   ├── expertos/            # Interfaz 1 — Entrevista a Expertos
│   │   ├── usuarios-extremos/   # Interfaz 2 — Usuarios Extremos
│   │   ├── needfinding/         # Interfaz 3 — Observación Directa / Iceberg
│   │   ├── empathy-map/         # Interfaz 4 — Empathy Map
│   │   ├── roper-dynagram/      # Interfaz 5 — Roper Dynagram
│   │   └── requerimientos/      # Interfaz 6 — Mapeo de Requerimientos
│   ├── components/              # Componentes compartidos (CRUD, forms, export)
│   ├── lib/                     # Acceso a IndexedDB, helpers de export JSON/CSV
│   └── types/                   # Modelos de datos compartidos (TypeScript)
├── data/                        # Exports JSON/CSV de las entrevistas reales
├── docs/
│   └── Documento_Reflexion_ModerAI.docx
├── package.json
└── README.md
```

## Instalación y ejecución local

Requiere [Node.js](https://nodejs.org) (LTS) instalado.

```bash
# Instalar dependencias
npm install

# Levantar en modo desarrollo (hot-reload)
npm run dev

# Generar build de producción
npm run build

# Servir el build de producción
npm run preview
```

La app corre por defecto en `http://localhost:5173` (modo desarrollo) o `http://127.0.0.1:4173` (preview de producción).

## Datos de investigación

Los datos cargados en la suite provienen de trabajo de campo real:

- **1 entrevista a experto** del dominio (arquitectura de extensiones de navegador y sistemas NLP).
- **3 usuarios entrevistados/observados** cubriendo los perfiles súper-experto, inexperto y mainstream.
- **1 sesión de observación directa** (needfinding) de 35 minutos en entorno real de navegación.

Los exports de cada interfaz (JSON/CSV) se encuentran en `/data`. El análisis y las conclusiones de esta investigación están documentados en `docs/Documento_Reflexion_ModerAI.docx`.

## Decisiones de arquitectura

- **Sin backend**: toda la persistencia vive en IndexedDB del navegador, evitando infraestructura innecesaria para una herramienta de captura personal de datos de investigación.
- **Capa de datos compartida**: hooks y modelos TypeScript comunes a las 6 interfaces, para no duplicar lógica de CRUD, validación y exportación.
- **Interfaz 6 como nodo de integración**: el Mapeo de Requerimientos lee y enlaza datos generados en las interfaces de Needfinding, Empathy Map y Roper Dynagram, en lugar de operar como una vista aislada, para sostener la trazabilidad insight → requisito → decisión de arquitectura.
- **Recálculo reactivo ("ley embebida")**: los porcentajes de cuota (Roper) y de prioridad relativa (Mapeo de Requerimientos) se recalculan automáticamente ante cualquier alta, edición o baja de un registro relacionado.

## Autor

Grupo 952 — Ingeniería en Software y Tecnologías de Emergentes, UABC.
