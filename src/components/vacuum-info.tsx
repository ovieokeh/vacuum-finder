import { twMerge } from "tailwind-merge";

import { CurrencySymbolMapping, Vacuum, VacuumsFilter } from "../types";
import { useSiteConfig } from "../providers/site-config";
import { VacuumFeatures } from "./vacuum-features";

interface VacuumResultProps {
  vacuum: Vacuum;
  filters: VacuumsFilter;
}

export const VacuumInfo = ({
  vacuum,
  filters,
  imageClassName = "",
}: VacuumResultProps & {
  imageClassName?: string;
}) => {
  const { currency } = useSiteConfig();
  const USD_TO_EUR = 0.85;
  let price = vacuum.price;
  if (currency === "EUR") {
    price = Number((vacuum.price * USD_TO_EUR).toFixed(2));
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Image */}
      <div className={twMerge(" h-36 flex-shrink-0 sm:mb-0 overflow-hidden rounded", imageClassName)}>
        <img className="object-cover w-full h-full" src={vacuum.image} alt={vacuum.name} />
      </div>
      {/* Main info */}
      <div className="flex flex-col gap-2">
        <div>
          <h3 className="text-base font-semibold text-primary">{vacuum.name}</h3>
          <p className="text-sm text-text/90">
            {vacuum.brand} – {vacuum.model}
          </p>
        </div>
        <p className="mt-2 sm:mt-0 text-lg font-bold text-accent">
          {CurrencySymbolMapping[currency]}
          {price}
        </p>

        {/* Feature icons */}
        <div>
          <p className="text-sm font-semibold">Features</p>
          <div className="p-1">
            <VacuumFeatures vacuum={vacuum} filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
};
