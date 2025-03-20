import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

import { useSiteConfig } from "../providers/site-config";
import { CurrencyIconMapping, RegionIconMapping, SUPPORTED_CURRENCIES, SUPPORTED_REGIONS } from "../types";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Link, useLocation } from "react-router";
import { IoGlobeOutline } from "react-icons/io5";
import { Region } from "../database";
import { LuUser } from "react-icons/lu";

export const Navigation = forwardRef<HTMLDivElement>((_, ref) => {
  const navRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => navRef.current as HTMLDivElement);
  const location = useLocation();

  const { user, region, currency, setRegion, setCurrency, setNavHeight } = useSiteConfig();

  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.clientHeight);
    }
  }, [setNavHeight]);

  const handleSetRegion = (value: Region) => {
    setRegion(value);
    if (value === "europe") {
      setCurrency("eur");
    } else {
      setCurrency("usd");
    }
  };

  const appPages = ["/vacuums", "/vacuums/:id"];
  const isAppPage = appPages.some((page) => location.pathname.startsWith(page));

  const CurrentRegionIcon = RegionIconMapping[region] ?? IoGlobeOutline;
  const CurrentCurrencyIcon = CurrencyIconMapping[currency];

  return (
    <div className="z-20 p-4 grow shadow sticky h-[66px]" ref={navRef}>
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6 text-sm md:text-base text-text!">
          <Link to="/" className="text-text! font-semibold">
            <span className="hidden md:block">Robot Vacuum Finder</span>
            <span className="md:hidden">Home</span>
          </Link>

          <div className="flex gap-2 md:gap-6">
            <Link to="/quiz" className="text-text hover:text-text/90">
              Quiz
            </Link>
            {!isAppPage && (
              <Link to="/vacuums" className="text-text hover:text-text/90">
                Search
              </Link>
            )}
            <Link to="/guides" className="text-text hover:text-text/90">
              Guides
            </Link>
          </div>
        </div>

        <div className="flex flow-row gap-1 md:gap-4 items-center justify-between">
          <Listbox value={region} onChange={handleSetRegion}>
            <div className="flex flex-col gap-2">
              <ListboxButton className="flex flex-row items-center justify-between gap-2 text-left px-2! py-1! bg-background!">
                <CurrentRegionIcon className="w-4 h-4" />
                <span className="hidden md:block capitalize">{region}</span>
              </ListboxButton>
              <ListboxOptions anchor="bottom start" className="bg-background rounded shadow z-20">
                {SUPPORTED_REGIONS.map((type) => (
                  <ListboxOption
                    key={type}
                    value={type}
                    className="group flex gap-2 px-4 py-2 data-[focus]:bg-background-alt cursor-pointer capitalize"
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
              <ListboxOptions anchor="bottom start" className="bg-background rounded shadow z-20">
                {SUPPORTED_CURRENCIES.map((type) => (
                  <ListboxOption
                    key={type}
                    value={type}
                    className="group flex gap-2 px-4 py-2 data-[focus]:bg-background-alt cursor-pointer uppercase"
                  >
                    {type}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>

          {user?.id ? (
            <Link to="/admin" className="text-text hover:text-text/90">
              <LuUser className="size-6" />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
});
