"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, formatPrice, getProduct, products } from "@/lib/catalog";
import { Icon } from "./icons";

type CartItem = { productId: string; quantity: number };
type EnquiryIntent = { productId?: string; quantity?: number; cart?: boolean };
type StoreContextType = {
  items: CartItem[]; favorites: string[]; hydrated: boolean; cartOpen: boolean; searchOpen: boolean;
  setCartOpen: (value: boolean) => void; setSearchOpen: (value: boolean) => void;
  addItem: (productId: string, quantity?: number) => void; setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void; toggleFavorite: (productId: string) => void;
  enquiry: EnquiryIntent | null; setEnquiry: (value: EnquiryIntent | null) => void;
  whatsappEnabled: boolean;
};
const StoreContext = createContext<StoreContextType | null>(null);
export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("StoreProvider is required");
  return value;
}

export function StoreProvider({ children, whatsappEnabled }: { children: ReactNode; whatsappEnabled: boolean }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [enquiry, setEnquiry] = useState<EnquiryIntent | null>(null);
  const [toast, setToast] = useState("");
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem("aavira-bag") || "[]");
      if (Array.isArray(saved)) setItems(saved.filter((item) => typeof item === "object" && item && getProduct(item.productId) && Number.isInteger(item.quantity) && item.quantity > 0).map((item) => ({ productId: item.productId, quantity: Math.min(item.quantity, 10) })));
      const liked: unknown = JSON.parse(localStorage.getItem("aavira-favorites") || "[]");
      if (Array.isArray(liked)) setFavorites(liked.filter((id): id is string => typeof id === "string" && !!getProduct(id)));
    } catch { /* A new bag is used if storage is unavailable. */ }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem("aavira-bag", JSON.stringify(items)); localStorage.setItem("aavira-favorites", JSON.stringify(favorites)); } catch { /* Shopping still works without persistent storage. */ }
  }, [items, favorites, hydrated]);
  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(timeout);
  }, [toast]);
  useEffect(() => {
    if (!cartOpen && !searchOpen && !enquiry) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [cartOpen, searchOpen, enquiry]);
  function addItem(productId: string, quantity = 1) {
    if (!getProduct(productId)) return;
    setItems((current) => {
      const existing = current.find((item) => item.productId === productId);
      return existing ? current.map((item) => item.productId === productId ? { ...item, quantity: Math.min(10, item.quantity + quantity) } : item) : [...current, { productId, quantity: Math.min(10, Math.max(1, quantity)) }];
    });
    setSearchOpen(false); setCartOpen(true);
  }
  function toggleFavorite(productId: string) {
    const exists = favorites.includes(productId);
    setFavorites((current) => exists ? current.filter((id) => id !== productId) : [...current, productId]);
    setToast(exists ? "Removed from your favourites" : "Saved to your favourites");
  }
  return <StoreContext.Provider value={{ items, favorites, hydrated, cartOpen, searchOpen, setCartOpen, setSearchOpen, addItem, setQuantity: (id, quantity) => setItems((current) => current.map((item) => item.productId === id ? { ...item, quantity: Math.max(1, Math.min(10, quantity)) } : item)), removeItem: (id) => setItems((current) => current.filter((item) => item.productId !== id)), toggleFavorite, enquiry, setEnquiry, whatsappEnabled }}>
    {children}
    {cartOpen && <CartDrawer />}
    {searchOpen && <SearchDialog />}
    {enquiry && <EnquiryDialog key={`${enquiry.productId || ""}-${enquiry.cart || ""}`} />}
    {toast && <div className="toast" role="status"><Icon name="check" size={18} />{toast}</div>}
  </StoreContext.Provider>;
}

export function Dialog({ children, onClose, titleId, drawer = false }: { children: ReactNode; onClose: () => void; titleId: string; drawer?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = ref.current;
    const focusable = () => Array.from(element?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, textarea, select, [tabindex="0"]') || []);
    const firstInput = element?.querySelector<HTMLInputElement>("input:not([type=hidden])");
    (firstInput || focusable()[0] || element)?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") closeRef.current();
      if (event.key === "Tab") {
        const nodes = focusable(); const first = nodes[0]; const last = nodes[nodes.length - 1];
        if (!nodes.length) { event.preventDefault(); return; }
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }
    document.addEventListener("keydown", keydown);
    return () => { document.removeEventListener("keydown", keydown); previous?.focus(); };
  }, []);
  return <div className={`modal-backdrop ${drawer ? "drawer-backdrop" : ""}`} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className={drawer ? "cart-drawer" : "dialog-panel"} role="dialog" aria-modal="true" aria-labelledby={titleId} ref={ref} tabIndex={-1}>{children}</div></div>;
}

