import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/catalog";
import { Icon, Ornament } from "@/components/icons";
export const metadata: Metadata = { title: "Our Collections" };
export default function CollectionsPage() {
  return <main><section className="catalog-hero"><div className="page-container"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Collections</span></div><span className="eyebrow">A WORLD OF BEAUTIFUL WEAVES</span><h1>Every weave, a new story.</h1><p>Six thoughtfully curated collections. A little something for every you.</p></div></section><section className="page-container collections-content"><div className="collections-grid">{categories.map((category) => <Link href={`/shop?category=${category.name}`} className="collection-tile" key={category.name}><div className="collection-tile-image"><Image src={category.image} alt={`${category.name} sarees`} fill sizes="(max-width: 600px) 45vw, 32vw" style={{ objectFit: "cover", objectPosition: "center 28%" }} /></div><div className="collection-tile-title"><div><span className="eyebrow">{category.subtitle}</span><h2>{category.name} Sarees</h2></div><Icon name="arrow" size={25} /></div></Link>)}</div><Ornament /></section></main>;
}
