import { useEffect, useRef } from "react";

/**
 * Anti-spam guard shared by every lead form. Three layers:
 *
 * 1. A visually hidden "website" honeypot input (real users never see or
 *    fill it; form-filler bots do).
 * 2. A "formStartedAt" timestamp recorded when the form mounted.
 * 3. A Cloudflare Turnstile challenge token (Managed mode,
 *    appearance: interaction-only — invisible unless Cloudflare decides the
 *    visitor is suspicious).
 *
 * All three ride along in the POST body and are checked in
 * server/lib/spam.ts — a failed check is dropped server-side with a fake 201
 * before any DB insert or email send.
 */

// Site keys are public by design. The dev key is Cloudflare's documented
// always-pass test key, so local forms work without a real challenge.
const TURNSTILE_SITE_KEY = import.meta.env.DEV
  ? "1x00000000000000000000AA"
  : "0x4AAAAAAEUXXwXAP6IxQFx1";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
    };
  }
}

let turnstileScript: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (!turnstileScript) {
    turnstileScript = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Turnstile script failed to load"));
      document.head.appendChild(script);
    });
  }
  return turnstileScript;
}

export function useSpamGuard() {
  const startedAtRef = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const tokenRef = useRef("");

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        if (cancelled || !turnstileContainerRef.current || !window.turnstile) return;
        if (widgetIdRef.current !== null) return;
        widgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          appearance: "interaction-only",
          "refresh-expired": "auto",
          callback: (token: string) => {
            tokenRef.current = token;
          },
          "expired-callback": () => {
            tokenRef.current = "";
          },
        });
      })
      .catch((err) => {
        console.error("[spam-guard]", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const guardPayload = () => {
    const token = tokenRef.current;
    // Turnstile tokens are single-use; refresh shortly after a submission so
    // a retry (e.g. after a validation error) gets a fresh token.
    setTimeout(() => {
      if (widgetIdRef.current !== null && window.turnstile) {
        tokenRef.current = "";
        window.turnstile.reset(widgetIdRef.current);
      }
    }, 1500);
    return {
      website: honeypotRef.current?.value ?? "",
      formStartedAt: startedAtRef.current,
      turnstileToken: token,
    };
  };

  const honeypotField = (
    <>
      {/* Positioned off-screen instead of display:none — many bots skip fields
          that are display:none but still fill off-screen ones. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <input
          ref={honeypotRef}
          type="text"
          name="website"
          placeholder="Your website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {/* Invisible unless Cloudflare escalates to an interactive challenge. */}
      <div ref={turnstileContainerRef} />
    </>
  );

  return { guardPayload, honeypotField };
}
