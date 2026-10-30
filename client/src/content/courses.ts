/**
 * Courses — groupings of the printed menu sections, for the homepage
 * "One Table. Many Kitchens." showcase and the menu page's ?course= filter.
 * This only groups existing section slugs; the dishes themselves always come
 * from the menu data. Breakfast is deliberately in no course (it is a meal,
 * not a course) and stays on the full menu. Soups & Salads keeps its course
 * filter but is not featured on the homepage.
 */
export type Course = {
  slug: string;
  name: string;
  /** Menu category slugs, in the order they are shown when filtered. */
  categories: string[];
  /** Media slug for the course photograph, and its object-position. */
  image: string;
  focus?: string;
  /** Optional second, smaller photograph shown alongside (e.g. a drink beside a dessert). */
  inset?: { image: string; focus?: string };
};

export const COURSES: Course[] = [
  {
    slug: "starters",
    name: "Starters",
    categories: ["indian-appetizer", "tandoor-temptation", "oriental-starter", "steamed", "continental-starter"],
    image: "kebab-skewer",
    focus: "50% 40%",
  },
  {
    slug: "soups-and-salads",
    name: "Soups & Salads",
    categories: ["soup", "salad"],
    image: "clear-soup",
  },
  {
    slug: "indian-mains",
    name: "Indian Mains",
    categories: ["indian-main-course", "dal", "rice-and-biryani", "indian-breads"],
    image: "biryani-overhead",
    focus: "30% 62%",
  },
  {
    slug: "maharashtrian-specials",
    name: "Maharashtrian Specials",
    categories: ["maharashtrian-thali", "tawa-special"],
    image: "seafood-thali",
    focus: "50% 52%",
  },
  {
    slug: "continental-and-asian",
    name: "Continental & Asian",
    categories: ["continental-main-course", "pizza", "sandwich-and-burgers", "oriental-main-course"],
    image: "pizza-slice",
    focus: "18% 58%",
  },
  {
    slug: "desserts-and-drinks",
    name: "Desserts & Drinks",
    categories: ["desserts", "mocktail", "milkshake", "beverages"],
    image: "sizzling-brownie",
    focus: "62% 50%",
    inset: { image: "mocktail-still", focus: "50% 40%" },
  },
];
