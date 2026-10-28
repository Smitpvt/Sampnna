/**
 * Business facts shown on the site. Only verified values belong here —
 * everything below comes from the restaurant's own printed menu. Leave a
 * field null rather than guessing; the UI hides anything that is null.
 */
export const site = {
  name: "Sampann",
  legalName: "Sampann Resort & Restaurant",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locality: "Chaul, Alibag",
  region: "Maharashtra",
  country: "IN",
  phone: { display: "+91 99605 90302", tel: "+919960590302" },
  /** No public email address supplied yet. */
  email: null as string | null,
  instagram: { handle: "@sampann.alibag", url: "https://www.instagram.com/sampann.alibag/" },
  /** Not supplied yet — the footer and contact page say "call to confirm". */
  openingHours: null as { days: string; hours: string }[] | null,
  /** Map search for the business name and locality (not a hand-placed pin). */
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sampann+Resort+%26+Restaurant+Chaul+Alibag",
  mapsEmbedUrl: "https://www.google.com/maps?q=Sampann+Resort+%26+Restaurant,+Chaul,+Alibag&output=embed",
  /** From the menu: "We also host". */
  events: ["Banquet Hall", "Party Order", "Engagement", "Wedding", "Birthday"],
  /** From the menu's welcome page. */
  cuisines: ["Indian", "Tandoor", "Oriental", "Continental", "Konkan"],
  gstNote: "All prices in ₹. 5% GST applicable.",
} as const;

/**
 * Reservation request rules. The time window is a sanity bound for the form,
 * NOT published opening hours — adjust to the restaurant's real hours.
 */
export const reservationRules = {
  timeZone: "Asia/Kolkata",
  utcOffsetMinutes: 330,
  firstSlot: "07:00",
  lastSlot: "22:30",
  slotMinutes: 30,
  minLeadMinutes: 60,
  maxDaysAhead: 90,
  minGuests: 1,
  /** Larger parties are directed to call (banquet / party enquiries). */
  maxGuests: 20,
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
