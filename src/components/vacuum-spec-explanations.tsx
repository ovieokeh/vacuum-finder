import { Vacuum, VacuumMappingTechnology, VacuumsFilter } from "../types";

const COLOR_CLASSES = {
  success: "text-green-700 bg-green-50 border-green-200 dark:bg-green-900/50 dark:text-green-50",
  warning: "text-yellow-700 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-50",
  error: "text-red-700 bg-red-50 border-red-200",
  info: "text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-900/50 dark:text-blue-50",
  neutral: "text-gray-700 dark:text-gray-300 bg-gray-50 border-gray-200 dark:bg-gray-900/50",
};

interface SpecItem {
  label: string;
  description: string;
  colorClass: string;
}

function makeSpecItem(label: string, description: string, type: keyof typeof COLOR_CLASSES = "neutral"): SpecItem {
  return {
    label,
    description,
    colorClass: COLOR_CLASSES[type],
  };
}

interface VacuumSpecExplanationsProps {
  vacuum: Vacuum;
  filters: VacuumsFilter;
}
export const VacuumSpecExplanations = ({ vacuum, filters }: VacuumSpecExplanationsProps) => {
  const getBatteryLifeExplanation = (mins: number) => {
    if (mins < 60) {
      return makeSpecItem(
        `Battery: ${mins} min`,
        "Fine for smaller homes, but may need more frequent charging if you have several rooms.",
        "warning"
      );
    } else if (mins < 120) {
      return makeSpecItem(`Battery: ${mins} min`, "Good for medium-sized homes with a few rooms.", "success");
    } else {
      return makeSpecItem(
        `Battery: ${mins} min`,
        "Extended run time—ideal for larger homes or multiple passes in one go.",
        "success"
      );
    }
  };

  const getSuctionExplanation = (pa: number) => {
    if (pa < 2000) {
      return makeSpecItem(
        `Suction: ${pa} Pa`,
        "Decent for light messes, may struggle with thick carpets or embedded dirt.",
        "warning"
      );
    } else if (pa < 3000) {
      return makeSpecItem(
        `Suction: ${pa} Pa`,
        "Handles everyday dust, debris, and moderate pet hair quite well.",
        "success"
      );
    } else {
      return makeSpecItem(
        `Suction: ${pa} Pa`,
        "Powerful enough for heavy dirt, thick rugs, and stubborn pet hair.",
        "success"
      );
    }
  };

  const getNoiseExplanation = (db: number | null) => {
    if (db === null) {
      return makeSpecItem(
        "Noise Level",
        "Noise level not specified. Check the product details for more info.",
        "neutral"
      );
    }

    if (db < 60) {
      return makeSpecItem(`Noise: ${db} dB`, "Very quiet. You may barely notice it in the next room.", "success");
    } else if (db <= 70) {
      return makeSpecItem(`Noise: ${db} dB`, "Moderate noise; audible but not overly disruptive.", "warning");
    } else {
      return makeSpecItem(`Noise: ${db} dB`, "A bit loud. Best scheduled when you’re out or in another area.", "error");
    }
  };

  const getMappingExplanation = (tech: VacuumMappingTechnology) => {
    if (tech === VacuumMappingTechnology.Laser) {
      return makeSpecItem("Mapping: Laser", "Uses laser-based scanning for accurate, systematic cleaning.", "info");
    }
    return makeSpecItem(
      "Mapping: Camera",
      "Navigates via camera; may vary in low light but avoids most obstacles.",
      "info"
    );
  };

  const getMultiFloorMappingExplanation = (multiFloor: boolean | null) => {
    if (typeof multiFloor === "boolean") {
      return makeSpecItem(
        "Multi-floor Mapping",
        multiFloor
          ? "Stores multiple floor plans—great if you have a multi-story home."
          : "Single-floor mapping only; may need to re-map if you have multiple levels.",
        "info"
      );
    }
    return makeSpecItem(
      "Multi-floor Mapping",
      "May or may not support multi-floor mapping. Check details for more info.",
      "info"
    );
  };

  const getMopExplanation = (hasMop: boolean | null) => {
    if (typeof hasMop === "boolean") {
      return makeSpecItem(
        "Mop Function",
        hasMop
          ? "Has a mop function—great for hard floors and light spills."
          : "No mop function—best for carpets and dry cleaning.",
        "info"
      );
    }
    return makeSpecItem("Mop Function", "May or may not have a mop function. Check details for more info.", "info");
  };

  const getSelfEmptyExplanation = (selfEmpty: boolean | null) => {
    if (typeof selfEmpty === "boolean") {
      if (!selfEmpty) {
        return makeSpecItem("Self-emptying", "Dustbin must be emptied manually after each cleaning.", "warning");
      }
      if (filters.numPets > 0) {
        return makeSpecItem(
          "Self-emptying",
          "Automatically empties dustbin—less hassle, especially with pets.",
          "success"
        );
      }
      return makeSpecItem("Self-emptying", "Dustbin empties itself, so you rarely have to do it manually.", "success");
    }
    return makeSpecItem("Self-emptying", "May or may not have self-emptying. Check details for more info.", "info");
  };

  const getAppControlExplanation = () =>
    makeSpecItem("App Control", "Control + schedule cleanings from your phone—convenient for busy schedules.", "info");

  const getPetHairExplanation = (petHair: boolean | null) => {
    if (typeof petHair === "boolean") {
      if (!petHair) {
        return makeSpecItem(
          "Pet Hair Friendly",
          "Not specifically designed for pet hair, but still effective at cleaning.",
          "warning"
        );
      }
      if (filters.numPets > 0) {
        return makeSpecItem(
          "Pet Hair Friendly",
          `Optimized for pet hair. With ${filters.numPets} pet(s), it keeps shedding under control.`,
          "success"
        );
      }
      return makeSpecItem(
        "Pet Hair Friendly",
        "Even without pets, it’s great at picking up fine fur and dander.",
        "success"
      );
    }
    return makeSpecItem(
      "Pet Hair Friendly",
      "May or may not be optimized for pet hair. Check details for more info.",
      "info"
    );
  };

  const getVirtualWallsExplanation = () =>
    makeSpecItem(
      "Virtual Walls",
      "Set up invisible barriers to keep the vacuum out of certain areas or rooms.",
      "info"
    );

  const specsList = [
    getBatteryLifeExplanation(vacuum.batteryLifeMins),
    getSuctionExplanation(vacuum.suctionPowerPa),
    getNoiseExplanation(vacuum.noiseLevelDb),
    getSelfEmptyExplanation(vacuum.selfEmptying),
    getPetHairExplanation(vacuum.petHair),
    getMappingExplanation(vacuum.mappingTechnology),
    getMultiFloorMappingExplanation(vacuum.multiFloorMapping),
    getMopExplanation(vacuum.mopFunction),
  ];

  if (vacuum.virtualWalls) {
    specsList.push(getVirtualWallsExplanation());
  }
  if (vacuum.appControl) {
    specsList.push(getAppControlExplanation());
  }

  return (
    <div className="mt-4 space-y-4">
      <h4 className="font-semibold text-base text-gray-900 dark:text-gray-300">What do the features mean?</h4>
      <div className="space-y-3 md:h-[50svh] overflow-y-scroll">
        {specsList.map((item, idx) => (
          <div key={idx} className={`flex flex-col p-3 border-l-4 rounded ${item.colorClass}`}>
            <span className="font-medium">{item.label}</span>
            <span className="text-sm">{item.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
