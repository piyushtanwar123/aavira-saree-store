import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquiryButton } from "@/components/chrome";
import { Icon } from "@/components/icons";

const policies: Record<string, { title: string; subtitle: string; sections: { heading: string; text: string }[] }> = {
  shipping: { title: "Shipping & Delivery", subtitle: "Good things deserve a thoughtful journey.", sections: [
    { heading: "A note about this store", text: "AAVIRA ESSENTIAL is a fictional, enquiry-only demonstration boutique. There is no automated checkout or delivery service. Sending an enquiry does not place an order or initiate shipment." },
    { heading: "Illustrative shipping rates", text: "The shopping bag displays complimentary shipping for merchandise totals of ₹2,999 and above, or an estimated ₹149 below that threshold. These are demonstration rates. A merchant must confirm actual charges, serviceable postcodes, dispatch times, and delivery estimates before accepting an order." },
    { heading: "Before you order", text: "Please use the enquiry form to discuss your preferred saree, delivery location, fabric details, and current availability. No stock or delivery date is guaranteed by this website." },
    { heading: "Tracking your purchase", text: "Shipment tracking is not integrated. An operating merchant would provide tracking information separately after confirming and dispatching an order." },
  ] },
  returns: { title: "Returns & Exchanges", subtitle: "A little clarity, for a little peace of mind.", sections: [
    { heading: "Enquiry-only demonstration", text: "No purchases are processed through this website. This page explains the information an operating store would need to confirm, and is not an active returns commitment." },
    { heading: "Confirm before ordering", text: "Before completing a purchase with a merchant, ask for the applicable return window, exchange eligibility, condition requirements, shipping charges, and refund timing in writing." },
    { heading: "Blouse pieces & alterations", text: "Always confirm whether cutting a blouse piece, stitching, fall and pico work, or other alterations affect return eligibility. Do not alter a saree before checking the merchant’s terms." },
    { heading: "Colour & fabric", text: "Campaign and product imagery on this demonstration site is AI-generated. Screens also vary in colour reproduction. Request current photographs and confirm fabric composition, measurements, and zari details before purchasing any physical product." },
  ] },
  care: { title: "The Saree Care Guide", subtitle: "A beautiful weave deserves a little extra love.", sections: [
    { heading: "Clean with care", text: "For silk blends, zari, and delicate embroidery, professional dry cleaning is usually the safest choice. Always follow the specific care label provided with the physical garment; advice here is general guidance only." },
    { heading: "Store softly", text: "Fold your saree loosely in breathable, unbleached cotton or muslin. Store in a cool, dry place away from direct sunlight. Avoid plastic bags and sharp-edged hangers that can damage delicate fibres." },
    { heading: "Let your saree breathe", text: "Occasionally unfold and refold along different lines to reduce stress on the fabric. Air briefly in shade after wearing and ensure it is completely dry before storing." },
    { heading: "Mind the little things", text: "Apply perfume before dressing and allow it to dry. Keep jewellery and pins away from loose weaves. If pressing is permitted by the care label, use low heat and a protective cloth, and avoid direct heat on embroidery and zari." },
  ] },
  privacy: { title: "Privacy Policy", subtitle: "Your trust is something we care for.", sections: [
    { heading: "What we collect", text: "When you submit an enquiry, we store your name, email, optional phone number, message, selected product references, quantities, and submission time in a PostgreSQL database. Newsletter signups store your email and signup time. Please do not submit sensitive personal or payment information." },
    { heading: "How information is used", text: "Enquiry details are stored for a store operator to review. Newsletter emails are saved to a subscriber list. This demo does not send automated emails, distribute newsletters, process payments, or forward your details to WhatsApp automatically. No public endpoint exposes enquiry or subscriber records." },
    { heading: "Browser storage", text: "Your bag and favourites are saved in your browser’s local storage so they remain on your device between visits. Clearing your browser’s site data removes those saved choices. We do not use advertising or analytics cookies in this demo." },
    { heading: "WhatsApp & external services", text: "If the store operator configures WhatsApp, choosing that option opens WhatsApp with a prefilled message. You decide whether to send it. WhatsApp then processes data under its own privacy policy. Fonts and campaign images are hosted locally." },
    { heading: "Questions & removal requests", text: "Use the enquiry form and mention a privacy or removal request. This fictional demo has no staffed customer service and no guaranteed response time. Before public launch, the operator must provide real contact details, a retention schedule, and a compliant privacy policy." },
  ] },
  terms: { title: "Terms & Conditions", subtitle: "A few essentials, thoughtfully explained.", sections: [
    { heading: "About AAVIRA ESSENTIAL", text: "AAVIRA ESSENTIAL is a fictional brand created to demonstrate a starter saree storefront. Catalogue names, descriptions, specifications, discounts, shipping rates, and images are illustrative, not an offer of actual stock." },
    { heading: "Enquiries, not orders", text: "Adding an item to your bag, saving a favourite, or submitting an enquiry does not create a sale or reserve inventory. No payment gateway, live inventory, tax service, or fulfilment provider is connected. An enquiry confirmation only means the submission was saved." },
    { heading: "Pricing & imagery", text: "Prices are displayed in Indian Rupees. Discounts compare illustrative catalogue prices. All product and editorial images are AI-generated. Verify final product details, taxes, shipping, and payment terms directly with a real merchant before making a purchase." },
    { heading: "Responsible use", text: "Do not submit unlawful content, personal information belonging to others without permission, or automated spam. Basic form validation and request limiting are applied. The demo is provided as-is without a promise of staffed support or commercial fulfilment." },
  ] },
};
export function generateStaticParams() { return Object.keys(policies).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; return { title: policies[slug]?.title || "Information" }; }
export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const policy = policies[slug]; if (!policy) notFound();
  return <main><section className="catalog-hero"><div className="page-container"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>{policy.title}</span></div><span className="eyebrow">THE AAVIRA ESSENTIALS</span><h1>{policy.title}</h1><p>{policy.subtitle}</p></div></section><article className="page-container policy-content"><div className="policy-notice">This is a demonstration storefront for a fictional brand. Purchases, payments, and deliveries are not processed. All commercial policies must be confirmed by a real store operator before launch.</div>{policy.sections.map((section) => <section className="policy-block" key={section.heading}><h2>{section.heading}</h2><p>{section.text}</p></section>)}<EnquiryButton>Have a question? Get in touch <Icon name="arrow" size={18} /></EnquiryButton></article></main>;
}
