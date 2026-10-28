import type { Metadata } from "next";
import { MenuBrowser } from "@/components/menu/MenuBrowser";
import { site } from "@/config/site";
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
  const dishCount = categories.reduce((n, c) => n + c.dishes.length, 0);

  return (
    <>
      <header className="bg-sand/60 pb-14 pt-32 md:pb-20 md:pt-44">
        <div className="shell grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow text-terracotta">The menu</p>
            <h1 className="mt-5 text-display">
              Everything <em className="text-terracotta">on</em> the table.
            </h1>
          </div>
          <div className="space-y-4 text-ink-soft md:col-span-4 md:col-start-9">
            <p className="text-lg leading-relaxed">
              {dishCount} dishes across {categories.length} sections — from morning dosa to the tandoor, the wok and the Konkan tawa.
            </p>
            <p className="text-sm">{site.gstNote}</p>
          </div>
        </div>
      </header>

      {categories.length === 0 ? (
        <p className="shell py-24 text-center text-lg text-ink-soft">The menu is being updated. Please call us for today&apos;s dishes.</p>
      ) : (
        <MenuBrowser categories={categories} />
      )}
    </>
  );
}
