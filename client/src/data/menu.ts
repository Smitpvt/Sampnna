/**
 * SAMPANN MENU — single source of truth.
 *
 * Transcribed from "Sampann_Menu_with_Allergens.pdf" (Chaul · Alibag). Dish names,
 * descriptions and prices are kept as printed; only capitalisation changes
 * (the printed menu is all caps). All prices are in ₹; 5% GST applies.
 *
 * This file seeds the database (prisma/seed.ts). The website reads menu data
 * from the database only — never import this file into UI components.
 *
 * Entries the restaurant should confirm are listed in MENU_REVIEW_NOTES below.
 */

/** "APS" on the printed menu — price depends on the size of the catch. */
export const AS_PER_SIZE = "As per size";

import type { AllergenCode } from "../content/allergens";

export type PriceOptionSource = { label: string; price?: number; priceNote?: string };

export type DishSource = {
  name: string;
  description?: string;
  price?: number;
  priceNote?: string;
  options?: PriceOptionSource[];
  /** Key into media.generated.json — only when the photo verifiably shows this dish. */
  image?: string;
  tags?: string[];
  /** Allergen codes printed beside the dish on the menu (see ALLERGEN_GUIDE). */
  allergens?: AllergenCode[];
  featured?: boolean;
};

export type CategorySource = {
  slug: string;
  name: string;
  description?: string;
  /** Illustrative category photo (may show a related dish from the same kitchen). */
  image?: string;
  dishes: DishSource[];
};

const vegChicken = (veg: number, chicken: number): PriceOptionSource[] => [
  { label: "Veg", price: veg },
  { label: "Chicken", price: chicken },
];
const halfFull = (half: number, full: number): PriceOptionSource[] => [
  { label: "Half", price: half },
  { label: "Full", price: full },
];

const SEAFOOD = ["seafood"];