export function QuantityControl({ quantity, onChange, compact = false }: { quantity: number; onChange: (quantity: number) => void; compact?: boolean }) {
  return <div className={`quantity-control ${compact ? "compact" : ""}`}><button type="button" onClick={() => onChange(quantity - 1)} disabled={quantity <= 1} aria-label="Decrease quantity"><Icon name="minus" size={15} /></button><span aria-live="polite">{quantity}</span><button type="button" onClick={() => onChange(quantity + 1)} disabled={quantity >= 10} aria-label="Increase quantity"><Icon name="plus" size={15} /></button></div>;
}

export function CartLines({ closeOnLink = false }: { closeOnLink?: boolean }) {
  const { items, setQuantity, removeItem, setCartOpen } = useStore();
  return <div className="cart-lines">{items.map((item) => {
    const product = getProduct(item.productId); if (!product) return null;
    return <div className="cart-line" key={item.productId}><Link className="cart-thumb" href={`/products/${product.slug}`} onClick={() => { if (closeOnLink) setCartOpen(false); }}><Image src={product.image} alt={product.name} fill sizes="110px" style={{ objectFit: "cover", objectPosition: product.imagePosition || "center 30%" }} /></Link><div className="cart-line-details"><span className="eyebrow">{product.color}</span><Link href={`/products/${product.slug}`} onClick={() => { if (closeOnLink) setCartOpen(false); }} className="cart-product-name">{product.name}</Link><p>{formatPrice(product.price)}</p><QuantityControl quantity={item.quantity} onChange={(quantity) => setQuantity(item.productId, quantity)} compact /></div><button className="icon-button remove-item" aria-label={`Remove ${product.name}`} onClick={() => removeItem(item.productId)}><Icon name="trash" size={17} /></button></div>;
  })}</div>;
}

export function EmptyBag() {
  const { setCartOpen } = useStore();
  return <div className="empty-state"><span className="empty-icon"><Icon name="bag" size={35} /></span><h3>A little room for elegance.</h3><p>Your shopping bag is waiting for something beautiful.</p><Link className="button button-primary" href="/shop" onClick={() => setCartOpen(false)}>Discover the collection <Icon name="arrow" size={18} /></Link></div>;
}

function CartDrawer() {
  const { items, setCartOpen, setEnquiry } = useStore();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (getProduct(item.productId)?.price || 0) * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return <Dialog drawer onClose={() => setCartOpen(false)} titleId="bag-heading"><div className="dialog-heading"><div><span className="eyebrow">YOUR CHOSEN PIECES</span><h2 id="bag-heading">Shopping bag <span>({count})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close shopping bag"><Icon name="close" /></button></div>{items.length ? <><div className="shipping-notice"><Icon name="truck" size={20} />{subtotal >= FREE_SHIPPING_THRESHOLD ? "Your bag qualifies for complimentary shipping." : `${formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} away from complimentary shipping.`}</div><div className="drawer-lines"><CartLines closeOnLink /></div><div className="drawer-summary"><div className="summary-row"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><div className="summary-row subtle"><span>Estimated shipping</span><span>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</span></div><p className="small-note">No payment is taken. Confirm availability by enquiry.</p><button className="button button-primary full-width" onClick={() => { setCartOpen(false); setEnquiry({ cart: true }); }}>Enquire to order <Icon name="arrow" size={18} /></button><Link href="/cart" className="text-link centered" onClick={() => setCartOpen(false)}>View shopping bag</Link></div></> : <EmptyBag />}</Dialog>;
}

