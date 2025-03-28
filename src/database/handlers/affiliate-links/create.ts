import { supabase } from "../..";
import { AffiliateLinkCreate } from "../../types";
import { TRACKING_LINK } from "./shared";

export const addAffiliateLink = async ({
  affiliateLink,
  vacuumId,
}: {
  affiliateLink: AffiliateLinkCreate;
  vacuumId: string;
}) => {
  const { data: userData } = await supabase.auth.getUser();
  const userEmail = userData.user?.email;
  if (!userEmail) {
    throw new Error("Missing user email.");
  }

  const { region, currency, price, link } = affiliateLink;

  const { data, error } = await supabase
    .from("AffiliateLinks")
    .insert({
      vacuumId,
      region,
      currency,
      price,
      link: `${link}${TRACKING_LINK}`,
      userEmail,
    })
    .select();

  const created = data?.[0];

  if (error || !created) {
    throw error;
  }

  return created;
};
