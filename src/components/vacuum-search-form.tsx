import { useMemo, useState } from "react";
import { BiRuler, BiWallet } from "react-icons/bi";
import { LuDoorOpen } from "react-icons/lu";
import { MdPets } from "react-icons/md";
import { GiSoap, GiVacuumCleaner } from "react-icons/gi";

import { CurrencySymbolMapping, FloorType, VacuumsFilter } from "../types";
import { AppFieldExtendedReactFormApi, formInit } from "./form";
import { Button } from "@headlessui/react";
import { AnyFormApi, FormValidateOrFn, useStore } from "@tanstack/react-form";
import { useSiteConfig } from "../providers/site-config";
import { CiEdit } from "react-icons/ci";
import { Modal } from "./modal";
import { IoFilterOutline } from "react-icons/io5";

export type VacuumSearchFormInterface = AppFieldExtendedReactFormApi<
  VacuumsFilter,
  FormValidateOrFn<VacuumsFilter> | undefined,
  FormValidateOrFn<VacuumsFilter> | undefined,
  FormValidateOrFn<VacuumsFilter> | undefined,
  FormValidateOrFn<VacuumsFilter> | undefined,
  FormValidateOrFn<VacuumsFilter> | undefined,
  FormValidateOrFn<VacuumsFilter> | undefined,
  FormValidateOrFn<VacuumsFilter> | undefined,
  FormValidateOrFn<VacuumsFilter> | undefined,
  FormValidateOrFn<VacuumsFilter> | undefined,
  typeof formInit.fieldComponents,
  typeof formInit.formComponents
>;

interface VacuumSearchFormProps {
  form: VacuumSearchFormInterface;
}

export function VacuumSearchForm({ form }: VacuumSearchFormProps) {
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
    <div className="space-y-6 hidden md:block">
      {simpleFilters}
      <form.AppForm>
        <form.FormSubmitButton>Find Vacuums</form.FormSubmitButton>
      </form.AppForm>
    </div>
  );

  const mobileFilters = (
    <MobileFiltersDialog className="block md:hidden" form={form}>
      <div className="flex flex-col gap-4">{simpleFilters}</div>
    </MobileFiltersDialog>
  );

  return (
    <form
      className="px-4 py-2 md:p-4 flex flex-col gap-4"
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
      <p className="text-sm font-semibold flex items-center gap-2">
        <IoFilterOutline className="inline w-5 h-5" />
        Filters
      </p>
      <Button onClick={open} className="px-0! py-2! text-start outline-0! focus:outline-0! opacity-70 text-sm!">
        {filtersDisplay} <CiEdit className="inline w-5 h-5" />
      </Button>

      <Modal
        title="Refine your vacuum search"
        isOpen={isOpen}
        close={close}
        panelClassName="justify-between"
        childrenClassName="space-y-6"
      >
        {children}

        <Button
          className="ml-auto bg-background/90!"
          type="button"
          onClick={() => {
            close();
            form.handleSubmit();
          }}
        >
          Find Vacuums
        </Button>
      </Modal>
    </div>
  );
};
