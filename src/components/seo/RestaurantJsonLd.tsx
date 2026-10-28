import { site } from "@/config/site";

/**
 * schema.org Restaurant data using only verified facts from site config.
 * No hours, rating or price range until those are supplied/verified.
 */
export function RestaurantJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: site.legalName,
    url: site.url,
    image: `${site.url}/images/og/dining-room-arches.jpg`,
    logo: `${site.url}/brand/sampann-logo.png`,
    telephone: site.phone.tel,
    servesCuisine: site.cuisines,
    menu: `${site.url}/menu`,
    acceptsReservations: true,
    address: { "@type": "PostalAddress", addressLocality: site.locality, addressRegion: site.region, addressCountry: site.country },
    sameAs: [site.instagram.url],
    ...(site.openingHours ? { openingHours: site.openingHours.map((h) => `${h.days} ${h.hours}`) } : {}),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
