import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { BiRuler, BiWallet } from "react-icons/bi";
import { LuDoorOpen } from "react-icons/lu";
import { MdPets } from "react-icons/md";
import { GiSoap, GiVacuumCleaner } from "react-icons/gi";

import { CurrencySymbolMapping, FloorType, VacuumsFilter } from "../types";
import { useAppForm } from "./form";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";
import { AnyFormApi, useStore } from "@tanstack/react-form";
import { useSiteConfig } from "../providers/site-config";
import { CiEdit } from "react-icons/ci";

interface VacuumFormProps {
  onSubmit: (formData: VacuumsFilter) => void;
}

export function VacuumForm({ onSubmit }: VacuumFormProps) {
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
      onSubmit(value);
    },
  });

  useEffect(() => {
    form.handleSubmit();
  }, [form]);

  const simpleFilters = useMemo(
    () => (
      <>
        <form.AppField
          name="floorType"
          children={(field) => (
            <field.FormSelectField
              label="Floor Type"
              icon={<GiVacuumCleaner className="w-4 h-4 text-primary" />}
              options={Object.values(FloorType)}
              selectedOption={field.state.value}
              onChange={(value) => field.setValue(value)}
            />
          )}
        />

        <form.AppField
          name="budget"
          children={(field) => (
            <field.FormTextField
              type="number"
              label="Budget"
              icon={<BiWallet className="w-4 h-4 text-primary" />}
              value={field.state.value}
              onChange={(value) => field.setValue(value as number)}
            />
          )}
        />

        <form.AppField
          name="houseSizeSqM"
          children={(field) => (
            <field.FormTextField
              type="number"
              label="Living area (sqm)"
              icon={<BiRuler className="w-4 h-4 text-primary" />}
              value={field.state.value}
              onChange={(value) => field.setValue(value as number)}
            />
          )}
        />

        <form.AppField
          name="numRooms"
          children={(field) => (
            <field.FormTextField
              type="number"
              label="Number of Rooms"
              icon={<LuDoorOpen className="w-4 h-4 text-primary" />}
              value={field.state.value}
              onChange={(value) => field.setValue(value as number)}
            />
          )}
        />

        <form.AppField
          name="numPets"
          children={(field) => (
            <field.FormTextField
              type="number"
              label="Number of pets"
              icon={<MdPets className="w-4 h-4 text-primary" />}
              value={field.state.value}
              onChange={(value) => field.setValue(value as number)}
            />
          )}
        />

        <form.AppField
          name="mopFunction"
          children={(field) => (
            <field.FormToggleField
              label="Mop feature"
              icon={<GiSoap className="w-4 h-4 text-primary" />}
              checked={field.state.value}
              onChange={(value) => field.setValue(value)}
            />
          )}
        />
      </>
    ),
    [form]
  );

  const desktopFilters = (
    <div className="space-y-6 hidden sm:block">
      {simpleFilters}
      <form.AppForm>
        <form.FormSubmitButton>Find Vacuums</form.FormSubmitButton>
      </form.AppForm>
    </div>
  );

  const mobileFilters = (
    <MobileFiltersDialog className="block sm:hidden" form={form}>
      <div className="flex flex-col gap-4">{simpleFilters}</div>
    </MobileFiltersDialog>
  );

  return (
    <form
      className="p-4 flex flex-col gap-4 bg-background"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {desktopFilters}
      {mobileFilters}
    </form>
  );
}

const MobileFiltersDialog = ({
  className = "",
  form,
  children,
}: {
  className?: string;
  form: AnyFormApi;
  children: React.ReactNode;
}) => {
  const { currency } = useSiteConfig();
  const [isOpen, setIsOpen] = useState(false);

  const formValues = useStore(form.store, (s) => s.values as VacuumsFilter);

  const filtersDisplay = Object.entries(formValues).reduce((acc, filter) => {
    const filterName = filter[0];
    let filterValue = filter[1];

    switch (filterName) {
      case "floorType":
        filterValue += " floor";
        break;
      case "budget":
        filterValue = `${CurrencySymbolMapping[currency]}${filterValue}`;
        break;
      case "houseSizeSqM":
        filterValue += "sqm";
        break;
      case "numRooms":
        filterValue += " rooms";
        break;
      case "numPets":
        filterValue += " pets";
        break;
      case "mopFunction": {
        const transformedValue = filterValue ? "with mop" : "without mop";
        filterValue = transformedValue;
        break;
      }
      default:
        break;
    }

    return acc + `${acc.length ? ", " : ""}${filterValue}`;
  }, "");

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <div className={className}>
      <p className="text-lg font-semibold">Filters</p>
      <Button onClick={open} className="px-0! py-2! text-start outline-0! focus:outline-0!">
        {filtersDisplay} <CiEdit className="inline w-5 h-5" />
      </Button>

      <Dialog open={isOpen} onClose={close} className="fixed inset-0 z-50">
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/50 transition-all">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              className="w-full flex flex-col max-w-md rounded-lg bg-background-alt p-4 space-y-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
              transition
            >
              <DialogTitle as="h3">
                <span className="font-semibold">Refine your vacuum search</span>
                <Button onClick={close} className="absolute top-2 right-2 bg-transparent!">
                  <IoMdClose className="w-6 h-6" />
                </Button>
              </DialogTitle>

              {children}

              <Button
                className="ml-auto"
                type="button"
                onClick={() => {
                  close();
                  form.handleSubmit();
                }}
              >
                Find Vacuums
              </Button>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
