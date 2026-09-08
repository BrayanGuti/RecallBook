# Plan de Implementación — RecallBook / Bitácora

**Basado en:** `design.md` v0.1 + `requirements.md` v0.2
**Propósito de este documento:** dividir la construcción del MVP en checkpoints pequeños, secuenciales y **verificables sin leer código** — cada uno es una "victoria" que se puede comprobar usando el navegador, un dashboard o un archivo, no revisando el repositorio.

Este documento **no explica cómo implementar** (eso vive en `AGENTE_IMPLEMENTACION.md`). Este documento define **qué significa que un paso esté terminado**.

---

## Cómo usar este plan

- Los checkpoints están agrupados en **Bloques** (A–F), y dentro de cada bloque van en orden de dependencia.
- No se avanza al siguiente checkpoint si el actual no pasa su **Criterio de aceptación**.
- Cada checkpoint tiene una sección **Cómo verificar** con pasos concretos que cualquier persona (no solo quien programó) puede ejecutar.
- Si un checkpoint no se puede verificar así, está mal diseñado — hay que partirlo más.

---

## Bloque A — Fundación

### CP-A1. Landing estática (sin lógica)

**Objetivo:** que exista una página pública en `/` con el contenido de marketing, sin ninguna interacción real todavía.

**Incluye:**

- Hero con hook de marketing.
- Botón "Empezar mazo" (puede no hacer nada todavía o navegar a `/demo` vacío).
- Open Graph, favicon, metadata básica.

**Criterio de aceptación:**

- La página carga en `/` sin errores en consola.
- Al compartir la URL (o inspeccionarla con una herramienta de preview de OG), se ve título, descripción e imagen.
- La página es legible y sin scroll horizontal en un viewport de 375px de ancho.

**Cómo verificar:**

1. Abrir la URL en el navegador con las devtools en modo móvil (375px).
2. Pegar la URL en un validador de Open Graph (ej. la herramienta de preview de Twitter/X o Facebook Sharing Debugger) y confirmar que se ve una tarjeta con imagen y texto.
3. Confirmar visualmente que no hay franjas blancas raras ni texto cortado.

---

### CP-A2. Modelo de datos del mazo cargado

**Objetivo:** que exista el contenido completo del mazo "Hábitos Atómicos" (8–12 tarjetas) como datos, no como texto hardcodeado en componentes.

**Criterio de aceptación:**

- Existen entre 8 y 12 tarjetas.
- La proporción es ~70% Tipo A / ~30% Tipo B (Sección 9.1 de requirements).
- Cada tarjeta Tipo A tiene un "hook" que sigue alguno de los 4 patrones de la Fórmula del Hook (Sección 9.2).
- Cada tarjeta Tipo B tiene entre 3 y 4 opciones, exactamente una correcta, y una explicación de 1–2 líneas.

**Cómo verificar:**

- Sin abrir el navegador: contar tarjetas y releer cada hook en voz alta — ¿rompe una expectativa o suena a definición de enciclopedia? Si suena aburrido, no pasa.
- Confirmar a mano que cada tarjeta Tipo B tiene una sola opción marcada como correcta.

---

## Bloque B — El mazo se puede recorrer (sin backend, sin analytics)

### CP-B1. Navegación básica del mazo con datos falsos de progreso

**Objetivo:** poder entrar a `/demo`, ver la tarjeta 1, avanzar y retroceder, y ver el contador de progreso, usando el contenido real del Bloque A.

**Criterio de aceptación:**

- Al entrar a `/demo` se ve la tarjeta 1 y el indicador dice "Tarjeta 1 de N".
- El botón "Siguiente" avanza una tarjeta y actualiza el contador y la barra de progreso.
- El botón "Anterior" existe y funciona, excepto en la tarjeta 1 (deshabilitado o ausente).
- En la última tarjeta, "Siguiente" lleva a una pantalla de cierre (aunque esa pantalla esté vacía todavía).
- Funciona con swipe horizontal en un dispositivo o emulador táctil.
- El botón "Siguiente"/"Anterior" sigue funcionando aunque no se use swipe (RF-1.3: el gesto nunca es el único método).

**Cómo verificar:**

1. Entrar a `/demo` en un celular real o emulador táctil.
2. Recorrer todo el mazo solo con swipe, de principio a fin.
3. Recargar y recorrerlo solo con botones, de principio a fin.
4. Confirmar que el contador y la barra de progreso siempre coinciden con la tarjeta visible.

---

### CP-B2. Interacción de tarjeta Tipo A (flip)

**Objetivo:** que las tarjetas de flip funcionen como se especifica.

**Criterio de aceptación:**

- Al hacer tap/clic en una tarjeta Tipo A, se voltea con una animación (no un cambio brusco).
- El reverso muestra la enseñanza central, distinta del hook del frente.
- Se puede volver a ver el frente (o al menos avanzar sin quedar atascado).
- no se puede avanazr sin ver el reverso

**Cómo verificar:**

