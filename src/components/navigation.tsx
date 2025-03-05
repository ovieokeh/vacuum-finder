import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

import { useSiteConfig } from "../providers/site-config";
import { Currency, CurrencyIconMapping, Region, RegionIconMapping } from "../types";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

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
      <div className="flex items-center gap-4 md:gap-6">
        <Link to="/" className="text-text!">
          <h2 className="hidden md:block font-semibold text-lg">Robot Vacuum Buyer Tool</h2>
          <h2 className="md:hidden font-semibold text-lg">RVBT</h2>
        </Link>

        <div className="flex gap-4">
          <Link to="/vacuum-search" className="text-text hover:text-text/90">
            Tool
          </Link>
          <Link to="/guides" className="text-text hover:text-text/90">
            Guides
          </Link>
        </div>
      </div>

      <div className="flex flow-row gap-4 min-w-38 justify-between">
        <Listbox value={region} onChange={(value) => setRegion(value)}>
          <div className="flex flex-col gap-2">
            <ListboxButton className="flex flex-row items-center justify-between gap-2 text-left px-2! py-1! bg-background!">
              <CurrentRegionIcon className="w-4 h-4" />
              {region}
            </ListboxButton>
            <ListboxOptions anchor="bottom start" className="bg-background rounded shadow z-10">
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
            <ListboxButton className="flex flex-row items-center justify-between gap-2 text-left px-2! py-2! bg-background!">
              <CurrentCurrencyIcon className="w-4 h-4" />
            </ListboxButton>
            <ListboxOptions anchor="bottom start" className="bg-background rounded shadow z-10">
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
