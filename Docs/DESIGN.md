# Design — RecallBook / Bitácora

**Versión:** 0.1  
**Fecha:** Septiembre 2026  
**Estado:** Propuesto para implementación del MVP  
**Relacionado con:** `requirements.md` v0.2

---

## 1. Propósito

Este documento define el diseño técnico del MVP de RecallBook / Bitácora. El producto se implementará como una aplicación web mobile-first cuyo objetivo no es construir todavía la plataforma completa, sino validar el comportamiento del usuario frente al formato de aprendizaje basado en active recall.

Las hipótesis del MVP son:

1. El usuario inicia el mazo.
2. El usuario termina el mazo.
3. El usuario deja señales de intención: email, rating, feedback y encuesta.

El diseño prioriza:

- costo operativo inicial de $0 dentro de los límites gratuitos de los servicios seleccionados;
- mínima infraestructura;
- bajo tiempo de implementación;
- rendimiento alto en móvil y WebViews de TikTok/Instagram;
- trazabilidad de todo el funnel;
- facilidad de evolución hacia un producto completo en fases posteriores.

El alcance funcional de este documento se deriva del `requirements.md`, que define el MVP como landing + mazo demo de "Hábitos Atómicos", sin autenticación, perfiles, repetición espaciada, catálogo de múltiples libros ni aplicación móvil nativa.

---

## 2. Principios de diseño

### 2.1 MVP first

No se agregará infraestructura o abstracciones cuyo valor dependa de funcionalidades que todavía están fuera del alcance.

Quedan fuera del MVP:

- backend dedicado con NestJS o Express;
- autenticación;
- Redis;
- colas y workers;
- Kafka;
- ORM;
- CMS;
- sistema de usuarios;
- algoritmo de repetición espaciada;
- aplicación móvil nativa.

### 2.2 Static first

La landing y el contenido del mazo demo serán estáticos siempre que sea posible. El cliente solo ejecutará JavaScript donde exista interacción real.

### 2.3 Separación de responsabilidades

Se usarán dos servicios con responsabilidades distintas:

- **PostHog:** comportamiento y analítica de producto.
- **Supabase PostgreSQL:** datos persistentes enviados voluntariamente por el usuario.

Ambos se correlacionarán mediante un `session_id` generado por la aplicación.

### 2.4 Fallos externos no deben romper el producto

La caída o indisponibilidad de PostHog no debe impedir que el usuario complete el mazo ni envíe el formulario.

La indisponibilidad temporal de Supabase sí debe impedir confirmar el envío del formulario, pero la UI deberá mostrar un estado recuperable y no perder silenciosamente la información introducida.

---

# 3. Arquitectura general

```text
                                      ┌──────────────────────┐
                                      │        Usuario       │
                                      │ Mobile / Desktop     │
                                      │ TikTok / Instagram WV│
                                      └──────────┬───────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────┐
                                  │       Next.js App       │
                                  │                         │
                                  │ React + TypeScript      │
                                  │ Tailwind CSS            │
                                  │ shadcn/ui               │
                                  │ Motion                  │
                                  │ Zustand                 │
                                  │ Zod                     │
                                  └──────────┬──────────────┘
                                             │
                         ┌───────────────────┴──────────────────┐
                         │                                      │
                         ▼                                      ▼
                ┌─────────────────┐                  ┌──────────────────┐
                │     PostHog     │                  │     Supabase     │
                │                 │                  │                  │
                │ Events          │                  │ PostgreSQL       │
                │ Funnels         │                  │ Leads            │
                │ Behavior        │                  │ Feedback         │
                │ Session data    │                  │ Survey answers   │
                └─────────────────┘                  └──────────────────┘
                         │                                      │
                         └──────────────┬───────────────────────┘
                                        │
                                  session_id
                                  correlation
```

### 3.1 Flujo principal

```text
Landing
  ↓
landing_viewed
  ↓
Usuario pulsa "Empezar mazo"
  ↓
deck_started
  ↓
Cards
  ↓
card_viewed / card_flipped / question_answered
  ↓
Deck completado
  ↓
deck_completed
  ↓
Formulario
  ↓
Supabase INSERT
  ↓
feedback_submitted
```

---

# 4. Stack tecnológico

