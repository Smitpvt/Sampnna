/**
 * Editorial copy. Introductory text written from the restaurant's own menu
 * ("Welcome to Sampann'") — no invented history, awards, people or claims.
 * Replace freely once verified brand copy is supplied.
 */
export const copy = {
  hero: {
    eyebrow: "A taste of the Konkan",
    heading: "Sampann",
    body: "Where the warmth of Maharashtrian hospitality meets the flavours of the coast. Discover Indian, Tandoor, Oriental and Continental favourites, thoughtfully brought together at Sampann.",
  },
  story: {
    eyebrow: "What is Sampann?",
    word: "संपन्न",
    pronunciation: "sam·pann",
    heading: "A Place for Good Food & Good Times.",
    body: [
      "Sampann means being समृद्ध and भरभरून जगणं. For us, it’s about serving good food, bringing people together, and making every visit feel special.",
      "From Maharashtrian favourites and Konkani seafood to tandoor dishes and more, there’s something for everyone at our table. Come for the food, stay for the warmth, and leave with a smile.",
    ],
    cta: "Our Story",
  },
  reserve: {
    eyebrow: "Reserve a table",
    heading: "Tell us when you'd like to come.",
    body: "Send a reservation request and our team will contact you to confirm. Your table is held only once we've confirmed it with you.",
  },
  about: {
    hero: {
      eyebrow: "About Sampann",
      location: "Chaul · Alibag · Maharashtra",
      meanings: [
        { word: "समृद्ध", gloss: "having plenty." },
        { word: "भरभरून जगणं", gloss: "living with a full heart." },
      ],
      /** The three senses of the word, each linking down to its chapter. */
      senses: [
        { title: "Good food", label: "The food", href: "#about-table" },
        { title: "A place for everyone", label: "The place", href: "#about-place" },
        { title: "Time together", label: "The people", href: "#about-moments" },
      ],
      roomCaption: "The dining room",
    },
    table: {
      label: "The food",
      lead: "Our kitchen in Chaul cooks a little of everything, and cooks it to share.",
      body: "Indian gravies and the tandoor, Konkani seafood, Maharashtrian thalis and Continental plates, all on one menu. So everyone at the table finds something they love.",
      /** Each kitchen with a real photo from the library and the dish it shows. */
      kitchens: [
        { name: "Indian", image: "biryani-overhead", pictured: "Biryani", focus: "32% 48%" },
        { name: "Maharashtrian", image: "kombadi-vade", pictured: "Kombadi Vade", focus: "50% 50%" },
        { name: "Konkani", image: "seafood-thali", pictured: "Seafood Thali", focus: "50% 52%" },
        { name: "Continental", image: "pasta-parmesan", pictured: "Pasta", focus: "70% 62%" },
      ],
    },
    kitchen: {
      label: "The chef & the kitchen",
      /** From the restaurant's own menu ("Welcome to Sampann'"). */
      lead: "Our chefs work with fresh ingredients, led by a HACCP-certified chef.",
      body: "From thalis with sol kadhi to tawa-fried fish, the tandoor and the wok, this is where every plate begins.",
      note: "Not sure what to order? Our staff are always happy to help.",
      /** Not supplied yet. Fill these in and they appear on the page; left null, nothing shows. */
      chefName: null as string | null,
      chefStory: null as string | null,
    },
    place: {
      label: "The place",
      body: "Sampann Resort & Restaurant: brick walls and long turquoise seats inside, and a garden just beyond the arches. There's room here for everyone.",
      findUs: "You'll find us in",
      town: "Chaul",
      area: "Alibag, Maharashtra",
      photoCaption: "Arched windows and coloured glass",
      features: ["Brick walls", "Arched windows", "Coloured glass", "Turquoise banquettes", "A garden beyond the glass"],
    },
    moments: {
      label: "The people",
      lines: ["Dinner for two.", "Lunch with the family."],
      lineAccent: "Or a big day with everyone you love.",
      hostLabel: "We also host",
    },
    close: {
      body: "Good food, a warm welcome and a seat for everyone. Come hungry, bring your people.",
      invite: "या, जेवून जा!",
      location: "Chaul, Alibag",
    },
  },
} as const;
