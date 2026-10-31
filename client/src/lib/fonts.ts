import { Cormorant_Garamond } from "next/font/google";

/**
 * Cormorant Garamond for the editorial homepage sections that use it (the
 * course showcase, testimonials and closing note). Applied per section via
 * `cormorant.variable`; read in CSS as var(--font-cormorant). The rest of the
 * site keeps its own serif.
 */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
