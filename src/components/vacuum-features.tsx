import { ReactNode } from "react";
import { FaBatteryHalf, FaDog, FaTrashAlt, FaMobileAlt } from "react-icons/fa";
import { BsFillVolumeUpFill } from "react-icons/bs";
import { GiVacuumCleaner, GiWaterDrop } from "react-icons/gi";
import { MdSensors, MdLayers } from "react-icons/md";

import { Vacuum, VacuumsFilter } from "../types";

interface VacuumResultProps {
  vacuum: Vacuum;
  filters: VacuumsFilter;
}

export const VacuumFeatures = ({
  vacuum,
  exclude = [],
  limit,
}: VacuumResultProps & {
  exclude?: (keyof Vacuum)[];
  limit?: number;
}) => {
  const featureKeyMapping: Partial<Record<keyof Vacuum, { icon: ReactNode; text: string }>> = {
    ["batteryLifeInMinutes"]: { icon: <FaBatteryHalf />, text: `${vacuum.batteryLifeInMinutes} min` },
    ["suctionPowerInPascals"]: { icon: <GiVacuumCleaner />, text: `${vacuum.suctionPowerInPascals} Pa` },
    ["noiseLevelInDecibels"]: { icon: <BsFillVolumeUpFill />, text: `${vacuum.noiseLevelInDecibels} dB` },
    ["mappingTechnology"]: { icon: <MdSensors />, text: vacuum.mappingTechnology },
    ["hasMultiFloorMappingFeature"]: { icon: <MdLayers />, text: "Multi-floor" },
    ["hasVirtualWallsFeature"]: { icon: <MdSensors />, text: "Virtual walls" },
    ["hasMoppingFeature"]: { icon: <GiWaterDrop />, text: "Mop" },
    ["hasSelfEmptyingFeature"]: { icon: <FaTrashAlt />, text: "Self-empty" },
    ["hasAppControl"]: { icon: <FaMobileAlt />, text: "App Control" },
  };

  let keys = Object.keys(featureKeyMapping) as (keyof Vacuum)[];
  keys = keys.filter((key) => exclude.includes(key) === false);
  if (limit) {
    keys.splice(limit);
  }

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
      {keys.map((key) => {
        const feature = featureKeyMapping[key as keyof Vacuum];
        if (feature && !exclude.includes(key as keyof Vacuum)) {
          const { icon, text } = feature;
          return (
            <div key={key} className="flex items-center gap-1">
              {icon}
              <span>{text}</span>
            </div>
          );
        }
        return null;
      })}
      {vacuum.suctionPowerInPascals > 3000 ? (
        <div key="hasPetHairOptimized" className="flex items-center gap-1">
          <FaDog />
          <span>Pet-friendly</span>
        </div>
      ) : null}
    </div>
  );
};
