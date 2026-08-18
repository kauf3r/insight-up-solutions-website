/**
 * Spam gate for the public lead-capture endpoints.
 *
 * Every legit submission comes from our own forms, which attach two hidden
 * fields via useSpamGuard (client/src/lib/spam-guard.tsx):
 *   - "website": honeypot input — must arrive empty
 *   - "formStartedAt": ms epoch when the form mounted
 *
 * Bots either fill the honeypot, submit within a couple of seconds, replay a
 * captured payload, or POST the API directly without the fields at all. All
 * four cases are rejected. Callers respond with a fake 201 so bots get no
 * signal that they were filtered.
 */

const MIN_FILL_MS = 3_000;
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function getSpamReason(body: unknown): string | null {
  if (typeof body !== "object" || body === null) {
    return "missing body";
  }
  const { website, formStartedAt } = body as Record<string, unknown>;

  if (typeof website === "string" && website.trim() !== "") {
    return "honeypot filled";
  }

  const startedAt = typeof formStartedAt === "number" ? formStartedAt : NaN;
  if (!Number.isFinite(startedAt)) {
    return "missing formStartedAt";
  }

  const elapsedMs = Date.now() - startedAt;
  if (elapsedMs < MIN_FILL_MS) {
    return `submitted too fast (${elapsedMs}ms)`;
  }
  if (elapsedMs > MAX_AGE_MS) {
    return "stale formStartedAt (replayed payload)";
  }

  return null;
}

/**
 * Cloudflare Turnstile server-side verification. Skipped entirely when
 * TURNSTILE_SECRET_KEY is not set (local dev). Fails OPEN if the siteverify
 * API itself is unreachable — a Cloudflare outage must not drop real leads;
 * the honeypot + time-gate layer still applies.
 */
export async function getTurnstileReason(body: unknown): Promise<string | null> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return null;
  }
  const token =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>).turnstileToken
      : undefined;
  if (typeof token !== "string" || token === "") {
    return "missing turnstile token";
  }
  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = (await res.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };
    if (!data.success) {
      return `turnstile rejected (${(data["error-codes"] ?? []).join(",") || "no error code"})`;
    }
    return null;
  } catch (err) {
    console.error("[TURNSTILE] siteverify unreachable — failing open:", err);
    return null;
  }
}
