import { useMemo, useState } from "react";
import { BiWallet } from "react-icons/bi";
import { MdPets } from "react-icons/md";
import { GiSoap } from "react-icons/gi";
import { CiEdit } from "react-icons/ci";
import { IoFilterOutline } from "react-icons/io5";
import { Button } from "@headlessui/react";
import { AnyFormApi, FormValidateOrFn, useStore } from "@tanstack/react-form";
import { useSiteConfig } from "../providers/site-config";
import { CurrencySymbolMapping, VacuumMappingTechnology, VacuumsFilter } from "../types";
import { AppFieldExtendedReactFormApi, formInit } from "./form";
import { Modal } from "./modal";
import { useVacuumBrandsQuery } from "../database/hooks";

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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const brandsQuery = useVacuumBrandsQuery();
  const brands = brandsQuery.data;

  // --- Simple Filters ---
  const simpleFilters = useMemo(
    () => (
      <>
        <form.AppField
          name="brand"
          children={(field) => (
            <field.FormSelectField
              label="Brand"
              selectedOption={field.state.value}
              options={brands?.brands || []}
              onChange={(value) => field.setValue(value)}
            />
          )}
        />

        <form.AppField
          name="budget"
          children={(field) => (
            <field.FormTextField
              name="budget"
              type="number"
              label="Budget"
              icon={<BiWallet className="w-4 h-4 text-primary" />}
              value={field.state.value}
              onChange={(value) => field.setValue(value as number)}
              formErrors={form.getAllErrors().form.errors}
            />
          )}
        />

        <form.AppField
          name="mappingTechnology"
          children={(field) => (
            <field.FormSelectField
              label="Mapping Technology"
              selectedOption={field.state.value}
              options={Object.values(VacuumMappingTechnology)}
              onChange={(value) => field.setValue(value)}
            />
          )}
        />

        <form.AppField
          name="numPets"
          children={(field) => (
            <field.FormTextField
              name="numPets"
              type="number"
              label="Number of pets"
              icon={<MdPets className="w-4 h-4 text-primary" />}
              value={field.state.value}
              onChange={(value) => field.setValue(value as number)}
              formErrors={form.getAllErrors().form.errors}
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
    [form, brands?.brands]
  );

  // --- Advanced Filters (all keys from VacuumBase) ---
  const advancedFilters = useMemo(
    () => (
      <div className="mt-4 grid grid-cols-1 gap-4">
        <form.AppField
          name="minBatteryLifeInMinutes"
          children={(field) => (
            <field.FormTextField
              name="minBatteryLifeInMinutes"
              type="number"
              label="Min Battery Life (minutes)"
              value={field.state.value}
              onChange={(value) => field.setValue(value as number)}
              formErrors={form.getAllErrors().form.errors}
            />
          )}
        />
        <form.AppField
          name="minSuctionPowerInPascals"
          children={(field) => (
            <field.FormTextField
              name="minSuctionPowerInPascals"
              type="number"
              label="Min Suction Power (Pascals)"
              value={field.state.value}
              onChange={(value) => field.setValue(value as number)}
              formErrors={form.getAllErrors().form.errors}
            />
          )}
        />
        <form.AppField
          name="maxNoiseLevelInDecibels"
          children={(field) => (
            <field.FormTextField
              name="maxNoiseLevelInDecibels"
              type="number"
              label="Max Noise Level (dB)"
              value={field.state.value}
              onChange={(value) => field.setValue(value as number)}
              formErrors={form.getAllErrors().form.errors}
            />
          )}
        />
        <form.AppField
          name="minWaterTankCapacityInLiters"
          children={(field) => (
            <field.FormTextField
              name="minWaterTankCapacityInLiters"
              type="number"
              label="Min Water Tank Capacity (liters)"
              value={field.state.value}
              onChange={(value) => field.setValue(value as number)}
              formErrors={form.getAllErrors().form.errors}
            />
          )}
        />
        <form.AppField
          name="minDustbinCapacityInLiters"
          children={(field) => (
            <field.FormTextField
              name="minDustbinCapacityInLiters"
              type="number"
              label="Min Dustbin Capacity (liters)"
              value={field.state.value}
              onChange={(value) => field.setValue(value as number)}
              formErrors={form.getAllErrors().form.errors}
            />
          )}
        />
        <form.AppField
          name="hasSelfEmptyingFeature"
          children={(field) => (
            <field.FormToggleField
              label="Self-emptying"
              checked={field.state.value}
              onChange={(value) => field.setValue(value)}
            />
          )}
        />
        <form.AppField
          name="hasZoneCleaningFeature"
          children={(field) => (
            <field.FormToggleField
              label="Zone cleaning"
              checked={field.state.value}
              onChange={(value) => field.setValue(value)}
            />
          )}
        />
        <form.AppField
          name="hasMultiFloorMappingFeature"
          children={(field) => (
            <field.FormToggleField
              label="Multi-floor mapping"
              checked={field.state.value}
              onChange={(value) => field.setValue(value)}
            />
          )}
        />
        <form.AppField
          name="hasCarpetBoostFeature"
          children={(field) => (
            <field.FormToggleField
              label="Carpet boost"
              checked={field.state.value}
              onChange={(value) => field.setValue(value)}
            />
          )}
        />
        <form.AppField
          name="hasVirtualWallsFeature"
          children={(field) => (
            <field.FormToggleField
              label="Virtual walls"
              checked={field.state.value}
              onChange={(value) => field.setValue(value)}
            />
          )}
        />
        <form.AppField
          name="hasSmartHomeIntegration"
          children={(field) => (
            <field.FormToggleField
              label="Smart home integration"
              checked={field.state.value}
              onChange={(value) => field.setValue(value)}
            />
          )}
        />
        <form.AppField
          name="hasVoiceControl"
          children={(field) => (
            <field.FormToggleField
              label="Voice control"
              checked={field.state.value}
              onChange={(value) => field.setValue(value)}
            />
          )}
        />
        <form.AppField
          name="hasAppControl"
          children={(field) => (
            <field.FormToggleField
              label="App control"
              checked={field.state.value}
              onChange={(value) => field.setValue(value)}
            />
          )}
        />
        <form.AppField
          name="hasRemoteControl"
          children={(field) => (
            <field.FormToggleField
              label="Remote control"
              checked={field.state.value}
              onChange={(value) => field.setValue(value)}
            />
          )}
        />
        <form.AppField
          name="hasManualControl"
          children={(field) => (
            <field.FormToggleField
              label="Manual control"
              checked={field.state.value}
              onChange={(value) => field.setValue(value)}
            />
          )}
        />
      </div>
    ),
    [form]
  );

  // --- Desktop & Mobile Filters ---
  const desktopFilters = (
    <div className="hidden md:block">
      <div className="h-[69vh] overflow-y-scroll space-y-2">
        {simpleFilters}
        <Button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="my-4 p-0! text-sm text-primary underline"
        >
          {showAdvanced ? "Hide Advanced Filters" : "Show Advanced Filters"}
        </Button>
        {showAdvanced && advancedFilters}
      </div>
      <form.AppForm>
        <Button
          type="button"
          onClick={() => form.handleSubmit()}
          className="w-full bg-background border! border-border!"
        >
          Find Vacuums
        </Button>
      </form.AppForm>
    </div>
  );

  const mobileFilters = (
    <MobileFiltersDialog className="block md:hidden" form={form}>
      <div className="flex flex-col gap-4">
        {simpleFilters}
        <Button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="text-sm text-primary underline"
        >
          {showAdvanced ? "Hide Advanced Filters" : "Show Advanced Filters"}
        </Button>
        {showAdvanced && advancedFilters}
      </div>
    </MobileFiltersDialog>
  );

  const formErrors = form.getAllErrors().form.errors;
  if (formErrors.length) {
    console.log("Form errors", formErrors);
  }

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

  const filtersDisplay = Object.entries(formValues).reduce((acc, [key, value]) => {
    let displayValue = "";
    switch (key) {
      case "floorType":
        displayValue = `${value} floor`;
        break;
      case "budget":
        displayValue = `${CurrencySymbolMapping[currency]}${value}`;
        break;
      case "houseSizeSqM":
        displayValue = `${value}sqm`;
        break;
      case "numRooms":
        displayValue = `${value} rooms`;
        break;
      case "numPets":
        displayValue = `${value} pets`;
        break;
      case "mopFunction":
        displayValue = value ? "with mop" : "without mop";
        break;
      case "brand":
        if (value) {
          displayValue = `Brand: ${value}`;
        }
        break;
      case "mappingTechnology":
        if (value) {
          displayValue = `Mapping: ${value}`;
        }
        break;
      case "minBatteryLifeInMinutes":
        if (value) {
          displayValue = `Battery life: ${value} minutes`;
        }
        break;

      default:
        break;
    }
    return acc + `${acc.length && displayValue ? ", " : ""}${displayValue}`;
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
          className="w-full bg-background border! border-border!"
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
