# Recology Customer Portal — demo front end

A modern, mobile-first front end for the Recology customer portal. It is a **demo only**: mock data, no database, and no real payments. The story for the demo is that customers and Recology’s back office keep the same AMCS platform, account numbers, invoice numbers, and labels. Only the front end is new.

## Demo credentials

Sign in at `/login` with any valid email and the password `demo1234`.

A wrong password shows an inline error. Register at `/create-an-account` with any values that pass validation (invoice numbers look like `INV1000`). Registration sets the same session cookie and lands you on the dashboard.

Every signed-in email sees the same two mock service accounts. The name in the header is taken from the email you used. Switch accounts from the header to change the balance, collection day, and invoices.

Guest payment samples:

| Account Number | Invoice Number | Result |
| --- | --- | --- |
| `10458291` | `INV104582` | Balance due $86.42 |
| `20933104` | `INV209331` | Already paid |

Anything else shows an invoice-not-found error. Payments show reference `PMT-482913` and are not processed.

## Sitecore CDP events

This portal is an external app. It sends SitecoreAI events with the Cloud SDK (`@sitecore-cloudsdk/events` 0.6) and the analytics identifier `recology`.

On a successful registration at `/create-an-account`, the browser sends:

1. An `IDENTITY` event for the new email (`identifiers` provider `email`), so the anonymous browser becomes that customer.
2. A custom event named `New Account Created`.

Both go to `edge-platform.sitecorecloud.io`. In the browser network log, filter for that host and look for a `POST` whose name starts with `events` and whose status is `201`. The payload `browser_id` matches the `sc_cid` cookie.

Set `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID` to the same Edge Context ID the [marketing site](https://recology.vercel.app/) uses, then restart the dev server. Until that value is set, registration still completes and the success screen says tracking is waiting.

`https://recology.vercel.app` and this portal are different sites, so they do not share the `sc_cid` cookie. To attach the new account to a visitor who was already on the marketing site, open the portal with that visitor’s browser id, for example `http://localhost:3002/create-an-account?sc_cid=<browser-id>`. The portal writes that value into `sc_cid` before the Cloud SDK starts.

## Headless personalization

The home page asks SitecoreAI for the live headless experience `newcustomer` and, when that call returns content, shows it in a box above **My Recology Account**. The request follows the SitecoreAI REST steps: create a client id, call `callFlows`, then send a `pageView` goal for `/`.

If the experience is missing, the visitor does not qualify, or the call fails, the box stays off and the rest of the page is unchanged. Open `/?personalization=off` to skip the calls. Set `NEXT_PUBLIC_HEADLESS_PERSONALIZATION=false` to turn the box off for every page load.

This work is on the `headless-personalization` branch. `git checkout main` returns to the homepage without it.

## The AMCS adapter

`src/lib/amcs/client.ts` is the only place the UI asks for portal data. Each function waits 300–600ms and returns typed mock data from `src/lib/amcs/mock-data.ts`.

In production these call the existing AMCS Customer Portal APIs — the UI is a drop-in replacement; no back-office change required. Swap the bodies of those functions for the real endpoints and leave the screens alone.

Route protection lives in `src/proxy.ts`. Next.js 16 renamed Middleware to Proxy; this file is that gate. `/dashboard` requires the `recology_session` cookie set by the sign-in and register server actions. Sign out clears it.

The account switcher reads the shared mock account list directly so the shell stays instant. Page bodies go through the adapter, which is why the dashboard, invoices, payments, payment accounts, and calendar show a short skeleton.

## Brand assets

Drop replacements in place without changing code:

- `public/recology-logo.png` — used in the header. If the file fails to load, the UI falls back to a green **Recology** wordmark.
- `public/auth-bg.jpg` — right-hand photo on Sign In, Register, and Forgot Password. If it fails to load, that panel falls back to a green gradient.

Colors are CSS variables in `src/app/globals.css` (`--primary` `#00853F`, hover token `primary-hover` `#00632F`, tint `brand-tint` `#E8F5EC`). Change them there to re-skin the portal.

## Choices

- Cache Components and partial prefetching are off. The session cookie and the mock delays need to run on each request.
- **Make a Payment** is a presentational pay flow so **Pay now** has a destination. **Service Locations**, **Update contact details**, and **Request service change** are “Coming soon in demo” placeholders so those menu items never 404.
- **Support Request** in the footer opens a dialog. The same form is a page under My Recology Service. Both toast “Request Submitted Successfully”.
- **Forgot Password?** confirms on screen and does not send email.
- Stop paper statements warns that the request can take 1–2 billing cycles, then shows the same success toast.
- Dark mode is not included.
- The bill illustration on the home page and the Account / Invoice help icons is drawn in the page (callouts 1 and 2), not a separate image.

## Scripts

```bash
npm run dev
npm run lint
npm run build
```
