/**
 * Seeds menu and gallery content from the single sources of truth:
 *   src/data/menu.ts            — the printed menu
 *   src/data/media-sources.json — curated photography (+ media.generated.json)
 *
 * Idempotent: safe to re-run after editing those files. Never touches
 * reservations, enquiries or testimonials.
 */
import { PrismaClient, type GalleryCategory } from "@prisma/client";
import { MENU } from "../src/data/menu";
import sources from "../src/data/media-sources.json";
import generated from "../src/data/media.generated.json";
import { slugify } from "../src/lib/slug";

const prisma = new PrismaClient();
const manifest = generated as Record<string, { src: string; width: number; height: number; blurDataUrl: string }>;

function imageSrc(slug?: string) {
  if (!slug) return null;
  const entry = manifest[slug];
  if (!entry) throw new Error(`Menu references unknown image "${slug}"`);
  return entry.src;
}

function imageAlt(slug?: string) {
  return slug ? ((sources as { slug: string; alt: string }[]).find((s) => s.slug === slug)?.alt ?? null) : null;
}

async function seedMenu() {
  const seen = new Set<string>();
  let dishCount = 0;

  for (const [ci, cat] of MENU.entries()) {
    const category = await prisma.menuCategory.upsert({
      where: { slug: cat.slug },
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description ?? null,
        image: imageSrc(cat.image),
        imageAlt: imageAlt(cat.image),
        displayOrder: ci,
      },
      update: {
        name: cat.name,
        description: cat.description ?? null,
        image: imageSrc(cat.image),
        imageAlt: imageAlt(cat.image),
        displayOrder: ci,
      },
    });

    for (const [di, d] of cat.dishes.entries()) {
      let slug = slugify(d.name);
      if (seen.has(slug)) slug = `${slug}-${cat.slug}`;
      if (seen.has(slug)) throw new Error(`Duplicate dish slug ${slug}`);
      seen.add(slug);

      const data = {
        name: d.name,
        description: d.description ?? null,
        price: d.price ?? null,
        priceNote: d.priceNote ?? null,
        image: imageSrc(d.image),
        imageAlt: imageAlt(d.image),
        categoryId: category.id,
        tags: d.tags ?? [],
        isFeatured: d.featured ?? false,
        displayOrder: di,
      };
      const dish = await prisma.dish.upsert({ where: { slug }, create: { slug, ...data }, update: data });

      await prisma.dishPriceOption.deleteMany({ where: { dishId: dish.id } });
      if (d.options?.length) {
        await prisma.dishPriceOption.createMany({
          data: d.options.map((o, oi) => ({
            dishId: dish.id,
            label: o.label,
            price: o.price ?? null,
            priceNote: o.priceNote ?? null,
            displayOrder: oi,
          })),
        });
      }
      dishCount++;
    }
  }
  console.log(`Menu: ${MENU.length} categories, ${dishCount} dishes`);
}

async function seedGallery() {
  const items = (sources as { slug: string; alt: string; caption: string; category: GalleryCategory; gallery: boolean }[]).filter(
    (s) => s.gallery,
  );
  for (const [i, s] of items.entries()) {
    const m = manifest[s.slug];
    if (!m) throw new Error(`Missing generated image for ${s.slug}`);
    const data = {
      altText: s.alt,
      caption: s.caption,
      category: s.category,
      width: m.width,
      height: m.height,
      blurDataUrl: m.blurDataUrl,
      displayOrder: i,
    };
    // Web copies moved from .jpg to .webp: re-point rows seeded before the
    // switch instead of creating duplicates that reference missing files.
    const legacyUrl = m.src.replace(/\.webp$/, ".jpg");
    if (legacyUrl !== m.src && !(await prisma.galleryImage.findUnique({ where: { imageUrl: m.src } }))) {
      await prisma.galleryImage.updateMany({ where: { imageUrl: legacyUrl }, data: { imageUrl: m.src } });
    }
    await prisma.galleryImage.upsert({ where: { imageUrl: m.src }, create: { imageUrl: m.src, ...data }, update: data });
  }
  console.log(`Gallery: ${items.length} images`);
}

