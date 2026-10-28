/**
 * Homepage presentation config. This only *selects and orders* dishes that
 * already exist in the menu (by slug) — it never defines dishes or prices.
 * Unknown slugs are skipped; empty picks fall back to the category's first dishes.
 */
export type ChapterConfig = {
  key: string;
  title: string;
  intro: string;
  /** A menu category slug, or a dish tag collection. */
  source: { category: string } | { tag: string };
  image: string;
  picks: string[];
};

export const HOME_CHAPTERS: ChapterConfig[] = [
  {
    key: "continental-starters",
    title: "Continental Starters",
    intro: "Herb-marinated prawns, crumbed bites and fries — an easy way into the evening.",
    source: { category: "continental-starter" },
    image: "chimichurri-prawns",
    picks: ["chimichurri-prawns", "crispy-fish-finger", "chicken-milanese", "cheese-corn-ball", "garlic-herbs-french-fries"],
  },
  {
    key: "oriental-main-course",
    title: "Oriental Main Course",
    intro: "Rice, noodles and curries from the wok — from Thai red and green to Kung Pao.",
    source: { category: "oriental-main-course" },
    image: "kitchen-wok",
    picks: ["thai-curry", "pad-thai-noodles", "kung-pao-chicken", "mao-tofu", "burnt-garlic-rice"],
  },
  {
    key: "indian-main-course",
    title: "Indian Main Course",
    intro: "Slow, generous gravies of vegetables, paneer, chicken and mutton — for the middle of the table.",
    source: { category: "indian-main-course" },
    image: "tandoori-naan-brick",
    picks: ["paneer-lababdar", "sabji-diwani-handi", "murg-nawabi", "murg-mussallam", "ghosh-rara"],
  },
  {
    key: "maharashtrian-thalis",
    title: "Authentic Maharashtrian Thalis",
    intro: "Complete meals on a single plate — every thali comes with sol kadhi, rice, bread and dessert.",
    source: { category: "maharashtrian-thali" },
    image: "seafood-thali",
    picks: ["veg-thali", "chicken-thali", "mutton-thali", "seafood-thali", "kombadi-vade"],
  },
  {
    key: "seafood-specials",
    title: "Seafood Specials",
    intro: "Pomfret, surmai, bombil and prawns — fried on the tawa, roasted in the tandoor, tossed in the wok.",
    source: { tag: "seafood" },
    image: "pomfret-green-masala",
    picks: ["pomfret-fry", "surmai-fry", "bombil-fry", "tandoori-jhinga", "prawns-salt-and-pepper"],
  },
  {
    key: "mocktails",
    title: "Mocktails",
    intro: "Lime and mint, guava and spice, fruit and fizz — poured cold.",
    source: { category: "mocktail" },
    image: "mocktail-coupe",
    picks: ["virgin-mojito", "guava-spice", "fruit-punch", "strawberry-delight", "blue-lagoon"],
  },
  {
    key: "desserts",
    title: "Desserts",
    intro: "From ukadiche modak with ghee to a brownie that arrives sizzling.",
    source: { category: "desserts" },
    image: "ukadiche-modak",
    picks: ["ukadiche-modak-3-pc", "sizzling-brownie", "elaneer-payasam", "gulab-jamun-2-pc", "banana-toffee-with-ice-cream"],
  },
];

export const HOME_MEDIA = {
  heroBackdrop: "dining-room-arches",
  heroInset: "honey-chilli-lotus-stem",
  storyImage: "lantern-brick-arch",
  storyDetail: "table-setting-overhead",
  gallery: ["arched-window-garden", "seafood-thali", "kitchen-flame", "mocktail-still", "table-setting-banquette"],
  reservation: "dining-room-evening",
};