| Capa | Tecnología | Decisión |
|---|---|---|
| Framework | Next.js App Router | Sí |
| Lenguaje | TypeScript | Sí |
| Rendering | Static-first / SSG | Sí |
| Styling | Tailwind CSS | Sí |
| UI primitives | shadcn/ui | Sí |
| Iconos | Lucide React | Sí |
| Animaciones | Motion for React | Sí |
| Estado cliente | Zustand | Sí |
| Validación | Zod | Sí |
| Base de datos | Supabase PostgreSQL | Sí |
| Analytics | PostHog | Sí |
| Hosting | Cloudflare Pages / static hosting compatible | Sí |
| Testing unitario | Vitest | Sí |
| E2E | Playwright | Sí |
| Control de versiones | GitHub | Sí |

No se fijan versiones exactas de dependencias en este documento. Las versiones concretas se definirán en `package.json` al iniciar el repositorio y se mantendrán mediante lockfile.

---

# 5. Frontend

## 5.1 Next.js

Next.js será utilizado como framework principal con App Router.

El MVP será esencialmente estático. El objetivo es evitar un servidor de aplicación persistente para este experimento.

La landing, metadata y contenido del mazo se construirán en build time. Los Client Components se limitarán a las zonas que necesitan interacción, estado o APIs del navegador.

## 5.2 Server Components vs Client Components

### Server Components

Por defecto:

- layout global;
- landing estática;
- textos de marketing;
- metadata SEO/Open Graph;
- secciones informativas;
- wrappers sin interacción.

### Client Components

Se reservarán para:

- deck player;
- flashcards;
- gestos y navegación;
- Zustand store;
- animaciones interactivas;
- captura de eventos PostHog;
- formulario de feedback;
- integración con Supabase desde el navegador, cuando corresponda.

No se marcará toda la aplicación como `use client`.

---

# 6. Arquitectura de carpetas

La estructura definitiva de frontend queda como punto a refinar durante implementación, pero la propuesta inicial es:

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── demo/
│   │   └── page.tsx
│   ├── privacy/
│   │   └── page.tsx
│   └── terms/
│       └── page.tsx
│
├── components/
│   ├── landing/
│   ├── deck/
│   ├── cards/
│   ├── feedback/
│   └── ui/
│
├── data/
│   └── atomic-habits.ts
│
├── stores/
│   └── deck-store.ts
│
├── lib/
│   ├── analytics/
│   ├── supabase/
│   ├── validation/
│   └── utils/
│
├── types/
│   ├── deck.ts
│   └── analytics.ts
│
└── styles/
```

La estructura podrá ajustarse durante la implementación. No debe convertirse en una tarea de arquitectura independiente del MVP.

---

# 7. Estado de la aplicación — Zustand

Zustand será utilizado exclusivamente para el estado local del flujo del mazo.

No se utilizará como sustituto de server state ni como almacén universal de la aplicación.

## 7.1 Estado mínimo

```ts
interface DeckState {
  currentCardIndex: number;
  startedAt: number | null;
  completedAt: number | null;
  answers: Record<string, string>;
  flippedCards: Record<string, boolean>;
  completed: boolean;
}
```

## 7.2 Acciones

```text
startDeck()
nextCard()
previousCard()
flipCard(cardId)
answerQuestion(cardId, optionId)
completeDeck()
resetDeck()
```

No se persistirá este estado en localStorage en el MVP salvo que una necesidad real aparezca durante las pruebas.

La ausencia de persistencia es intencional: el requisito actual no contempla progreso multi-sesión.

---

# 8. Modelo de dominio del mazo

El contenido del mazo no se hardcodeará dentro de JSX.

Se definirá como datos tipados.

## 8.1 Tipos de tarjeta

```text
Deck
 ├── metadata
 └── cards[]
       ├── FlipCard
       └── MultipleChoiceCard
```

### FlipCard

```ts
interface FlipCard {
  id: string;
  type: 'flip';
  hook: string;
  front: string;
  back: string;
}
```

### MultipleChoiceCard

```ts
interface MultipleChoiceCard {
  id: string;
  type: 'multiple-choice';
  hook: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation: string;
}
```

### Deck

```ts
interface Deck {
  id: string;
  slug: string;
  title: string;
  bookTitle: string;
  cardCount: number;
  cards: DeckCard[];
}
```

Para el MVP, `atomic-habits.ts` será la fuente de verdad del contenido del mazo.

En una fase posterior, este modelo podrá pasar de archivos estáticos a tablas de Supabase sin cambiar el contrato visual de los componentes.

---

# 9. UX del mazo

## 9.1 Flujo

```text
/               Landing
│
└── /demo       Deck player
                   │
                   ├── card 1
                   ├── card 2
                   ├── ...
                   ├── card N
                   │
                   └── completion
                          │
                          └── feedback form
