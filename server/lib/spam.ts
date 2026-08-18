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
