# Requerimientos del Producto — RecallBook / Bitácora

**MVP de Validación (Landing + Mazo Demo)**
**Versión:** 0.2
**Fecha:** Septiembre 2026
**Estado:** Aprobado para Desarrollo / Listo para Implementación

---

## 1. Resumen Ejecutivo

- **Nombre tentativo:** RecallBook / Bitácora
- **Categoría:** EdTech / Productividad personal — _Active Recall_ aplicado a libros.
- **Problema:** Las personas leen libros de autoayuda, negocios o filosofía, se motivan de 2 a 5 días, y luego olvidan el 90% del contenido (la "ilusión de aprendizaje"). Los resúmenes pasivos (Blinkist, audiolibros, texto plano) no generan retención real.
- **Solución:** Aplicación web interactiva estilo Duolingo + Anki. Ofrece mazos de _flashcards_ basados en los aprendizajes clave de un libro, utilizando recuerdo activo y (a futuro) repetición espaciada, en sesiones cortas de aproximadamente 3 minutos.
- **Objetivo de este documento:** Definir los requerimientos completos del MVP de validación: una _landing page_ pública con un mazo demo jugable, instrumentada para medir interés, _engagement_ y adopción de la metodología antes de construir el producto completo.

---

## 2. Objetivo del MVP

Este MVP es un experimento medible para validar tres hipótesis centrales de negocio e interacción:

1. **¿La gente termina el mazo?** (Validación de retención y formato).
2. **¿La gente deja su correo electrónico?** (Validación de intención de uso futuro).
3. **¿La gente percibe que la metodología les ayuda a recordar lo que lee?** (Validación de la propuesta de valor pedagógica).

🎯 **Criterio de éxito:** Definido en la **Sección 7**. El MVP se considera exitoso si alcanza los umbrales de métricas establecidos.

---

## 3. Alcance del MVP

### ✅ Incluido en el MVP

- **Landing Page Pública:** Sin necesidad de registro previa (_frictionless_).
- **Mazo Demo de "Hábitos Atómicos":** 8 a 12 tarjetas interactivas (las 3 primeras definidas como plantilla de referencia; el resto se estructurará siguiendo los patrones de la Sección 9).
- **Tipos de Tarjetas:**
  - **Tipo A:** Flip Card (Frente / Reverso).
  - **Tipo B:** Selección Múltiple (Aplicación práctica y recuerdo activo).
- **Formulario de Cierre:** Captura de email + calificación (1-5 estrellas) + campo de texto libre + mini-encuesta de metodología + checkbox legal.
- **Telemetría y Analítica:** Medición de _funnel_ completo evento por evento.
- **Diseño Mobile-First & WebViews:** Optimizado para navegadores _in-app_ de TikTok e Instagram.
- **Sistema de Diseño y Paleta de Colores:** Aplicación de la identidad visual oficial con variantes claras, oscuras y de estado (éxito/error).

### ❌ Fuera de Alcance (Fase 2+)

- Algoritmo de repetición espaciada (SM-2 de Anki).
- Sistema de autenticación, perfiles de usuario y guardado de progreso multi-sesión.
- Catálogo de múltiples libros.
- Aplicación móvil nativa (iOS/Android).
- Notificaciones push o secuencias automatizadas de email.

---

## 4. Requerimientos Funcionales (RF)

### RF-1. Navegador e Interacción de Tarjetas

- **RF-1.1 Tarjeta Tipo A (Flip Card / Principio):**
  - Frente: Presenta una situación detonante, mito o pregunta provocadora.
  - Reverso: Se revela mediante animación de giro (_flip_) al hacer tap/clic, mostrando la enseñanza central y su aplicación.
- **RF-1.2 Tarjeta Tipo B (Selección Múltiple / Aplicación):**
  - Se intercala cada 2 o 3 tarjetas de Tipo A.
  - Presenta un escenario cotidiano con 3 a 4 opciones de respuesta (1 correcta).
  - Opciones visuales con retroalimentación inmediata:
    - **Respuesta Correcta:** Borde/fondo en verde pastel, microinteracción positiva y breve explicación (1-2 líneas).
    - **Respuesta Incorrecta:** Borde/fondo en rojo pastel, resalta la opción correcta en verde pastel y muestra retroalimentación explicativa.
  - No frena el flujo del mazo al fallar (enfoque en aprendizaje, no en penalización).
- **RF-1.3 Controles de Navegación:**
  - Botones "Siguiente" y "Anterior" adaptados al alcance del pulgar en dispositivos móviles.
  - Soporte de gestos táctiles (_swipe_) horizontal.

### RF-2. Indicador de Progreso

- **RF-2.1 Visualización de Estado:** Barra de progreso superior interactiva y contador explícito ("Tarjeta X de Y") visible en todo momento.

### RF-3. Pantalla de Cierre y Captura de Datos

Al completar la última tarjeta del mazo:

