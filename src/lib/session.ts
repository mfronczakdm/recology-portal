import { cookies } from "next/headers";

export const SESSION_COOKIE = "recology_session";

export type Session = {
  email: string;
  name: string;
};

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Session;
    if (!parsed.email || !parsed.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function setSession(session: Session) {
  const store = await cookies();
  store.set(SESSION_COOKIE, encodeURIComponent(JSON.stringify(session)), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
