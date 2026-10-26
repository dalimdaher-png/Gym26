# Autodestrucción (Apoyo en la autodestrucción)

Aplicación web estática para seguir tu rutina de gimnasio y el objetivo semanal de running.

## Estructura del proyecto

- `index.html` - estructura de la app.
- `styles.css` - diseño nocturno, mobile first (cabeceras, bloques A/B/C/D, series, temporizador).
- `icons.js` - íconos (Lucide, licencia ISC).
- `script.js` - lógica de rutinas, localStorage y navegación.
- `sw.js` - service worker: la app abre sin conexión.
- `icon-180.png`, `icon-192.png`, `icon-512.png` - íconos para la pantalla de inicio.

## Cómo usarlo localmente

1. Abre `index.html` directamente en tu navegador.
2. Alternativamente, usa un servidor simple si prefieres:
   - Con Python 3:
     - `cd "c:\Users\daali\OneDrive\Desktop\Gym"`
     - `python -m http.server 8000`
     - Luego abre `http://localhost:8000`

## Funcionalidades incluidas

- Pantalla `Running`: un único objetivo de **21 km semanales** (semana de lunes a domingo, se reinicia cada lunes). Registro libre de km por día, con acumulado, restantes, % de cumplimiento, barra de progreso e historial de km por semana. Si superás los 21 km se sigue acumulando la distancia real. Sin días obligatorios, distancias fijas ni objetivos de ritmo. Conserva la card de referencia Garmin y el archivo de Agosto.
- Pantalla `Rutinas`: rutina activa **Entrenamiento Dali · Semana 3** (4 días, desde la pestaña “Semana 3 - 26-10-2026” de la planilla de Juan Pablo) con series de aproximación vs. efectivas, pesos estimados como "Pendiente de confirmar", aclaraciones y videos del entrenador, marcado de cada serie, peso y repeticiones reales, cargas editables, historial de entrenamientos y última/mejor marca por ejercicio. La rutina anterior queda archivada.
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
- Ajustes → Respaldo de datos: descargá un respaldo (JSON) e importalo si cambiás de celular o se borran los datos del navegador.
- Al actualizar la rutina, subí `GYM_ROUTINE_REV` en `script.js` si cambian ejercicios o series: migra las cargas guardadas sin pisar tus ediciones.


## Versión 2 (rediseño)

- 3 pestañas: Rutina, Running y Ajustes.
- Rutina: resumen de la semana, barra de días con progreso, ejercicios agrupados por bloque (A, B, C, D), anillo de avance, temporizador de descanso fijo abajo (arranca al tildar la serie o al anotar las repeticiones; marca el mínimo y el máximo del descanso).
- Al abrir, selecciona el día a medias o el próximo día pendiente de la semana.
- Aviso "Hay una versión nueva" cuando se actualiza el service worker.
- Los datos siguen en `localStorage` (clave `dark-gym-planner-v1`), sin cambios de formato.

## Semana 3 (26 oct 2026)

- Rutina vigente: Semana 3 (idéntica a la Semana 2). La Semana 2 queda cerrada: el Día 4 figura como “No realizado” y las sesiones que habían quedado a medias pasan al historial como “Incompleto”. Las cargas que habías editado en la Semana 2 se guardan aparte (`gym.weekArchive.s2`) y la Semana 3 arranca con los pesos de Juan Pablo.
- Historial agrupado por semana (Semana 3 vigente, Semana 2 y Semana 1 cerradas). No se borra ni se pisa ningún registro; los viejos se ubican por fecha.
- Kilos por lado: en los ejercicios con barra se ve cuánto poner de cada lado y el total. Barra olímpica de 20 kg (hip thrust, peso muerto, sentadilla). En la Smith se muestran los discos y se aclara que no incluyen la barra.
- Intensidad de 1 a 10 por ejercicio, guardada en cada entrenamiento.
- Los registros de las pestañas “Registro …” de la planilla no están en la app (el repositorio es público).
- Para cargar la Semana 4: subir `GYM_ROUTINE_REV`, agregar la semana a `GYM_WEEKS` y ajustar los pesos en `GYM_ROUTINE`.
