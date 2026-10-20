import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { isRateLimited, isSameOrigin, validEmail } from "@/lib/server-utils";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: "This request is not allowed." }, { status: 403 });
  if (isRateLimited(request, "newsletter")) return Response.json({ error: "Please try again in 15 minutes." }, { status: 429 });
  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return Response.json({ error: "Please enter your email address." }, { status: 400 });
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!validEmail(email)) return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    await db.insert(subscribers).values({ email }).onConflictDoNothing({ target: subscribers.email });
    return Response.json({ subscribed: true });
  } catch (error) {
    if (error instanceof SyntaxError) return Response.json({ error: "Please enter your email address." }, { status: 400 });
    console.error("Newsletter subscription could not be saved", error);
    return Response.json({ error: "We couldn’t save your email. Please try again shortly." }, { status: 503 });
  }
}
