"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/catalog";
import { Icon } from "./icons";
import { useStore } from "./store";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addItem, favorites, toggleFavorite } = useStore();
  const liked = favorites.includes(product.id);
  return <article className="product-card"><div className="product-visual"><Link href={`/products/${product.slug}`} className="product-image-link" aria-label={`Discover ${product.name}`}><Image src={product.image} alt={`${product.name} in ${product.color}, styled on a model`} fill sizes="(max-width: 600px) 47vw, (max-width: 900px) 45vw, 24vw" priority={priority} style={{ objectFit: "cover", objectPosition: product.imagePosition || "center 30%" }} /></Link>{product.badge && <span className="product-badge">{product.badge}</span>}<button className={`favorite-button ${liked ? "is-favorite" : ""}`} aria-label={`${liked ? "Remove" : "Save"} ${product.name} ${liked ? "from" : "to"} favourites`} aria-pressed={liked} onClick={() => toggleFavorite(product.id)}><Icon name="heart" size={18} /></button><button className="quick-add" onClick={() => addItem(product.id)}><Icon name="bag" size={17} /><span>Quick add</span><Icon name="plus" size={15} /></button></div><div className="product-details"><div className="product-meta"><span>{product.fabric}</span><span className="color-swatch" style={{ background: product.colorHex }} title={product.color} /></div><Link href={`/products/${product.slug}`} className="product-name">{product.name}</Link><div className="product-price"><span>{formatPrice(product.price)}</span>{product.originalPrice && <><del>{formatPrice(product.originalPrice)}</del><span className="discount">{Math.round((1 - product.price / product.originalPrice) * 100)}% off</span></>}</div></div></article>;
}
