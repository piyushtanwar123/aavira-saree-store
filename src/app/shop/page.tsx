import type { Metadata } from "next";
import { ShopBrowser } from "@/components/shop-browser";
export const metadata: Metadata = { title: "Shop the Saree Collection", description: "Explore our collection of Banarasi, Kanjivaram, bridal, silk, festive and designer sarees." };
export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : "";
  const query = typeof params.q === "string" ? params.q : "";
  const sort = typeof params.sort === "string" ? params.sort : "featured";
  return <ShopBrowser key={`${category}-${query}-${sort}`} initialCategory={category} initialQuery={query} initialSort={sort} />;
}
