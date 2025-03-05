import { z } from "zod";

import { VacuumForm, VacuumFormInterface } from "./vacuum-form";
import { VacuumResults } from "./vacuum-results";
import { FloorType } from "../types";
import { useDatabase } from "../database/hooks";
import { useSiteConfig } from "../providers/site-config";
import { useAppForm } from "./form";
import { useEffect, useRef } from "react";
import { useStore } from "@tanstack/react-form";
import { useWindowWidth } from "../hooks/use-window-width";
import { twMerge } from "tailwind-merge";
import { useAppDispatch } from "../redux";
import { replaceState } from "../redux/vacuum-filters-reducer";

export function VacuumWizard({ className = "" }: { className?: string }) {
  const windowWidth = useWindowWidth();
  const { navHeight } = useSiteConfig();
  const { filterVacuumsMutation } = useDatabase();
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
    },
    validators: {
      onChange: z.object({
        floorType: z.nativeEnum(FloorType),
        budget: z.number().int().min(100),
        houseSizeSqM: z.number().int().min(5),
        numRooms: z.number().int().min(1),
        numPets: z.number().int().min(0),
        mopFunction: z.boolean(),
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

  useEffect(() => {
    form.handleSubmit();
  }, [form]);

  const filtersContainerWidth = filtersContainerRef.current?.clientWidth ?? 300;
  const vacuumResultsWidth = Math.min(windowWidth - (filtersContainerWidth + 64), 868);

  return (
    <div
      className={twMerge(`flex flex-col-reverse justify-between  sm:flex-row sm:justify-normal`, className)}
      style={{
        height: `calc(100vh - ${navHeight + 16}px)`,
      }}
    >
      <div
        className="grow pt-4 sm:pt-0 bg-white dark:bg-background/80 border border-border sm:rounded-tl-lg sm:rounded-bl-lg"
        ref={filtersContainerRef}
      >
        <div className="hidden sm:block p-4 pb-0">
          <h2 className="text-lg font-bold text-secondary">Refine your search</h2>
        </div>

        <VacuumForm form={form as unknown as VacuumFormInterface} />
      </div>

      <div className="h-[99%] sm:w-3/4 sm:h-full overflow-y-scroll py-4 sm:rounded-tr-lg sm:rounded-br-lg sm:p-4 pt-0 dark:bg-background-alt">
        <div className="p-4 pb-0 sm:p-0">
          <h2 className="text-lg font-bold text-secondary mb-4">Recommended Vacuums</h2>
        </div>
        <VacuumResults
          containerWidth={vacuumResultsWidth}
          filters={filters}
          results={filterVacuumsMutation.data ?? []}
        />
      </div>
    </div>
  );
}
