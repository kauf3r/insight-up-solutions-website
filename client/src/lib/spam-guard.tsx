import { useRef } from "react";

/**
 * Anti-spam guard shared by every lead form.
 *
 * Renders a visually hidden "website" honeypot input (real users never see or
 * fill it; form-filler bots do) and records when the form mounted. Both values
 * ride along in the POST body and are checked in server/lib/spam.ts — a filled
 * honeypot, a too-fast submit, or a payload missing the fields is dropped
 * server-side before any DB insert or email send.
 */
export function useSpamGuard() {
  const startedAtRef = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);

  const guardPayload = () => ({
    website: honeypotRef.current?.value ?? "",
    formStartedAt: startedAtRef.current,
  });

  // Positioned off-screen instead of display:none — many bots skip fields
  // that are display:none but still fill off-screen ones.
  const honeypotField = (
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
  );

  return { guardPayload, honeypotField };
}
