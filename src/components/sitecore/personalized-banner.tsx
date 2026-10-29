"use client";

import { useEffect, useState } from "react";
import { loadHomePersonalization } from "@/lib/sitecore/personalize-home";

const TITLE_KEYS = ["title", "headline", "heading"];
const BODY_KEYS = ["message", "body", "description", "text", "subtitle", "summary"];

function textValue(value: unknown) {
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value !== "string") return "";
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|div|h\d)>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function firstText(data: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const text = textValue(data[key]);
    if (text) return { key, text };
  }
  return null;
}

function labelFor(key: string) {
  const spaced = key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function PersonalizedBanner() {
  const [content, setContent] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    let active = true;
    void loadHomePersonalization()
      .then((next) => {
        if (active) setContent(next);
      })
      .catch((error: unknown) => console.debug(error));
    return () => {
      active = false;
    };
  }, []);

  if (!content) return null;

  const title = firstText(content, TITLE_KEYS);
  const body = firstText(content, BODY_KEYS);
  const image = textValue(content.image ?? content.imageUrl);
  const href = textValue(content.href ?? content.url ?? content.link ?? content.ctaUrl);
  const cta = textValue(content.cta ?? content.button ?? content.ctaText ?? content.linkText) || "Learn more";
  const used = new Set(
    [title?.key, body?.key, "image", "imageUrl", "href", "url", "link", "ctaUrl", "cta", "button", "ctaText", "linkText"].filter(
      Boolean,
    ),
  );

  const extras: { key: string; text?: string; items?: string[] }[] = [];
  for (const [key, value] of Object.entries(content)) {
    if (used.has(key)) continue;
    if (Array.isArray(value)) {
      const items = value.map(textValue).filter(Boolean);
      if (items.length) extras.push({ key, items });
      continue;
    }
    const text = textValue(value);
    if (text) extras.push({ key, text });
  }

  const safeHref = href.startsWith("/") || href.startsWith("https://") ? href : "";
  const safeImage = image.startsWith("https://") ? image : "";

  return (
    <aside aria-label="Personalized content" className="mb-8 max-w-3xl rounded-xl bg-white p-6 shadow-sm ring-1 ring-primary/20">
      <p className="text-xs font-semibold tracking-wide text-primary uppercase">For you</p>
      {title ? <h2 className="mt-2 text-2xl font-semibold text-slate-900">{title.text}</h2> : null}
      {body ? <p className="mt-2 text-sm leading-6 whitespace-pre-line text-slate-700">{body.text}</p> : null}
      {safeImage ? (
        // The experience supplies the image URL, so this is not a local asset.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={safeImage} alt="" className="mt-4 max-h-48 w-full rounded-xl object-cover" />
      ) : null}
      {extras.length ? (
        <dl className="mt-4 space-y-2 text-sm text-slate-700">
          {extras.map((item) => (
            <div key={item.key}>
              <dt className="font-semibold text-slate-900">{labelFor(item.key)}</dt>
              {item.items ? (
                <dd>
                  <ul className="mt-1 list-disc pl-5">
                    {item.items.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                </dd>
              ) : (
                <dd>{item.text}</dd>
              )}
            </div>
          ))}
        </dl>
      ) : null}
      {safeHref ? (
        <a href={safeHref} className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline">
          {cta}
        </a>
      ) : null}
    </aside>
  );
}
