# Gym26 – Servidor Garmin

Backend ligero (Node + Express) que se autentica con tu cuenta de Garmin Connect y expone un endpoint REST simple para que la app estática (GitHub Pages) muestre tus datos de salud y actividad.

No es un servidor MCP — es una API HTTP propia, pensada para ser consumida desde el navegador.

## Por qué existe esto

La app de entrenamiento es 100% estática (GitHub Pages, sin backend). Un navegador no puede:
- llamar directo a Garmin Connect (no tiene una API pública con CORS habilitado), ni
- guardar tu contraseña de Garmin de forma segura.

Por eso este servidor corre aparte, guarda tus credenciales como variables de entorno (nunca en el código) y le entrega a la app solo los datos ya procesados.

## Configuración local

1. `cd server`
2. `npm install`
3. Copia `.env.example` a `.env` y completa tus datos:
   - `GARMIN_EMAIL` / `GARMIN_PASSWORD`: tu cuenta de Garmin Connect
   - `API_KEY`: una clave propia, larga y aleatoria (ej. `openssl rand -hex 32` o cualquier generador de contraseñas). La app deberá enviarla en el header `x-api-key`
   - `ALLOWED_ORIGIN`: el origen exacto de tu app (ej. `https://dalimdaher-png.github.io`), para que solo ella pueda consumir la API
4. `npm start`
5. Probar: `curl -H "x-api-key: TU_CLAVE" http://localhost:3000/api/garmin/today`

## Endpoint

### `GET /api/garmin/today`

Requiere el header `x-api-key`. Devuelve un resumen del día actual:

```json
{
  "steps": { "total": 8423, "goal": 10000 },
  "heartRate": { "resting": 58, "latest": 60 },
  "sleep": { "durationSeconds": 27000, "score": 78 },
  "bodyBattery": { "charged": 45, "drained": 60, "latest": 72 },
  "trainingReadiness": { "score": 65, "level": "MODERATE", "feedback": "..." },
  "updatedAt": "2026-06-08T12:00:00.000Z"
}
```

Cualquier campo puede venir en `null` si Garmin no tiene datos para hoy o si esa métrica no está disponible para tu dispositivo. La respuesta se cachea en memoria por 15 minutos; usa `?refresh=true` para forzar una actualización.

## Notas sobre autenticación con Garmin

- El servidor guarda el token de sesión en `.garmin-tokens/` para no iniciar sesión en cada request (Garmin puede bloquear logins muy frecuentes).
- Si tu cuenta tiene **autenticación en dos pasos (MFA)**, el login automático puede fallar. La librería usada (`garmin-connect`) todavía no tiene un flujo de MFA totalmente automatizado — si esto ocurre, la alternativa más simple es desactivar temporalmente el MFA para esta cuenta o crear una cuenta/clave de aplicación específica si Garmin lo permite.

## Despliegue (necesario para que la app en GitHub Pages lo use)

GitHub Pages solo sirve archivos estáticos, así que este servidor debe alojarse en un servicio que ejecute procesos Node, por ejemplo:

- **Render** (`render.com`): plan gratuito para "Web Services", build command `npm install`, start command `npm start`.
- **Railway** (`railway.app`) o **Fly.io** como alternativas.

Pasos generales:
1. Crea una cuenta en el servicio elegido y un nuevo "Web Service" apuntando a la carpeta `server/` de este repo.
2. Configura las variables de entorno (`GARMIN_EMAIL`, `GARMIN_PASSWORD`, `API_KEY`, `ALLOWED_ORIGIN`) en el panel del servicio — nunca las subas al repositorio.
3. Despliega y copia la URL pública que te entregue el servicio (ej. `https://tu-servicio.onrender.com`).
4. En la app, ve a **Ajustes → Garmin**, pega esa URL y tu `API_KEY`.
