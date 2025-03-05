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
  const featureKeyMapping: Record<keyof Vacuum, { icon: ReactNode; text: string }> = {
    ["batteryLifeMins"]: { icon: <FaBatteryHalf />, text: `${vacuum.batteryLifeMins} min` },
    ["suctionPowerPa"]: { icon: <GiVacuumCleaner />, text: `${vacuum.suctionPowerPa} Pa` },
    ["noiseLevelDb"]: { icon: <BsFillVolumeUpFill />, text: `${vacuum.noiseLevelDb} dB` },
    ["mappingTechnology"]: { icon: <MdSensors />, text: vacuum.mappingTechnology },
    ["multiFloorMapping"]: { icon: <MdLayers />, text: "Multi-floor" },
    ["virtualWalls"]: { icon: <MdSensors />, text: "Virtual walls" },
    ["mopFunction"]: { icon: <GiWaterDrop />, text: "Mop" },
    ["selfEmptying"]: { icon: <FaTrashAlt />, text: "Self-empty" },
    ["appControl"]: { icon: <FaMobileAlt />, text: "App Control" },
    ["petHair"]: { icon: <FaDog />, text: "Pet-friendly" },
  };

  let keys = Object.keys(featureKeyMapping) as (keyof Vacuum)[];
  keys = keys.filter((key) => exclude.includes(key) === false);
  if (limit) {
    keys.splice(limit);
  }

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
      {keys.map((key) => {
        if (featureKeyMapping[key as keyof Vacuum] && !exclude.includes(key as keyof Vacuum)) {
          const { icon, text } = featureKeyMapping[key as keyof Vacuum];
          return (
            <div key={key} className="flex items-center gap-1">
              {icon}
              <span>{text}</span>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};
