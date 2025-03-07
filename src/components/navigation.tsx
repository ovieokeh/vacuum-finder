import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

import { useSiteConfig } from "../providers/site-config";
import { Currency, CurrencyIconMapping, Region, RegionIconMapping } from "../types";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IoGlobeOutline } from "react-icons/io5";

export const Navigation = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const { region, currency, setRegion, setCurrency, setNavHeight } = useSiteConfig();
  const { user } = useSiteConfig();

  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.clientHeight);
    }
  }, [setNavHeight]);

  const CurrentRegionIcon = RegionIconMapping[region] ?? IoGlobeOutline;
  const CurrentCurrencyIcon = CurrencyIconMapping[currency];

  return (
    <div className="z-20 max-w-[1200px] mx-auto p-4 grow flex justify-between items-center shadow sticky" ref={navRef}>
      <div className="flex items-center gap-4 md:gap-6">
        <Link to="/" className="text-text!">
          <span className="hidden md:block">Robot Vacuum Finder</span>
          <span className="md:hidden">Home</span>
        </Link>

        <div className="flex gap-4">
          <Link to="/vacuums" className="text-text hover:text-text/90">
            Finder
          </Link>
          <Link to="/guides" className="text-text hover:text-text/90">
            Guides
          </Link>
          {user?.id ? (
            <Link to="/admin" className="text-text hover:text-text/90">
              Dashboard
            </Link>
          ) : null}
        </div>
      </div>

      <div className="flex flow-row gap-4 items-center justify-between">
        <Listbox value={region} onChange={(value) => setRegion(value)}>
          <div className="flex flex-col gap-2">
            <ListboxButton className="flex flex-row items-center justify-between gap-2 text-left px-2! py-1! bg-background!">
              <CurrentRegionIcon className="w-4 h-4" />
              <span className="hidden md:block">{region}</span>
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
    </div>
  );
};
