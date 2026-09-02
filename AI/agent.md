# Guía para el Agente Implementador — RecallBook / Bitácora

Este documento es para el agente (LLM) que va a escribir el código de este proyecto. No es para el humano.

**Documentos de referencia obligatorios, en este orden de autoridad:**

1. `requirements.md` v0.2 — define QUÉ debe hacer el producto. Es la fuente de verdad de negocio.
2. `design.md` v0.1 — define CÓMO se construye técnicamente. Es la fuente de verdad de arquitectura.
3. `PLAN_IMPLEMENTACION.md` — define el ORDEN y el criterio de "terminado" de cada checkpoint.
4. Este documento — define ESTILO y disciplina de trabajo.

Si algo en este documento contradice a `design.md`, gana `design.md`. Este documento nunca introduce tecnología nueva ni decisiones de alcance; solo disciplina de ejecución.

---

## 0. Regla de oro: otro agente debe poder entender un archivo sin leer el resto del repo

Vas a escribir código que **otro agente (sin memoria de esta conversación) tendrá que modificar después, leyendo solo lo mínimo posible.** Esto no es una preferencia de estilo, es un requisito funcional del proyecto. Cada decisión de organización de código se evalúa contra esta pregunta:

> Si un agente nuevo abre únicamente este archivo, ¿tiene el contexto suficiente para entender qué hace y por qué, sin tener que abrir 5 archivos más primero?

Reglas concretas que se derivan de esto:

- **Un archivo, un propósito.** Si un archivo hace dos cosas no relacionadas, se parte en dos.
- **Encabezado de contexto en archivos no triviales.** Todo archivo que no sea trivialmente obvio por su nombre (componentes de lógica, stores, validadores, clientes de servicios externos) empieza con un comentario de 3–6 líneas explicando: qué hace este archivo, de qué otros archivos depende conceptualmente, y qué NO hace (para evitar que otro agente asuma responsabilidades que no tiene).
- **Nombres explícitos sobre nombres cortos.** `deckProgressStore.ts` mejor que `store.ts`. `submitFeedbackForm.ts` mejor que `submit.ts`.
- **No "magia".** Nada de valores mágicos sin nombre, nada de lógica implícita que dependa de convenciones no escritas (ej: "si el id empieza con `q_` es de tipo pregunta" sin que eso esté explícito en un tipo o constante).
- **Tipos explícitos y colocados cerca de su dominio**, no todos amontonados en un solo `types.ts` gigante. `types/deck.ts` para el dominio del mazo, `types/analytics.ts` para eventos — tal como ya lo define la Sección 6 de `design.md`.
- **Evitar abstracciones "inteligentes" prematuras.** Preferir código un poco repetitivo pero legible sobre una abstracción genérica que ahorra 10 líneas pero obliga a saltar entre 3 archivos para entender un flujo simple.
- **Barrels (`index.ts` que reexportan todo) solo si no ocultan de dónde viene algo.** Si usás un barrel, que sea plano y fácil de escanear, no un re-export en cascada de varios niveles.
- **Cada carpeta con lógica no trivial lleva un `README.md` de 5–10 líneas**: qué vive acá, qué no vive acá, y el archivo de entrada recomendado para empezar a leer.
- **Commits pequeños y descriptivos, uno por checkpoint (o sub-parte de checkpoint).** El mensaje de commit referencia el ID del checkpoint (ej: `CP-B2: flip animation for Type A cards`). Esto le da a cualquier agente futuro un mapa de "qué se hizo cuándo y por qué" sin tener que adivinar leyendo el diff.

Esto aplica con la misma fuerza a tests, scripts de config y archivos de datos (`atomic-habits.ts`), no solo a componentes de UI.

---

## 1. Disciplina de trabajo por checkpoint

1. Trabajar **un checkpoint del `PLAN_IMPLEMENTACION.md` a la vez**, en el orden de los bloques (A → B → C → D → E → F). No adelantar trabajo de un bloque posterior "porque ya que estamos", salvo que el checkpoint actual lo requiera explícitamente.
2. Antes de marcar un checkpoint como terminado, releer su **Criterio de aceptación** en `PLAN_IMPLEMENTACION.md` y confirmar honestamente que se cumple, no solo que "el código compila".
3. Si durante un checkpoint aparece la necesidad de algo que `design.md` dejó explícitamente pendiente (Sección 30: estructura final de carpetas, tokens de diseño, naming), resolverlo ahí mismo de forma razonable y **documentar la decisión** en el `README.md` de la carpeta correspondiente. No hace falta pedir permiso para esas decisiones — el diseño las delega a implementación a propósito.
4. Si aparece la necesidad de algo que `design.md` **excluye explícitamente** (Sección 2.1: backend dedicado, Redis, colas, ORM, autenticación, etc.), no implementarlo. Señalarlo en vez de resolverlo silenciosamente.
5. No introducir dependencias nuevas que no estén en la Sección 4 de `design.md` sin una razón que se pueda justificar por escrito en 1–2 líneas en el commit.

