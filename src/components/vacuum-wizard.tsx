import { z } from "zod";

import { VacuumSearchForm, VacuumSearchFormInterface } from "./vacuum-search-form";
import { VacuumResults } from "./vacuum-results";
import { Currency, FloorType, Region } from "../types";
import { useSiteConfig } from "../providers/site-config";
import { useAppForm } from "./form";
import { useEffect, useRef } from "react";
import { useStore } from "@tanstack/react-form";
import { useWindowWidth } from "../hooks/use-window-width";
import { twMerge } from "tailwind-merge";
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
      budget: 1000,
      houseSizeSqM: 32,
      numRooms: 3,
      numPets: 0,
      mopFunction: false,
      region,
      currency,
    },
    validators: {
      onChange: z.object({
        floorType: z.nativeEnum(FloorType),
        budget: z.number().int().min(100),
        houseSizeSqM: z.number().int().min(5),
        numRooms: z.number().int().min(1),
        numPets: z.number().int().min(0),
        mopFunction: z.boolean(),
        region: z.nativeEnum(Region),
        currency: z.nativeEnum(Currency),
      }),
    },
    onSubmit: ({ value }) => {
      dispatch(
        replaceState({
          value: value,
        })
      );
      filterVacuumsMutation.mutate(value);
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
