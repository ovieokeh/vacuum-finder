import { useEffect, useMemo, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { useWindowWidth } from "../../hooks/use-window-width";
import { useSiteConfig } from "../../providers/site-config";
import { replaceState } from "../../redux/vacuum-filters-reducer";
import { useSearchVacuums } from "../../database/hooks";
import { useAppDispatch } from "../../redux";
import { VacuumSearchForm } from "../../components/vacuum-search-form";
import { VacuumResults } from "../../components/vacuum-results";
import { VacuumsFilters } from "../../types";

export function VacuumSearchPage() {
  const windowWidth = useWindowWidth();
  const { navHeight, region, currency } = useSiteConfig();
  const filtersContainerRef = useRef<HTMLDivElement>(null);
  const form = useForm<VacuumsFilters>({
    defaultValues: {
      budget: 10000,
      numPets: 0,
      mopFunction: false,
      region,
      currency,

      brand: "",
      mappingTechnology: "laser" as const,
      minBatteryLifeInMinutes: 60,
      minSuctionPowerInPascals: 2000,
      maxNoiseLevelInDecibels: 70,
      minWaterTankCapacityInLiters: 0,
      minDustbinCapacityInLiters: 0,
      hasMoppingFeature: false,
      hasSelfEmptyingFeature: false,
      hasZoneCleaningFeature: false,
      hasMultiFloorMappingFeature: false,
      hasVirtualWallsFeature: false,
      hasSmartHomeIntegration: false,
      hasAppControl: false,
      hasRemoteControl: false,
      hasManualControl: false,
    },
  });

  const filters = useWatch({ control: form.control });
  const searchVacuumsQuery = useSearchVacuums(filters);
  const { refetch } = searchVacuumsQuery;
  const searchVacuums = useMemo(() => searchVacuumsQuery.data, [searchVacuumsQuery.data]);

  const isLoading = searchVacuumsQuery.isLoading;
  console.log({ isLoading });

  const dispatch = useAppDispatch();

  const { handleSubmit, setValue } = form;

  useEffect(() => {
    refetch();
  }, [refetch, currency, region]);

  useEffect(() => {
    setValue("currency", currency);
  }, [currency, setValue]);
  useEffect(() => {
    setValue("region", region);
  }, [region, setValue]);

  // sync form with redux
  useEffect(() => {
    dispatch(replaceState({ value: filters }));
  }, [dispatch, filters]);

  const filtersContainerWidth = filtersContainerRef.current?.clientWidth ?? 300;
  const vacuumResultsWidth = Math.min(windowWidth - (filtersContainerWidth + 64), 868);

  return (
    <>
      <Helmet>
        <title>Robot Vacuum Finder</title>
        <meta name="description" content="Find the best robot vacuum for your needs with our vacuum finder tool." />
      </Helmet>

      <div
        className="flex flex-col-reverse justify-between md:flex-row md:justify-normal md:mx-auto md:max-w-[1240px] p-4"
        style={{
          height: `calc(100% - ${navHeight + 16}px)`,
        }}
      >
        <div
          className="fixed left-0 right-0 bottom-0 md:relative grow bg-background-alt border border-border md:rounded-tl-lg md:rounded-bl-lg"
          ref={filtersContainerRef}
        >
          <div className="hidden md:block p-4 pb-0">
            <h2 className="text-lg font-bold text-secondary">Refine your search</h2>
          </div>

          <FormProvider {...form}>
            <VacuumSearchForm
              form={form}
              handleSubmit={() => {
                handleSubmit(() => {
                  refetch();
                })();
              }}
            />
          </FormProvider>
        </div>

        <div className="md:border md:border-border md:border-l-0 md:w-3/4 md:h-full overflow-y-scroll md:overflow-auto py-4 pb-8 md:pb-4 md:rounded-tr-lg md:rounded-br-lg md:p-4 pt-0">
          <VacuumResults containerWidth={vacuumResultsWidth} filters={filters} results={searchVacuums?.results} />
        </div>
      </div>
      <Outlet />
    </>
  );
}
