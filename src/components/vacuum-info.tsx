import { twMerge } from "tailwind-merge";

import { Vacuum } from "../types";
import { VacuumFeatures } from "./vacuum-features";
import { PriceDisplay } from "./price-display";

interface VacuumResultProps {
  vacuum: Vacuum;
  imageClassName?: string;
}

export const VacuumInfo = ({ vacuum, imageClassName = "" }: VacuumResultProps) => {
  const name = `${vacuum.brand} ${vacuum.model}`;

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Image */}
      <div className={twMerge(" h-36 flex-shrink-0 md:mb-0 overflow-hidden rounded", imageClassName)}>
        <img className="object-contain w-full h-full" src={vacuum.imageUrl} alt={name} />
      </div>
      {/* Main info */}
      <div className="flex flex-col gap-2">
        <div>
          <h3 className="text-base font-semibold text-primary">{name}</h3>
          <p className="text-sm text-text/90">
            {vacuum.brand} – {vacuum.model}
          </p>
        </div>
        <PriceDisplay vacuum={vacuum} />

        {/* Feature icons */}
        <div>
          <p className="text-sm font-semibold">Features</p>
          <div className="p-1">
            <VacuumFeatures vacuum={vacuum} />
          </div>
        </div>
      </div>
    </div>
  );
};
