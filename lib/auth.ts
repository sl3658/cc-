import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { ensureEnv } from "./env";

const COOKIE_NAME = "admin_session";

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export async function setAdminSession(email: string) {
  const config = ensureEnv();
  const payload = Buffer.from(JSON.stringify({ email, t: Date.now() })).toString("base64url");
  const signature = sign(payload, config.SESSION_SECRET);

  cookies().set(COOKIE_NAME, `${payload}.${signature}`, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearAdminSession() {
  cookies().delete(COOKIE_NAME);
}

export async function requireAdminSession() {
  const config = ensureEnv();
  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((v) => v.trim().toLowerCase());
  const session = cookies().get(COOKIE_NAME)?.value;

  if (!session) {
    return null;
  }

  const [payload, signature] = session.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expected = sign(payload, config.SESSION_SECRET);
  const valid = timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) {
    return null;
  }

  const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email: string };
  if (!adminEmails.includes(parsed.email.toLowerCase())) {
    return null;
  }

  return parsed;
}
