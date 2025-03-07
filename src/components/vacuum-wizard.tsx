import { useEffect, useRef } from "react";
import { useStore } from "@tanstack/react-form";
import { twMerge } from "tailwind-merge";

import { VacuumSearchForm, VacuumSearchFormInterface } from "./vacuum-search-form";
import { VacuumResults } from "./vacuum-results";
import { Currency, FloorType, Region, VacuumMappingTechnology, VacuumsFilter } from "../types";
import { useSiteConfig } from "../providers/site-config";
import { useAppForm } from "./form";
import { useWindowWidth } from "../hooks/use-window-width";
import { useAppDispatch } from "../redux";
import { replaceState } from "../redux/vacuum-filters-reducer";
import { useFilterVacuumsMutation } from "../database/hooks";

export function VacuumWizard({ className = "" }: { className?: string }) {
  const windowWidth = useWindowWidth();
  const { navHeight, region, currency } = useSiteConfig();
  const filterVacuumsMutation = useFilterVacuumsMutation({});
  const filtersContainerRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  const form = useAppForm({
    defaultValues: {
      floorType: FloorType.Hardwood,
      budget: 10000,
      houseSizeSqM: 32,
      numRooms: 3,
      numPets: 0,
      mopFunction: false,
      region,
      currency,

      brand: "",
      mappingTechnology: VacuumMappingTechnology.Laser,
      minBatteryLifeInMinutes: 60,
      minSuctionPowerInPascals: 2000,
      maxNoiseLevelInDecibels: 70,
      minWaterTankCapacityInLiters: 0,
      minDustbinCapacityInLiters: 0,
      hasMoppingFeature: false,
      hasSelfEmptyingFeature: false,
      hasZoneCleaningFeature: false,
      hasMultiFloorMappingFeature: false,
      hasCarpetBoostFeature: false,
      hasVirtualWallsFeature: false,
      hasSmartHomeIntegration: false,
      hasVoiceControl: false,
      hasAppControl: false,
      hasRemoteControl: false,
      hasManualControl: false,
    },
    validators: {
      onChange: ({ value }) => {
        const entries = Object.entries(value);
        const errors: Record<string, string> = {};

        for (const [key, val] of entries) {
          switch (key) {
            case "floorType": {
              if (!Object.values(FloorType).includes(val as FloorType)) {
                errors[key] = "Invalid floor type";
              }
              break;
            }

            case "budget": {
              const parsed = parseInt(val as string, 10);
              if (isNaN(parsed) || parsed < 100) {
                errors[key] = "Invalid budget";
              }

              break;
            }

            case "houseSizeSqM": {
              const parsed = parseInt(val as string, 10);
              if (isNaN(parsed) || parsed < 5) {
                errors[key] = "Invalid house size";
              }
              break;
            }

            case "numRooms": {
              const parsed = parseInt(val as string, 10);
              if (isNaN(parsed) || parsed < 1) {
                errors[key] = "Invalid number of rooms";
              }
              break;
            }

            case "numPets": {
              const parsed = parseInt(val as string, 10);
              if (isNaN(parsed) || parsed < 0) {
                errors[key] = "Invalid number of pets";
              }
              break;
            }

            case "mopFunction": {
              if (typeof val !== "boolean") {
                errors[key] = "Invalid mop function";
              }
              break;
            }

            case "region":
              if (!Object.values(Region).includes(val as Region)) {
                errors[key] = "Invalid region";
              }
              break;

            case "currency":
              if (!Object.values(Currency).includes(val as Currency)) {
                errors[key] = "Invalid currency";
              }
              break;

            default:
              break;
          }
        }
      },
    },
    onSubmit: ({ value }) => {
      dispatch(
        replaceState({
          value: value,
        })
      );

      // remove all false or 0 values
      const entries = Object.entries(value);
      const filteredEntries = entries.filter(([, val]) => val !== false && val !== 0);
      const filteredValue = Object.fromEntries(filteredEntries) as unknown as VacuumsFilter;

      filterVacuumsMutation.mutate(filteredValue);
    },
  });

  const filters = useStore(form.store, (state) => state.values);

  const handleSubmit = form.handleSubmit;
  useEffect(() => {
    handleSubmit();
  }, [handleSubmit]);

  const setFieldValue = form.setFieldValue;
  useEffect(() => {
    setFieldValue("currency", currency);
    setTimeout(() => {
      handleSubmit();
    }, 0);
  }, [currency, setFieldValue, handleSubmit]);
  useEffect(() => {
    setFieldValue("region", region);
    setTimeout(() => {
      handleSubmit();
    }, 0);
  }, [region, setFieldValue, handleSubmit]);

  // sync form with redux
  const vacuumFilters = useStore(form.store, (s) => s.values);
  useEffect(() => {
    dispatch(replaceState({ value: vacuumFilters }));
  }, [dispatch, vacuumFilters]);

  const filtersContainerWidth = filtersContainerRef.current?.clientWidth ?? 300;
  const vacuumResultsWidth = Math.min(windowWidth - (filtersContainerWidth + 64), 868);

  return (
    <div
      className={twMerge(`flex flex-col-reverse justify-between  md:flex-row md:justify-normal`, className)}
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

        <VacuumSearchForm form={form as unknown as VacuumSearchFormInterface} />
      </div>

      <div className="md:border md:border-border md:border-l-0 md:w-3/4 md:h-full overflow-y-scroll md:overflow-auto py-4 pb-24 md:pb-4 md:rounded-tr-lg md:rounded-br-lg md:p-4 pt-0">
        <VacuumResults containerWidth={vacuumResultsWidth} filters={filters} results={filterVacuumsMutation.data} />
      </div>
    </div>
  );
}
