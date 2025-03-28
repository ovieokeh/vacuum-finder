import { MdInfoOutline } from "react-icons/md";

import { VacuumWithAffiliateLink } from "../database/types";
import { CurrencySymbolMapping } from "../types";
import { getCheapestPrice } from "../shared-utils/price";
import { useSiteConfig } from "../providers/site-config";
import { Popover } from "./popover";

export const PriceDisplay = ({ vacuum, hasVariants }: { vacuum: VacuumWithAffiliateLink; hasVariants?: boolean }) => {
  const { currency } = useSiteConfig();

  if (!vacuum?.affiliateLinks) {
    return <span className="block w-full">n/a</span>;
  }

  const cheapestPrice = getCheapestPrice(vacuum, currency);
  return cheapestPrice === 0 ? (
    <span className="block w-full">n/a</span>
  ) : cheapestPrice === -1 ? (
    <Popover
      panelClassName="bg-background-alt p-4 border border-border rounded z-60"
      triggerClassName="p-0!"
      trigger={<MdInfoOutline className="w-4 h-4 text-text!" />}
    >
      <p className="text-text/90">No price available in your chosen currency.</p>
      <p className="text-text/90">Try changing your selected currency at the top of the page.</p>
    </Popover>
  ) : (
    <p className="w-full flex items-center gap-2">
      {`${CurrencySymbolMapping[currency]}${cheapestPrice}`}
      {hasVariants && (
        <Popover
          panelClassName="bg-background-alt p-4 border border-border rounded z-60"
          triggerClassName="p-0!"
          trigger={<MdInfoOutline className="w-4 h-4 text-text!" />}
        >
          <p className="text-text/90">Price may include other variants like pro models</p>
        </Popover>
      )}
    </p>
  );
};