- **RF-3.1 Celebración:** Animación de cierre con confeti y mensajes de logro.
- **RF-3.2 Captura de Email:** Campo para unirse a la lista de espera con validación de formato.
- **RF-3.3 Rating:** Selector de 1 a 5 estrellas para el mazo.
- **RF-3.4 Solicitud de Contenido:** Campo de texto libre ("¿Qué libro te gustaría ver en RecallBook?").
- **RF-3.5 Mini-Encuesta de Metodología:**
  1. _"¿Qué tan probable es que uses esto para recordar libros que ya leíste?"_ (Escala 1–5).
  2. _"¿Pagarías por acceso a más mazos de tus libros favoritos?"_ (Sí / Tal vez / No).
- **RF-3.6 Conformidad Legal:** Checkbox desmarcado por defecto para aceptación de términos de tratamiento de datos personales conforme a la Ley 1581 de 2012.

### RF-4. Telemetría y Registro de Eventos

Captura automática vía PostHog o Supabase:

- `landing_vista`: Carga inicial (propiedades: `utm_source`, `utm_campaign`, `device`).
- `mazo_iniciado`: Clic en "Empezar mazo".
- `tarjeta_vista`: Carga de tarjeta (`tarjeta_numero`, `tiempo_en_tarjeta`).
- `tarjeta_volteada`: Rotación de tarjeta Tipo A.
- `pregunta_respondida`: Selección en Tipo B (`tarjeta_numero`, `correcta`, `opcion_elegida`).
- `mazo_abandonado`: Abandono previo a la pantalla final.
- `mazo_completado`: Llegada a la pantalla final (`tiempo_total_sesion`).
- `formulario_enviado`: Envío del formulario de captura y encuesta.

---

## 5. Requerimientos No Funcionales (RNF)

- **RNF-1 Mobile-First Estricto:** Diseñado prioritariamente para pantallas móviles (360px–430px de ancho). Sin _scroll_ horizontal involuntario, con áreas táctiles mínimas de 48x48px.
- **RNF-2 Rendimiento Extremo:** Carga inicial (LCP) < 1.5 segundos. Implementación mediante Next.js estático (SSG/ISR).
- **RNF-3 Cero Fricción:** Acceso directo e instantáneo al mazo sin pasarelas de registro previas.
- **RNF-4 Manejo Seguro de Datos:** Almacenamiento seguro en Supabase, respetando la privacidad del usuario (Ley 1581 de 2012).
- **RNF-5 Hook Provocador:** Cada tarjeta debe iniciar con una pregunta o premisa que rompa expectativas, evitando definiciones enciclopédicas o aburridas.
- **RNF-6 Identidad Visual y Estética:** Uso coherente de la paleta de colores oficial, bordes redondeados suaves, tipografía nítida y motion design pulido.
- **RNF-7 Compatibilidad con WebViews:** Renderizado y ejecución de scripts probados en navegadores integrados de TikTok e Instagram.

---

## 6. Stack Técnico

| Capa              | Tecnología    | Razón                                                         |
| :---------------- | :------------ | :------------------------------------------------------------ |
| **Framework**     | Next.js       | Renderizado SSG/ISR optimizado para velocidad.                |
| **Estilos**       | Tailwind CSS  | Desarrollo ágil y gestión centralizada del sistema de diseño. |
| **Despliegue**    | Vercel        | CDN global de alto rendimiento y costo cero inicial.          |
| **Analítica**     | PostHog       | Registro cookieless de funnels y métricas de sesión.          |
| **Base de Datos** | Supabase      | Persistencia de emails, encuestas y métricas.                 |
| **Animaciones**   | Framer Motion | Animaciones de _flip_, transiciones y efectos de confeti.     |

---

## 7. Métricas y Criterios de Éxito

| Métrica                  | Definición                                     | Umbral de Éxito |
| :----------------------- | :--------------------------------------------- | :-------------- |
| **Tasa de Inicio**       | `mazo_iniciado / landing_vista`                | > 50%           |
| **Tasa de Finalización** | `mazo_completado / mazo_iniciado`              | > 60%           |
| **Tasa de Captura**      | `formulario_enviado (email) / mazo_completado` | > 25%           |
| **Rating Promedio**      | Calificación del mazo en estrellas             | > 4.0 / 5.0     |
| **Score de Metodología** | Pregunta sobre utilidad percibida              | > 4.0 / 5.0     |

---

## 8. Sistema de Diseño e Identidad Visual (Paleta de Colores)

El sistema visual de RecallBook se basa en tonos azules y blancos limpios como núcleo visual, complementados con tonos pastel para estados de interacción y variantes claras/oscuras para dar flexibilidad al diseño.

### 8.1 Paleta Base

```css
/* Colores Principales */
--cool-sky: #5aa9e6; /* Azul primario / Acentos de marca */
--sky-blue: #7fc8f8; /* Azul secundario / Estados hover / Highlights */
--bright-snow: #f9f9f9; /* Fondo principal / Tarjetas / Limpieza visual */
--royal-gold: #ffe45e; /* Acento de celebración / Estrellas / Callouts */
--rose-kiss: #ff6392; /* Acento secundario / Badges / Microinteracciones */
```

### 8.2 Colores de Estado Integrados (Pasteles)

