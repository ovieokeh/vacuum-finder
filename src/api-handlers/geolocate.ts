import { Request, Response } from "express";
import geoip from "geoip-lite";
import { publicIpv4 } from "public-ip";
import { SUPPORTED_REGIONS } from "../types";
import { Region } from "../database";

// Geolocate a user by IP address
export const geolocateHandler = async (req: Request, res: Response) => {
  const publicIP = await publicIpv4();

  // 1) Extract IP address
  let ip = req.headers["fly-client-ip"] || req.headers["x-forwarded-for"] || publicIP;
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

    let locale = "";
    let region = "americas";

    if (userPrefLang) {
      // If user preference is provided, use it directly
      locale = userPrefLang;
    } else if (acceptLanguageHeader && typeof acceptLanguageHeader === "string") {
      // Otherwise, parse the Accept-Language header
      // e.g. "en-US,en;q=0.9" -> "en-US"
      locale = acceptLanguageHeader.split(",")[0];
    } else {
      // Fallback locale (customize as needed)
      locale = "en-US";
    }

    // Derive region from timezone
    if (timezone) {
      const splitRegion = timezone.split("/")[0].toLowerCase();
      console.log("splitRegion", splitRegion);
      region = SUPPORTED_REGIONS.includes(splitRegion as Region) ? splitRegion : "americas";
    }

    // 4) Return data
    res.json({
      ip,
      locale,
      region,
      countryCode: country,
      timeZone: timezone,
    });
  }
};
