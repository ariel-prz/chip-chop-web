// Blog "Consejos de Caramelo". Cada artículo: información general y verificable; todo lo que
// dependa del caso de cada mascota se deriva al veterinario. Sin promesas de salud.
// Para agregar un artículo: copia un bloque, cambia slug, textos y fechas, y publica.

export type BlogSection = { h2: string; paragraphs: string[]; list?: string[] };
export type BlogPost = {
  slug: string;
  title: string; // H1 y title (máx. ~55 caracteres para que entre con la marca)
  description: string; // 140 a 160 caracteres
  summary: string; // respuesta directa, 40 a 60 palabras
  datePublished: string;
  dateModified: string;
  related?: { href: string; label: string };
  sections: BlogSection[];
};

export const POSTS: BlogPost[] = [
  {
    slug: "como-cambiar-el-alimento-de-tu-mascota",
    title: "Cómo cambiar el alimento de tu perro o gato",
    description:
      "Guía de Caramelo para cambiar el alimento de tu perro o gato poco a poco: cuánto mezclar cada día, qué señales vigilar y cuándo ir al veterinario.",
    summary:
      "Para cambiar el alimento de tu perro o gato, mezcla el nuevo con el anterior durante unos siete a diez días, aumentando poco a poco la proporción del nuevo. Así su estómago se adapta y evitas vómitos o diarrea. Si aparecen molestias que no pasan, consulta a tu veterinario.",
    datePublished: "2026-11-15",
    dateModified: "2026-11-15",
    related: { href: "/productos/#cat-alimento-seco", label: "Ver alimento seco para perros y gatos" },
    sections: [
      {
        h2: "¿Por qué no conviene cambiar el alimento de golpe?",
        paragraphs: [
          "El sistema digestivo de perros y gatos se acostumbra a la comida que reciben a diario. Un cambio brusco puede provocar malestar estomacal, gases, vómitos o diarrea, aunque el alimento nuevo sea de buena calidad.",
        ],
      },
      {
        h2: "¿Cómo hago la transición paso a paso?",
        paragraphs: ["Una pauta común es repartir el cambio en cuatro etapas de dos o tres días cada una:"],
        list: [
          "Días 1 a 2: tres partes del alimento anterior y una del nuevo.",
          "Días 3 a 5: mitad y mitad.",
          "Días 6 a 8: una parte del anterior y tres del nuevo.",
          "Desde el día 9: solo el alimento nuevo.",
        ],
      },
      {
        h2: "¿Qué señales debo vigilar?",
        paragraphs: [
          "Durante el cambio, revisa que tu mascota coma con normalidad, que sus heces mantengan una consistencia firme y que no vomite. Si notas molestias leves, vuelve unos días a la proporción anterior antes de seguir avanzando.",
          "Si tu mascota deja de comer más de un día, tiene diarrea o vómitos que no paran, o la notas decaída, llévala al veterinario.",
        ],
      },
      {
        h2: "¿Cuándo es mejor preguntar antes al veterinario?",
        paragraphs: [
          "Si tu mascota es cachorro o gatito, es adulta mayor, tiene una enfermedad diagnosticada o come un alimento indicado por el veterinario, consulta antes de cambiarlo.",
        ],
      },
    ],
  },
  {
    slug: "agua-fresca-para-perros-y-gatos",
    title: "Agua fresca para tu perro o gato: guía práctica",
    description:
      "Consejos de Caramelo para que tu perro o gato tome suficiente agua: dónde poner el plato, cada cuánto cambiarla y cuándo conviene ir al veterinario.",
    summary:
      "Tu perro o gato debe tener agua limpia y fresca disponible todo el día, sobre todo si come alimento seco. Cambia el agua y lava el plato a diario, ponlo lejos de la comida y del arenero, y consulta al veterinario si notas que bebe mucho más o mucho menos de lo normal.",
    datePublished: "2026-11-15",
    dateModified: "2026-11-15",
    related: { href: "/productos/#cat-accesorios", label: "Ver platos y comederos" },
    sections: [
      {
        h2: "¿Por qué el agua importa tanto si come alimento seco?",
        paragraphs: [
          "El alimento seco tiene poca humedad, así que tu mascota obtiene casi toda el agua que necesita del plato. El alimento húmedo aporta más líquido, pero el agua fresca sigue siendo indispensable.",
        ],
      },
      {
        h2: "¿Cómo animo a mi mascota a tomar agua?",
        paragraphs: ["Algunas costumbres sencillas ayudan:"],
        list: [
          "Cambia el agua y lava el plato todos los días.",
          "Pon el plato de agua lejos de la comida y, en gatos, lejos del arenero.",
          "Si tienes varias mascotas o una casa grande, deja más de un plato.",
          "Muchos gatos prefieren platos anchos donde no rocen los bigotes.",
        ],
      },
      {
        h2: "¿Cuándo debo preocuparme?",
        paragraphs: [
          "Si notas que tu mascota bebe mucho más de lo habitual, casi no bebe, orina mucho más o mucho menos, o está decaída, llévala al veterinario. Esos cambios pueden indicar un problema de salud que conviene revisar a tiempo.",
        ],
      },
    ],
  },
  {
    slug: "antiparasitarios-para-perros-y-gatos",
    title: "Antiparasitarios para perros y gatos: guía breve",
    description:
      "Qué tipos de antiparasitarios hay para perros y gatos, por qué la dosis depende del peso y qué preguntarle al veterinario. Consejos de Caramelo, Chip Chop.",
    summary:
      "Los antiparasitarios protegen a tu perro o gato de parásitos internos, como lombrices, y externos, como pulgas y garrapatas. La dosis depende del peso y la especie, por eso conviene que tu veterinario te indique cuál usar y cada cuánto aplicarlo. Nunca uses en gatos un producto hecho solo para perros.",
    datePublished: "2026-11-15",
    dateModified: "2026-11-15",
    related: { href: "/productos/#cat-antiparasitarios", label: "Ver antiparasitarios en Chip Chop" },
    sections: [
      {
        h2: "¿Qué tipos de antiparasitarios existen?",
        paragraphs: ["En la tienda vas a encontrar varias presentaciones, cada una con un uso distinto:"],
        list: [
          "Internos (tabletas u orales): contra parásitos intestinales.",
          "Externos: collares, talcos, jabones o shampoos contra pulgas y garrapatas.",
          "Algunos productos combinan protección interna y externa.",
        ],
      },
      {
        h2: "¿Por qué la dosis depende del peso?",
        paragraphs: [
          "Cada producto indica para qué rango de peso y para qué especie está hecho. Por eso los collares y tabletas vienen en tallas o presentaciones distintas. Pesa a tu mascota o pídele a tu veterinario su peso actual antes de comprar.",
          "Algunos productos para perros pueden ser peligrosos para los gatos. Lee siempre la etiqueta y, si tienes dudas, pregunta antes de aplicarlo.",
        ],
      },
      {
        h2: "¿Qué le pregunto a mi veterinario?",
        paragraphs: ["Lleva estas preguntas a tu próxima consulta:"],
        list: [
          "¿Qué producto conviene según su peso, edad y estilo de vida?",
          "¿Cada cuánto debo aplicar el antiparasitario interno y el externo?",
          "¿Qué hago si convive con otras mascotas o con niños pequeños?",
        ],
      },
      {
        h2: "¿Qué señales indican que puede tener parásitos?",
        paragraphs: [
          "Rascado frecuente, pulgas o garrapatas visibles, pérdida de pelo, diarrea o pérdida de peso sin explicación son motivos para visitar al veterinario.",
        ],
      },
    ],
  },
];

export function postBySlug(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}