```

## 9.2 Navegación

Se soportará:

- botón Anterior;
- botón Siguiente;
- tap/click para flip en tarjetas Tipo A;
- swipe horizontal en móvil.

El gesto nunca será el único método de navegación.

## 9.3 Progreso

Siempre visible:

```text
Tarjeta X de Y
██████████░░░░░░░░
```

El progreso será derivado del estado local y no requerirá llamadas al backend.

## 9.4 Feedback Tipo B

Al seleccionar una opción:

1. se bloquea la pregunta para evitar múltiples respuestas;
2. se determina `correcta`;
3. se muestra feedback visual inmediato;
4. se muestra una explicación corta;
5. se registra `question_answered`;
6. el usuario puede continuar aunque la respuesta sea incorrecta.

---

# 10. Sistema visual

## 10.1 Tema

El MVP tendrá únicamente **Light Mode**.

No habrá selector de tema, detección de preferencia del sistema ni Dark Mode.

## 10.2 Paleta base

Se conservarán los colores definidos en `requirements.md`:

```css
--cool-sky: #5aa9e6;
--sky-blue: #7fc8f8;
--bright-snow: #f9f9f9;
--royal-gold: #ffe45e;
--rose-kiss: #ff6392;

--soft-green: #a8e6cf;
--soft-green-dark: #71c6a6;
--soft-red: #ffaaa5;
--soft-red-dark: #d97570;
```

También se conservarán las variantes claras y oscuras ya definidas en requirements.

## 10.3 Tokens

Los componentes consumirán tokens semánticos y no valores hexadecimales dispersos por el código.

Ejemplo conceptual:

```text
brand
brand-hover
surface
surface-muted
text
text-muted
success
success-border
error
error-border
```

## 10.4 Diseño responsive

Prioridad:

```text
360px → 430px
↓
tablet
↓
desktop
```

Requisitos clave:

- sin scroll horizontal involuntario;
- objetivos táctiles mínimos de 48x48px;
- contenido principal accesible con el pulgar;
- tarjetas centradas y legibles en pantallas pequeñas.

---

# 11. Supabase

## 11.1 Responsabilidad

Supabase almacenará únicamente información persistente de negocio enviada mediante el formulario de cierre.

No se utilizará Supabase como almacén principal de todos los eventos analíticos.

## 11.2 Datos MVP

Se propone una tabla única de submissions para minimizar complejidad:

```text
feedback_submissions
--------------------
id
session_id
email
rating
requested_book
methodology_score
would_pay
consent
created_at
```

En el MVP no es necesario separar prematuramente `leads`, `feedback` y `survey_answers` en tablas distintas, porque todas estas respuestas pertenecen a una misma interacción final.

## 11.3 Tipos

```text
id                  UUID / primary key
session_id          text
email               text
rating              smallint
requested_book      text nullable
methodology_score   smallint
would_pay           text
consent             boolean
created_at          timestamptz
```

Restricciones recomendadas:

```text
rating ∈ [1, 5]
methodology_score ∈ [1, 5]
would_pay ∈ {'yes', 'maybe', 'no'}
consent = true para un envío considerado válido
```

La validación de entrada ocurrirá tanto en frontend como en la base de datos cuando sea razonable.

## 11.4 `session_id`

Se generará un UUID por sesión de mazo/visita relevante.

Ejemplo:

```text
session_id = 7f8f9d8e-...
```

El mismo ID se incluirá en:

- propiedades de eventos PostHog;
- fila de `feedback_submissions`;
- logs internos de debugging cuando resulte necesario.

No se utilizará el email como identificador de correlación de analytics.

## 11.5 Seguridad

La clave de servicio de Supabase (`service_role`) nunca llegará al navegador.

Si el cliente realiza el `INSERT` directamente mediante Supabase Data API, se utilizará una clave pública/publishable y políticas RLS estrictas.

Modelo esperado para `feedback_submissions`:

```text
anon
 ├── INSERT ✅
 ├── SELECT ❌
 ├── UPDATE ❌
 └── DELETE ❌
