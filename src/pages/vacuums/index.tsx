import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Outlet } from "react-router";
import { Helmet } from "react-helmet";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { useWindowWidth } from "../../hooks/use-window-width";
import { useSiteConfig } from "../../providers/site-config";
import { initialSearchFiltersState, replaceState } from "../../redux/vacuum-filters-reducer";
import { useInfiniteQueryFetcher, useSearchVacuumsInfinite } from "../../database/hooks";
import { useAppDispatch, useAppSelector } from "../../redux";
import { VacuumSearchForm } from "../../components/vacuum-search-form";
import { VacuumResults } from "../../components/vacuum-results";
import { VacuumsFilters } from "../../types";
import { markAllValuesAsDefined } from "../../shared-utils/object";
import { useContentScroll } from "../../hooks/use-disable-body-scroll";

export function VacuumSearchPage() {
  const windowWidth = useWindowWidth();
  useContentScroll(false);

  const { navHeight, region, currency } = useSiteConfig();
  const sharedFilters = useAppSelector((state) => state.vacuumsFilters);
  const filtersContainerRef = useRef<HTMLDivElement>(null);
  const form = useForm<VacuumsFilters>({
    defaultValues: sharedFilters,
  });
  const [currentFilters, setCurrentFilters] = useState<VacuumsFilters>(sharedFilters);
  const filters = useWatch({ control: form.control });
  const searchVacuumsQuery = useSearchVacuumsInfinite({
    filters: currentFilters,
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
    setCurrentFilters((prev) => ({ ...prev, currency }));
  }, [currency, setValue]);
  useEffect(() => {
    setValue("region", region);
    setCurrentFilters((prev) => ({ ...prev, region }));
  }, [region, setValue]);

  const definedFilters = useMemo(() => markAllValuesAsDefined<VacuumsFilters>(filters), [filters]);

  // sync form with redux to share filters with :vacuum page
  useEffect(() => {
    dispatch(replaceState({ value: definedFilters }));
  }, [dispatch, definedFilters]);

  const resetFilters = useCallback(() => {
    setCurrentFilters(initialSearchFiltersState);
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
        className={`flex flex-col justify-between md:flex-row md:justify-normal md:mx-auto md:max-w-[1280px] px-4 pt-2 h-[calc(100svh-162px)] md:h-[calc(100svh-76px)] relative`}
      >
        <div
          className="fixed left-0 right-0 bottom-0 md:relative grow bg-background-alt border border-border md:border-r-0 md:rounded-tl-lg md:rounded-bl-lg md:h-full"
          ref={filtersContainerRef}
        >
          <div className="hidden md:block p-4 pb-0">
            <h2 className="text-lg font-bold text-secondary">Refine your search</h2>
          </div>

          <FormProvider {...form}>
            <VacuumSearchForm
              form={form}
              navHeight={navHeight}
              filtersContainerHeight={filtersContainerHeight}
              handleSubmit={() => {
                handleSubmit(() => {
                  setCurrentFilters(definedFilters);
                })();
              }}
              resetFilters={resetFilters}
            />
          </FormProvider>
        </div>

        <div
          className={`md:border md:border-border md:w-3/4 overflow-y-scroll md:overflow-auto py-4 pb-8 md:pb-4 md:rounded-tr-lg md:rounded-br-lg md:p-4 pt-0`}
        >
          <VacuumResults
            className="flex flex-wrap gap-4 md:gap-0"
            linkClassname="md:basis-1/2 lg:basis-1/3"
            containerWidth={vacuumResultsWidth}
            results={vacuums}
            fetchMoreComponent={fetchMoreComponent}
          />
        </div>
      </div>
      <Outlet />
    </>
  );
}