export const MENU: CategorySource[] = [
  {
    slug: "breakfast",
    name: "Breakfast",
    description: "South Indian tiffin, Maharashtrian favourites and simple morning plates.",
    dishes: [
      { name: "Idli", allergens: ["D", "M"], price: 89, description: "2 pc rice cake served with lentils based stew and coconut chutney" },
      { name: "Medu Vada", allergens: ["D", "M"], price: 119, description: "2 pc deep fried doughnut made from a batter of black gram with lentils based stew and coconut chutney" },
      { name: "Plain Dosa", allergens: ["D", "M"], price: 99 },
      { name: "Butter Dosa", allergens: ["D", "M"], price: 119, description: "A thin savory crepe made from fermented batter of brown rice and lentil based stew and coconut chutney with butter" },
      { name: "Masala Dosa", allergens: ["D", "M"], price: 129, description: "A thin savory crepe made from fermented batter of brown rice and lentil based stew and coconut chutney with butter" },
      { name: "Plain Cheese Dosa", allergens: ["D", "M"], price: 119, description: "A thin savory crepe made from fermented batter of brown rice and lentil based stew and coconut chutney with cheese" },
      { name: "Masala Cheese Dosa", allergens: ["D", "M"], price: 159, description: "A thin savory crepe made from fermented batter of brown rice and lentil based stew and coconut chutney with cheese" },
      { name: "Gini Dosa", allergens: ["D", "M"], price: 149, description: "A thin savory crepe made from fermented batter of brown rice and lentil based stew and coconut chutney" },
      { name: "Podi Dosa", allergens: ["D", "M"], price: 149, description: "A thin savory crepe made from a fermented batter of ground rice and lentils based stew and coconut chutney" },
      { name: "Plain Uttapam", allergens: ["D", "M"], price: 129 },
      { name: "Poha", allergens: ["N", "M"], price: 99, description: "Flattened rice that is steam cooked with onions, spices and herbs" },
      { name: "Upma", allergens: ["D", "G", "N", "M"], price: 99, description: "A dish of thick porridge from dry roasted semolina" },
      { name: "Sheera", allergens: ["D", "G", "N"], price: 119, description: "A traditional Indian pudding made with semolina, clarified butter and nuts" },
      { name: "Sabudana Vada", allergens: ["D", "N"], price: 99, description: "2 pc traditional deep fried fritters made with sago" },
      { name: "Sabudana Khichdi", allergens: ["D", "N"], price: 129, description: "A traditional Maharashtrian flavour made with sago" },
      { name: "Tawa Aloo Paratha", allergens: ["D", "G"], price: 129, description: "A layer flat bread stuffed with potato, made from wheat flour, accompanied with yogurt and pickle" },
      { name: "Tawa Paneer Paratha", allergens: ["D", "G"], price: 149, description: "A layer flat bread stuffed with paneer, made from wheat flour, accompanied with yogurt and pickle" },
      { name: "Matka Misal Pav", allergens: ["D", "G"], price: 129, description: "A traditional curry made from sprouted legumes and a tangy gravy, served in an earthen pot" },
      { name: "Bread Butter", allergens: ["D", "G"], price: 59, description: "4 pc bread slices served with jam" },
      { name: "Toast Butter", allergens: ["D", "G"], price: 79, description: "4 pc toasted bread slices served with jam" },
    ],
  },
  {
    slug: "indian-appetizer",
    name: "Indian Appetizer",
    dishes: [
      { name: "Roasted Papad", price: 29 },
      { name: "Fried Papad", price: 49 },
      { name: "Masala Papad", price: 69 },
      { name: "Roomali Papad", price: 119 },
      { name: "Masala Roomali Papad", price: 179 },
      { name: "Hara Bhara Kabab", allergens: ["D", "G"], price: 349, description: "Chopped vegetable, cottage cheese, crispy deep fried" },
      { name: "Fresh Corn Tikki", allergens: ["D", "G"], price: 349, description: "Crispy golden patty made with sweet corn and mashed potatoes seasoned with traditional spices" },
      { name: "Kothmir Vadi", allergens: ["N"], price: 199, description: "Fresh coriander and dry kaju with chickpea flour" },
    ],
  },
  {
    slug: "salad",
    name: "Salad",
    image: "waldorf-salad",
    dishes: [
      { name: "Green Salad", price: 149, description: "Beetroot, tomato, cucumber, carrot, lemon slices, green chilly" },
      { name: "Cucumber Salad", price: 119, description: "Freshly sliced cucumber" },
      { name: "Caesar Salad", allergens: ["D", "G", "E"], options: vegChicken(249, 299), description: "Green salad typically featuring romaine lettuce and croutons tossed with a creamy mayonnaise tangy dressing" },
      { name: "Greek Salad", allergens: ["D"], price: 349, description: "Farm vegetables with feta cheese & lemon pepper dressing" },
      { name: "Waldorf Salad", allergens: ["D", "E", "N", "Ce"], price: 349, image: "waldorf-salad", description: "Apple and walnuts salad, tangy crème mayonnaise dressing coats apples, celery & walnuts" },
      { name: "Quinoa Salad", allergens: ["N", "M"], price: 399, description: "Mixture of farm vegetables with avocado slices" },
      { name: "Fresh Fruit Platter", price: 349, description: "Fresh seasonal fruit" },
    ],
  },
  {
    slug: "beverages",
    name: "Beverages",
    dishes: [
      { name: "Mineral Water", price: 29 },
      { name: "Cold Drinks", price: 69 },
      { name: "Tea", allergens: ["D"], price: 49 },
      { name: "Coffee", allergens: ["D"], price: 59 },
      { name: "Black Coffee", allergens: ["D"], price: 49 },
      { name: "Milk", allergens: ["D"], price: 69 },
      { name: "Fresh Lime Soda", price: 89 },
      { name: "Fresh Lime Water", price: 49 },
      { name: "Solkadhi", price: 69 },
    ],
  },
  {
    slug: "soup",
    name: "Soup",
    image: "khao-suey",
    dishes: [
      { name: "Manchow Soup", allergens: ["G", "S"], options: vegChicken(249, 289), description: "Soya based spicy soup with fried noodles" },
      { name: "Lemon Coriander Soup", price: 299, description: "Exotic vegetables with Asian lemon flavour" },
      { name: "Chicken Lemon Coriander", price: 329 },
      { name: "Hot & Sour Soup", allergens: ["G", "S"], options: vegChicken(249, 289), description: "Mushroom and bamboo shoot with sour flavour" },
      { name: "Tom Yum Soup", allergens: ["G", "N", "S"], options: vegChicken(249, 289), description: "Thai flavoured spicy soup" },
      { name: "Cream of Mushroom Soup", allergens: ["D", "G"], price: 299, description: "Fresh mushroom with creamy flavour" },
      { name: "Tomato Basil Soup", allergens: ["D"], price: 279, description: "Tomato purée with a fresh basil flavour" },
      { name: "Burmese Khao Suey Soup", allergens: ["G", "P"], options: vegChicken(349, 399), image: "khao-suey", description: "Exotic vegetables, coconut milk powder, crispy noodles, boiled noodles with Indonesian flavoured accompaniment" },
      { name: "Noodles Clear Soup", allergens: ["G", "S", "Se"], options: vegChicken(249, 289) },
      { name: "Minestrone Soup", allergens: ["D", "G", "N"], price: 299, description: "Vegetables based with basil, parmesan cheese & macaroni" },
      { name: "Malaysian Laksa", allergens: ["G"], options: vegChicken(299, 329), description: "Exotic vegetables, coconut milk based with noodles" },
      { name: "Seafood Soup", allergens: ["D", "C"], price: 399, tags: SEAFOOD, description: "Prawn bisque, shrimps & asparagus tartare, fennel seeds" },
    ],
  },
  {
    slug: "pizza",
    name: "Pizza",
    image: "pizza-slice",
    dishes: [
      { name: "Margherita Pizza", allergens: ["D", "G"], price: 299, description: "Basil leaf base pizza" },
      { name: "Rustica Pizza", allergens: ["D", "G"], options: vegChicken(399, 449), description: "Dough topped with tomato sauce, mozzarella cheese, spinach, cherry tomato & ricotta cheese" },
      { name: "Pollo Pesto Pizza", allergens: ["D", "G"], price: 449, description: "Dough topped with tomato sauce, mozzarella cheese, spicy chicken, cherry tomato & parmesan cheese" },
      { name: "Messina Pizza", allergens: ["D", "G", "C"], price: 499, image: "messina-pizza", tags: SEAFOOD, featured: true, description: "Dough topped with tomato sauce & mozzarella cheese, prawns, garlic, fresh chilli & lettuce" },
      { name: "Ortolana Pizza", allergens: ["D", "G"], price: 499, description: "Dough topped with tomato sauce & mozzarella cheese, market vegetables" },
      { name: "Four Cheese Pizza", allergens: ["D", "G"], options: vegChicken(449, 449), description: "Dough topped with cream sauce & mozzarella cheese, parmesan, ricotta, cream cheese" },
      { name: "Truffle Oil Funghi Pizza", allergens: ["D", "G"], price: 549, description: "Dough topped with tomato sauce & mozzarella cheese, market mushroom & truffle oil" },
    ],
  },
  {
    slug: "sandwich-and-burgers",
    name: "Sandwich & Burgers",
    description: "All items served with coleslaw & fries.",
    dishes: [
      { name: "Veg Sandwich", allergens: ["D", "G"], price: 149 },
      { name: "Veg Cheese Sandwich", allergens: ["D", "G"], price: 179 },
      { name: "Chicken Sandwich", allergens: ["D", "G"], price: 279 },
      { name: "Chicken Tikka Sandwich", allergens: ["D", "G", "M"], price: 299 },
      { name: "Veg Burger", allergens: ["D", "G"], price: 169 },
      { name: "Chicken Burger", allergens: ["D", "G", "E"], price: 199 },
    ],
  },
  {
    slug: "continental-starter",
    name: "Continental Starter",
    image: "chimichurri-prawns",
    dishes: [
      { name: "French Fries", price: 199 },
      { name: "Garlic Herbs French Fries", allergens: ["D"], price: 239 },
      { name: "French Fries Peri Peri", price: 239 },
      { name: "Crispy Fish Finger", allergens: ["D", "G", "E", "F"], price: 399, tags: SEAFOOD, description: "Boneless fish marinated with herbs & coated with crumbs, with tartare sauce" },
      { name: "Duplex Mushroom", allergens: ["D", "E"], price: 399 },
      { name: "Chicken Milanese", allergens: ["D", "G", "E", "N"], price: 499, description: "Crumb chicken with green lettuce salad on the side with spicy dip" },
      { name: "Cheese Corn Ball", allergens: ["D", "G", "E", "N"], price: 399, description: "Fresh sweet corn, mashed potato with spicy dip" },
      { name: "Chimichurri Prawns", allergens: ["D", "C"], price: 599, image: "chimichurri-prawns", tags: SEAFOOD, featured: true, description: "Herbs marinated prawns with sautéed vegetables" },
      { name: "Cheese Garlic Bread", allergens: ["D", "G"], price: 199 },
    ],
  },
  {
    slug: "continental-main-course",
    name: "Continental Main Course",
    image: "pasta-parmesan",
    dishes: [
      { name: "Penne Arrabbiata Pasta", allergens: ["D", "G"], options: vegChicken(399, 449), description: "Served with garlic bread" },
      { name: "Penne Alfredo Pasta", allergens: ["D", "G"], options: vegChicken(399, 449), description: "Served with garlic bread" },
      { name: "Rigatoni al Pesto Sauce", allergens: ["D", "G", "N"], options: vegChicken(399, 449), description: "Served with garlic bread" },
      { name: "Fettuccine Chicken Bolognese", allergens: ["D", "G"], price: 449, description: "Fettuccine pasta with minced chicken bolognese sauce" },
      { name: "Spaghetti Aglio Olio", allergens: ["D", "G"], options: vegChicken(399, 449), description: "Sliced garlic, chilli, parsley, olive garlic breadcrumbs" },
      { name: "Spicy Diavola Grilled Chicken", allergens: ["D", "M"], price: 449, description: "Herbs marinated chicken with mashed potatoes, sautéed vegetables & jus sauce" },
      { name: "Grilled Fish", allergens: ["D", "M", "F"], price: 599, tags: SEAFOOD, description: "Herbs marinated boneless fish with baby potatoes, spinach purée and lemon cream butter sauce" },
      { name: "Skewers BBQ Cottage Cheese", allergens: ["D"], price: 399, description: "Herbs marinated cottage cheese with skewer vegetables & sautéed vegetables with BBQ sauce" },
      { name: "Eggplant & Zucchini Parmigiana", allergens: ["D"], price: 399, description: "Fresh mozzarella cheese, chunky tomato sauce, parmesan cheese" },
    ],
  },
  {
    slug: "tandoor-temptation",
    name: "Tandoor Temptation",
    image: "murg-tandoori",
    dishes: [
      { name: "Mushroom Tikka", allergens: ["D", "M"], price: 299 },
      { name: "Stuffed Tandoori Mushroom", allergens: ["D", "M"], price: 349 },
      { name: "Paneer Tikka", allergens: ["D", "M"], price: 349 },
      { name: "Paneer Malai Tikka", allergens: ["D", "M"], price: 379 },
      { name: "Paneer Pahadi Tikka", allergens: ["D", "M"], price: 379 },
      { name: "Paneer Multani", allergens: ["D", "M"], price: 379 },
      { name: "Veg Seekh Kabab", allergens: ["D", "M"], price: 289 },
      { name: "Paneer Seekh Kabab", allergens: ["D", "M"], price: 349 },
      { name: "Chicken Seekh Kabab", allergens: ["D"], price: 399 },
      { name: "Mutton Seekh Kabab", allergens: ["D", "G", "N"], price: 539 },
      { name: "Chicken Malai Tikka", allergens: ["D", "G", "N"], price: 429 },
      { name: "Chicken Kalimiri Tikka", allergens: ["D", "G", "S"], price: 429 },
      { name: "Chicken Pahadi Kabab", allergens: ["D", "G"], price: 429 },
      { name: "Murg Tandoori", allergens: ["D", "M"], options: halfFull(399, 749), image: "murg-tandoori", featured: true },
      { name: "Murg Tang Talwar", allergens: ["D", "N", "M"], price: 399 },
      { name: "Murg Dum Kabab", allergens: ["D", "N", "M"], price: 389 },
      { name: "Murg Rozali Kabab", allergens: ["D", "N", "M"], price: 419 },
      { name: "Murg Nawabi Kabab", allergens: ["D", "N", "M"], price: 439 },
      { name: "Tandoori Jhinga", allergens: ["D", "M", "C"], price: 599, tags: SEAFOOD },
      { name: "Tandoori Pomfret", allergens: ["D", "M", "F"], priceNote: AS_PER_SIZE, tags: SEAFOOD },
    ],
  },
  {
    slug: "indian-main-course",
    name: "Indian Main Course",
    image: "kitchen-curry-ladle",
    dishes: [
      { name: "Sabji Banjara", allergens: ["D", "N"], price: 349, description: "Shallow fried vegetables, green & yellow combination with yogurt and nuts" },
      { name: "Sabji Diwani Handi", allergens: ["D", "N"], price: 349, description: "7 types of vegetables in spinach base" },
      { name: "Sabji Sham Savera", allergens: ["D", "N"], price: 399, description: "Two types of kofta with rich brown and greenish gravy" },
      { name: "Sabji Khasta", allergens: ["D", "N"], price: 399, description: "Golden touch of nuts, combination of vegetables tossed in clarified butter" },
      { name: "Sabji Maharaja", allergens: ["D", "N"], price: 399, description: "Vegetable balls with crushed cashew in rich radish gravy" },
      { name: "Mushroom Masala", allergens: ["D"], price: 299, description: "Classic masala gravy" },
      { name: "Mushroom Laziz", allergens: ["D"], price: 349, description: "A rich & creamy north Indian dish simmered in a fragrant tomato and onion gravy infused with aromatic Indian spices" },
      { name: "Punjabi Paneer Chop Masala", allergens: ["D", "N"], price: 349, description: "Cube pcs of cottage cheese, touch of yogurt in radish, rich cumin flavour" },
      { name: "Paneer Pasanda", allergens: ["D", "N"], price: 399, description: "Soft stuffed paneer filled with aromatic nuts, topped with rich luxurious gravy" },
      { name: "Paneer Lababdar", allergens: ["D", "N"], price: 349, description: "Cottage cheese cooked in a silky smooth rich tomatoes & nuts gravy" },
      { name: "Paneer Lazeez", allergens: ["D", "N"], price: 349, description: "A rich & creamy north Indian dish simmered in a fragrant tomato and onion gravy infused with aromatic Indian spices" },
      { name: "Paneer De Tukda", allergens: ["D"], price: 349, description: "Traditional texture of Punjab with cumin & onion base" },
      { name: "Lasooni Palak", allergens: ["D"], price: 299, description: "Fenugreek leaves tossed in flavour of garlic in north Indian style" },
      { name: "Murg Rara", allergens: ["D", "N"], price: 349, description: "Bone chicken with mince in Indian herbs" },
      { name: "Murg Patiala", allergens: ["D", "E", "N"], price: 399, description: "Shredded chicken in egg wrap in Indian herbs" },
      { name: "Murg Mussallam", allergens: ["D", "E", "N"], options: halfFull(449, 889), description: "Whole chicken roasted, egg, minced chicken & pulao rice flavoured in Indian herbs" },
      { name: "Murg Banjara", allergens: ["D", "N"], price: 349, description: "Boneless chicken with ancient texture of cream cheese in Indian herbs" },
      { name: "Murg Maharaja", allergens: ["D", "N"], options: halfFull(449, 849), description: "Tandoori chicken with minced chicken in rich texture in Indian herbs" },
      { name: "Butter Chicken", allergens: ["D", "N"], price: 499 },
      { name: "Murg Nawabi", allergens: ["D", "N"], price: 399, description: "Boneless chicken in aromatic curry mix of yogurt, cream, cashew paste with royal flavours in Indian herbs" },
      { name: "Murg Bagicha", allergens: ["D", "N"], price: 349, description: "Chicken simmered in a blend of fresh herbs like mint, coriander, green chilly, yogurt in Indian spices" },
      { name: "Ghosh Nawabi", allergens: ["D", "N"], price: 549, description: "With bone mutton in a rich aromatic curry mix of yogurt, cream, cashew paste with royal flavour in Indian herbs" },
      { name: "Ghosh Rogan Josh", allergens: ["D", "M"], price: 549 },
      { name: "Ghosh Rara", allergens: ["D", "N"], price: 549, description: "Bone mutton with mince in Indian herbs" },
    ],
  },
  {
    slug: "indian-breads",
    name: "Indian Breads",
    image: "kitchen-dough",
    dishes: [
      { name: "Chapati", allergens: ["D", "G"], price: 24 },
      { name: "Bhakari", price: 39 },
      { name: "Roti", allergens: ["D", "G"], price: 35 },
      { name: "Butter Roti", allergens: ["D", "G"], price: 39 },
      { name: "Laccha Paratha", allergens: ["D", "G"], price: 49 },
      { name: "Naan", allergens: ["D", "G"], price: 79 },
      { name: "Butter Naan", allergens: ["D", "G"], price: 99 },
      { name: "Cheese Naan", allergens: ["D", "G"], price: 119 },
      { name: "Cheese Garlic Naan", allergens: ["D", "G"], price: 139 },
      { name: "Garlic Naan", allergens: ["D", "G"], price: 119 },
      { name: "Kulcha", allergens: ["D", "G", "Se"], price: 59 },
      { name: "Chura Paratha", allergens: ["D", "G"], price: 79 },
      { name: "Roomali Roti", allergens: ["D", "G", "E"], price: 79 },
      { name: "Murg Kheema Paratha", allergens: ["D", "G"], price: 179 },
      { name: "Ghosh Kheema Paratha", allergens: ["D", "G"], price: 249 },
    ],
  },
  {
    slug: "oriental-starter",
    name: "Oriental Starter",
    image: "chongqing-mala-chicken",
    dishes: [
      { name: "Veg Crispy", allergens: ["G", "S"], price: 349 },
      { name: "Veg Manchurian", allergens: ["G", "S"], price: 299 },
      { name: "Paneer Chilly", allergens: ["D", "G", "S", "Se"], price: 349 },
      { name: "Chicken Chilly", allergens: ["G", "E", "S"], price: 399 },
      { name: "Lollypop", allergens: ["G", "E", "Ce"], price: 399 },
      { name: "Honey Chilli Lotus Stem", allergens: ["G", "S", "Se"], price: 449, image: "honey-chilli-lotus-stem", featured: true, description: "Crispy fried lotus stem with sesame seeds" },
      { name: "Chimi Chang Roll", allergens: ["D", "G"], price: 449, description: "Combination of mozzarella cheese & processed cheese with three types of bell peppers" },
      { name: "Schezwan Dry Green Beans", allergens: ["G", "S", "Se"], price: 399, description: "Long beans, Sichuan pepper corn, dry chilly, black bean seeds" },
      { name: "Beijing Style Cottage Cheese", allergens: ["D", "G", "S", "Se"], price: 399, description: "Schezwan pepper corn, dry chilly, sesame seeds & three types of bell pepper" },
      { name: "Chongqing Mala Chicken", allergens: ["G", "E", "S", "Se"], price: 499, image: "chongqing-mala-chicken", featured: true, description: "Boneless chicken with Sichuan pepper corn, dry red chilly & three types of bell pepper" },
      { name: "Prawns Salt & Pepper", allergens: ["G", "E", "C"], price: 499, tags: SEAFOOD, description: "Spicy black pepper with three types of bell pepper" },
      { name: "Chicken Salt & Pepper", allergens: ["G", "S", "Se"], price: 399, description: "Spicy black pepper with three types of bell pepper" },
    ],
  },
  {
    slug: "oriental-main-course",
    name: "Oriental Main Course",
    description: "Rice, noodles and curries from the wok.",
    image: "kitchen-wok",
    dishes: [
      { name: "Veg Fried Rice", allergens: ["D", "G", "S", "Se"], price: 299 },
      { name: "Chicken Fried Rice", allergens: ["D", "G", "S", "Se"], price: 349 },
      { name: "Burnt Garlic Rice", allergens: ["G", "S"], options: vegChicken(349, 399) },
      { name: "Veg Hakka Noodles", allergens: ["G", "S", "Se"], price: 299 },
      { name: "Chicken Hakka Noodles", allergens: ["G", "S", "Se"], price: 349 },
      { name: "Stir Fried Noodles", allergens: ["G", "S", "Se"], options: vegChicken(349, 399) },
      { name: "Pan Fried Noodles", allergens: ["G", "S", "Se"], options: vegChicken(319, 369), description: "Exotic vegetables with white garlic sauce" },
      { name: "Pad Thai Noodles", allergens: ["G", "N", "S"], options: vegChicken(349, 449), description: "Rice stick noodles with sweet tangy sauce" },
      { name: "Mongolian Rice Noodles", allergens: ["G", "S", "Se"], options: vegChicken(349, 449), description: "Juicy rice and noodles combination with exotic vegetables" },
      { name: "Mao Tofu", allergens: ["G", "S", "Se"], price: 449, description: "Tofu tossed in black bean sauce" },
      { name: "Kung Pao Chicken", allergens: ["G", "E", "N", "S", "Se"], price: 429, description: "Boneless chicken in dry red chilli with nuts" },
      { name: "Thai Curry", allergens: ["D", "G", "S", "Se", "C"], options: [...vegChicken(449, 499), { label: "Prawns", price: 549 }], description: "Options of green or red curry served with steamed rice" },
      { name: "Thukpa", allergens: ["G", "S"], price: 399, description: "Mixed vegetables with sauces noodles" },
    ],
  },
  {
    slug: "steamed",
    name: "Steamed",
    description: "Momos & dim sum served with sesame dip / black bean dip / celery dip.",
    image: "dim-sum-steam",
    dishes: [
      { name: "Momos", allergens: ["G", "E", "S", "Se"], options: vegChicken(399, 349) },
      { name: "Dim Sum Crystal Veg", allergens: ["G", "S", "Se", "C"], price: 399 },
      { name: "Sea Momos", allergens: ["G", "S", "Se", "C"], price: 549 },
    ],
  },
  {
    slug: "rice-and-biryani",
    name: "Rice & Biryani",
    image: "matka-biryani",
    dishes: [
      { name: "Steamed Rice", price: 179 },
      { name: "Jeera Rice", price: 219 },
      { name: "Veg Pulao", price: 299 },
      { name: "Dal Khichdi", price: 249 },
      { name: "Murgh Matka Dum Biryani", allergens: ["D", "E", "N", "C"], price: 399 },
      { name: "Ghosh Matka Dum Biryani", allergens: ["D", "E", "N", "C"], price: 499 },
      { name: "Veg Matka Dum Biryani", allergens: ["D", "N"], price: 349 },
      { name: "Biryani Rice", allergens: ["D", "N"], price: 229 },
      { name: "Curd Rice", allergens: ["D", "M"], price: 299 },
    ],
  },
  {
    slug: "dal",
    name: "Dal",
    dishes: [
      { name: "Dal Fry", price: 229 },
      { name: "Dal Tadka", price: 249 },
      { name: "Dal Makhani", allergens: ["D"], price: 299 },
      { name: "Sampanna Special Dal Handi Ghotala", allergens: ["D"], price: 349 },
    ],
  },
  {
    slug: "maharashtrian-thali",
    name: "Maharashtrian Thali",
    description: "Complete Maharashtrian meals on a single plate, each with sol kadhi, rice, bread and dessert.",
    image: "seafood-thali",
    dishes: [
      { name: "Veg Thali", allergens: ["D", "G", "E", "N", "M"], price: 349, image: "veg-thali", description: "Sol kadhi, appetizer, two types of sabzi, lentils, rice, bread, desserts" },
      { name: "Chicken Thali", allergens: ["D", "G", "E", "N", "M"], price: 449, description: "Sol kadhi, appetizer, dry kheema & chicken curry, egg, rice, bread, desserts" },
      { name: "Mutton Thali", allergens: ["D", "G", "E", "N", "M"], price: 649, description: "Sol kadhi, appetizer, mutton dry & curry, egg, rice, bread, desserts" },
      { name: "Seafood Thali", allergens: ["D", "G", "N", "M", "F", "C"], priceNote: AS_PER_SIZE, image: "seafood-thali", tags: SEAFOOD, description: "Sol kadhi, appetizer, masala dry & curry, sukhat, rice, bread, desserts" },
      { name: "Kombadi Vade", allergens: ["D", "G", "N", "M"], price: 449, image: "kombadi-vade", description: "Authentic Maharashtrian cuisine with a seven types mixture of herbs with curry & rice" },
      { name: "Extra Vade 4 pc", allergens: ["G"], price: 119 },
    ],
  },
  {
    slug: "tawa-special",
    name: "Tawa Special",
    image: "pomfret-green-masala",
    dishes: [
      { name: "Pomfret Fry", allergens: ["D", "F"], priceNote: AS_PER_SIZE, tags: SEAFOOD },
      { name: "Surmai Fry", allergens: ["D", "F"], priceNote: AS_PER_SIZE, tags: SEAFOOD },
      { name: "Bombil Fry", allergens: ["D", "F"], priceNote: AS_PER_SIZE, tags: SEAFOOD },
      { name: "Chicken Sukha Malwani / Agri", allergens: ["D", "M"], price: 349 },
      { name: "Mutton Sukha Malwani / Agri", allergens: ["D", "M"], price: 449 },
    ],
  },
  {
    slug: "mocktail",
    name: "Mocktail",
    image: "virgin-mojito",
    dishes: [
      { name: "Guava Spice", price: 249 },
      { name: "Fruit Punch", allergens: ["D", "N"], price: 249, description: "A vibrant drink featuring a blend of multiple fruit juices, often with a hint of fizz" },
      { name: "Strawberry Delight", price: 249, description: "The lush fruity flavour of strawberries with a cool, fizzy finish" },
      { name: "Virgin Mojito", price: 199, image: "virgin-mojito", description: "Tangy flavours of lime and mint" },
      { name: "Blue Lagoon", price: 249 },
    ],
  },
  {
    slug: "milkshake",
    name: "Milkshake",
    dishes: [
      { name: "Chocolate Milkshake", allergens: ["D", "S"], price: 249 },
      { name: "Mango Milkshake", allergens: ["D", "N"], price: 249 },
      { name: "Strawberry Milkshake", allergens: ["D", "S"], price: 249 },
      { name: "Dry Fruits Milkshake", allergens: ["D", "N"], price: 299 },
      { name: "Lassi", allergens: ["D", "N"], price: 129 },
      { name: "Butter Milk", allergens: ["D"], price: 89 },
    ],
  },
  {
    slug: "desserts",
    name: "Desserts",
    image: "sizzling-brownie",
    dishes: [
      { name: "Fruit Salad", allergens: ["D", "N"], price: 249 },
      { name: "Gulab Jamun (2 pc)", allergens: ["D", "G", "N"], price: 99 },
      { name: "Ukadiche Modak (3 pc)", allergens: ["D", "N"], price: 199, image: "ukadiche-modak-still" },
      { name: "Banana Toffee with Ice Cream", allergens: ["D", "G", "N", "Se"], price: 249 },
      { name: "Sizzling Brownie", allergens: ["D", "G", "E", "N"], price: 299, image: "sizzling-brownie", featured: true },
      { name: "Elaneer Payasam", allergens: ["D", "N"], price: 199 },
      { name: "Ice Cream", allergens: ["D", "N"], price: 149 },
    ],
  },
];

