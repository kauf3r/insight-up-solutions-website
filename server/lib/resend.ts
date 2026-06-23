import { Resend } from "resend";

let cachedClient: Resend | null = null;

function getClient(): Resend {
  if (!cachedClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is required");
    }
    cachedClient = new Resend(apiKey);
  }
  return cachedClient;
}

export function getResendClient() {
  return {
    client: getClient(),
    fromEmail: "Insight Up Solutions <info@insightupsolutions.com>",
  };
}

type EmailPayload = Parameters<Resend["emails"]["send"]>[0];

const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Send an email via Resend with retry-and-backoff on transient failures
 * (rate-limit 429 and 5xx). Lead notifications are core value, so a single
 * swallowed 429 should not silently drop a customer/admin email.
 *
 * Returns true if the send eventually succeeded, false if all attempts failed.
 * Never throws — callers log the outcome but always respond to the user.
 */
export async function sendEmailWithRetry(
  client: Resend,
  payload: EmailPayload,
  options: { label?: string; maxAttempts?: number; baseDelayMs?: number } = {},
): Promise<boolean> {
  const { label = "email", maxAttempts = 4, baseDelayMs = 600 } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { error } = await client.emails.send(payload);
      if (!error) {
        return true;
      }
      // Resend returns a structured error object (no throw) for API errors.
      const status = (error as { statusCode?: number }).statusCode;
      const retryable = status === undefined || RETRYABLE_STATUS.has(status);
      console.error(
        `[RESEND ERROR] ${label} attempt ${attempt}/${maxAttempts} failed (status ${status ?? "unknown"}):`,
        error,
      );
      if (!retryable || attempt === maxAttempts) {
        return false;
      }
    } catch (err: any) {
      const status = err?.statusCode;
      const retryable = status === undefined || RETRYABLE_STATUS.has(status);
      console.error(
        `[RESEND ERROR] ${label} attempt ${attempt}/${maxAttempts} threw (status ${status ?? "unknown"}):`,
        err?.message ?? err,
      );
      if (!retryable || attempt === maxAttempts) {
        return false;
      }
    }
    // Exponential backoff with jitter before the next attempt.
    const delay = baseDelayMs * 2 ** (attempt - 1) + Math.floor(Math.random() * 250);
    await sleep(delay);
  }
  return false;
}