async function seedTestimonials() {
  const reviews = [
    {
      authorName: "Shlok Patil",
      rating: 5,
      reviewText: "I had an absolutely amazing experience at this restaurant! From the moment I walked in, the ambiance was warm, welcoming, and beautifully designed. The staff was incredibly polite, attentive, and made sure everything was perfect throughout the visit. The food was outstanding — every dish was fresh, flavorful, and cooked to perfection. You can really tell they use high-quality ingredients and put a lot of care into presentation. The taste was simply unforgettable! The service was quick and efficient, and the overall vibe made it a perfect place to relax and enjoy a great meal with family or friends. Highly recommended! I will definitely be visiting again soon.",
      source: "GOOGLE" as const,
      isPublished: true,
      isVerified: true,
    },
    {
      authorName: "Pratik Bande",
      rating: 5,
      reviewText: "We ordered Surmai fry, Tandoori Pomfret and Prawns thali, it was so yum 😋. That just can't be expressed in words. You have to come here and try it. And in the end enjoy their special refreshing solkadi.",
      source: "GOOGLE" as const,
      isPublished: true,
      isVerified: true,
    },
    {
      authorName: "Yogeshkumar Sirpuram",
      rating: 5,
      reviewText: "Awesome atmosphere, good people and Anna Parabrahma.. Wherever you are in Alibaug, come for fooding at this place.",
      source: "GOOGLE" as const,
      isPublished: true,
      isVerified: true,
    },
    {
      authorName: "AmarnnHappy",
      rating: 5,
      reviewText: "Just stopped for a tea break and the tea was excellent. The restaurant is neat and clean, with both AC and non-AC seating. The ambience is very pleasant and inviting—it almost made us want to stay for a full meal.",
      source: "GOOGLE" as const,
      isPublished: true,
      isVerified: true,
    },
    {
      authorName: "Vinay Kunte",
      rating: 5,
      reviewText: "We had our dinner here. Superb ambience, quick service, caring staff are the highlight. Very well planned place. Best wishes to you all.",
      source: "GOOGLE" as const,
      isPublished: true,
      isVerified: true,
    },
    {
      authorName: "Maithili",
      rating: 5,
      reviewText: "We visited for dinner at this hotel and had a fantastic time. Every dish we ordered was rich in flavor and perfectly cooked, 10 out of 10. What made the night even better was the staff—they were professional and very attentive. Prompt service and great ambience. Will definitely visit again! Highly recommended!",
      source: "GOOGLE" as const,
      isPublished: true,
      isVerified: true,
    },
    {
      authorName: "Girish Kale",
      rating: 5,
      reviewText: "Sampann Resort — New Food Joint Discovery. Check out this exciting new food joint at Chaul offering fresh varieties of local and fusion dishes—perfect addition to the area's dining scene. Highly recommend for a delightful dine-out. Fantastic service at Hotel Sampann Resort & Restaurant! Akash provided top-notch service—attentive, friendly, and made our evening perfect! We tried their dim-sum and momos (crispy and flavorful perfection), plus the Malaysian laksa soup that was bursting with authentic spices. Most recommended: the paysam with coconut milk—creamy, indulgent, and the ideal sweet finish!",
      source: "GOOGLE" as const,
      isPublished: true,
      isVerified: true,
    },
    {
      authorName: "Vedant Kulkarni",
      rating: 5,
      reviewText: "Great food, peaceful ambience, and excellent service! Everything was fresh, tasty, and well prepared. A perfect place to enjoy a relaxing meal in Alibag. Highly recommended!",
      source: "GOOGLE" as const,
      isPublished: true,
      isVerified: true,
    },
    {
      authorName: "Deepali Yadav",
      rating: 5,
      reviewText: "The restaurant is amazing. Royal look, very good. Staff is very good and friendly. Helpful. They offer welcome drink and snack. Family oriented. Must visit if you're in Alibaug. Surprisingly you should expect all kinds of food varieties and not just Konkani food. Amazing spacious parking and dining. The food is quite good.",
      source: "GOOGLE" as const,
      isPublished: true,
      isVerified: true,
    },
    {
      authorName: "Kadambari Vidoor",
      rating: 5,
      reviewText: "The best place to have dinner and end our short trip to Alibaug. Trusted the locals who suggested Sampann restaurant. What an amazing vibe, ambience and food. 10/10 food. We ordered Surmai and Pomfret thali along with tandoori prawns, extremely delicious. Thali came with a modak in it and it's heavenly tasty and subtle sweet. The staff Imran and Rathod are really helpful and humble.",
      source: "GOOGLE" as const,
      isPublished: true,
      isVerified: true,
    },
    {
      authorName: "Abhilash Revo",
      rating: 5,
      reviewText: "Excellent food and great hospitality. We had our breakfast and dinner with them. Their Dal Handi Ghotala is a must try, we also had butter chicken with Jeera rice which was awesome too. In breakfast we had Medu Vada which was delicious and served quickly too. Overall it was a great experience and would definitely recommend to anyone visiting Revdanda, Alibaug.",
      source: "GOOGLE" as const,
      isPublished: true,
      isVerified: true,
    },
    {
      authorName: "Jitesh Patil",
      rating: 5,
      reviewText: "Highly recommended! Everything from the warm, beautiful ambience to the top-tier service was spot on. The food was exceptional—fresh, flavorful, and beautifully presented in every dish. It's the perfect spot to relax over a great meal with family or friends. I'll definitely be back soon! Thanks to Ganpat for your quick service. Must try: Solkadhi, Pomfret Tandoori Fry, and don't forget their Ukdiche Modak that's simply the best and very delicious.",
      source: "GOOGLE" as const,
      isPublished: true,
      isVerified: true,
    },
  ];

  let added = 0;
  for (const r of reviews) {
    const existing = await prisma.testimonial.findFirst({
      where: { authorName: r.authorName, reviewText: r.reviewText },
    });
    if (!existing) {
      await prisma.testimonial.create({ data: r });
      added++;
    }
  }
  console.log(`Testimonials: ${added} added, ${reviews.length - added} duplicates skipped`);
}

seedMenu()
  .then(seedGallery)
  .then(seedTestimonials)
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
