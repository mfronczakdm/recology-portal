"use client";

const EDGE = "https://edge-platform.sitecorecloud.io";
const SITE_NAME = "recology";
const FRIENDLY_ID = "newcustomer";
const CLIENT_COOKIE = "sc_px_client";
const BROWSER_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Step 3 in the SitecoreAI guide is the goal event. The copied template left
 * the type blank; a page-view goal uses this type and the page path as the name.
 */
const GOAL_EVENT = {
  type: "pageView",
  name: "/",
};

function contextId() {
  return process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID?.trim() ?? "";
}

function readCookie(name: string) {
  const pair = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return pair ? decodeURIComponent(pair.slice(name.length + 1)) : "";
}

function writeCookie(name: string, value: string) {
  const maxAge = 730 * 24 * 60 * 60;
  document.cookie = `${name}=${value}; Path=/; SameSite=Lax; Max-Age=${maxAge}`;
}

function headers(context: string) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-sitecore-contextid": context,
  };
}

async function ensureClientId(context: string) {
  const fromQuery = new URLSearchParams(window.location.search).get("sc_cid") ?? "";
  if (BROWSER_ID.test(fromQuery)) {
    writeCookie(CLIENT_COOKIE, fromQuery);
    return fromQuery;
  }

  const saved = readCookie(CLIENT_COOKIE);
  if (BROWSER_ID.test(saved)) return saved;

  const browserCookie = readCookie("sc_cid");
  if (BROWSER_ID.test(browserCookie)) {
    writeCookie(CLIENT_COOKIE, browserCookie);
    return browserCookie;
  }

  const response = await fetch(`${EDGE}/v1/events/api/dp/v1/clients`, {
    method: "POST",
    headers: headers(context),
    body: JSON.stringify({ clientKey: "" }),
  });
  if (!response.ok) return "";

  const payload = (await response.json()) as { id?: string };
  if (!payload.id || !BROWSER_ID.test(payload.id)) return "";
  writeCookie(CLIENT_COOKIE, payload.id);
  return payload.id;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

type PromoPointer = {
  path: string;
  language: string;
  field: string;
};

function promoPointer(value: unknown): PromoPointer | null {
  const promo = asRecord(asRecord(value)?.promoContent);
  const item = asRecord(promo?.item);
  if (typeof item?.path !== "string" || typeof item.field !== "string") return null;
  return {
    path: item.path,
    language: typeof item.language === "string" ? item.language : "en",
    field: item.field,
  };
}

function sitecoreLink(value: string) {
  return {
    url: value.match(/\burl="([^"]*)"/)?.[1] ?? "",
    text: value.match(/\btext="([^"]*)"/)?.[1] ?? "",
  };
}

async function fetchPromo(context: string, promo: PromoPointer) {
  const response = await fetch(`${EDGE}/v1/content/api/graphql/v1?sitecoreContextId=${encodeURIComponent(context)}`, {
    method: "POST",
    headers: headers(context),
    body: JSON.stringify({
      query: `query Promo($path: String!, $language: String!) {
        item(path: $path, language: $language) {
          displayName
          fields(ownFields: true) { name value }
        }
      }`,
      variables: { path: promo.path, language: promo.language },
    }),
  });
  if (!response.ok) return null;

  const payload = (await response.json()) as {
    data?: { item?: { displayName?: string; fields?: { name?: string; value?: string }[] } };
  };
  const fields = new Map(
    (payload.data?.item?.fields ?? [])
      .filter((field) => field.name && field.value)
      .map((field) => [field.name as string, field.value as string]),
  );
  const message = fields.get(promo.field) ?? "";
  if (!message) return null;

  const title = fields.get("PromoText") || payload.data?.item?.displayName || "";
  const link = sitecoreLink(fields.get("PromoLink") ?? "");
  return {
    title: title === message ? "" : title,
    message,
    href: link.url,
    cta: link.text,
  };
}

/** Sitecore returns the object configured on the headless experience. */
function contentFromDecision(value: unknown): Record<string, unknown> | null {
  const record = asRecord(value);
  if (!record || promoPointer(record)) return null;

  const nested = asRecord(record.content) ?? asRecord(record.data);
  const content = nested ?? record;
  if (typeof content.query === "string") return null;

  const visible = Object.values(content).some((item) => item != null && item !== "" && typeof item !== "object");
  return visible ? content : null;
}

async function sendGoal(context: string, clientId: string) {
  await fetch(`${EDGE}/v1/events/api/dp/v1/events`, {
    method: "POST",
    headers: headers(context),
    body: JSON.stringify({
      clientKey: "",
      clientId,
      siteId: SITE_NAME,
      channel: "WEB",
      language: "EN",
      name: GOAL_EVENT.name,
      type: GOAL_EVENT.type,
    }),
  });
}

export function personalizationDisabled() {
  if (process.env.NEXT_PUBLIC_HEADLESS_PERSONALIZATION === "false") return true;
  return new URLSearchParams(window.location.search).get("personalization") === "off";
}

async function runHomePersonalization(): Promise<Record<string, unknown> | null> {
  if (typeof window === "undefined" || personalizationDisabled()) return null;

  const context = contextId();
  if (!context) return null;

  const clientId = await ensureClientId(context);
  if (!clientId) return null;

  const flow = await fetch(`${EDGE}/v1/personalize/v2/callFlows?siteId=${encodeURIComponent(SITE_NAME)}`, {
    method: "POST",
    headers: headers(context),
    body: JSON.stringify({
      clientKey: "",
      channel: "web",
      pointOfSale: SITE_NAME,
      browserId: clientId,
      friendlyId: FRIENDLY_ID,
    }),
  });

  void sendGoal(context, clientId).catch((error: unknown) => console.debug(error));

  if (!flow.ok) {
    console.debug("Headless personalization newcustomer returned no content.", flow.status);
    return null;
  }

  const decision: unknown = await flow.json();
  const promo = promoPointer(decision);
  if (promo) return fetchPromo(context, promo);
  return contentFromDecision(decision);
}

let inflight: Promise<Record<string, unknown> | null> | null = null;

/** Runs the three SitecoreAI headless steps and returns visitor-facing content. */
export function loadHomePersonalization(): Promise<Record<string, unknown> | null> {
  if (typeof window === "undefined" || personalizationDisabled()) return Promise.resolve(null);
  if (!inflight) {
    inflight = runHomePersonalization().catch((error: unknown) => {
      console.debug(error);
      return null;
    });
  }
  return inflight;
}
