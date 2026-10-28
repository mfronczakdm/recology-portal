"use client";

import { CloudSDK } from "@sitecore-cloudsdk/core/browser";
import "@sitecore-cloudsdk/events/browser";
import { event, identity } from "@sitecore-cloudsdk/events/browser";

/** Analytics identifier for the Recology SitecoreAI site. */
const SITE_NAME = "recology";
const BROWSER_COOKIE = "sc_cid";
const BROWSER_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const NEW_ACCOUNT_EVENT = "New Account Created";

export type TrackingResult = "sent" | "skipped" | "failed";

type WithEvents = {
  addEvents: () => { initialize: () => void };
};

function contextId() {
  return process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID?.trim() ?? "";
}

/** Reuse the marketing-site browser id when the portal is opened with ?sc_cid=. */
function adoptBrowserIdFromQuery() {
  const incoming = new URLSearchParams(window.location.search).get("sc_cid") ?? "";
  if (!BROWSER_ID.test(incoming)) return;

  const maxAge = 730 * 24 * 60 * 60;
  document.cookie = `${BROWSER_COOKIE}=${incoming}; Path=/; SameSite=Lax; Max-Age=${maxAge}`;
}

let ready: Promise<boolean> | null = null;

export function ensureCloudSdk(): Promise<boolean> {
  if (ready) return ready;

  ready = (async () => {
    if (typeof window === "undefined") return false;

    adoptBrowserIdFromQuery();
    const id = contextId();
    if (!id) {
      console.debug("Sitecore CDP tracking waits for NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID.");
      return false;
    }

    (CloudSDK({
      sitecoreEdgeContextId: id,
      siteName: SITE_NAME,
      enableBrowserCookie: true,
    }) as unknown as WithEvents)
      .addEvents()
      .initialize();
    return true;
  })().catch((error: unknown) => {
    console.debug(error);
    ready = null;
    return false;
  });

  return ready;
}

function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._-]+/).filter(Boolean);
  const label = (part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  return {
    firstName: parts[0] ? label(parts[0]) : undefined,
    lastName: parts.length > 1 ? parts.slice(1).map(label).join(" ") : undefined,
  };
}

export async function trackNewAccount(input: {
  email: string;
  phone?: string;
  method: "invoice" | "activation";
}): Promise<TrackingResult> {
  const ok = await ensureCloudSdk();
  if (!ok) return "skipped";

  const email = input.email.trim().toLowerCase();
  const { firstName, lastName } = nameFromEmail(email);
  const shared = {
    channel: "WEB",
    currency: "USD",
    language: "EN",
    page: "Create an account",
  };

  try {
    await identity({
      ...shared,
      email,
      firstName,
      lastName,
      phone: input.phone,
      identifiers: [{ id: email, provider: "email" }],
    });
    await event({
      ...shared,
      type: NEW_ACCOUNT_EVENT,
      extensionData: {
        email,
        method: input.method,
      },
    });
    return "sent";
  } catch (error) {
    console.debug(error);
    return "failed";
  }
}