```

La política exacta dependerá de la forma final de insertar los datos.

RLS debe estar habilitado antes de exponer la tabla y las políticas/grants deberán probarse explícitamente.

---

# 12. PostHog

## 12.1 Responsabilidad

PostHog será la fuente de verdad para:

- comportamiento;
- funnel;
- abandono;
- progreso de sesión;
- interacción con tarjetas;
- métricas de adquisición asociadas a UTM;
- análisis de producto.

## 12.2 Evento de sesión

Todos los eventos deberán contener:

```text
session_id
```

y utilizarán un nombre de evento consistente en inglés.

---

# 13. Contrato definitivo de Analytics

Los nombres y propiedades del `requirements.md` se consideran funcionalmente cerrados. El diseño técnico los normaliza a nombres de eventos en inglés para mantener consistencia en el código.

## 13.1 `landing_viewed`

Se dispara una vez al cargar la landing.

Propiedades:

```ts
{
  session_id: string;
  utm_source: string | null;
  utm_campaign: string | null;
  device: 'mobile' | 'tablet' | 'desktop';
}
```

Opcionalmente podrán añadirse otros UTM si posteriormente son necesarios, pero no son requeridos por el MVP.

## 13.2 `deck_started`

Se dispara cuando el usuario pulsa "Empezar mazo".

Propiedades:

```ts
{
  session_id: string;
  deck_id: string;
  card_count: number;
}
```

## 13.3 `card_viewed`

Se dispara cuando una tarjeta pasa a ser la tarjeta activa.

Propiedades:

```ts
{
  session_id: string;
  deck_id: string;
  card_id: string;
  card_number: number;
  card_type: 'flip' | 'multiple-choice';
  time_on_previous_card_ms: number | null;
}
```

La propiedad del requirements `tiempo_en_tarjeta` se normaliza a tiempo sobre la tarjeta anterior al entrar en la nueva tarjeta. En la última tarjeta, el tiempo final de sesión podrá calcularse desde `deck_completed`.

## 13.4 `card_flipped`

Se dispara cuando una tarjeta Tipo A es volteada.

Propiedades:

```ts
{
  session_id: string;
  deck_id: string;
  card_id: string;
  card_number: number;
}
```

El evento representa la interacción de flip, no una nueva vista.

## 13.5 `question_answered`

Se dispara al seleccionar una opción en una tarjeta Tipo B.

Propiedades:

```ts
{
  session_id: string;
  deck_id: string;
  card_id: string;
  card_number: number;
  correct: boolean;
  selected_option_id: string;
}
```

No se enviará el texto completo de la opción si el ID resulta suficiente para el análisis.

## 13.6 `deck_abandoned`

Se dispara cuando el usuario abandona el flujo antes de llegar a completion y existe una señal fiable de abandono.

Propiedades:

```ts
{
  session_id: string;
  deck_id: string;
  last_card_number: number;
  elapsed_time_ms: number;
}
```

El disparo no dependerá exclusivamente de `beforeunload`, dado que los navegadores móviles y WebViews pueden terminar la página sin garantizar este evento.

Como estrategia principal, se podrá detectar abandono mediante una combinación de visibilidad, navegación fuera del flujo y ausencia de continuidad cuando exista una oportunidad razonable de hacerlo. El objetivo del MVP es capturar una aproximación útil, no construir un sistema perfecto de attribution.

## 13.7 `deck_completed`

Se dispara al llegar a la pantalla de cierre.

Propiedades:

```ts
{
  session_id: string;
  deck_id: string;
  card_count: number;
  total_session_time_ms: number;
}
```

El evento deberá enviarse una sola vez por sesión.

## 13.8 `feedback_submitted`

Se dispara después de que Supabase confirme correctamente el almacenamiento del formulario.

Propiedades:

```ts
{
  session_id: string;
  deck_id: string;
  rating: number;
  methodology_score: number;
  would_pay: 'yes' | 'maybe' | 'no';
  has_requested_book: boolean;
}
```

El email no se enviará como propiedad de analytics.

El evento confirma que el envío persistente fue aceptado.

---

# 14. Reglas de Analytics

## 14.1 Naming

Los eventos usarán `snake_case` en inglés.

Ejemplo:

```text
correcto: question_answered
incorrecto: pregunta_respondida
incorrecto: questionAnswered
```

## 14.2 Idempotencia lógica

Eventos que representan una acción única deberán emitirse una sola vez por acción relevante.

En particular:

- `deck_started`: una vez por sesión de mazo;
- `deck_completed`: una vez por sesión de mazo;
- `feedback_submitted`: una vez por formulario enviado correctamente.

## 14.3 Privacidad

No enviar a PostHog:

- email;
- contenido libre introducido por el usuario;
- información personal innecesaria.

El texto libre `requested_book` se almacena en Supabase y no se replicará automáticamente como evento analítico.

---

# 15. Landing y adquisición

## 15.1 Open Graph

Open Graph forma parte del MVP porque el producto puede distribuirse mediante enlaces desde WhatsApp, Instagram, TikTok, X u otras superficies.

Se implementará:

- title;
- description;
- canonical;
- Open Graph title;
- Open Graph description;
- Open Graph image;
- metadata de Twitter/X cuando corresponda;
- favicon;
- robots;
- sitemap.

## 15.2 UTM

La landing leerá y conservará, al menos:

```text
utm_source
utm_campaign
```

El valor disponible al inicio de sesión se asociará al evento `landing_viewed`.

No se requiere una plataforma adicional de attribution para el MVP.

---

# 16. Formularios y validación

Zod será la fuente de verdad de validación en frontend.

Esquema conceptual:

```text
email
 └── formato válido

