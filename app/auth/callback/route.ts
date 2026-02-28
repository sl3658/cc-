import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { ensureEnv } from "@/lib/env";
import { setAdminSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/admin?error=missing_code", request.url));
  }

  const config = ensureEnv();
  const oauth2 = new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET,
    config.GOOGLE_REDIRECT_URI
  );

  const { tokens } = await oauth2.getToken(code);
  oauth2.setCredentials(tokens);

  const oauth2Service = google.oauth2({ version: "v2", auth: oauth2 });
  const profile = await oauth2Service.userinfo.get();

  if (!profile.data.email) {
    return NextResponse.redirect(new URL("/admin?error=invalid_email", request.url));
  }

  await setAdminSession(profile.data.email);
  return NextResponse.redirect(new URL("/admin", request.url));
}
