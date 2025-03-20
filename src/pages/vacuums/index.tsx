import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Outlet } from "react-router";
import { Helmet } from "react-helmet";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { useWindowWidth } from "../../hooks/use-window-width";
import { useSiteConfig } from "../../providers/site-config";
import { replaceState } from "../../redux/vacuum-filters-reducer";
import { useInfiniteQueryFetcher, useSearchVacuumsInfinite } from "../../database/hooks";
import { useAppDispatch, useAppSelector } from "../../redux";
import { VacuumSearchForm } from "../../components/vacuum-search-form";
import { VacuumResults } from "../../components/vacuum-results";
import { VacuumsFilters } from "../../types";
import { markAllValuesAsDefined } from "../../shared-utils/object";
import { useContentScroll } from "../../hooks/use-disable-body-scroll";
import { FormSelectField } from "../../components/form-components";
import { twMerge } from "tailwind-merge";

interface SortingBarProps {
  onSortChange: (sort: string, order: string) => void;
  sortValue: string;
  className?: string;
}
const SortingBar = ({ sortValue, className, onSortChange }: SortingBarProps) => {
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
    <div className={twMerge("flex justify-between items-center py-4 md:px-4 border-b border-border", className)}>
      <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
};

export function VacuumSearchPage() {
  const windowWidth = useWindowWidth();
  useContentScroll(false);

  const { navHeight, region, currency } = useSiteConfig();
  const sharedFilters = useAppSelector((state) => state.vacuumsFilters);
  const filtersContainerRef = useRef<HTMLDivElement>(null);
  const form = useForm<VacuumsFilters>({
    defaultValues: sharedFilters,
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

  const dispatch = useAppDispatch();

  const { handleSubmit, setValue, reset } = form;

  useEffect(() => {
    setValue("currency", currency);
  }, [currency, setValue]);
  useEffect(() => {
    setValue("region", region);
  }, [region, setValue]);

  const definedFilters = useMemo(() => markAllValuesAsDefined<VacuumsFilters>(filters), [filters]);

  // sync form with redux to share filters with :vacuum page
  useEffect(() => {
    dispatch(replaceState({ value: definedFilters }));
  }, [dispatch, definedFilters]);

  const resetFilters = useCallback(() => {
    reset();
  }, [reset]);

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
      <Helmet>
        <title>Robot Vacuum Finder</title>
        <meta name="description" content="Find the best robot vacuum for your needs with our vacuum finder tool." />
      </Helmet>

      <div
        className={`flex flex-col justify-between md:flex-row md:justify-normal md:mx-auto md:max-w-[1280px] px-4 md:pt-2 h-[calc(100svh-162px)] md:h-[calc(100svh-76px)] relative`}
      >
        <div
          className="fixed left-0 right-0 bottom-0 md:relative grow bg-background-alt border border-border md:border-r-0 md:rounded-tl-lg md:rounded-bl-lg md:h-full md:min-w-1/4 md:max-w-1/4"
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
                })();
              }}
              resetFilters={resetFilters}
            />
          </FormProvider>
        </div>

        <div className="flex flex-col md:border md:border-border md:w-3/4 py-4 pb-8 md:pb-4 md:rounded-tr-lg md:rounded-br-lg md:p-0 pt-0 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between md:px-4 relative">
            <p className="text-sm md:absolute">
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
              linkClassname="md:basis-1/2 lg:basis-1/3"
              containerWidth={vacuumResultsWidth}
              results={vacuums}
              fetchMoreComponent={fetchMoreComponent}
            />
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
