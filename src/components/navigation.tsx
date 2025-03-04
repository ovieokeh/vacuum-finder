import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

import { useSiteConfig } from "../providers/site-config";
import { Currency, CurrencyIconMapping, Region, RegionIconMapping } from "../types";
import { useEffect, useRef } from "react";

export const Navigation = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const { region, currency, setRegion, setCurrency, setNavHeight } = useSiteConfig();

  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.clientHeight);
    }
  }, [setNavHeight]);

  const CurrentRegionIcon = RegionIconMapping[region];
  const CurrentCurrencyIcon = CurrencyIconMapping[currency];

  return (
    <nav className="max-w-[1200px] mx-auto p-4 grow flex justify-between items-center" ref={navRef}>
      <h2 className="font-semibold text-lg">Robot Vacuum Buyer Tool</h2>
      <div className="flex flow-row gap-4 min-w-48 justify-between">
        <Listbox value={region} onChange={(value) => setRegion(value)}>
          <div className="flex flex-col gap-2">
            <ListboxButton className="flex flex-row items-center justify-between gap-2 text-left px-2! bg-background!">
              <CurrentRegionIcon className="w-4 h-4" />
              {region}
            </ListboxButton>
            <ListboxOptions anchor="bottom start" className="bg-background rounded shadow">
              {Object.values(Region).map((type) => (
                <ListboxOption
                  key={type}
                  value={type}
                  className="group flex gap-2 px-4 py-2 data-[focus]:bg-background-alt cursor-pointer"
                >
                  {type}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>

        <Listbox value={currency} onChange={(value) => setCurrency(value)}>
          <div className="flex flex-col gap-2">
            <ListboxButton className="flex flex-row items-center justify-between gap-2 text-left px-2! bg-background!">
              <CurrentCurrencyIcon className="w-4 h-4" />
              {currency}
            </ListboxButton>
            <ListboxOptions anchor="bottom start" className="bg-background rounded shadow">
              {Object.values(Currency).map((type) => (
                <ListboxOption
                  key={type}
                  value={type}
                  className="group flex gap-2 px-4 py-2 data-[focus]:bg-background-alt cursor-pointer"
                >
                  {type}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>
    </nav>
  );
};
