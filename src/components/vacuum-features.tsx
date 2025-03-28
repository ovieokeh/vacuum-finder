import { ReactNode } from "react";
import { FaBatteryHalf, FaDog, FaTrashAlt, FaMobileAlt, FaChild } from "react-icons/fa";
import { BsFillVolumeUpFill } from "react-icons/bs";
import { GiVacuumCleaner, GiWaterDrop } from "react-icons/gi";
import { MdSensors, MdLayers } from "react-icons/md";
import { TfiLayoutAccordionSeparated } from "react-icons/tfi";
import { TbSmartHome } from "react-icons/tb";

import { VacuumsFilters } from "../types";
import { Vacuum, VacuumWithAffiliateLink } from "../database/types";
import { LuSpeech, LuTarget } from "react-icons/lu";
import { IoGameController } from "react-icons/io5";

interface VacuumResultProps {
  vacuum: VacuumWithAffiliateLink;
  filters: VacuumsFilters;
}

export const VacuumFeatures = ({
  vacuum,
  exclude = [],
  limit,
  truncate,
}: Omit<VacuumResultProps, "filters"> & {
  exclude?: (keyof Vacuum)[];
  limit?: number;
  truncate?: boolean;
}) => {
  const featureKeyMapping: Partial<Record<keyof Vacuum, { icon: ReactNode; text: string }>> = {
    ["batteryLifeInMinutes"]: { icon: <FaBatteryHalf />, text: `${vacuum.batteryLifeInMinutes} min` },
    ["suctionPowerInPascals"]: { icon: <GiVacuumCleaner />, text: `${vacuum.suctionPowerInPascals} Pa` },
    ["noiseLevelInDecibels"]: { icon: <BsFillVolumeUpFill />, text: `${vacuum.noiseLevelInDecibels} dB` },
    ["mappingTechnology"]: { icon: <MdSensors />, text: vacuum.mappingTechnology },
    ["hasMultiFloorMappingFeature"]: { icon: <MdLayers />, text: "Multi-floor" },
    ["hasVirtualWallsFeature"]: { icon: <TfiLayoutAccordionSeparated />, text: "Virtual walls" },
    ["hasMoppingFeature"]: { icon: <GiWaterDrop />, text: "Mop" },
    ["hasSelfEmptyingFeature"]: { icon: <FaTrashAlt />, text: "Self-empty" },
    ["hasAppControlFeature"]: { icon: <FaMobileAlt />, text: "App Control" },
    ["hasZoneCleaningFeature"]: { icon: <LuTarget />, text: "Zone cleaning" },
    ["hasGoogleOrAlexaIntegrationFeature"]: { icon: <TbSmartHome />, text: "Smart Assistant Compatible" },
    ["hasManualControlFeature"]: { icon: <IoGameController />, text: "Manual control" },
    ["hasVoiceControlFeature"]: { icon: <LuSpeech />, text: "Voice control" },
    ["hasChildLockFeature"]: { icon: <FaChild />, text: "Child lock" },
  };

  let keys = Object.keys(featureKeyMapping) as (keyof Vacuum)[];
  keys = keys.filter((key) => exclude.includes(key) === false).filter((key) => !!vacuum[key]);
  if (limit) {
    keys.splice(limit);
  }

  if (!vacuum) {
    return null;
  }

  const truncated = keys.length > 5 && truncate;
  const renderKeys = truncated ? keys.slice(0, 5) : keys;

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm">
      {renderKeys.map((key) => {
        const featureValue = vacuum[key];
        if (!featureValue) {
          return null;
        }

        const feature = featureKeyMapping[key as keyof Vacuum];
        if (feature && !exclude.includes(key as keyof Vacuum)) {
          const { icon, text } = feature;
          return (
            <div key={key} className="flex items-center gap-1">
              {icon}
              <span className="capitalize">{text}</span>
            </div>
          );
        }
        return null;
      })}
      {vacuum.suctionPowerInPascals && vacuum.suctionPowerInPascals > 3000 ? (
        <div key="hasPetHairOptimized" className="flex items-center gap-1">
          <FaDog />
          <span>Pet-friendly</span>
        </div>
      ) : null}
      {truncated ? <span>{`and ${keys.length - 5} more features`}</span> : null}
    </div>
  );
};