- Tocar cada tarjeta Tipo A del mazo demo y confirmar visualmente la animación y que el contenido del reverso tiene sentido con el frente.

---

### CP-B3. Interacción de tarjeta Tipo B (selección múltiple)

**Objetivo:** que el flujo de pregunta → respuesta → feedback funcione exactamente como en RF-1.2.

**Criterio de aceptación:**

- Al seleccionar una opción, esa tarjeta queda bloqueada (no se puede cambiar la respuesta).
- Si la opción es correcta: se ve en verde pastel + microinteracción + explicación.
- Si es incorrecta: la opción elegida se ve en rojo pastel, la correcta se resalta en verde, y se muestra la explicación.
- En ambos casos el usuario puede seguir avanzando (fallar no bloquea el mazo).
- El feedback no depende solo del color (RNF de accesibilidad / Sección 21): debe haber un ícono o texto adicional, no solo el borde de color.

**Cómo verificar:**

1. Responder cada pregunta del mazo una vez bien y, recargando, una vez mal.
2. Confirmar que en ambos casos se puede seguir avanzando.
3. Ver la pantalla en escala de grises (herramienta de simulación de daltonismo del navegador) y confirmar que sigue siendo claro cuál respuesta era correcta.

---

### CP-B4. Pantalla de cierre con celebración

**Objetivo:** que al terminar el mazo se sienta como un logro, con confeti, antes de pedir nada.

**Criterio de aceptación:**

- Al llegar a la última tarjeta y avanzar, aparece una animación de confeti y un mensaje de logro.
- No aparece todavía el formulario mezclado en la misma pantalla de forma abrumadora (puede estar debajo, pero la celebración es lo primero que se percibe).

**Cómo verificar:**

- Completar el mazo de principio a fin y confirmar la sensación: ¿se siente un cierre satisfactorio o se salta directo a un formulario frío?

---

## Bloque C — Captura de datos (formulario + Supabase)

### CP-C1. Formulario de cierre con validación en cliente

**Objetivo:** que el formulario de la Sección 4 (RF-3) exista completo y valide antes de intentar enviar nada.

**Criterio de aceptación:**

- Contiene: email, rating 1–5 estrellas, texto libre "qué libro te gustaría ver", las 2 preguntas de la mini-encuesta, checkbox legal desmarcado por defecto.
- No se puede enviar con: email inválido, sin rating, sin respuesta de la encuesta, o checkbox destildado.
- Los mensajes de error son específicos por campo, no un error genérico.

**Cómo verificar:**

1. Intentar enviar el formulario vacío → debe mostrar errores específicos y no enviar nada.
2. Llenarlo con un email inválido (`sin-arroba`) → debe marcar error solo en ese campo.
3. Llenarlo completo y correcto, sin marcar el checkbox → debe bloquear el envío.

---

### CP-C2. Envío exitoso a Supabase

**Objetivo:** que un envío válido efectivamente quede guardado.

**Criterio de aceptación:**

- Al enviar el formulario válido, aparece una confirmación visual de éxito.
- La fila aparece en la tabla `feedback_submissions` de Supabase con todos los campos correctos.
- El campo `session_id` de esa fila coincide con el de la sesión del navegador que lo envió.
- Intentar leer la tabla desde un cliente anónimo (sin credenciales de servicio) falla — RLS activo.

**Cómo verificar:**

1. Enviar el formulario con datos de prueba reconocibles (ej. email `test-cp-c2@ejemplo.com`).
2. Entrar al dashboard de Supabase y confirmar que la fila existe con esos datos.
3. Desde la consola del navegador (con solo la clave pública), intentar un `select` sobre la tabla y confirmar que es rechazado.

---

### CP-C3. Manejo de error de Supabase (resiliencia)

**Objetivo:** que si Supabase falla, el usuario no pierda su información ni vea un falso éxito.

**Criterio de aceptación:**

- Si el envío falla, se muestra un mensaje de error recuperable (no técnico, no un stack trace).
- Los datos que el usuario ya escribió siguen en el formulario (no se borran).
- Existe un botón/manera de reintentar sin volver a escribir todo.
- En ningún caso se muestra la pantalla de éxito si el guardado no fue confirmado.

**Cómo verificar:**

- Simular la caída de Supabase (cortar internet, o bloquear el dominio de Supabase desde las devtools) y enviar el formulario. Confirmar que se ve el error, que los datos siguen ahí, y que "Reintentar" funciona al restaurar la conexión.

---

## Bloque D — Analytics (PostHog)

### CP-D1. Eventos del funnel disparándose correctamente

**Objetivo:** que los 8 eventos de la Sección 13 del diseño se disparen en el momento correcto, con las propiedades correctas, y una sola vez cuando corresponde.

**Criterio de aceptación:**

- Cada evento (`landing_viewed`, `deck_started`, `card_viewed`, `card_flipped`, `question_answered`, `deck_abandoned`, `deck_completed`, `feedback_submitted`) aparece en el panel de eventos "live" de PostHog al hacer la acción correspondiente.
- Todos los eventos traen `session_id`, y ese `session_id` es el mismo durante toda una sesión.
- `deck_started` y `deck_completed` aparecen exactamente una vez por recorrido completo del mazo, no más.
- El email **nunca** aparece como propiedad de ningún evento.

