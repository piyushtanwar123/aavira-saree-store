import { whatsappNumber } from "@/lib/server-utils";

export async function GET(request: Request) {
  const number = whatsappNumber();
  if (!number) return Response.json({ error: "WhatsApp is not configured. Set WHATSAPP_NUMBER on the server to enable enquiries." }, { status: 503 });
  const message = new URL(request.url).searchParams.get("message")?.slice(0, 4000) || "Hello AAVIRA ESSENTIAL, I would like to enquire about a saree.";
  return Response.redirect(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, 307);
}
