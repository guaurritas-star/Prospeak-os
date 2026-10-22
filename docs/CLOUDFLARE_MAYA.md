# Maya con Gemini: GitHub Pages + Cloudflare Workers

**Guía actualizada:** [Configurar Gemini con 4 GitHub Secrets, sin código piloto](GITHUB_SECRETS_MAYA.md).

No hace falta conectar GitHub desde Cloudflare: el workflow **Deploy Maya Worker from GitHub** publica el Worker desde el repositorio.

La API privada está en `workers/maya/src/index.js`. La configuración está en `workers/maya/wrangler.jsonc`. El sitio web permanece en GitHub Pages.

## Protección

- Turnstile es obligatorio para cada mensaje enviado a Maya.
- No se solicita contraseña ni código de piloto.
- La protección de solicitudes es aproximada por ubicación de Cloudflare y no sustituye límites globales de gasto, autenticación de alumnos ni supervisión de cuotas.
- El Worker solo podrá contactar a Gemini cuando `MAYA_ENABLED=true` y se hayan configurado las claves privadas desde GitHub Secrets.
- La clave Gemini **no se publica** en el navegador.
- No uses claves compartidas previamente en chat: revócalas y crea otras nuevas.

**Sigue los pasos concretos del documento enlazado arriba para el despliegue, variables y prueba.**