/**
 * Entries that look like print errors or are ambiguous. Shown nowhere on the
 * site; listed so the restaurant can confirm them.
 */
export const MENU_REVIEW_NOTES: { dish: string; note: string }[] = [
  { dish: "Plain Dosa", note: "Printed description repeats Medu Vada's (\"deep fried doughnut… black gram\"). Description omitted until corrected." },
  { dish: "Duplex Mushroom", note: "Printed description repeats Crispy Fish Finger's (\"Boneless fish…\"). Description omitted until corrected." },
  { dish: "Masala Dosa", note: "Description is identical to Butter Dosa's, including \"with butter\". Kept as printed." },
  { dish: "Lasooni Palak", note: "Described as \"Fenugreek leaves\"; palak is spinach. Kept as printed." },
  { dish: "Sabji Maharaja / Punjabi Paneer Chop Masala", note: "\"radish gravy\" / \"in radish\" may mean \"reddish\". Kept as printed." },
  { dish: "Momos", note: "Veg (₹399) is priced above Chicken (₹349). Kept as printed." },
  { dish: "Dim Sum Crystal Veg / Sea Momos", note: "Printed on one line as \"DIM SUM CRYSTAL VEG 399 SEA MOMOS 549\". Interpreted as two dishes." },
  { dish: "Four Cheese Pizza", note: "Veg and Chicken are both ₹449. Kept as printed." },
  { dish: "Tandoori Pomfret, Seafood Thali, Pomfret / Surmai / Bombil Fry", note: "Printed as \"APS\"; shown as \"As per size\"." },
];
