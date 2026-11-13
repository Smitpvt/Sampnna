/** Allergen key printed on the menu ("Allergen guide"). */
export const ALLERGEN_GUIDE = {
  D: "Dairy",
  G: "Gluten",
  E: "Egg",
  N: "Tree nuts",
  P: "Peanuts",
  S: "Soya",
  Se: "Sesame",
  M: "Mustard",
  Ce: "Celery",
  F: "Fish",
  C: "Crustaceans",
} as const;

export type AllergenCode = keyof typeof ALLERGEN_GUIDE;
