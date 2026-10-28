-- Supabase exposes the public schema through its Data API (PostgREST) using the
-- public anon key. Enabling Row Level Security with NO policies denies all
-- access through that API, so guest names, emails and phone numbers can't be
-- read from the browser. Prisma connects as the table owner and is unaffected.
ALTER TABLE "MenuCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Dish" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DishPriceOption" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GalleryImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Reservation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Testimonial" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContactEnquiry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
