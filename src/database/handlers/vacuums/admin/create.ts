import { supabase } from "../../..";
import { AffiliateLinkCreate, Currency, MappingTechnology, Region, VacuumCreate } from "../../../types";
import { TRACKING_LINK } from "../../affiliate-links/shared";

export const addVacuum = async ({
  data,
  affiliateLinks,
}: {
  data: VacuumCreate;
  affiliateLinks: AffiliateLinkCreate[] | null;
}) => {
  const { data: userData } = await supabase.auth.getUser();
  const userEmail = userData.user?.email;
  if (!userEmail) {
    throw new Error("Missing user email.");
  }

  const { imageUrl, brand, model, mappingTechnology } = data;

  if (!imageUrl || !brand || !model) {
    throw new Error("Vacuum brand, model, and image URL are required.");
  }

  const { data: response, error } = await supabase
    .from("Vacuums")
    .insert({
      ...data,
      brand: brand.trim(),
      model: model.trim(),
      imageUrl: imageUrl.trim(),
      mappingTechnology: mappingTechnology as MappingTechnology,
      userEmail,
    })
    .select();

  const created = response?.[0];

  if (error || !created) {
    throw error;
  }

  if (affiliateLinks && typeof affiliateLinks === "object") {
    const affiliateLinksArray = Object.values(affiliateLinks) as AffiliateLinkCreate[];
    await supabase.from("AffiliateLinks").insert(
      affiliateLinksArray.map((link) => ({
        price: link.price,
        currency: link.currency as Currency,
        region: link.region as Region,
        vacuumId: created.id,
        link: `${link.link}${TRACKING_LINK}`,
        userEmail,
      }))
    );
  }

  // refetch the vacuum to get the full data
  const { data: vacuumData, error: vacuumError } = await supabase
    .from("Vacuums")
    .select(`*,affiliateLinks:AffiliateLinks (*)`)
    .eq("id", created.id)
    .single();
  if (vacuumError || !vacuumData) {
    throw vacuumError;
  }

  return vacuumData;
};
