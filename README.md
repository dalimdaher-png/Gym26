# Diario de Entrenamiento Oscuro

Aplicación web estática para organizar entrenamientos semanales de calistenia, gimnasio y running.

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

- Pantalla `Hoy` con entrenamiento sugerido, detalles y botones de acción.
- Rutinas de gimnasio cargadas (Día A, B, C) y calistenia.
- Biblioteca de running con 11 entrenamientos.
- Progresión flexible de 8 semanas.
- Resumen semanal con cumplimiento, parciales, saltados y objetivos.
- Historial guardado por fecha.
- Ajustes para targets semanales, modo flexible/calendario, modo running, recomendaciones y semana actual.
- Almacenamiento en `localStorage`.

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
