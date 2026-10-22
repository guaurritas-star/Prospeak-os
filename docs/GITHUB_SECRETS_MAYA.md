# Maya en GitHub Secrets — configuración simplificada

**Sí, las claves pueden almacenarse en GitHub Actions Secrets** sin quedar visibles en la página. Los secretos se usan para **desplegar** un Worker de Cloudflare: GitHub Pages por sí mismo es estático y no puede ejecutar Gemini con una clave oculta cuando el alumno escribe.

Este método evita el problema de Cloudflare `Missing git connection`. No hace falta conectar GitHub desde Cloudflare.

## 1. Rotar la clave

La clave que se compartió anteriormente en el chat debe revocarse en Google AI Studio y reemplazarse por una nueva. **No envíes la nueva clave a ningún chat ni la pongas en el frontend.**

## 2. Crear un token de Cloudflare (NO su integración con GitHub)

En https://dash.cloudflare.com/profile/api-tokens crea un API token con permisos mínimos para desplegar Workers (plantilla Edit Cloudflare Workers, restringida a la cuenta de Cloudflare donde estará el Worker).

Encuentra el **Account ID** de esa misma cuenta en Cloudflare. La cuenta debe tener un subdominio `workers.dev` habilitado; Cloudflare puede pedir que lo actives desde Workers & Pages una sola vez.

## 3. Guardar cinco secretos en GitHub

Ve a https://github.com/guaurritas-star/Prospeak-os/settings/secrets/actions → New repository secret y añade:

| Secret name | Qué pegar |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Token de Cloudflare con acceso limitado a Workers |
| `CLOUDFLARE_ACCOUNT_ID` | ID de la cuenta Cloudflare |
| `GEMINI_API_KEY` | Tu **nueva** clave Gemini |
| `TURNSTILE_SECRET_KEY` | Secret key del widget Turnstile |
| `PILOT_ACCESS_CODE` | Contraseña larga y única (12+ caracteres) para alumnos del piloto |

Para obtener Turnstile, crea un widget **Managed** en Cloudflare con hostname `guaurritas-star.github.io`. Conserva la **site key** pública para la sección 5. Los alumnos necesitarán realizar una verificación por mensaje.

## 4. Desplegar desde GitHub (sin 'Git connection')

Abre https://github.com/guaurritas-star/Prospeak-os/actions/workflows/deploy-maya-cloudflare.yml

Selecciona Run workflow, rama `main`, y deja **activate_maya = false** la primera vez. GitHub desplegará `workers/maya` e instalará las credenciales como secretos de ejecución en Cloudflare. La acción utiliza solamente el token de despliegue; no necesita instalar la app de GitHub en Cloudflare.

Revisa que Actions termine en verde y copia la URL que aparezca terminada en `.workers.dev`. Si el subdominio workers.dev aún no existe, actívalo una vez en Cloudflare antes del despliegue.

## 5. Enlazar Maya desde GitHub Pages

Ve a https://github.com/guaurritas-star/Prospeak-os/settings/variables/actions → New repository variable:

| Variable pública | Valor |
| --- | --- |
| `PROSPEAK_AI_API_URL` | `https://TU-WORKER.TU-CUENTA.workers.dev/api/chat` (URL real del despliegue) |
| `PROSPEAK_TURNSTILE_SITE_KEY` | La site key pública de Turnstile (no la secret key) |

Después abre https://github.com/guaurritas-star/Prospeak-os/actions/workflows/deploy-pages.yml y pulsa Run workflow para publicar GitHub Pages otra vez.

## 6. Activar el piloto (solo después de verificar protección y cuota)

Confirma primero que Turnstile valida, que la contraseña no se comparte públicamente, que la cuenta Gemini tiene límite de gasto/cuota adecuado y que el Worker rechaza solicitudes inválidas. Regresa al workflow de GitHub y ejecútalo nuevamente con **activate_maya = true**. Esa opción guarda `MAYA_ENABLED=true` únicamente como secreto en Cloudflare.

En cualquier momento puedes ejecutar el mismo workflow con **activate_maya = false** para apagar nuevas llamadas a Gemini (el Worker queda publicado sin usar la API). El Worker no admite llamadas con la clave pública en el sitio; los mensajes llegan al Worker bajo verificación.

**Limitación importante:** el código de piloto es compartido, el rate limiting es por IP y Turnstile es antibot, no autenticación por usuario. Para público general hacen falta cuentas por alumno y límites globales de gasto/uso. No publiques ni distribuyas el código piloto libremente.

Este procedimiento automatiza la publicación, pero **sigue necesitando un Worker de Cloudflare**; GitHub Pages no ejecuta funciones privadas durante la visita.
