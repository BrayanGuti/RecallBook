import { Deck } from "@/types/deck";

export const atomicHabitsDeck: Deck = {
  id: "atomic-habits-demo",
  title: "Hábitos Atómicos: Conceptos Clave",
  bookTitle: "Hábitos Atómicos",
  author: "James Clear",
  cards: [
    {
      id: 1,
      type: "A",
      pattern: "mito_derribado",
      front:
        "¿Por qué tener metas demasiado altas puede ser la razón directa de tu fracaso?",
      back: {
        concept: "No caes al nivel de tus metas caes al nivel de tus sistemas.",
        application:
          "Los ganadores y perdedores tienen exactamente las mismas metas. Fijarte un objetivo no cambia nada si no cambias el proceso diario que te lleva hasta ahí.",
      },
    },
    {
      id: 2,
      type: "A",
      pattern: "reto_creencia",
      front:
        "¿Por qué esforzarte por tener más disciplina garantiza que termines volviendo a tus malos hábitos?",
      back: {
        concept:
          "Las personas con 'autocontrol' no luchan contra la tentación; diseñan su entorno para evitarla.",
        application:
          "Si para trabajar concentrado necesitas resistir la tentación de mirar el teléfono, tarde o temprano cederás. Saca el teléfono de la habitación.",
      },
    },
    {
      id: 3,
      type: "B",
      question:
        "Quieres leer más cada noche, pero apenas te acuestas terminas cayendo en la trampa de mirar el celular hasta tarde. Según la ley de Hacerlo obvio, ¿cuál es la única estrategia que funciona?",
      options: [
        {
          id: "opt1",
          text: "Prometerte con fuerza a medianoche que mañana sí vas a tener disciplina.",
          isCorrect: false,
        },
        {
          id: "opt2",
          text: "Dejar el libro sobre tu almohada en la mañana y el celular en otra habitación.",
          isCorrect: true,
        },
        {
          id: "opt3",
          text: "Poner una alarma ruidosa a las 10:00 PM que te ordene abrir el libro.",
          isCorrect: false,
        },
        {
          id: "opt4",
          text: "Comprarte un e-reader pensando que el gasto te va a obligar a leer.",
          isCorrect: false,
        },
      ],
      explanation:
        "Reduce la fricción del hábito bueno y aumenta la del malo. El ambiente gana más peleas que la voluntad.",
    },
    {
      id: 4,
      type: "A",
      pattern: "dato_contraintuitivo",
      front:
        "¿Por qué repetir un hábito durante 21 días seguidos suele fallar para la gran mayoría?",
      back: {
        concept:
          "Los hábitos no se forman por cantidad de días, sino por la frecuencia de repeticiones sin fricción.",
        application:
          "Aplica la Regla de los 2 Minutos: transforma 'Leer 30 minutos' en 'Leer una sola página'. Cuando la acción inicial requiere esfuerzo cero, la resistencia desaparece.",
      },
    },
    {
      id: 5,
      type: "A",
      pattern: "espejo_directo",
      front:
        "¿Alguna vez te has preguntado por qué sigues cayendo en los mismos errores aunque sabes exactamente lo que tienes que hacer?",
      back: {
        concept:
          "Tu conducta actual es solo el reflejo de la identidad con la que te percibes hoy.",
        application:
          "Cada acción que ejecutas es un voto por el tipo de persona en la que te conviertes. No intentes 'hacer ejercicio'; asume 'soy alguien que no se salta su entrenamiento'.",
      },
    },
    {
      id: 6,
      type: "B",
      question:
        "Llevas 3 semanas yendo al gimnasio sin faltar un solo día, te miras al espejo y te ves exactamente igual. Tu cerebro te dice que estás perdiendo el tiempo. ¿Qué principio estás ignorando?",
      options: [
        {
          id: "opt1",
          text: "El Plateau de Crecimiento Latente: el cambio se acumula en silencio antes de volverse visible.",
          isCorrect: true,
        },
        {
          id: "opt2",
          text: "La Ley del Mínimo Esfuerzo: si no ves cambios en 20 días, la rutina no sirve.",
          isCorrect: false,
        },
        {
          id: "opt3",
          text: "La Paradoja del Objetivo: necesitas cambiar de rutina radicalmente cada 21 días.",
          isCorrect: false,
        },
      ],
      explanation:
        "El trabajo no se pierde, se almacena. Los cambios en sistemas complejos rompen la superficie solo después de cruzar un umbral crítico.",
    },
    {
      id: 7,
      type: "A",
      pattern: "reto_creencia",
      front:
        "¿Por qué intentar eliminar un placer instantáneo por 'salud' casi nunca resiste el estrés del día a día?",
      back: {
        concept:
          "El cerebro humano está diseñado para priorizar la recompensa inmediata sobre el beneficio futuro.",
        application:
          "Usa la Agrupación de Tentaciones: vincula lo que 'necesitas hacer' con algo que 'deseas hacer'. Escucha tu podcast favorito únicamente mientras lavas los platos.",
      },
    },
    {
      id: 8,
      type: "A",
      pattern: "espejo_directo",
      front:
        "¿Alguna vez fallaste un solo día en tu rutina y sentiste que ya habías arruinado todo el progreso?",
      back: {
        concept:
          "El primer fallo es un error inevitable; el segundo fallo es el verdadero comienzo de un mal hábito.",
        application:
          "Nunca rompas la regla de 'no fallar dos veces'. Si un imprevisto te impide entrenar hoy, ve mañana aunque solo sean 10 minutos. Lo crucial es mantener el voto de identidad.",
      },
    },
    {
      id: 9,
      type: "B",
      question:
        "Sales cansado del trabajo con hambre voraz y siempre terminas pidiendo comida rápida porque cocinar requiere demasiado esfuerzo. Según la ley de hacerlo fácil, ¿cómo rompes el ciclo?",
      options: [
        {
          id: "opt1",
          text: "Inscribirte a un curso de cocina saludable para motivarte los fines de semana.",
          isCorrect: false,
        },
        {
          id: "opt2",
          text: "Dejar la comida saludable lista en recipientes en la parte frontal de la nevera.",
          isCorrect: true,
        },
        {
          id: "opt3",
          text: "Pagarle una multa a un amigo cada vez que termines comprando comida rápida.",
          isCorrect: false,
        },
        {
          id: "opt4",
          text: "Prohibirte cenar esa noche para castigar tu falta de compromiso.",
          isCorrect: false,
        },
      ],
      explanation:
        "Reducir la fricción preparando las cosas por adelantado elimina la necesidad de tomar decisiones difíciles cuando tu energía está agotada.",
    },
    {
      id: 10,
      type: "A",
      pattern: "dato_contraintuitivo",
      front:
        "¿Por qué enfocarte en los resultados que quieres lograr es el camino más lento para transformar tu vida?",
      back: {
        concept:
          "El verdadero cambio no es conseguir mejores resultados, sino transformar tu autoimagen.",
        application:
          "Los resultados son pasajeros; la identidad permanece. Cada pequeña promesa cumplida le demuestra a tu cerebro que eres una persona capaz y confiable.",
      },
    },
  ],
};
