import Link from "next/link";
import { Icon, Ornament } from "@/components/icons";
export default function NotFound() { return <main className="not-found"><span className="eyebrow">A DIFFERENT THREAD TO FOLLOW</span><h1>This page has wandered away.</h1><p>Let’s take you back to something beautiful.</p><Link href="/shop" className="button button-primary">Explore the collection <Icon name="arrow" size={18} /></Link><Ornament /></main>; }
