# ProSpeak OS — Gemini con Cloudflare desde GitHub (sin código piloto)

ProSpeak OS sigue alojado en GitHub Pages. El Worker de Cloudflare aloja únicamente la API privada de Maya. No uses la clave Gemini en `VITE_*`, código público ni capturas.

## Seguridad actual

- **Ya no existe `PILOT_ACCESS_CODE`** ni una contraseña de acceso en Messenger.
- La verificación Cloudflare Turnstile es obligatoria **antes de cada mensaje** y se comprueba en el servidor.
- Límite aproximado de 6 solicitudes/minuto por IP y 15 solicitudes/minuto compartidas **por ubicación de Cloudflare** (no son límites globales estrictos).
- CORS restringe el origen a `https://guaurritas-star.github.io`, pero CORS **no** autentica a usuarios.
- `MAYA_ENABLED` se mantiene `false` en el primer despliegue automático para evitar consumo accidental.
- **Sin código privado, cualquier visitante que complete Turnstile podrá usar Gemini una vez activado.** Controla la cuota y la facturación de tu cuenta de Google; para un lanzamiento público se requieren controles adicionales de abuso y gasto.

**IMPORTANTE:** revoca cualquier clave Gemini que hayas compartido por chat y genera otra. No pegues la nueva aquí.

## Paso 1 — Repository Secrets

Abre: https://github.com/guaurritas-star/Prospeak-os/settings/secrets/actions

Debes tener estos **cuatro** Repository Secrets (no Environment Secrets):

| Nombre | Valor |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Token de Cloudflare con permisos de edición de Workers para tu cuenta |
| `CLOUDFLARE_ACCOUNT_ID` | ID de esa cuenta de Cloudflare |
| `GEMINI_API_KEY` | Clave privada **nueva** de Google AI Studio |
| `TURNSTILE_SECRET_KEY` | Secret key privada del widget Turnstile |

No hace falta crear `PILOT_ACCESS_CODE`.

## Paso 2 — Publicar el Worker desde GitHub Actions

Abre: https://github.com/guaurritas-star/Prospeak-os/actions/workflows/deploy-maya-cloudflare.yml

- Cuando se publique un cambio de `workers/maya/**` o el workflow, GitHub intentará desplegar el Worker **desactivado** (secreto `MAYA_ENABLED=false`).
- Si aún no está publicado o falló, entra a **Run workflow** → rama `main` → deja **activate_maya** sin marcar → **Run workflow**.
- Abre el registro del paso **Deploy Cloudflare Worker** y copia la URL real `https://...workers.dev`. Si es la primera vez, Cloudflare puede pedir habilitar un subdominio `workers.dev` en Workers & Pages.

Este proceso usa GitHub Secrets para guardar la clave Gemini como **secreto de ejecución en Cloudflare**, sin Git connection. Comprueba que las acciones finalicen correctamente antes de activar llamadas de pago.

## Paso 3 — Configurar las dos variables públicas del sitio

En https://github.com/guaurritas-star/Prospeak-os/settings/variables/actions (Repository Variables):

| Nombre | Valor |
|---|---|
| `PROSPEAK_AI_API_URL` | `https://TU-WORKER.TU-CUENTA.workers.dev/api/chat` (usa tu URL real) |
| `PROSPEAK_TURNSTILE_SITE_KEY` | Site key **pública** del widget Turnstile |

El widget Turnstile debe autorizar el hostname `guaurritas-star.github.io`. No confundas Site key con Secret key.

Ejecuta el workflow https://github.com/guaurritas-star/Prospeak-os/actions/workflows/deploy-pages.yml → **Run workflow**. Así el frontend recibe las variables públicas. En ausencia de ellas, Maya permanece en Guided Practice.

## Paso 4 — Habilitar Gemini al terminar la revisión

Antes de activar, revisa los límites/cuotas y presupuestos en Google AI Studio y prueba que Cloudflare está protegido contra peticiones inválidas. **Sin contraseña, el modo IA permite acceso a cualquiera que resuelva Turnstile**: no es apto para uso público de alto tráfico sin mejores controles.

Abre el workflow de Maya y ejecuta manualmente **Run workflow**, rama `main`, con **activate_maya = true**. El Worker recibirá `MAYA_ENABLED=true`. Entonces prueba una conversación breve.

Para apagar Gemini, ejecuta otra vez **Run workflow** con **activate_maya=false**. Los cambios futuros de código al Worker también lo desactivan de forma preventiva hasta que vuelvas a activarlo.

## Diagnóstico

- `Guided Practice`: faltan las variables públicas o no se recompiló GitHub Pages.
- `503`: Worker desactivado o faltan secretos.
- `403`: problema con Turnstile, origen o token.
- `429`: se agotó el límite aproximado de solicitudes.
- `502`: verifica modelo, API key, cuota y disponibilidad de Gemini.

Cualquier clave o token debe permanecer en GitHub Secrets, no en el chat.
