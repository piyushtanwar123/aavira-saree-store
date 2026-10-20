export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  imagePosition?: string;
  categories: string[];
  fabric: string;
  color: string;
  colorHex: string;
  badge?: string;
  description: string;
  bestseller?: boolean;
};

export const products: Product[] = [
  { id: "ae-001", slug: "gulab-rose-banarasi-silk", name: "Gulab Rose Banarasi Silk", price: 3499, originalPrice: 4299, image: "/images/rose-silk.jpg", categories: ["Silk", "Banarasi", "Festive"], fabric: "Banarasi silk blend", color: "Dusty Rose", colorHex: "#bb8181", badge: "NEW ARRIVAL", description: "A little romance, woven into every fold. Gulab pairs a soft rose hue with delicate gold-toned floral zari and a beautifully finished border. An effortless choice for intimate celebrations and days that deserve a little more.", bestseller: true },
  { id: "ae-002", slug: "meera-emerald-kanjivaram", name: "Meera Emerald Kanjivaram", price: 4299, originalPrice: 5499, image: "/images/emerald-silk.jpg", categories: ["Silk", "Kanjivaram", "Festive"], fabric: "Kanjivaram silk blend", color: "Emerald Green", colorHex: "#24483e", badge: "BESTSELLER", description: "Deep emerald meets luminous gold in a saree made for your most cherished moments. Meera brings together a generous zari border, a graceful drape, and the quiet grandeur of a timeless Indian weave.", bestseller: true },
  { id: "ae-003", slug: "tara-ivory-gold-silk", name: "Tara Ivory Gold Silk", price: 2999, originalPrice: 3699, image: "/images/ivory-silk.jpg", categories: ["Silk", "Designer"], fabric: "Soft silk blend", color: "Ivory Gold", colorHex: "#d7c9a4", badge: "NEW ARRIVAL", description: "Understated and endlessly elegant. Tara is a soft ivory saree, scattered with delicate gold-toned florals and edged with a refined woven border. A light, luminous companion for daytime festivities and everyday occasions." },
  { id: "ae-004", slug: "anika-wine-banarasi", name: "Anika Wine Banarasi", price: 3899, originalPrice: 4799, image: "/images/hero-saree.jpg", imagePosition: "74% center", categories: ["Banarasi", "Silk", "Bridal"], fabric: "Banarasi silk blend", color: "Burgundy Wine", colorHex: "#701f33", badge: "MOST LOVED", description: "An ode to heritage in a captivating shade of wine. Anika features rich gold-toned brocade, an intricately woven pallu, and a statement border. A celebration saree to return to, season after season.", bestseller: true },
  { id: "ae-005", slug: "rhea-ruby-bridal-silk", name: "Rhea Ruby Bridal Silk", price: 5999, originalPrice: 7499, image: "/images/bridal-red.jpg", categories: ["Bridal", "Banarasi", "Silk"], fabric: "Bridal Banarasi silk blend", color: "Ruby Red", colorHex: "#9d2433", badge: "HERITAGE EDIT", description: "For beginnings as beautiful as you. Rhea is an heirloom-inspired ruby red saree, adorned with elaborate gold-toned floral zari and a richly detailed pallu. A timeless expression of joy and tradition.", bestseller: true },
  { id: "ae-006", slug: "noor-lilac-organza", name: "Noor Lilac Organza", price: 2799, originalPrice: 3499, image: "/images/lilac-designer.jpg", categories: ["Designer", "Festive"], fabric: "Embroidered organza blend", color: "Soft Lilac", colorHex: "#a78baf", badge: "NEW ARRIVAL", description: "Airy, delicate, and quietly extraordinary. Noor's translucent lilac layers are finished with softly embroidered florals and a delicate metallic border. Made for garden celebrations, long lunches, and golden-hour gatherings." },
  { id: "ae-007", slug: "sunehri-gold-festive-silk", name: "Sunehri Gold Festive Silk", price: 3299, originalPrice: 3999, image: "/images/gold-festive.jpg", categories: ["Festive", "Silk", "Kanjivaram"], fabric: "Woven festive silk blend", color: "Antique Gold", colorHex: "#b88a32", badge: "FESTIVE FAVOURITE", description: "Wear a little sunshine. Sunehri's warm golden hue, subtle woven motifs, and contrasting wine border capture the spirit of celebration. Beautifully fluid and easy to style for every festive gathering." },
];

export const categories = [
  { name: "Silk", subtitle: "Effortless classics", image: "/images/ivory-silk.jpg" },
  { name: "Banarasi", subtitle: "Woven with heritage", image: "/images/rose-silk.jpg" },
  { name: "Kanjivaram", subtitle: "South Indian splendour", image: "/images/emerald-silk.jpg" },
  { name: "Bridal", subtitle: "For your forever", image: "/images/bridal-red.jpg" },
  { name: "Designer", subtitle: "A modern expression", image: "/images/lilac-designer.jpg" },
  { name: "Festive", subtitle: "Made to celebrate", image: "/images/gold-festive.jpg" },
];

export const newArrivals = products.slice(0, 4);
export const bestsellers = products.filter((product) => product.bestseller);
export const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;
export const findProduct = (slug: string) => products.find((product) => product.slug === slug);
export const getProduct = (id: string) => products.find((product) => product.id === id);
export const FREE_SHIPPING_THRESHOLD = 2999;
export const SHIPPING_FEE = 149;
