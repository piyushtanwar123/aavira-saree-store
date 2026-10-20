const attempts = new Map<string, { count: number; expires: number }>();
export function isRateLimited(request: Request, scope: string, limit = 10) {
  const now = Date.now();
  if (attempts.size > 1000) for (const [key, value] of attempts) if (value.expires < now) attempts.delete(key);
  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const key = `${scope}:${address}`;
  const current = attempts.get(key);
  if (!current || current.expires < now) { attempts.set(key, { count: 1, expires: now + 15 * 60 * 1000 }); return false; }
  current.count += 1;
  return current.count > limit;
}
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  try { return new URL(origin).host === host || new URL(origin).host === new URL(request.url).host; } catch { return false; }
}
export const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
export function whatsappNumber() {
  const number = (process.env.WHATSAPP_NUMBER || "").replace(/[\s()+-]/g, "");
  return /^[1-9]\d{7,14}$/.test(number) ? number : null;
}