rating
 └── integer 1..5

methodology_score
 └── integer 1..5

would_pay
 └── yes | maybe | no

requested_book
 └── opcional

consent
 └── debe ser true
```

La validación de UI no reemplaza la validación de base de datos/RLS.

---

# 17. Manejo de errores

## 17.1 PostHog falla

El producto continúa funcionando.

```text
UI
 ↓
intenta enviar evento
 ↓
PostHog falla
 ↓
error se captura silenciosamente
 ↓
usuario continúa normalmente
```

Analytics es secundario frente al flujo del producto.

## 17.2 Supabase falla al enviar formulario

```text
Submit
 ↓
Supabase error
 ↓
NO confirmar envío
 ↓
mostrar mensaje de error recuperable
 ↓
conservar datos del formulario en memoria
 ↓
permitir retry
```

No mostrar una pantalla de éxito si la persistencia no fue confirmada.

## 17.3 Errores inesperados

Los errores no controlados se registrarán de forma que permitan debugging sin introducir un sistema adicional de observabilidad en el MVP, salvo que durante desarrollo se determine que resulta necesario.

---

# 18. Testing

El testing se orientará principalmente a verificar que el funnel funciona correctamente y que las integraciones producen los efectos esperados.

No se priorizará una cobertura exhaustiva de detalles visuales.

## 18.1 Unit tests

Se probarán principalmente:

- validación Zod;
- transición de estado del deck;
- validación de respuestas;
- construcción de payloads de analytics;
- cálculo de progreso;
- reglas de finalización.

## 18.2 E2E principal

Debe existir como mínimo un flujo crítico:

```text
Landing
  ↓
Start deck
  ↓
Recorrer cards
  ↓
Responder una pregunta
  ↓
Completar deck
  ↓
Completar formulario
  ↓
Submit
```

Assertions mínimas:

```text
✓ deck_completed se genera
✓ feedback_submitted se genera después de persistencia exitosa
✓ request a Supabase ocurre
✓ request contiene payload esperado
✓ request a PostHog contiene event name esperado
✓ el usuario llega a la pantalla final
```

---

# 19. Estrategia de mocking en E2E

La regla del MVP será:

> Las dependencias externas deben estar mockeadas siempre que el objetivo del test sea comprobar el comportamiento de la aplicación y no la disponibilidad del proveedor.

Playwright permite inspeccionar, interceptar y mockear tráfico HTTP del navegador, por lo que puede utilizarse para verificar requests sin depender de la disponibilidad real de los servicios externos.

## 19.1 Test principal de funnel

Se recomienda mockear las respuestas de:

- PostHog;
- Supabase.

Pero **no** mockear la lógica interna de la aplicación que construye los requests.

Se comprobará que:

```text
UI action
 ↓
request real de la app
 ↓
request interceptada por Playwright
 ↓