````css
/* Estados de Retroalimentación (Tipo B) */
--soft-green: #a8e6cf; /* Verde pastel - Respuesta correcta / Éxito */
--soft-green-dark: #71c6a6; /* Verde pastel oscuro - Bordes / Texto activo */
--soft-red: #ffaaa5; /* Rojo pastel - Respuesta incorrecta / Error */
--soft-red-dark: #d97570; /* Rojo pastel oscuro - Bordes / Texto de error */
```css
````

### 8.3 Escala de Variantes (Claras y Oscuras)

```css
/* Variantes para componentes, sombras y jerarquía */
--cool-sky-light: #e8f4fc;
--cool-sky-dark: #327ab3;

--sky-blue-light: #f0f8fe;
--sky-blue-dark: #4fa0d8;

--bright-snow-dark: #e5e5e5; /* Gris claro para bordes sutiles */

--royal-gold-light: #fff8d6;
--royal-gold-dark: #c9af26;

--rose-kiss-light: #ffe6ee;
--rose-kiss-dark: #c73863;
```

---

## 9. Estrategia de Contenido y Estructura del Mazo Demo

### 9.1 Mezcla de Mecánicas

- **Total de Tarjetas:** 8 a 12 tarjetas en la versión final.
- **Distribución:** ~70% Tipo A (Flip) y ~30% Tipo B (Selección múltiple intercalada).
- **Regla de Contenido:** Todas las tarjetas deben seguir la **Fórmula del Hook** para mantener el compromiso del usuario.

### 9.2 Fórmula del Hook

> _"¿Por qué [creencia/hábito tradicional] puede ser la razón de [tu problema/dolor específico]?"_

Patrones aceptados:

1. **Mito derribado:** Contradice directamente una creencia popular.
2. **Dato contraintuitivo:** Declaración directa que rompe esquemas.
3. **Espejo directo:** Apela a una experiencia cotidiana del lector en segunda persona ("tú").
4. **Reto de creencia:** Plantea una paradoja entre lo que se cree y lo que enseña el autor.

### 9.3 Tarjetas de Referencia (Plantillas del Mazo "Hábitos Atómicos")

#### Tarjeta 1 — Tipo A (Mito Derribado) — CONFIRMADA

- **Frente:** "¿Por qué tener metas demasiado altas puede ser la razón de tu fracaso?"
- **Reverso:** "No caes al nivel de tus metas — caes al nivel de tus sistemas. Fijarte una meta no cambia nada si no cambias el proceso diario que te lleva (o no) hasta ahí."

#### Tarjeta 2 — Tipo A (Espejo Directo) — PLANTILLA

- **Frente:** "¿Alguna vez empezaste algo con toda la motivación... y lo dejaste en 2 semanas?"
- **Reverso:** "No fue falta de disciplina. Fue que dependiste de la motivación en vez de construir un sistema que funcione incluso los días en que no tienes ganas."

#### Tarjeta 3 — Tipo B (Selección Múltiple) — PLANTILLA

- **Situación:** "Quieres leer más, pero cada noche terminas viendo el celular en la cama. Según Hábitos Atómicos, ¿cuál es la estrategia más efectiva?"
- **Opciones:**
- A) Ponerte más fuerza de voluntad.
- B) Dejar el libro sobre la almohada y el celular en otra habitación. ✅
- C) Prometerte que mañana sí lees.
- D) Leer solo los fines de semana.

- **Retroalimentación (Correcta / Incorrecta):** "Exacto — reduce la fricción del hábito bueno y aumenta la del malo. El ambiente gana más peleas que la voluntad."

_(Nota: Las tarjetas 4 a 12 se redactarán utilizando los patrones y colores definidos en este documento)._

---

## 10. Aviso Legal y Privacidad (Ley 1581 de 2012)

### Checkbox del Formulario (Obligatorio, desmarcado por defecto)

> ☐ Acepto que mi correo electrónico sea utilizado para recibir novedades de RecallBook. Puedo cancelar mi suscripción en cualquier momento.

### Leyenda Visible en Formulario

> Tu correo solo se utilizará para notificarte sobre el lanzamiento. No compartimos ni vendemos tus datos a terceros. Puedes solicitar la eliminación de tus datos escribiendo a [email de contacto].

---

## 11. Estado de Preguntas y Definiciones

| Aspecto                | Estado    | Definición                                                                         |
| ---------------------- | --------- | ---------------------------------------------------------------------------------- |
| **Número de Tarjetas** | CERRADO   | 8 a 12 tarjetas por mazo demo.                                                     |
| **Mecánicas de Juego** | CERRADO   | Tipo A (Flip Card) + Tipo B (Selección Múltiple).                                  |
| **Identidad Visual**   | CERRADO   | Paleta de colores oficial con variantes claras, oscuras y de estado.               |
| **Hook Inicial**       | CERRADO   | Confirmado y normado mediante la Fórmula del Hook.                                 |
| **Adquisición / Ads**  | PENDIENTE | Se definirá en el documento independiente _"Requerimientos de Campaña TikTok/IG"_. |
