import { MdInfoOutline } from "react-icons/md";
import { Popover } from "./popover";
import { CurrencySymbolMapping, Vacuum } from "../types";
import { getCheapestPrice } from "../shared-utils/price";
import { useSiteConfig } from "../providers/site-config";

export const PriceDisplay = ({ vacuum }: { vacuum: Vacuum }) => {
  const { currency } = useSiteConfig();
  const cheapestPrice = getCheapestPrice(vacuum, currency);
  return cheapestPrice === 0 ? (
    <span className="block w-full">n/a</span>
  ) : cheapestPrice === -1 ? (
    <Popover
      panelClassName="bg-background-alt p-4 border border-border rounded"
      triggerClassName="p-0!"
      trigger={<MdInfoOutline className="w-4 h-4 text-text!" />}
    >
      <p className="text-text/90">No price available in your chosen currency.</p>
      <p className="text-text/90">Try changing your selected currency at the top of the page.</p>
    </Popover>
  ) : (
    <p className="block w-full">{`${CurrencySymbolMapping[currency]}${cheapestPrice}`}</p>
  );
};
