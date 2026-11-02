import type { Metadata } from "next";
import { MenuBook } from "@/components/menu/MenuBook";
import { getMenu } from "@/services/menu";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Menu",
  description:
    "The full Sampann menu — breakfast, Indian appetizers and mains, tandoor, Oriental, Continental, pizza, Maharashtrian thalis, seafood, mocktails and desserts. Prices in ₹.",
  alternates: { canonical: "/menu" },
  openGraph: { title: "Menu · Sampann, Alibag", images: [{ url: "/images/og/seafood-thali.jpg", alt: "Seafood thali at Sampann" }] },
};

export default async function MenuPage() {
  const categories = await getMenu();

  if (categories.length === 0) {
    return (
      <p className="shell pb-24 pt-40 text-center text-lg text-ink-soft">The menu is being updated. Please call us for today&apos;s dishes.</p>
    );
  }

  return <MenuBook categories={categories} />;
}
