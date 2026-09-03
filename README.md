# RecallBook

RecallBook es una aplicación web de aprendizaje basada en **Active Recall**, diseñada para transformar las ideas clave de los libros en sesiones cortas e interactivas mediante flashcards.

El MVP busca validar la propuesta de valor antes de construir la plataforma completa: que los usuarios **inicien y terminen un mazo**, perciban utilidad en la metodología y demuestren intención de seguir usando el producto.

## MVP

El MVP está compuesto por:

- Landing page pública sin autenticación.
- Mazo demo de **Hábitos Atómicos** con 8–12 tarjetas.
- Flashcards de dos tipos:
  - **Flip Card:** enseñanza en frente/reverso.
  - **Multiple Choice:** aplicación práctica mediante recuerdo activo.
- Navegación mediante botones y swipe en dispositivos móviles.
- Indicador de progreso.
- Pantalla de finalización con feedback visual.
- Formulario de email, rating y encuesta.
- Analítica del funnel mediante PostHog.
- Persistencia de feedback mediante Supabase.
- Diseño mobile-first optimizado para WebViews de TikTok e Instagram.

## Flujo

```text
Landing
   ↓
Start deck
   ↓
Cards
   ↓
Deck completed
   ↓
Feedback form
   ↓
Supabase

        └── PostHog → Funnel & product analytics
```

Cada sesión utiliza un `session_id` para correlacionar el comportamiento registrado en PostHog con el envío final del formulario.

## Stack

| Capa            | Tecnología           |
| --------------- | -------------------- |
| Framework       | Next.js + App Router |
| Lenguaje        | TypeScript           |
| Styling         | Tailwind CSS         |
| UI              | shadcn/ui            |
| Iconos          | Lucide React         |
| Animaciones     | Motion               |
| Estado cliente  | Zustand              |
| Validación      | Zod                  |
| Database        | Supabase PostgreSQL  |
| Analytics       | PostHog              |
| Unit testing    | Vitest               |
| E2E testing     | Playwright           |
| Version control | GitHub               |

La aplicación sigue un enfoque **static-first**. Los Server Components se utilizan por defecto y los Client Components se reservan para las zonas que requieren interacción, estado o APIs del navegador.

## Analytics

Los eventos principales utilizan `snake_case` y se asocian a un `session_id`:

```text
landing_viewed
deck_started
card_viewed
card_flipped
question_answered
deck_abandoned
deck_completed
feedback_submitted
```

PostHog se utiliza para comportamiento, funnels, abandono y engagement. El email y otros datos personales no se envían como propiedades de analytics.

## Supabase

El MVP utiliza una tabla `feedback_submissions` para almacenar las respuestas del formulario:

```text
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

La tabla debe utilizar **Row Level Security (RLS)**. El cliente únicamente necesita permisos de inserción; las operaciones de lectura, actualización y eliminación no deben estar expuestas públicamente.

La `service_role` key nunca debe llegar al navegador.

Las variables públicas deben contener únicamente credenciales destinadas al cliente.

## Desarrollo

Instalar dependencias:

```bash
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Por defecto, la aplicación estará disponible en:

```text
http://localhost:3000
```

Los scripts disponibles dependen de la configuración del `package.json`, pero el pipeline esperado es:

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
E2E
```

## Testing

El objetivo principal del testing es proteger el funnel crítico y las integraciones.

### Unit tests

Se priorizan:

- validación con Zod;
- transiciones del estado del deck;
- respuestas de las preguntas;
- progreso;
- reglas de finalización;
- payloads de analytics.

### E2E

El flujo principal debe cubrir:

```text
Landing
  ↓
Start deck
  ↓
Recorrer cards
  ↓
Responder pregunta
  ↓
Completar deck
  ↓
Enviar formulario
```

Las integraciones externas pueden mockearse con Playwright para comprobar requests y payloads sin depender de la disponibilidad de PostHog o Supabase.

## Rendimiento y UX

El proyecto prioriza:

- Mobile-first desde 360px.
- Targets táctiles mínimos de 48×48px.
- Sin scroll horizontal involuntario.
- LCP objetivo < 1.5s.
- JavaScript inicial mínimo.
- Componentes interactivos aislados.
- Compatibilidad con WebViews de TikTok e Instagram.
- Accesibilidad básica mediante navegación por teclado, foco visible, labels semánticos y feedback no dependiente únicamente del color.

## Alcance

### Incluido

- Landing.
- Mazo demo de Hábitos Atómicos.
- 8–12 tarjetas.
- Active Recall mediante flip y multiple choice.
- Progreso y navegación móvil.
- Completion screen.
- Feedback y encuesta.
- Supabase.
- PostHog.
- `session_id`.
- Open Graph.
- Mobile-first.
- Tests del funnel crítico.

### Fuera del MVP

- Autenticación.
- Perfiles.
- Persistencia de progreso.
- Múltiples libros.
- Spaced repetition.
- App nativa.
- Push notifications.
- CMS.
- Administración de contenido.
- Backend dedicado.
- Dashboard propio de analytics.

## Métricas de validación

El MVP busca validar principalmente:

| Métrica              |  Objetivo |
| -------------------- | --------: |
| Tasa de inicio       |     > 50% |
| Tasa de finalización |     > 60% |
| Captura de email     |     > 25% |
| Rating promedio      | > 4.0 / 5 |
| Score de metodología | > 4.0 / 5 |

Estas métricas determinan si existe suficiente evidencia para avanzar hacia el producto completo.

## Evolución

La arquitectura está diseñada para crecer sin introducir complejidad prematuramente.

Una siguiente fase puede incorporar:

```text
users
books
decks
cards
progress
```

y posteriormente autenticación, múltiples libros, progreso persistente, spaced repetition y una capa de administración de contenido.

Un backend dedicado o infraestructura adicional solo se incorporará cuando las necesidades del producto lo justifiquen.

## Principio del proyecto

> Construir solamente lo necesario para medir correctamente la experiencia y aprender del comportamiento real de los usuarios.