payload correcto
```

Esto permite probar que la aplicación sí intenta enviar la información correcta sin que el CI dependa de PostHog o Supabase.

## 19.2 Test de error de Supabase

Mock:

```text
Supabase → 500 / error controlado
```

Esperamos:

- no mostrar éxito;
- mantener los datos del formulario;
- mostrar error;
- permitir retry.

## 19.3 Test de error de PostHog

Mock:

```text
PostHog → network failure / error
```

Esperamos:

- el deck sigue funcionando;
- el usuario puede completar el mazo;
- ninguna excepción rompe la UI.

## 19.4 Test opcional contra Supabase real

No será parte del test E2E obligatorio del CI inicial.

Podrá existir un test de integración ejecutado bajo demanda para verificar que RLS, grants e INSERT funcionan realmente en un proyecto de test.

Ese test debe limpiar los datos creados después de ejecutarse.

---

# 20. Pruebas de red

Playwright se utilizará para observar requests y respuestas de red.

Para integraciones críticas se comprobarán:

```text
HTTP method
URL / endpoint
payload
status esperado
```

Los tests no deben depender del dashboard de PostHog ni del dashboard de Supabase como parte del flujo E2E.

La validación se realizará desde el navegador y, cuando exista un test de integración específico, desde API/DB de test.

---

# 21. Accesibilidad mínima

El MVP deberá cumplir al menos:

- controles navegables por teclado en desktop;
- foco visible;
- labels asociados a inputs;
- botones semánticos;
- feedback de respuesta no dependiente exclusivamente del color;
- contraste razonable;
- target táctil mínimo de 48x48px.

No se buscará certificación formal WCAG en esta fase.

---

# 22. Rendimiento

Objetivo principal:

```text
LCP < 1.5s
```

Priorización:

1. contenido estático;
2. mínimo JavaScript inicial;
3. imágenes optimizadas;
4. evitar dependencias innecesarias;
5. fuentes limitadas;
6. componentes interactivos aislados.

Reglas:

- no video de fondo en hero;
- no imágenes gigantes;
- no librerías globales innecesarias;
- no cargar analytics bloqueando el render principal;
- no convertir todo el árbol en Client Components.

---

# 23. Seguridad y privacidad

## 23.1 Principios

- no almacenar secretos en cliente;
- no enviar service keys al navegador;
- mínima captura de datos personales;
- consentimiento explícito;
- RLS en tablas expuestas;
- no replicar email en analytics;
- validar entradas en cliente y servidor/base de datos cuando corresponda.

## 23.2 Datos personales

El MVP únicamente requiere el email como dato personal persistente, además de las respuestas proporcionadas voluntariamente en el formulario.

El checkbox de consentimiento permanecerá desmarcado por defecto.

El texto legal de `requirements.md` será la referencia de contenido para el MVP.

---

# 24. Environment variables

Solo se expondrán al cliente variables destinadas explícitamente a ello.

Conceptualmente:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_POSTHOG_HOST
```

Nunca:

```text
SUPABASE_SERVICE_ROLE_KEY
```

En caso de introducir funciones server-side posteriormente, los secretos se mantendrán exclusivamente del lado servidor.

---

# 25. Deployment

El deployment inicial deberá ser compatible con una aplicación estática de Next.js.

Se propone:

```text
GitHub
   ↓
CI / build
   ↓
Static Next.js output
   ↓
Cloudflare Pages o hosting estático equivalente
```

La decisión de hosting debe mantenerse compatible con el objetivo de costo inicial $0 y con el uso comercial futuro del producto.

No se desplegará:

- servidor Node dedicado;
- contenedor Docker;
- VM;
- Kubernetes;
- base de datos propia.

---

# 26. CI/CD mínimo

El pipeline inicial debe ejecutar:

```text
install
 ↓
lint
 ↓
typecheck
 ↓
unit tests
 ↓
build
 ↓
E2E (cuando el entorno sea estable)
```

El deployment se realizará únicamente cuando estos pasos críticos pasen.

No se requiere un sistema de CI complejo para el MVP.

---

# 27. Costos

Objetivo arquitectónico:

```text
Next.js             $0
React               $0
Tailwind            $0
shadcn/ui            $0
Motion              $0
Zustand             $0
Zod                 $0
Supabase            $0* 
PostHog             $0*
Cloudflare          $0*
GitHub              $0*

*MVP dentro de límites gratuitos
```

