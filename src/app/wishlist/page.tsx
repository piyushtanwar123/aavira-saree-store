import type { Metadata } from "next";
import { ShopBrowser } from "@/components/shop-browser";
export const metadata: Metadata = { title: "Your Favourites" };
export default function WishlistPage() { return <ShopBrowser favoritesOnly />; }
