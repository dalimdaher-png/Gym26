# Diario de Entrenamiento Oscuro

Aplicación web estática para seguir tu rutina de gimnasio y el objetivo semanal de running.

## Estructura del proyecto

- `index.html` - estructura de la app.
- `styles.css` - diseño oscuro, gótico y mobile first.
- `script.js` - lógica de rutinas, recomendaciones, localStorage y navegación.

## Cómo usarlo localmente

1. Abre `index.html` directamente en tu navegador.
2. Alternativamente, usa un servidor simple si prefieres:
   - Con Python 3:
     - `cd "c:\Users\daali\OneDrive\Desktop\Gym"`
     - `python -m http.server 8000`
     - Luego abre `http://localhost:8000`

## Funcionalidades incluidas

- Pantalla `Running`: un único objetivo de **21 km semanales** (semana de lunes a domingo, se reinicia cada lunes). Registro libre de km por día, con acumulado, restantes, % de cumplimiento, barra de progreso e historial de km por semana. Si superás los 21 km se sigue acumulando la distancia real. Sin días obligatorios, distancias fijas ni objetivos de ritmo. Conserva la card de referencia Garmin y el archivo de Agosto.
- Pantalla `Rutinas`: rutina activa **Entrenamiento Dali** (4 días, desde la planilla del 10 oct 2026) con series de aproximación vs. efectivas, pesos estimados como "Pendiente de confirmar", aclaraciones y videos del entrenador, marcado de cada serie, peso y repeticiones reales, cargas editables, historial de entrenamientos y última/mejor marca por ejercicio. La rutina anterior queda archivada.
- Card de referencia Garmin editable desde Ajustes → Datos Garmin (manual).
- Almacenamiento en `localStorage` (clave `dark-gym-planner-v1`): el historial anterior se conserva.

## Cómo publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub con tu proyecto.
2. Sube estos archivos al repositorio.
3. En el repositorio, ve a `Settings` > `Pages`.
4. Selecciona la rama principal (`main` o `master`) y la carpeta `/`.
5. Guarda. GitHub Pages servirá la app desde `https://<tu-usuario>.github.io/<tu-repo>/`.

> Asegúrate de que `index.html`, `styles.css` y `script.js` estén en la raíz del repositorio.

## Notas

- La app funciona completamente sin backend.
- Todas las configuraciones y el historial se guardan en el navegador.
- Si quieres empezar desde cero, utiliza la opción `Resetear semana` en ajustes.