function SearchDialog() {
  const [query, setQuery] = useState("");
  const { setSearchOpen } = useStore();
  const router = useRouter();
  const results = products.filter((product) => `${product.name} ${product.categories.join(" ")} ${product.color}`.toLowerCase().includes(query.toLowerCase().trim())).slice(0, 4);
  function submit(event: FormEvent) { event.preventDefault(); setSearchOpen(false); router.push(`/shop?q=${encodeURIComponent(query)}`); }
  return <Dialog onClose={() => setSearchOpen(false)} titleId="search-heading"><div className="dialog-heading"><div><span className="eyebrow">FIND YOUR FOREVER FAVOURITE</span><h2 id="search-heading">A world of beautiful weaves.</h2></div><button className="icon-button" onClick={() => setSearchOpen(false)} aria-label="Close search"><Icon name="close" /></button></div><form className="search-form" onSubmit={submit}><Icon name="search" /><input aria-label="Search sarees" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try ‘silk’, ‘rose’, or ‘festive’" /><button className="icon-button" type="submit" aria-label="Search collection"><Icon name="arrow" /></button></form><p className="eyebrow search-caption">{query ? `${results.length ? "MATCHING" : "NO MATCHING"} PIECES` : "A FEW OF OUR FAVOURITES"}</p><div className="search-results">{results.map((product) => <Link href={`/products/${product.slug}`} key={product.id} onClick={() => setSearchOpen(false)}><span className="search-result-image"><Image src={product.image} alt={product.name} fill sizes="70px" style={{ objectFit: "cover", objectPosition: product.imagePosition }} /></span><span><span className="search-result-name">{product.name}</span><span className="subtle">{product.fabric}</span></span><span>{formatPrice(product.price)}</span></Link>)}</div>{results.length === 0 && <p className="subtle search-empty">Try another colour, fabric, or collection.</p>}<Link className="button button-outline full-width" href={`/shop?q=${encodeURIComponent(query)}`} onClick={() => setSearchOpen(false)}>Explore all sarees <Icon name="arrow" size={18} /></Link></Dialog>;
}

function EnquiryDialog() {
  const { enquiry, setEnquiry, items, whatsappEnabled } = useStore();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const product = enquiry?.productId ? getProduct(enquiry.productId) : null;
  const selectedItems = product ? [{ productId: product.id, quantity: Math.max(1, Math.min(10, enquiry?.quantity || 1)) }] : enquiry?.cart ? items : [];
  const description = selectedItems.map((item) => `${getProduct(item.productId)?.name} × ${item.quantity}`).join(", ");
  const whatsappMessage = `Hello AAVIRA ESSENTIAL! ${description ? `I would like to enquire about: ${description}.` : "I'd love some help choosing a saree."} Please confirm availability and ordering details.`;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return; setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email: form.get("email"), phone: form.get("phone"), message: form.get("message"), website: form.get("website"), items: selectedItems }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "We couldn't save your enquiry. Please try again.");
      setReference(data.reference);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again."); } finally { setBusy(false); }
  }
  return <Dialog onClose={() => setEnquiry(null)} titleId="enquiry-heading"><div className="dialog-heading"><div><span className="eyebrow">A PERSONAL TOUCH</span><h2 id="enquiry-heading">Let’s find your perfect saree.</h2></div><button className="icon-button" onClick={() => setEnquiry(null)} aria-label="Close enquiry"><Icon name="close" /></button></div>{reference ? <div className="enquiry-success" role="status"><span className="empty-icon"><Icon name="check" size={34} /></span><h3>Your enquiry is saved.</h3><p>Thank you for your interest in AAVIRA ESSENTIAL.</p><p className="small-note">Reference: {reference.slice(0, 8).toUpperCase()}</p><p className="integration-note">This is a demo storefront. Your enquiry has been stored, but no order, payment, email, or delivery has been initiated.</p><button className="button button-primary" onClick={() => setEnquiry(null)}>Continue exploring <Icon name="arrow" size={18} /></button></div> : <><p className="subtle enquiry-intro">{description || "Have a question about fabrics, styling, or a favourite piece? Leave us a note."}</p>{whatsappEnabled ? <a className="button whatsapp-action full-width" href={`/api/whatsapp?message=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" />Continue on WhatsApp <Icon name="arrow" size={18} /></a> : <p className="integration-note"><Icon name="whatsapp" size={19} />WhatsApp isn’t connected to this demo yet. You can save an enquiry below.</p>}<form className="enquiry-form" onSubmit={submit}><div className="form-row"><label>Your name<input name="name" required maxLength={100} autoComplete="name" placeholder="Your full name" /></label><label>Email address<input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" /></label></div><label>Phone number <span className="subtle">(optional)</span><input name="phone" type="tel" maxLength={25} autoComplete="tel" placeholder="+91" /></label><label>Your message<textarea name="message" required maxLength={2000} rows={3} defaultValue={description ? `I'd like to know more about ${description}. Please share availability and ordering details.` : ""} placeholder="How can we help you?" /></label><input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" /><p className="small-note">By submitting, you agree to our <Link href="/policies/privacy" onClick={() => setEnquiry(null)}>privacy policy</Link>. This is an enquiry, not a confirmed order.</p>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary full-width" disabled={busy}>{busy ? "Saving your enquiry…" : "Send an enquiry"}<Icon name="arrow" size={18} /></button></form></>}</Dialog>;
}
