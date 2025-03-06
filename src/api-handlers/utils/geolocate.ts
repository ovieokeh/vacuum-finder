import { Request, Response } from "express";
import geoip from "geoip-lite";

// Geolocate a user by IP address
export const geolocateHandler = (req: Request, res: Response) => {
  // 1) Extract IP address
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (Array.isArray(ip)) ip = ip[0];
  if (ip && typeof ip === "string" && ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }

  // 2) Geolocate IP
  const geo = ip ? geoip.lookup(ip) : null;
  if (!geo) {
    res.status(404).json({ error: "Unable to geolocate IP address." });
  } else {
    const { country, timezone } = geo;

    // 3) Derive userLocale
    // - userPrefLang could come from request query or body
    //   (customize as needed depending on your app).
    const userPrefLang = (req.query.userPrefLang as string) || req.body.userPrefLang || "";

    // - acceptLanguage is the header e.g. "en-US,en;q=0.9"
    const acceptLanguageHeader = req.headers["accept-language"];

    let userLocale = "";

    if (userPrefLang) {
      // If user preference is provided, use it directly
      userLocale = userPrefLang;
    } else if (acceptLanguageHeader && typeof acceptLanguageHeader === "string") {
      // Otherwise, parse the Accept-Language header
      // e.g. "en-US,en;q=0.9" -> "en-US"
      userLocale = acceptLanguageHeader.split(",")[0];
    } else {
      // Fallback locale (customize as needed)
      userLocale = "en-US";
    }

    // 4) Return data
    res.json({
      ip,
      userLocale,
      countryCode: country,
      timeZone: timezone,
    });
  }
};
