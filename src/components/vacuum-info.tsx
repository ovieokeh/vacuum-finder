import { twMerge } from "tailwind-merge";

import { VacuumFeatures } from "./vacuum-features";
import { PriceDisplay } from "./price-display";
import { VacuumWithAffiliateLink } from "../database/types";
import { Link } from "react-router";
import { useMemo } from "react";
import { useSearchVacuums } from "../database/hooks";

interface VacuumResultProps {
  vacuum: VacuumWithAffiliateLink;
  className?: string;
  imageClassName?: string;
  withLink?: boolean;
  navigateRoot?: string;
  truncateFeatures?: boolean;
}

export const VacuumInfo = ({
  vacuum,
  className = "",
  imageClassName = "",
  navigateRoot = "",
  withLink = true,
  truncateFeatures = true,
}: VacuumResultProps) => {
  const name = `${vacuum.brand} ${vacuum.model}`;
  const similarQuery = useSearchVacuums({
    filters: {
      brand: vacuum.brand,
      model: vacuum.model,
    },
    enabled: true,
  });
  const similarVacuums = similarQuery.data?.results.filter((v: VacuumWithAffiliateLink) => v.id !== vacuum.id);

  const content = useMemo(
    () => (
      <>
        {/* Image */}
        <div className={twMerge("h-52 flex-shrink-0 md:mb-0 overflow-hidden rounded", imageClassName)}>
          <img className="object-contain w-full h-full" src={vacuum.imageUrl} alt={name} />
        </div>
        {/* Main info */}
        <div className="flex flex-col gap-2">
          <div>
            <h3 className="text-base font-semibold text-primary">{name}</h3>
          </div>
          <PriceDisplay vacuum={vacuum} hasVariants={similarVacuums && similarVacuums.length > 1} />

          {/* Feature icons */}
          <div>
            <p className="text-sm font-semibold">Features</p>
            <div className="p-1">
              <VacuumFeatures vacuum={vacuum} truncate={truncateFeatures} />
            </div>
          </div>
        </div>
      </>
    ),
    [vacuum, imageClassName, name, truncateFeatures, similarVacuums]
  );

  const sharedClassname = twMerge(
    `flex flex-col gap-4 p-2  ${withLink ? "border-border border hover:border-accent" : ""}`,
    className
  );

  return withLink ? (
    <Link to={navigateRoot ? `${navigateRoot}/${vacuum.id}` : vacuum.id} className={sharedClassname}>
      {content}
    </Link>
  ) : (
    <div className={sharedClassname}>{content}</div>
  );
};
