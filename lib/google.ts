import { google } from "googleapis";
import { ensureEnv } from "./env";

export function getGoogleCalendarClient() {
  const config = ensureEnv();
  const oauth2 = new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET,
    config.GOOGLE_REDIRECT_URI
  );

  oauth2.setCredentials({
    refresh_token: config.GOOGLE_REFRESH_TOKEN
  });

  return google.calendar({ version: "v3", auth: oauth2 });
}

export function createGoogleAuthUrl() {
  const config = ensureEnv();
  const oauth2 = new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET,
    config.GOOGLE_REDIRECT_URI
  );

  return oauth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/calendar"
    ]
  });
}
