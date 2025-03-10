import { supabase } from "../..";
import { AffiliateLink } from "../../../types";
import { TRACKING_LINK } from "./shared";

// Update a affiliateLink by id
export const updateAffiliateLink = async ({ data }: { data: AffiliateLink }) => {
  if (data.url) {
    data.url = `${data.url}${TRACKING_LINK}`;
  }

  const { data: affiliateLink, error } = await supabase.from("AffiliateLinks").update(data).eq("id", data.id);
  if (error) {
    throw error;
  }

  return affiliateLink;
};