---

## 2. Notas de implementación por bloque

Estas notas son guía técnica breve, no repiten lo que ya dice `design.md` — léelo también.

### Bloque A — Fundación

- Server Components para todo lo estático (landing, metadata). Nada de `"use client"` a nivel de layout.
- El modelo de datos del mazo (`data/atomic-habits.ts`) se escribe usando los tipos de `types/deck.ts` (Sección 8 de `design.md`), nunca objetos sueltos sin tipar.
- Al redactar las tarjetas 4–12 (contenido pendiente según Sección 9.3 de `requirements.md`), cada hook debe poderse clasificar explícitamente en uno de los 4 patrones de la Fórmula del Hook — si no encaja en ninguno, reescribirlo.

### Bloque B — Mazo navegable

- Todo el estado del recorrido vive en el Zustand store definido en la Sección 7 de `design.md`. No dupliques ese estado en `useState` local de los componentes de tarjeta.
- El componente de tarjeta Tipo A y el de Tipo B son componentes separados que comparten un wrapper común, no un solo componente con muchos `if type === ...` internos difíciles de seguir.
- La animación de flip y el confeti son responsabilidad de componentes de presentación puros — no deben tener lógica de negocio ni leer el store directamente si se les puede pasar por props.

### Bloque C — Captura de datos

- El schema de Zod (Sección 16 de `design.md`) es la única fuente de verdad de validación en cliente. El componente de formulario no debe reimplementar reglas de validación a mano.
- El cliente de Supabase se aísla en `lib/supabase/` (ya definido en la estructura de carpetas). Ningún componente debe importar el SDK de Supabase directamente — todos pasan por ese módulo, para que un agente futuro que necesite auditar seguridad solo tenga que mirar una carpeta.
- Verificar RLS **antes** de considerar cerrado CP-C2 — no asumir que "como el INSERT funcionó, la seguridad está bien". Confirmar explícitamente que SELECT/UPDATE/DELETE anónimos fallan.

### Bloque D — Analytics

- Todos los eventos se emiten a través de un único módulo (`lib/analytics/`), nunca llamando al SDK de PostHog directamente desde un componente. Esto es lo que te permite, en CP-D3, simular la caída de PostHog en un solo lugar.
- Cada función de este módulo debe corresponder 1:1 a un evento de la Sección 13 de `design.md`, con el mismo nombre en inglés y las mismas propiedades — sin variaciones "creativas" de naming.
- El `session_id` se genera una vez por sesión y se guarda en un lugar accesible tanto por el módulo de analytics como por el módulo de Supabase (ver Sección 11.4 de `design.md`), sin pasarlo manualmente por props por toda la app si se puede evitar.

### Bloque E — Calidad transversal

- Los tests de accesibilidad y responsive son manuales según `PLAN_IMPLEMENTACION.md` — no hace falta escribir tests automatizados para esto en el MVP, salvo que ya exista fricción evidente.
- Los tests E2E (Sección 18–20 de `design.md`) deben interceptar red real vía Playwright, no mockear funciones internas de la app. Si un test E2E mockea una función de tu propio código en vez de la respuesta HTTP del proveedor externo, está mal planteado — revisar Sección 19.1 de `design.md`.

### Bloque F — Lanzamiento

- Confirmar que ninguna variable de entorno fuera de la lista de la Sección 24 de `design.md` quedó expuesta al cliente. Esto se puede grepear en el bundle de producción antes de dar el checkpoint por cerrado.

---

## 3. Qué hacer si algo no está claro

Orden de resolución cuando el agente encuentre una ambigüedad:

1. ¿Está resuelto en `requirements.md` o `design.md`? Usar esa respuesta.
2. ¿Es una de las decisiones delegadas explícitamente a implementación (Sección 30 de `design.md`)? Resolver de forma razonable, simple, y **documentarlo** donde corresponda (README de la carpeta o comentario del archivo).
3. ¿Contradice algo explícitamente excluido del MVP (Sección 2.1 de `design.md` o "Fuera de Alcance" de `requirements.md`)? No implementarlo — señalarlo en vez de improvisar una solución.
4. Si ninguna de las anteriores aplica, elegir la opción más simple y reversible, dejar constancia de la decisión y la razón por escrito, y seguir. No bloquear el avance por una duda menor que no cambia el criterio de aceptación del checkpoint actual.

---

## 4. Definición de "listo para el siguiente checkpoint"

Un checkpoint se da por cerrado solo cuando **las tres** condiciones se cumplen:

1. Se cumple el Criterio de aceptación descrito en `PLAN_IMPLEMENTACION.md` para ese checkpoint (verificado de la forma no-técnica que ahí se describe).
2. El código nuevo sigue las reglas de la Sección 0 de este documento (legible por otro agente sin contexto extra).
3. Existe al menos un commit cuyo mensaje referencia el ID del checkpoint.

Si falta cualquiera de las tres, el checkpoint no está terminado, aunque "funcione".
