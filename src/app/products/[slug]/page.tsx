import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, findProduct } from "@/lib/catalog";
import { ProductDetail } from "@/components/product-detail";
import { ProductCard } from "@/components/product-card";

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = findProduct(slug);
  return { title: product?.name || "Saree not found", description: product?.description };
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();
  const related = products.filter((item) => item.id !== product.id).sort((a, b) => Number(b.categories.some((category) => product.categories.includes(category))) - Number(a.categories.some((category) => product.categories.includes(category)))).slice(0, 4);
  return <main><ProductDetail product={product} /><section className="page-container product-section related-section"><div className="section-heading centered-heading"><span className="eyebrow">A LITTLE MORE TO FALL IN LOVE WITH</span><h2>You May Also Love</h2></div><div className="product-grid">{related.map((item) => <ProductCard product={item} key={item.id} />)}</div></section></main>;
}
