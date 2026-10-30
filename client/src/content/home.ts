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

/**
 * Featured Dishes, in display order. Each is selected by its exact menu name —
 * the description always comes from the menu data. `image` is a plate-centred
 * square crop of a camera original, made and colour-matched by
 * server/scripts/featured-images.mjs. The pizza is identified as Ortolana from
 * its toppings (market vegetables on tomato sauce and mozzarella), and the
 * menu's thali with pomfret is the Seafood Thali — worth confirming with the
 * kitchen. Messina Pizza, Chongqing Mala Chicken and Chimichurri Prawns are
 * left out: their supplied images have no verified provenance.
 */
export type FeaturedConfig = { dish: string; image: string };

export const FEATURED_DISHES: FeaturedConfig[] = [
  { dish: "Burmese Khao Suey Soup", image: "khao-suey" },
  { dish: "Ortolana Pizza", image: "ortolana-pizza" },
  { dish: "Seafood Thali", image: "seafood-thali" },
  { dish: "Fettuccine Chicken Bolognese", image: "fettuccine-bolognese" },
  { dish: "Murgh Matka Dum Biryani", image: "murgh-biryani" },
  { dish: "Kombadi Vade", image: "kombadi-vade" },
  { dish: "Honey Chilli Lotus Stem", image: "lotus-stem" },
  { dish: "Ukadiche Modak (3 pc)", image: "ukadiche-modak" },
];

export const HOME_MEDIA = {
  /** Hero crossfade, in order. The first is the LCP image and shows alone when motion is reduced. */
  heroBackdrops: ["dining-room-arches", "dining-room-windows", "table-setting-row", "dining-room-evening"],
  /** The meaning section: large landscape interior, then the small ones at its top-left and bottom-right corners. */
  storyImages: ["dining-room-long-view", "lantern-brick-arch", "table-setting-overhead"],
  gallery: ["arched-window-garden", "seafood-thali", "kitchen-flame", "mocktail-still", "table-setting-banquette"],
  reservation: "dining-room-evening",
};
