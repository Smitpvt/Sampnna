/**
 * Guest-facing figures and reviews for the homepage Highlights and
 * "Words from Our Guests" sections. Edit here — nothing is fetched from Google.
 *
 * GOOGLE_RATING is copied by hand from Sampann's Google Maps listing; update
 * `rating`, `reviewCount` and `checked` together when it changes. The dishes
 * figure is not here: it is counted from the live menu.
 */

import { site } from "@/config/site";

export const GOOGLE_RATING = {
  rating: 4.7,
  /** Shown with a "+" — the listing's total at the time it was checked. */
  reviewCount: 291,
  checked: "2026-10",
} as const;

/**
 * Where "Review us on Google ↗" points — a plain Google Maps link, opened in a
 * new tab (no API). Currently Sampann's Google Maps search link from
 * config/site.ts. TODO: replace with the listing's own "Write a review" share
 * link (Google Maps → Sampann → Reviews → Write a review → copy link) once
 * the restaurant provides it.
 */
export const GOOGLE_REVIEW_URL: string = site.mapsUrl;

export type Testimonial = {
  id: string;
  /** As the guest chose to be named (e.g. on Google). */
  name: string;
  /** 1–5, as the guest gave it. */
  rating: number;
  text: string;
  /** Where the review was published, e.g. "Google". */
  source?: string;
  /** Month and year, e.g. "Oct 2026". */
  date?: string;
};

/**
 * Genuine guest reviews, copied word for word with the guest's public name,
 * star rating and source. Empty until real reviews are added — the carousel
 * only appears on the live site when this has entries.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "review-shlok-patil",
    name: "Shlok Patil",
    rating: 5,
    text: "I had an absolutely amazing experience at this restaurant! From the moment I walked in, the ambiance was warm, welcoming, and beautifully designed. The staff was incredibly polite, attentive, and made sure everything was perfect throughout the visit. The food was outstanding — every dish was fresh, flavorful, and cooked to perfection. You can really tell they use high-quality ingredients and put a lot of care into presentation. The taste was simply unforgettable! The service was quick and efficient, and the overall vibe made it a perfect place to relax and enjoy a great meal with family or friends. Highly recommended! I will definitely be visiting again soon.",
  },
  {
    id: "review-pratik-bande",
    name: "Pratik Bande",
    rating: 5,
    text: "We ordered Surmai fry, Tandoori Pomfret and Prawns thali, it was so yum 😋. That just can't be expressed in words. You have to come here and try it. And in the end enjoy their special refreshing solkadi.",
  },
  {
    id: "review-yogeshkumar-sirpuram",
    name: "Yogeshkumar Sirpuram",
    rating: 5,
    text: "Awesome atmosphere, good people and Anna Parabrahma.. Wherever you are in Alibaug, come for fooding at this place.",
  },
  {
    id: "review-amarnnhappy",
    name: "AmarnnHappy",
    rating: 5,
    text: "Just stopped for a tea break and the tea was excellent. The restaurant is neat and clean, with both AC and non-AC seating. The ambience is very pleasant and inviting—it almost made us want to stay for a full meal.",
  },
  {
    id: "review-vinay-kunte",
    name: "Vinay Kunte",
    rating: 5,
    text: "We had our dinner here. Superb ambience, quick service, caring staff are the highlight. Very well planned place. Best wishes to you all.",
  },
  {
    id: "review-maithili",
    name: "Maithili",
    rating: 5,
    text: "We visited for dinner at this hotel and had a fantastic time. Every dish we ordered was rich in flavor and perfectly cooked, 10 out of 10. What made the night even better was the staff—they were professional and very attentive. Prompt service and great ambience. Will definitely visit again! Highly recommended!",
  },
  {
    id: "review-girish-kale",
    name: "Girish Kale",
    rating: 5,
    text: "Sampann Resort — New Food Joint Discovery. Check out this exciting new food joint at Chaul offering fresh varieties of local and fusion dishes—perfect addition to the area's dining scene. Highly recommend for a delightful dine-out. Fantastic service at Hotel Sampann Resort & Restaurant! Akash provided top-notch service—attentive, friendly, and made our evening perfect! We tried their dim-sum and momos (crispy and flavorful perfection), plus the Malaysian laksa soup that was bursting with authentic spices. Most recommended: the paysam with coconut milk—creamy, indulgent, and the ideal sweet finish!",
  },
  {
    id: "review-vedant-kulkarni",
    name: "Vedant Kulkarni",
    rating: 5,
    text: "Great food, peaceful ambience, and excellent service! Everything was fresh, tasty, and well prepared. A perfect place to enjoy a relaxing meal in Alibag. Highly recommended!",
  },
  {
    id: "review-deepali-yadav",
    name: "Deepali Yadav",
    rating: 5,
    text: "The restaurant is amazing. Royal look, very good. Staff is very good and friendly. Helpful. They offer welcome drink and snack. Family oriented. Must visit if you're in Alibaug. Surprisingly you should expect all kinds of food varieties and not just Konkani food. Amazing spacious parking and dining. The food is quite good.",
  },
  {
    id: "review-kadambari-vidoor",
    name: "Kadambari Vidoor",
    rating: 5,
    text: "The best place to have dinner and end our short trip to Alibaug. Trusted the locals who suggested Sampann restaurant. What an amazing vibe, ambience and food. 10/10 food. We ordered Surmai and Pomfret thali along with tandoori prawns, extremely delicious. Thali came with a modak in it and it's heavenly tasty and subtle sweet. The staff Imran and Rathod are really helpful and humble.",
  },
  {
    id: "review-abhilash-revo",
    name: "Abhilash Revo",
    rating: 5,
    text: "Excellent food and great hospitality. We had our breakfast and dinner with them. Their Dal Handi Ghotala is a must try, we also had butter chicken with Jeera rice which was awesome too. In breakfast we had Medu Vada which was delicious and served quickly too. Overall it was a great experience and would definitely recommend to anyone visiting Revdanda, Alibaug.",
  },
  {
    id: "review-jitesh-patil",
    name: "Jitesh Patil",
    rating: 5,
    text: "Highly recommended! Everything from the warm, beautiful ambience to the top-tier service was spot on. The food was exceptional—fresh, flavorful, and beautifully presented in every dish. It's the perfect spot to relax over a great meal with family or friends. I'll definitely be back soon! Thanks to Ganpat for your quick service. Must try: Solkadhi, Pomfret Tandoori Fry, and don't forget their Ukdiche Modak that's simply the best and very delicious.",
  },
];

/**
 * Design-preview placeholders. Shown only in development (never in a
 * production build), and every card carries a visible "Placeholder" label.
 * They are not reviews from real guests.
 */
export const PREVIEW_TESTIMONIALS: Testimonial[] = [
  { id: "preview-1", name: "Guest name", rating: 5, text: "Placeholder review — a guest's words about the food and the welcome will appear here once a genuine review is added." },
  { id: "preview-2", name: "Guest name", rating: 5, text: "Placeholder review — this card previews how a longer review wraps across several lines in the carousel, so the layout can be checked before real reviews arrive." },
  { id: "preview-3", name: "Guest name", rating: 4, text: "Placeholder review — short." },
  { id: "preview-4", name: "Guest name", rating: 5, text: "Placeholder review — replace with a genuine review copied from Google or the guest book, with the guest's public name and rating." },
  { id: "preview-5", name: "Guest name", rating: 5, text: "Placeholder review — a fifth card, so the carousel has enough to scroll on wide screens." },
];
