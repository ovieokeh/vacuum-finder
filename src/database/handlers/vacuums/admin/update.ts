import { Currency, Region, supabase, VacuumWithAffiliateLinks } from "../../..";
import { TRACKING_LINK } from "../../affiliate-links/shared";

// Update a vacuum by id
export const updateVacuum = async ({ data }: { data: VacuumWithAffiliateLinks }) => {
  const vacuumId = data.id;

  if (!data) {
    throw new Error("Missing data.");
  }

  if (!vacuumId) {
    throw new Error("Missing vacuum id.");
  }

  const { data: userData } = await supabase.auth.getUser();
  const userEmail = userData.user?.email;
  if (!userEmail) {
    throw new Error("Missing user email.");
  }

  const { affiliateLinks, ...dataWithoutAffiliateLinks } = data;

  const { error } = await supabase.from("Vacuums").update(dataWithoutAffiliateLinks).eq("id", vacuumId);
  if (error) {
    throw error;
  }

  if (affiliateLinks) {
    // Insert affiliate links
    await supabase.from("AffiliateLinks").delete().eq("vacuumId", vacuumId);
    await supabase.from("AffiliateLinks").insert(
      affiliateLinks.map((link) => ({
        vacuumId,
        userEmail,
        price: link.price,
        currency: link.currency as Currency,
        region: link.region as Region,
        link: `${link.link}${TRACKING_LINK}`,
      }))
    );
  }

  const updated = await supabase
    .from("Vacuums")
    .select(
      `
    *,
    affiliateLinks:AffiliateLinks (*)
  `
    )
    .eq("id", vacuumId);
  if (updated.error) {
    throw updated.error;
  }

  return updated.data as unknown as VacuumWithAffiliateLinks;
};
