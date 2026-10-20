"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { categories, products } from "@/lib/catalog";
import { ProductCard } from "./product-card";
import { Icon } from "./icons";
import { useStore } from "./store";

export function ShopBrowser({ initialCategory = "", initialQuery = "", initialSort = "featured", favoritesOnly = false }: { initialCategory?: string; initialQuery?: string; initialSort?: string; favoritesOnly?: boolean }) {
  const [category, setCategory] = useState(categories.some((item) => item.name === initialCategory) ? initialCategory : "");
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState(initialSort);
  const { favorites, hydrated } = useStore();
  const filtered = useMemo(() => {
    let result = products.filter((product) => (!category || product.categories.includes(category)) && (!favoritesOnly || favorites.includes(product.id)) && `${product.name} ${product.color} ${product.fabric}`.toLowerCase().includes(query.toLowerCase().trim()));
    if (sort === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "bestselling") result = [...result].sort((a, b) => Number(!!b.bestseller) - Number(!!a.bestseller));
    if (sort === "newest") result = [...result].sort((a, b) => Number(b.badge === "NEW ARRIVAL") - Number(a.badge === "NEW ARRIVAL"));
    return result;
  }, [category, query, sort, favorites, favoritesOnly]);
  return <main className="shop-page"><section className="catalog-hero"><div className="page-container"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>{favoritesOnly ? "Your favourites" : "The saree collection"}</span></div><span className="eyebrow">{favoritesOnly ? "SOME THINGS STAY WITH YOU" : "BEAUTIFUL WEAVES. ENDLESS POSSIBILITIES."}</span><h1>{favoritesOnly ? "Your forever favourites." : category ? `${category} Sarees` : "Find your kind of timeless."}</h1><p>{favoritesOnly ? "The pieces you love, all in one beautiful place." : "Thoughtfully chosen sarees for the everyday and the extraordinary."}</p></div></section><section className="page-container catalog-content">{!favoritesOnly && <div className="filter-pills" aria-label="Filter by saree category"><button className={!category ? "selected" : ""} onClick={() => setCategory("")}>All sarees</button>{categories.map((item) => <button key={item.name} className={category === item.name ? "selected" : ""} onClick={() => setCategory(item.name)}>{item.name}</button>)}</div>}<div className="catalog-toolbar"><span className="result-count">{favoritesOnly && !hydrated ? "Finding your favourites…" : `${filtered.length} beautiful ${filtered.length === 1 ? "piece" : "pieces"}`}</span><div className="catalog-tools"><div className="catalog-search"><Icon name="search" size={17} /><input placeholder="Find a saree…" aria-label="Filter products by name, fabric, or colour" value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button className="icon-button" onClick={() => setQuery("")} aria-label="Clear product search"><Icon name="close" size={14} /></button>}</div><label className="sort-control"><span>Sort by:</span><select aria-label="Sort sarees" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="newest">New arrivals</option><option value="bestselling">Bestsellers</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A – Z</option></select></label></div></div>{filtered.length > 0 ? <div className="product-grid catalog-grid">{filtered.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 4} />)}</div> : <div className="empty-state"><span className="empty-icon"><Icon name={favoritesOnly ? "heart" : "search"} size={34} /></span><h2>{favoritesOnly ? "A love story waiting to happen." : "A different weave awaits."}</h2><p>{favoritesOnly ? "Tap the little heart on any saree to keep it here." : "We couldn’t find that combination. Try another colour or collection."}</p>{favoritesOnly ? <Link href="/shop" className="button button-primary">Explore the collection <Icon name="arrow" size={18} /></Link> : <button className="button button-primary" onClick={() => { setCategory(""); setQuery(""); }}>Show all sarees <Icon name="arrow" size={18} /></button>}</div>}<div className="catalog-bottom-note"><Icon name="sparkles" size={20} /><p>Every saree has a story. Let’s find yours.</p></div></section></main>;
}
