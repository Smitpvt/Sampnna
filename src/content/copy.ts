/**
 * Editorial copy. Introductory text written from the restaurant's own menu
 * ("Welcome to Sampann'") — no invented history, awards, people or claims.
 * Replace freely once verified brand copy is supplied.
 */
export const copy = {
  hero: {
    eyebrow: "Resort & Restaurant · Chaul, Alibag",
    lines: ["Abundance,", "at every table."],
    body: "Indian, Tandoor, Oriental, Continental and Konkan kitchens — gathered under brick arches, set for sharing.",
  },
  story: {
    eyebrow: "What is Sampann?",
    word: "संपन्न",
    pronunciation: "sam·pann",
    heading: "A word for a table that wants for nothing.",
    body: [
      "Sampann means abundance — rich, fulfilled, complete. It is the feeling of a table where every plate has a reason to be there, and every guest leaves having had enough of everything.",
      "Our menu travels: bold Indian flavours and tandoor temptations, savoury Oriental stir-fries, Western classics and the local cooking of the Konkan coast — prepared with fresh ingredients by a HACCP-certified chef.",
    ],
  },
  reserve: {
    eyebrow: "Reserve a table",
    heading: "Tell us when you'd like to come.",
    body: "Send a reservation request and our team will contact you to confirm. Your table is held only once we've confirmed it with you.",
  },
  about: {
    intro: "A warm, cosy dining room in Chaul for families, friends and the occasions worth gathering for.",
    meaning: [
      "In Marathi and Hindi, sampann describes something whole — prosperous, accomplished, complete. We took it as a promise about the table: generous, considered and unhurried.",
      "That idea shapes how we cook and how we host. A menu wide enough for every appetite at the table; plates meant to be passed around; staff happy to help you find your way through it all.",
    ],
    kitchens:
      "One menu, many kitchens: spicy Indian flavour and the tandoor, Oriental wok cooking, authentic Western dishes, and Konkan home-style cooking — Maharashtrian thalis, sol kadhi and tawa-fried fish from the coast.",
    room: "Exposed terracotta brick, arched windows of coloured glass and long turquoise banquettes. Lanterns warm the walls in the evening; during the day the arches frame the garden outside.",
    experience: [
      { title: "Made with care", body: "Our chefs work with fresh ingredients, led by a HACCP-certified chef." },
      { title: "Help at the table", body: "Our staff are always happy to help you navigate the menu and make recommendations." },
      { title: "For every occasion", body: "Families, friends and special occasions — and for larger gatherings, we also host banquets and parties." },
    ],
  },
} as const;
