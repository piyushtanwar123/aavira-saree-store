import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { getProduct } from "@/lib/catalog";
import { isRateLimited, isSameOrigin, validEmail } from "@/lib/server-utils";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: "This request is not allowed." }, { status: 403 });
  if (isRateLimited(request, "enquiry")) return Response.json({ error: "A few too many requests. Please try again in 15 minutes." }, { status: 429 });
  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return Response.json({ error: "Please send a valid enquiry." }, { status: 400 });
    if (body.website) return Response.json({ error: "Please try again." }, { status: 400 });
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (name.length < 2 || name.length > 100 || !validEmail(email) || phone.length > 25 || (phone && !/^[+\d\s()-]{7,25}$/.test(phone)) || message.length < 5 || message.length > 2000) return Response.json({ error: "Please enter your name, a valid email, and a message of at least 5 characters. Check your phone number if provided." }, { status: 400 });
    if (!Array.isArray(body.items) || body.items.length > 20) return Response.json({ error: "Please refresh your bag and try again." }, { status: 400 });
    const items: { productId: string; name: string; quantity: number; price: number }[] = [];
    for (const item of body.items) {
      if (!item || typeof item.productId !== "string") return Response.json({ error: "Invalid product selection." }, { status: 400 });
      const product = getProduct(item.productId);
      if (!product || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10) return Response.json({ error: "Please choose a valid quantity between 1 and 10." }, { status: 400 });
      items.push({ productId: product.id, name: product.name, quantity: item.quantity, price: product.price });
    }
    const [result] = await db.insert(enquiries).values({ name, email, phone: phone || null, message, items }).returning({ id: enquiries.id });
    return Response.json({ reference: result.id }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) return Response.json({ error: "Please send a valid enquiry." }, { status: 400 });
    console.error("Enquiry could not be saved", error);
    return Response.json({ error: "We couldn’t save your enquiry. Please try again shortly." }, { status: 503 });
  }
}
