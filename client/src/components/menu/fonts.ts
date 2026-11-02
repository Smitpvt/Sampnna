import { Jost } from "next/font/google";

/**
 * Jost — the geometric sans of the printed Sampann menu card. Used only by the
 * menu book (applied via `jost.variable`, read as var(--font-jost)); the rest
 * of the site keeps its own fonts.
 */
export const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});
