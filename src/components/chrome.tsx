"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark, Icon } from "./icons";
import { useStore } from "./store";

const navigation = [{ name: "Home", href: "/" }, { name: "Shop", href: "/shop" }, { name: "Collections", href: "/collections" }, { name: "Our Story", href: "/#our-story" }];
export function SiteHeader() {
  const { items, favorites, setCartOpen, setSearchOpen } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return <><div className="announcement-bar"><span className="announcement-star">✧</span><span>Complimentary shipping on orders ₹2,999 & above</span><span className="announcement-divider">|</span><span className="announcement-extra">Timeless weaves. Thoughtfully priced.</span><span className="announcement-star">✧</span></div><header className="site-header"><div className="nav-inner"><button className="icon-button mobile-menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? "close" : "menu"} /></button><Link href="/" className="logo-link" aria-label="Aavira Essential home" onClick={() => setMenuOpen(false)}><BrandMark /></Link><nav className="desktop-navigation" aria-label="Main navigation">{navigation.map((link) => <Link key={link.href} href={link.href} className={pathname === link.href ? "active" : ""}>{link.name}{link.name === "Shop" && <Icon name="chevron" size={12} />}</Link>)}</nav><div className="nav-actions"><button className="icon-button" aria-label="Search sarees" onClick={() => { setSearchOpen(true); setMenuOpen(false); }}><Icon name="search" size={21} /></button><Link href="/wishlist" className="icon-button header-wishlist" aria-label={`Your favourites${favorites.length ? `, ${favorites.length} saved` : ""}`}><Icon name="heart" size={21} />{favorites.length > 0 && <span className="nav-dot" />}</Link><span className="nav-separator" /><button className="cart-trigger" onClick={() => { setCartOpen(true); setMenuOpen(false); }} aria-label={`Open shopping bag, ${count} items`}><Icon name="bag" size={21} /><span className="cart-label">Bag</span><span className="bag-count">{count}</span></button></div></div>{menuOpen && <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation">{navigation.map((link) => <Link href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>{link.name}<Icon name="arrow" size={17} /></Link>)}<Link href="/wishlist" onClick={() => setMenuOpen(false)}>Your favourites <Icon name="heart" size={17} /></Link><p>Rooted in tradition. Woven for today.</p></nav>}</header></>;
}

export function EnquiryButton({ children, className = "button button-outline", productId, cart = false }: { children: React.ReactNode; className?: string; productId?: string; cart?: boolean }) {
  const { setEnquiry } = useStore();
  return <button className={className} onClick={() => setEnquiry({ productId, cart })}>{children}</button>;
}

function Newsletter() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (status === "loading") return;
    const form = event.currentTarget;
    const email = new FormData(form).get("email");
    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Please try again in a moment.");
      setStatus("success"); setMessage("You’re on the list. Thank you for being part of our story."); form.reset();
    } catch (caught) { setStatus("error"); setMessage(caught instanceof Error ? caught.message : "Please try again."); }
  }
  return <section className="newsletter-section"><div className="page-container newsletter-inner"><div><span className="eyebrow">A LITTLE AAVIRA IN YOUR INBOX</span><h2>Good things are worth staying for.</h2><p>New weaves, thoughtful stories, and a little inspiration.</p></div><div className="newsletter-form-wrap"><form onSubmit={subscribe} className="newsletter-form"><label className="sr-only" htmlFor="newsletter-email">Your email address</label><input id="newsletter-email" name="email" type="email" required maxLength={254} placeholder="Your email address" autoComplete="email" /><button type="submit" disabled={status === "loading"} aria-label="Join the Aavira newsletter">{status === "loading" ? "Joining…" : "Join the circle"}<Icon name="arrow" size={18} /></button></form>{message ? <p className={`newsletter-message ${status === "error" ? "form-error" : ""}`} role="status">{message}</p> : <p className="newsletter-privacy">Just beautiful things. No noise. <Link href="/policies/privacy">Privacy policy</Link></p>}</div></div></section>;
}

export function SiteFooter() {
  const { setEnquiry } = useStore();
  return <><Newsletter /><footer className="site-footer"><div className="page-container footer-main"><div className="footer-brand"><Link href="/" aria-label="Aavira Essential home"><BrandMark /></Link><p>Rooted in tradition. Woven for today.<br />Timeless sarees for every chapter of you.</p><div className="footer-socials"><button aria-label="Enquire on WhatsApp" onClick={() => setEnquiry({})}><Icon name="whatsapp" size={20} /></button><button aria-label="Contact Aavira Essential" onClick={() => setEnquiry({})}><Icon name="mail" size={20} /></button></div></div><div className="footer-column"><h3>Explore</h3><Link href="/shop">Shop all sarees</Link><Link href="/shop?sort=newest">New arrivals</Link><Link href="/shop?sort=bestselling">Bestsellers</Link><Link href="/collections">Our collections</Link><Link href="/#our-story">Our story</Link></div><div className="footer-column"><h3>Here to help</h3><Link href="/policies/shipping">Shipping & delivery</Link><Link href="/policies/returns">Returns & exchanges</Link><Link href="/policies/care">Saree care guide</Link><Link href="/policies/privacy">Privacy policy</Link><Link href="/policies/terms">Terms & conditions</Link></div><div className="footer-column footer-contact"><h3>Let’s connect</h3><button className="footer-contact-link" onClick={() => setEnquiry({})}><Icon name="mail" size={16} />Send us an enquiry</button><button className="footer-contact-link" onClick={() => setEnquiry({})}><Icon name="whatsapp" size={17} />Chat with us on WhatsApp</button><p>Monday – Saturday · 10 am – 6 pm IST</p><span className="footer-location">Thoughtfully curated in India.</span><span className="footer-demo-note">Fictional brand · Enquiry-only demo</span></div></div><div className="page-container footer-bottom"><p>© {new Date().getFullYear()} AAVIRA ESSENTIAL. All rights reserved.</p><span>Made with love, draped in tradition. <span className="footer-flower">✧</span></span><span>INDIA · INR ₹</span></div></footer><div className="floating-contact"><span className="floating-contact-label">A little help choosing?</span><button className="whatsapp-float" onClick={() => setEnquiry({})} aria-label="Chat with Aavira on WhatsApp"><Icon name="whatsapp" size={29} /></button></div></>;
}
