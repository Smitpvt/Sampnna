/**
 * The plate photos in public/images/featured_dishes, keyed by filename. The
 * row shows every image in that folder; a file not listed here falls back to
 * its filename for alt text and a default fit.
 * `plate` = [centreX, centreY, radiusX, radiusY], in % of the image: the
 * outline of that photo's plate, measured per image by tracing the plate edge
 * on 360 rays. The files are PNG cut-outs whose surround is a baked-in
 * checkerboard (or transparency) right up to the rim, and several plates are
 * slightly oval — so each photo is clipped to its own plate outline, then
 * scaled and centred so every whole plate appears at the same size with an
 * even margin inside its circle. Display only — the files are untouched.
 */
export const FEATURED_PLATES: Record<string, { name: string; alt: string; plate?: [number, number, number, number] }> = {
  "Bolongese_chicken_fettuice.png": { name: "Fettuccine Chicken Bolognese", alt: "Fettuccine in a minced chicken bolognese sauce, topped with basil, in a white bowl", plate: [49.88, 49.82, 47.61, 48.46] },
  "chicken_milaense.png": { name: "Chicken Milanese", alt: "Crumbed chicken milanese with a green leaf salad and a lime half on a white plate", plate: [49.98, 49.94, 49.71, 49.77] },
  "Chimi chauri prawns.png": { name: "Chimichurri Prawns", alt: "Prawns in a glossy sauce with spring onions, peppers and peanuts in a white bowl", plate: [49.73, 49.48, 49.17, 48.44] },
  "Chongqing mala chicken.png": { name: "Chongqing Mala Chicken", alt: "Chongqing mala chicken with dried red chillies and peppers in a white bowl", plate: [49.94, 49.92, 49.78, 49.63] },
  "Greek_Salad.png": { name: "Greek Salad", alt: "Greek salad with feta, olives, peppers and red onion on a white plate", plate: [49.72, 49.92, 49.53, 49.53] },
  "khao-suey.png": { name: "Burmese Khao Suey Soup", alt: "Burmese khao suey soup in a white bowl and saucer", plate: [49.92, 49.62, 49.65, 49.46] },
  "messina-pizza.png": { name: "Messina Pizza", alt: "Messina pizza topped with prawns, cherry tomatoes and herbs", plate: [50.06, 49.7, 49.59, 49.19] },
  "quiona_salad.png": { name: "Quinoa Salad", alt: "Red quinoa salad with tomato, apple, peppers and micro-greens in a white bowl", plate: [49.89, 49.41, 48.69, 48.21] },
  "Tandoori_jhinga.png": { name: "Tandoori Jhinga", alt: "Tandoori jhinga — charred spiced prawns on lettuce with lemon wedges", plate: [49.88, 49.28, 49.6, 49.16] },
  "waldorf-salad.png": { name: "Waldorf Salad", alt: "Waldorf salad with apple, walnuts and grapes on lettuce in a white bowl", plate: [49.84, 49.05, 48.64, 48.01] },
};

export const HOME_MEDIA = {
  /** Hero crossfade, in order. The first is the LCP image and shows alone when motion is reduced. */
  heroBackdrops: ["dining-room-arches", "dining-room-windows", "table-setting-row", "dining-room-evening"],
  /** The meaning section: large landscape interior, then the small ones at its top-left and bottom-right corners. */
  storyImages: ["dining-room-long-view", "lantern-brick-arch", "table-setting-overhead"],
  gallery: ["arched-window-garden", "seafood-thali", "kitchen-flame", "mocktail-still", "table-setting-banquette"],
  reservation: "dining-room-evening",
};
