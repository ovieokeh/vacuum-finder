import { MappingTechnology, VacuumWithAffiliateLinks } from "../database";
import { VacuumsFilters } from "../types";

interface VacuumSpecExplanationsProps {
  vacuum: VacuumWithAffiliateLinks;
  filters: VacuumsFilters;
}

export const VacuumSpecExplanations = ({ vacuum }: VacuumSpecExplanationsProps) => {
  if (!vacuum) {
    return null;
  }

  // Create a conversational summary for each feature

  const batterySummary = (() => {
    const mins = vacuum.batteryLifeInMinutes ?? 0;
    if (mins < 60) {
      return `The battery lasts only ${mins} minutes, which might be limiting for a larger home.`;
    } else if (mins >= 60 && mins < 120) {
      return `A battery life of ${mins} minutes should be fine for most medium-sized spaces.`;
    } else {
      return `An impressive battery life of ${mins} minutes makes it well-suited for larger areas.`;
    }
  })();

  const suctionSummary = (() => {
    const pa = vacuum.suctionPowerInPascals ?? 0;
    if (pa < 2000) {
      return `With only ${pa} Pascals of suction, it may struggle with stubborn dirt or thick carpets.`;
    } else if (pa >= 2000 && pa < 3000) {
      return `Its ${pa} Pascals of suction power is adequate for everyday cleaning.`;
    } else {
      return `A powerful suction of ${pa} Pascals means it’s great at handling pet hair and deep cleaning.`;
    }
  })();

  const noiseSummary = (() => {
    const db = vacuum.noiseLevelInDecibels;
    if (db === null) return "";
    if (db < 60) {
      return `Operating at only ${db} dB, it runs very quietly.`;
    } else if (db >= 60 && db <= 70) {
      return `At ${db} dB, the noise level is moderate and should be tolerable.`;
    } else {
      return `A noise level of ${db} dB might be a bit distracting during use.`;
    }
  })();

  const mappingSummary = (() => {
    const tech = vacuum.mappingTechnology as MappingTechnology;
    if (tech === "laser") {
      return `Its laser mapping system ensures precise navigation.`;
    }
    return `Using camera-based mapping, it navigates well though it might have trouble in low light.`;
  })();

  const multiFloorSummary = vacuum.hasMultiFloorMappingFeature
    ? `It supports multi-floor mapping, which is great for multi-story homes.`
    : "";

  const mopSummary = vacuum.hasMoppingFeature
    ? `The built-in mop function is a nice bonus for hard floors and light spills.`
    : "";

  const selfEmptySummary = (() => {
    if (typeof vacuum.hasSelfEmptyingFeature === "boolean") {
      if (vacuum.hasSelfEmptyingFeature) {
        return `Its self-emptying dustbin reduces maintenance.`;
      } else {
        return `The dustbin requires manual emptying.`;
      }
    }
    return "";
  })();

  const appControlSummary = vacuum.hasAppControlFeature
    ? `App control adds convenience for scheduling and adjustments.`
    : "";

  const virtualWallsSummary = vacuum.hasVirtualWallsFeature
    ? `Virtual walls let you restrict cleaning areas as needed.`
    : "";

  const petHairSummary = (() => {
    const suctionPowerInPascals = vacuum.suctionPowerInPascals ?? 0;
    // Use suction power as a proxy for pet hair performance.

    return suctionPowerInPascals >= 3000
      ? `Its strong suction makes it well-equipped for handling pet hair.`
      : `It might not be ideal for pet hair if you have several pets.`;

    return "";
  })();

  // Combine only non-empty summaries into a list
  const summaries = [
    batterySummary,
    suctionSummary,
    noiseSummary,
    mappingSummary,
    multiFloorSummary,
    mopSummary,
    selfEmptySummary,
    petHairSummary,
    appControlSummary,
    virtualWallsSummary,
  ].filter((s) => s && s.length > 0);

  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold mb-2">Feature Explanations</h4>
      {summaries.map((sentence, idx) => (
        <p key={idx} className="mb-2 text-text">
          {sentence}
        </p>
      ))}
    </div>
  );
};

export default VacuumSpecExplanations;
