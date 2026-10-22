## Solución a "Gemini is unavailable" (octubre 2026)

El workflow de GitHub muestra **Success** cuando Cloudflare recibió el Worker, **no** cuando Google Gemini generó una respuesta correcta.

ProSpeak ahora usa por defecto `gemini-3.5-flash-lite` en `workers/maya/wrangler.jsonc`: Google limita el acceso a Gemini 2.5 en proyectos nuevos y recomienda los modelos 3.5 Flash-Lite o 3.8 Flash.

Si Maya aún no responde, la pantalla reportará el tipo de error de Google (sin imprimir secretos):

- **GEMINI_AUTH (401):** clave inválida, revocada o no aceptada; verifica que `GEMINI_API_KEY` sea nueva y válida.
- **GEMINI_PERMISSION (403):** falta de permiso o clave de otro servicio; verifica la clave ligada a Gemini API.
- **GEMINI_MODEL (404):** modelo no accesible; comprueba en Google AI Studio qué modelo admite el proyecto.
- **GEMINI_QUOTA (429):** límite o cuota agotada; revisa cuotas y facturación.
- **GEMINI_BAD_REQUEST (400):** configuración de solicitud incompatible; consulta los registros del Worker.
- **GEMINI_UPSTREAM (5xx):** error temporal del proveedor.

Para revisar registros sin exponer claves, abre **Cloudflare → Workers & Pages → prospeak-maya-api → Observability / Logs**. El Worker solo registra modelo, código HTTP y estado técnico, no mensajes del alumno ni claves.

**IMPORTANTE:** todo push al Worker desde `main` lo deja **apagado** (`MAYA_ENABLED=false`) por seguridad. Al terminar este despliegue, vuelve a habilitarlo manualmente: [GitHub Actions — Deploy Maya Worker](https://github.com/guaurritas-star/Prospeak-os/actions/workflows/deploy-maya-cloudflare.yml) → **Run workflow** → `main` → `activate_maya=true`. Ejecuta una conversación breve y revisa el diagnóstico si falla.

Nunca pegues la clave API aquí. Si una clave ha sido compartida en un chat, revócala y reemplázala en Repository Secrets antes de habilitar la IA.

---

## Actualización UX: Maya conversa sin CAPTCHA en cada mensaje

- Cuando el Worker está desactivado, Messenger informa "Gemini no está activo" y mantiene el modo guiado: una respuesta guionizada **no debe presentarse como Gemini**.
- Cuando el Worker se habilita y la web tiene la clave pública de Turnstile, una sola verificación inicia una **sesión firmada de 20 minutos**. La conversación continúa sin repetir el widget después de cada mensaje. Cloudflare solo aparece si requiere interacción.
- La sesión se guarda en memoria de la pestaña, no en localStorage ni cookies, y está ligada a la IP usada en la verificación. Si cambia de red, se pedirá otra verificación.
- La clave privada Gemini y la clave privada Turnstile permanecen en el Worker.
- Los límites de solicitudes son aproximados por ubicación, **no** un presupuesto global fijo. Sin login, el sitio permite acceder a cualquiera que pase Turnstile. No lo dejes abierto masivamente sin mejores controles.
- El código actual usa Gemini 2.5 Flash con pensamiento desactivado para respuestas conversacionales ágiles y un prompt que responde a preguntas reales en vez de forzar guiones. La calidad real debe verificarse **una vez que Gemini esté activo**.

Para encender Gemini: [GitHub Actions — Deploy Maya Worker](https://github.com/guaurritas-star/Prospeak-os/actions/workflows/deploy-maya-cloudflare.yml), **Run workflow** → rama `main` → activar `activate_maya=true`, solo tras comprobar las cuotas y que la clave Gemini no esté expuesta. El despliegue automático de cambios al Worker lo deja apagado inicialmente.

---

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

## Paso 3 — Configurar la clave pública de Turnstile

En https://github.com/guaurritas-star/Prospeak-os/settings/variables/actions (Repository Variables):

| Nombre | Valor |
|---|---|
| `PROSPEAK_AI_API_URL` | Opcional: ya se usa por defecto `https://prospeak-maya-api.studiomxcandy.workers.dev/api/chat` |
| `PROSPEAK_TURNSTILE_SITE_KEY` | Site key **pública** del widget Turnstile |

La variable **obligatoria** es `PROSPEAK_TURNSTILE_SITE_KEY` (no la secret key). El endpoint del Worker ya está configurado en código. El widget Turnstile debe autorizar el hostname `guaurritas-star.github.io`. No confundas Site key con Secret key.

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