No se diseñará ninguna parte del sistema suponiendo gasto mensual antes de validar el producto.

---

# 28. Decisiones explícitas de alcance

## Incluido

- landing pública;
- mazo demo de Hábitos Atómicos;
- 8–12 tarjetas;
- flip cards;
- multiple choice;
- progreso;
- swipe;
- completion screen;
- confetti;
- formulario de email/rating/feedback/encuesta;
- Supabase;
- PostHog;
- correlación por `session_id`;
- Open Graph;
- mobile-first;
- light mode;
- tests del funnel crítico.

## Fuera del MVP

- dark mode;
- autenticación;
- perfiles;
- guardado de progreso;
- múltiples libros;
- spaced repetition;
- app nativa;
- push notifications;
- campañas automatizadas;
- CMS;
- administración de contenido;
- dashboard propio de analytics;
- arquitectura backend dedicada.

---

# 29. Evolución prevista

El diseño actual no debe bloquear la evolución posterior.

## Fase 2 — Producto real

```text
Supabase
 ├── users
 ├── books
 ├── decks
 ├── cards
 └── progress
```

Podrían incorporarse:

- autenticación;
- múltiples libros;
- repetición espaciada;
- progreso persistente;
- biblioteca personal.

## Fase 3 — Operación de contenido

```text
Admin / CMS
     ↓
Book
     ↓
Deck generation
     ↓
Human review
     ↓
Publish
```

## Fase 4 — Backend dedicado

Solo si el producto desarrolla necesidades que justifiquen:

- jobs;
- colas;
- procesamiento pesado;
- pagos;
- APIs complejas;
- integraciones externas;
- arquitectura multi-servicio.

En ese punto podría introducirse NestJS u otra capa backend.

---

# 30. Pendientes técnicos deliberadamente abiertos

Los siguientes temas no se consideran bloqueantes para cerrar el diseño arquitectónico del MVP y se concretarán durante implementación:

### 30.1 Arquitectura frontend final

Definir con mayor detalle:

- composición exacta de componentes;
- boundaries finales de Server/Client Components;
- implementación específica del Zustand store;
- convenciones de naming;
- organización final de carpetas.

### 30.2 Design system detallado

Definir en implementación:

- tipografía concreta;
- escala de spacing;
- radius tokens;
- shadows;
- motion tokens;
- variantes completas de botones, inputs y cards.

Estos detalles no deben retrasar el inicio del MVP.

---

# 31. Criterio de aceptación técnico del MVP

El MVP se considera técnicamente funcional cuando el flujo completo puede ejecutarse de principio a fin:

```text
Usuario
 ↓
Landing
 ↓
Start
 ↓
Deck
 ↓
Cards
 ↓
Completion
 ↓
Feedback form
 ↓
Supabase
```

y simultáneamente:

```text
Usuario
 ↓
PostHog events
 ↓
Funnel observable
```

Además:

```text
✓ PostHog caído → producto sigue funcionando
✓ Supabase caído → formulario muestra error recuperable
✓ RLS evita lectura pública de submissions
✓ Email nunca se envía como propiedad de analytics
✓ E2E verifica requests/payloads
✓ build pasa
✓ typecheck pasa
✓ tests críticos pasan
```

---

# 32. Resumen de decisiones

```text
                        RECALLBOOK MVP
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
         Frontend           Data            Testing
             │                │                │
        Next.js          Supabase          Playwright
        TypeScript       PostgreSQL        + mocks
        Tailwind         submissions      network checks
        shadcn           RLS
        Motion                +
        Zustand           PostHog
        Zod              analytics
             │                │
             └──────── session_id ─────────────┘
```

La regla fundamental de la arquitectura es:

> **Construir solamente lo necesario para medir correctamente la experiencia y aprender del comportamiento real de los usuarios.**

El backend, autenticación, persistencia de progreso, múltiples libros, spaced repetition y demás complejidad se introducirán únicamente cuando los resultados del MVP justifiquen su costo.

---

# 33. Referencias técnicas

- Next.js — Static Exports: https://nextjs.org/docs/app/guides/static-exports
- Supabase JavaScript: https://supabase.com/docs/reference/javascript/installing
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Playwright Network: https://playwright.dev/docs/network
- Playwright API Testing: https://playwright.dev/docs/api-testing
- PostHog: https://posthog.com/