**Cómo verificar:**

1. Abrir el panel "Activity"/"Live events" de PostHog en una pestaña.
2. En otra pestaña, hacer un recorrido completo: landing → empezar → cada tarjeta → completar → enviar formulario.
3. Confirmar en PostHog que aparecieron los 8 eventos, en orden razonable, con el mismo `session_id`, y sin ningún campo de email visible en las propiedades.

---

### CP-D2. Correlación session_id entre PostHog y Supabase

**Objetivo:** poder tomar una fila de Supabase y encontrar su sesión completa en PostHog (y viceversa).

**Criterio de aceptación:**

- Tomando el `session_id` de una fila reciente de `feedback_submissions`, se puede filtrar en PostHog por esa propiedad y ver el recorrido completo de esa sesión (landing → ... → submit).

**Cómo verificar:**

- Hacer un recorrido de prueba, copiar el `session_id` resultante desde Supabase, pegarlo como filtro en PostHog, y confirmar que aparece la secuencia completa de eventos de esa sesión.

---

### CP-D3. Manejo de error de PostHog (resiliencia)

**Objetivo:** que si PostHog falla, el producto siga funcionando con normalidad.

**Criterio de aceptación:**

- Con PostHog bloqueado/caído, el usuario puede completar todo el mazo y enviar el formulario sin errores visibles ni excepciones que rompan la UI.

**Cómo verificar:**

- Bloquear el dominio de PostHog desde las devtools y repetir un recorrido completo. Confirmar que no hay ningún mensaje de error visible para el usuario y que el formulario se envía igual a Supabase.

---

## Bloque E — Calidad transversal

### CP-E1. Responsive y accesibilidad mínima

**Criterio de aceptación (Sección 21 del diseño):**

- Todo el flujo se puede completar solo con teclado en desktop (tab, enter, flechas).
- El foco siempre es visible.
- Todos los targets táctiles miden al menos 48x48px.
- Sin scroll horizontal en ningún punto entre 360px y 430px de ancho.

**Cómo verificar:**

- Completar el flujo completo sin tocar el mouse/touch, solo con teclado.
- Medir con las devtools 2–3 botones/inputs al azar y confirmar el tamaño mínimo.

---

### CP-E2. Rendimiento

**Criterio de aceptación:**

- LCP < 1.5s en la landing, medido con Lighthouse en modo móvil con throttling.

**Cómo verificar:**

- Correr Lighthouse (modo móvil, simulando red 4G) sobre `/` y confirmar la métrica de LCP.

---

### CP-E3. E2E del funnel crítico con mocks

**Objetivo:** que exista al menos un test automatizado que recorra Landing → Start → Cards → Completar pregunta → Completar mazo → Formulario → Submit, con PostHog y Supabase mockeados (Sección 19 del diseño).

**Criterio de aceptación (verificable viendo el resultado del test, no el código):**

- El test corre en CI y pasa en verde.
- Existe un test separado que simula error de Supabase y confirma que no se muestra éxito falso.
- Existe un test separado que simula caída de PostHog y confirma que el mazo se completa igual.

**Cómo verificar:**

- Ver el resultado del pipeline de CI (verde) y el reporte de Playwright con los 3 escenarios (feliz, error Supabase, error PostHog) pasando.

---

## Bloque F — Lanzamiento

### CP-F1. Deploy accesible públicamente

**Criterio de aceptación:**

- La URL de producción carga desde una red externa (no localhost) y completa el flujo entero de principio a fin, incluyendo guardado real en Supabase y eventos reales en PostHog.
- La URL abre correctamente dentro del navegador in-app de Instagram y de TikTok (RNF-7).

**Cómo verificar:**

- Compartir el link real por WhatsApp a un celular, abrirlo desde ahí, y completar todo el flujo.
- Repetir abriendo el link desde un post/story de prueba en Instagram o TikTok, usando su navegador integrado.

---

## Checklist resumen (para marcar avance)

```
Bloque A — Fundación
[ ] A1. Landing estática
[ ] A2. Datos del mazo cargados

Bloque B — Mazo navegable
[ ] B1. Navegación básica
[ ] B2. Flip cards
[ ] B3. Selección múltiple
[ ] B4. Pantalla de cierre + confeti

Bloque C — Captura de datos
[ ] C1. Formulario + validación
[ ] C2. Envío exitoso a Supabase
[ ] C3. Manejo de error de Supabase

Bloque D — Analytics
[ ] D1. Eventos del funnel
[ ] D2. Correlación session_id
[ ] D3. Manejo de error de PostHog

Bloque E — Calidad
[ ] E1. Responsive + accesibilidad
[ ] E2. Rendimiento (LCP)
[ ] E3. E2E con mocks

Bloque F — Lanzamiento
[ ] F1. Deploy público verificado
```
