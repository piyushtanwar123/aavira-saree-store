import type { Metadata } from "next";
import { ShoppingBagPage } from "@/components/cart-page";
export const metadata: Metadata = { title: "Your Shopping Bag" };
export default function CartPage() { return <ShoppingBagPage />; }
