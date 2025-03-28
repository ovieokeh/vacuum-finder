import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Outlet } from "react-router";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { IoGlobeOutline } from "react-icons/io5";

import { useWindowWidth } from "../../hooks/use-window-width";
import { useSiteConfig } from "../../providers/site-config";
import { useInfiniteQueryFetcher, useSearchVacuumsInfinite } from "../../database/hooks";
import { VacuumSearchForm } from "../../components/vacuum-search-form";
import { VacuumResults } from "../../components/vacuum-results";
import { VacuumsFilters } from "../../types";
import { useContentScroll } from "../../hooks/use-disable-body-scroll";
import { FormSelectField } from "../../components/form-components";
import { Region } from "../../database/types";

import { useListCountries } from "../../database/hooks";
import { RegionIconMapping } from "../../types";
import { countryCodeToReadable } from "../../shared-utils/locale/locale";
import { SEO } from "../../components/seo";
import { initialSearchFiltersState } from "../../shared-utils/vacuum-filters";
import { useFiltersParams, useSyncFiltersToParams } from "../../hooks/use-filters-params";
import { EmailCapturePopup } from "../../components/email-capture";

interface SortingBarProps {
  onSortChange: (sort: string, order: string) => void;
  sortValue: string;
  className?: string;
}

const SortingBar = ({ sortValue, className, onSortChange }: SortingBarProps) => {
  const { region, setRegion, countryCode: userCountryCode, setCurrency } = useSiteConfig();
  const [countryCode, setCountryCode] = useState(userCountryCode);
  const countriesQuery = useListCountries();

  const countrySelectOptions = useMemo(
    () =>
      countriesQuery.data?.map((country) => ({
        label: countryCodeToReadable(country.countrycode),
        value: country.countrycode,
      })) ?? [],
    [countriesQuery.data]
  );
  const CurrentRegionIcon = RegionIconMapping[region] ?? IoGlobeOutline;
  const handleSetCountry = (country: string) => {
    const selectedCountry = countriesQuery.data?.find((c) => c.countrycode === country);
    if (selectedCountry) {
      setRegion(selectedCountry.region);
      setCurrency(selectedCountry.currency);
      setCountryCode(country);
    }
  };
  useEffect(() => {
    if (userCountryCode) {
      setCountryCode(userCountryCode);
    }
  }, [userCountryCode]);

  const sortingOptions = [
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Battery Life: Low to High", value: "batteryLife-asc" },
    { label: "Battery Life: High to Low", value: "batteryLife-desc" },
    { label: "Suction Power: Low to High", value: "suctionPower-asc" },
    { label: "Suction Power: High to Low", value: "suctionPower-desc" },
    { label: "Noise Level: Low to High", value: "noiseLevel-asc" },
    { label: "Noise Level: High to Low", value: "noiseLevel-desc" },
    { label: "Water Tank Capacity: Low to High", value: "waterTankCapacity-asc" },
    { label: "Water Tank Capacity: High to Low", value: "waterTankCapacity-desc" },
    { label: "Dustbin Capacity: Low to High", value: "dustbinCapacity-asc" },
    { label: "Dustbin Capacity: High to Low", value: "dustbinCapacity-desc" },
  ];

  return (
    <div className={twMerge("flex justify-between items-center py-4 md:px-4", className)}>
      <div className="flex items-center gap-6">
        <FormSelectField
          className="flex-row gap-4"
          label="Sort By"
          options={sortingOptions}
          value={sortValue}
          onChange={(value) => {
            const [sort, order] = value.split("-");
            onSortChange(sort, order);
          }}
        />

        <Listbox value={countryCode} onChange={handleSetCountry}>
          <div className="flex flex-col gap-2">
            <ListboxButton className="flex flex-row items-center justify-between gap-2 text-left px-2! py-1! bg-background!">
              <span className="hidden md:block">Region</span>
              <CurrentRegionIcon className="w-4 h-4" />
              <span className="hidden md:block capitalize">{countryCodeToReadable(countryCode!)}</span>
            </ListboxButton>
            <ListboxOptions anchor="bottom start" className="bg-background rounded shadow z-20 w-fit">
              {countrySelectOptions?.map((type) => (
                <ListboxOption
                  key={type.value}
                  value={type.value}
                  className="group flex gap-2 px-4 py-2 data-[focus]:bg-background-alt cursor-pointer capitalize"
                >
                  {type.label}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>
    </div>
  );
};

const REGION_BUDGETS: { [key in Region]: number } = {
  europe: 859,
  americas: 1000,
  africa: 10000,
  australia: 1300,
  asia: 1500,
};

export function VacuumSearchPage() {
  const windowWidth = useWindowWidth();
  useContentScroll(false);

  const { navHeight, region, currency } = useSiteConfig();
  const { filters: paramsFilters } = useFiltersParams();
  const defaultFilters = useMemo(
    () => ({ ...initialSearchFiltersState, budget: REGION_BUDGETS[region], region, currency, ...paramsFilters }),
    [region, currency, paramsFilters]
  );
  const filtersContainerRef = useRef<HTMLDivElement>(null);
  const form = useForm<VacuumsFilters>({
    defaultValues: defaultFilters,
  });
  const filters = useWatch({ control: form.control });
  const [sort, setSort] = useState("price");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const searchVacuumsQuery = useSearchVacuumsInfinite({
    filters,
    sorting: {
      key: sort,
      direction: order,
    },
    page: 1,
    limit: 9,
  });
  const vacuums = useMemo(
    () => searchVacuumsQuery.data?.pages.map((page) => page.results).flat() ?? [],
    [searchVacuumsQuery.data]
  );

  const { refetch, fetchNextPage } = searchVacuumsQuery;
  const { ref } = useInfiniteQueryFetcher(fetchNextPage);

  useEffect(() => {
    refetch();
  }, [refetch, currency, region]);

  const { handleSubmit, setValue, reset } = form;

  useEffect(() => {
    setValue("currency", currency);
    setValue("region", region);
    setValue("budget", paramsFilters.budget ?? REGION_BUDGETS[region]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, setValue]);

  useSyncFiltersToParams(filters as VacuumsFilters);

  const resetFilters = useCallback(() => {
    reset(defaultFilters);
  }, [reset, defaultFilters]);

  const filtersContainerWidth = filtersContainerRef.current?.clientWidth ?? 300;
  const filtersContainerHeight = filtersContainerRef.current?.clientHeight ?? 300;
  const vacuumResultsWidth = Math.min(windowWidth - (filtersContainerWidth + 64), 868);

  const fetchMoreComponent = useMemo(() => {
    return (
      <div
        ref={ref}
        style={{
          minHeight: 40,
          minWidth: 40,
        }}
      />
    );
  }, [ref]);

  return (
    <>
      <SEO
        title="Robot Vacuum Finder"
        description="Find the best robot vacuum for your needs with our vacuum finder tool."
        image="/images/refine-search-demo.png"
      />

      <div
        className={`flex flex-col justify-between md:flex-row md:justify-normal md:mx-auto md:max-w-[1440px] px-4 md:pt-2 h-[calc(100svh-128px)] md:h-[calc(100svh-76px)] relative`}
      >
        <div
          className="fixed left-0 right-0 bottom-0 md:relative grow md:rounded-tl-lg md:rounded-bl-lg md:h-full md:min-w-1/4 md:max-w-1/4"
          ref={filtersContainerRef}
        >
          <h2 className="hidden md:block p-4 pb-0 text-lg font-bold text-secondary">Refine your search</h2>

          <FormProvider {...form}>
            <VacuumSearchForm
              form={form}
              navHeight={navHeight}
              filtersContainerHeight={filtersContainerHeight}
              handleSubmit={() => {
                handleSubmit(() => {
                  resetFilters();
                });
              }}
              resetFilters={resetFilters}
            />
          </FormProvider>
        </div>

        <div className="flex flex-col md:w-3/4 py-4 md:pb-4 md:rounded-tr-lg md:rounded-br-lg md:p-0 pt-0 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between md:px-4 relative border-b border-border">
            <p className="text-sm pt-4 md:pt-0">
              We think these are the best options that match your criteria (
              {searchVacuumsQuery.data?.pages[searchVacuumsQuery.data.pages.length - 1].total ?? 0} results)
            </p>
            <SortingBar
              className="w-full justify-end"
              sortValue={sort + "-" + order}
              onSortChange={(sort, order) => {
                setSort(sort);
                setOrder(order as "asc" | "desc");
              }}
            />
          </div>
          <div className={`h-[calc(100%-1px)] md:h-[calc(100%-64px)] overflow-y-scroll md:overflow-auto`}>
            <VacuumResults
              className="flex flex-wrap gap-4 md:gap-0 px-0! md:px-4!"
              linkClassname="md:basis-1/2 lg:basis-1/3 dark:border shadow-sm"
              containerWidth={vacuumResultsWidth}
              results={vacuums}
              fetchMoreComponent={fetchMoreComponent}
            />
          </div>
        </div>
      </div>
      <EmailCapturePopup />

      <Outlet />
    </>
  );
}
