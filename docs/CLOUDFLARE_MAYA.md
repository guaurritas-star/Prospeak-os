# Maya con Gemini · GitHub Pages + Cloudflare Workers

ProSpeak OS (frontend) sigue en GitHub Pages. Solo Maya utiliza un Cloudflare Worker externo.
No es necesario usar Vercel ni mover la página.

## Seguridad por defecto
- **Desactivado por defecto.** Responde 503 hasta que el secreto MAYA_ENABLED tenga valor true.
- **Sin secretos públicos:** nunca guardes claves en GitHub, variables VITE_ ni mensajes de chat.
- **Piloto:** contraseña compartida de al menos 12 caracteres (PILOT_ACCESS_CODE).
- **Turnstile:** se verifica cada mensaje en el servidor. El token es de un solo uso.
- **Rate limiting:** ~6 llamadas por minuto por IP y ubicación de Cloudflare. No es un límite global de costos ni autenticación individual.
- CORS + hostname permitido: guaurritas-star.github.io; CORS solo no es autenticación.
- Solo se envían a Gemini los mensajes recientes; no se persiste historial en el Worker.
- Para clases grandes: crear sesiones por alumno, cuotas agregadas, seguimiento y presupuesto.

**Revoca la clave Gemini compartida previamente en el chat y genera una nueva.**

## 1. Crear Worker desde Cloudflare
1. Abre https://dash.cloudflare.com/ → Workers & Pages → Create application → Import a repository (GitHub).
2. Selecciona guaurritas-star/Prospeak-os, rama main.
3. Nombre del Worker: prospeak-maya-api.
4. Root directory: workers/maya.
5. Build command: vacío. Deploy command: npx wrangler deploy.
6. Publica. Guarda la URL real https://prospeak-maya-api.TU_SUBDOMINIO.workers.dev.

Este Worker inicialmente NO consume Gemini: queda apagado hasta configurar los secretos.
El código principal está en workers/maya/src/index.js.

## 2. Crear Turnstile
1. En el panel de Cloudflare crea un widget Turnstile (modo Managed).
2. Hostname permitido: guaurritas-star.github.io (no agregues /Prospeak-os/).
3. Site key PUBLICA: se guardará como Repository variable PROSPEAK_TURNSTILE_SITE_KEY en GitHub.
4. Secret key PRIVADA: se guardará como secreto TURNSTILE_SECRET_KEY en el Worker.

## 3. Agregar secretos al Worker
Ve a Workers & Pages → prospeak-maya-api → Settings → Variables and Secrets.
Agrega secretos (tipo Secret):
- GEMINI_API_KEY: clave NUEVA generada en https://aistudio.google.com/api-keys
- TURNSTILE_SECRET_KEY: secreto de tu widget.
- PILOT_ACCESS_CODE: contraseña nueva y única de al menos 12 caracteres, para alumnos piloto.

Ningún valor secreto debe estar en código o en las variables de GitHub.

Cuando hayas comprobado el costo/cuota de Gemini, la protección, y el código de acceso, habilita manualmente un último secreto: MAYA_ENABLED con valor true. Hazlo solo para el piloto controlado. Sin una cuota global rígida y usuarios individuales, no es apropiado abrir esto al público.

## 4. Conectar GitHub Pages
En https://github.com/guaurritas-star/Prospeak-os/settings/variables/actions crea dos Repository variables públicas:
- PROSPEAK_AI_API_URL = https://prospeak-maya-api.TU_SUBDOMINIO.workers.dev/api/chat
- PROSPEAK_TURNSTILE_SITE_KEY = valor público de Turnstile

Después ve a Actions → Build and deploy ProSpeak OS → Run workflow en rama main.
El sitio recibe esas variables al compilar. No las convierte en secretos.
Si faltan, Messenger sigue en Guided Practice (sin Gemini).

## 5. Prueba
1. Abre https://guaurritas-star.github.io/Prospeak-os/ y entra a Messenger.
2. Escribe la contraseña compartida por la profesora y completa el reto Turnstile.
3. Prueba el mensaje: Hi Maya, I work in marketing. Let's practice introducing an idea to a client.
4. Verifica que Maya recuerde la situación y formule una pregunta apropiada.
5. Prueba un código equivocado, sin Turnstile, y varias solicitudes seguidas.
6. Comprueba el consumo en Google AI Studio y los logs de Cloudflare.

## Diagnóstico
- Guided Practice: faltan las variables públicas de GitHub o no se recompiló.
- 503: falta activar el secreto MAYA_ENABLED o faltan otros secretos.
- 403 código incorrecto: revisa el acceso de alumno.
- 403 verificación: revisa widget, hostname y token Turnstile.
- 429: exceso de solicitudes.
- 502: revisa la cuota de Gemini, clave y modelo.

Para apagar Gemini, elimina el secreto MAYA_ENABLED o ponlo en false y vuelve a desplegar el Worker; alternativamente suspende la clave en Google AI Studio.
