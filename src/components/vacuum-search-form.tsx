import { useCallback, useMemo, useState } from "react";
import { Controller, FormProvider, UseFormReturn, useWatch } from "react-hook-form";
import { Button, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { BiChevronDown, BiWallet } from "react-icons/bi";
import { MdPets } from "react-icons/md";
import { GiSoap } from "react-icons/gi";
import { CiEdit } from "react-icons/ci";
import { IoFilterOutline } from "react-icons/io5";

import { useSiteConfig } from "../providers/site-config";
import { CurrencySymbolMapping, VacuumsFilters } from "../types";
import { Modal } from "./modal";
import { useListBrands } from "../database/hooks";
import { FormSelectField, FormTextField, FormToggleField } from "./form-components";

interface VacuumSearchFormProps {
  form: UseFormReturn<VacuumsFilters>;
  filtersContainerHeight?: number;
  navHeight?: number;
  handleSubmit: () => void;
  resetFilters: () => void;
}

export function VacuumSearchForm({
  form,
  filtersContainerHeight = 0,
  navHeight = 0,
  handleSubmit,
  resetFilters,
}: VacuumSearchFormProps) {
  const brandsQuery = useListBrands();
  const brands = brandsQuery.data;
  const isFormDirty = form.formState.isDirty;

  const simpleFilters = useMemo(
    () => (
      <>
        <Controller
          name="brand"
          render={({ field, fieldState }) => (
            <FormSelectField label="Brand" options={brands || []} state={fieldState} {...field} />
          )}
        />

        <Controller
          name="budget"
          render={({ field, fieldState }) => (
            <FormTextField
              type="number"
              label="Budget"
              labelIcon={<BiWallet className="w-4 h-4 text-primary" />}
              state={fieldState}
              {...field}
            />
          )}
        />

        <Controller
          name="mappingTechnology"
          render={({ field, fieldState }) => (
            <FormSelectField label="Mapping Technology" options={["laser", "camera"]} state={fieldState} {...field} />
          )}
        />

        <Controller
          name="numPets"
          render={({ field, fieldState }) => (
            <FormTextField
              type="number"
              label="Number of pets"
              labelIcon={<MdPets className="w-4 h-4 text-primary" />}
              state={fieldState}
              {...field}
            />
          )}
        />

        <Controller
          name="hasMoppingFeature"
          render={({ field, fieldState }) => (
            <FormToggleField
              label="Mop feature"
              icon={<GiSoap className="w-4 h-4 text-primary" />}
              state={fieldState}
              {...field}
            />
          )}
        />
      </>
    ),
    [brands]
  );

  return (
    <FormProvider {...form}>
      <form
        className="px-4 py-2 md:p-4 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="hidden md:block">
          <div
            className={`overflow-y-scroll space-y-2`}
            style={{
              height: `calc(${filtersContainerHeight - navHeight - 68}px)`,
              overflow: "hidden",
              overflowY: "scroll",
            }}
          >
            {simpleFilters}
            <AdvancedFilters form={form} />
          </div>

          <div className="flex gap-4 pt-4">
            {isFormDirty && (
              <Button
                type="button"
                onClick={() => resetFilters()}
                className="w-full bg-red-500/10 border! border-red-500! px-3! py-2!"
              >
                Reset
              </Button>
            )}
            <Button
              type="button"
              onClick={() => handleSubmit()}
              className="w-full bg-background border! border-border! px-3! py-2!"
            >
              Search
            </Button>
          </div>
        </div>
        <MobileFiltersDialog
          className="block md:hidden"
          form={form}
          handleSubmit={handleSubmit}
          resetFilters={resetFilters}
        >
          <div className="flex flex-col gap-4">
            {simpleFilters}
            <AdvancedFiltersSelectionDialog form={form} />
          </div>
        </MobileFiltersDialog>
      </form>
    </FormProvider>
  );
}

const MobileFiltersDialog = ({
  className = "",
  form,
  handleSubmit,
  children,
}: VacuumSearchFormProps & {
  className?: string;
  children: React.ReactNode;
}) => {
  const { currency } = useSiteConfig();
  const [isOpen, setIsOpen] = useState(false);

  const formValues = useWatch({ control: form.control });
  const isFormDirty = form.formState.isDirty;

  const filtersDisplay = Object.entries(formValues).reduce((acc, [key, value]) => {
    let displayValue = "";
    switch (key) {
      case "budget":
        displayValue = `${CurrencySymbolMapping[currency]}${value}`;
        break;
      case "numRooms":
        displayValue = `${value} rooms`;
        break;
      case "numPets":
        displayValue = `${value} pets`;
        break;
      case "hasMoppingFeature":
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
        panelClassName="overflow-hidden"
        childrenClassName="space-y-6 overflow-y-hidden"
      >
        <div className=" h-[calc(100svh-161px)] overflow-y-scroll">{children}</div>

        <div className="flex flex-col gap-4">
          {isFormDirty && (
            <Button
              type="button"
              onClick={() => {
                close();
                form.reset();
              }}
              className="w-full bg-red-500/10 border! border-red-500!"
            >
              Reset Filters
            </Button>
          )}

          <Button
            className="w-full bg-background border! border-border!"
            type="button"
            onClick={() => {
              close();
              handleSubmit();
            }}
          >
            Find Vacuums
          </Button>
        </div>
      </Modal>
    </div>
  );
};

const fuzzySearch = (query: string) => (key: string) => key.toLowerCase().includes(query.toLowerCase());
const shownFieldKeys = ["brand", "budget", "mappingTechnology", "numPets", "hasMoppingFeature", "region", "currency"];
const getVacuumFilterType = (key: keyof VacuumsFilters) => {
  // get type from Vacuum type
  switch (key) {
    case "batteryLifeInMinutes":
    case "dustbinCapacityInLiters":
    case "waterTankCapacityInLiters":
    case "suctionPowerInPascals":
    case "noiseLevelInDecibels":
    case "budget":
    case "numPets":
      return "number";
    case "hasMoppingFeature":
    case "hasSelfEmptyingFeature":
    case "hasZoneCleaningFeature":
    case "hasMultiFloorMappingFeature":
    case "hasVirtualWallsFeature":
    case "hasSmartHomeIntegrationFeature":
    case "hasAppControlFeature":
    case "hasManualControlFeature":
    case "hasChildLockFeature":
    case "hasVoiceControlFeature":
      return "boolean";
    default:
      return "string";
  }
};

const renderField = (key: keyof VacuumsFilters) => {
  const valueTypeFromTypings = getVacuumFilterType(key);
  const label = FilterKeyToLabel[key];

  console.log("valueTypeFromTypings", valueTypeFromTypings, key, label);
  switch (valueTypeFromTypings) {
    case "number":
      return (
        <Controller
          name={key}
          render={({ field, fieldState }) => (
            <FormTextField type="number" label={label} state={fieldState} {...field} />
          )}
        />
      );
    case "boolean":
      return (
        <Controller
          name={key}
          render={({ field, fieldState }) => <FormToggleField label={label} state={fieldState} {...field} />}
        />
      );
    case "string":
      return (
        <Controller
          name={key}
          render={({ field, fieldState }) => <FormTextField label={label} state={fieldState} {...field} />}
        />
      );
    default:
      return null;
  }
};

const AdvancedFilters = ({ form }: { form: UseFormReturn<VacuumsFilters> }) => {
  const formValues = useWatch({ control: form.control });

  console.log("formValues", formValues);

  const renderKeys = useMemo(() => {
    return Object.entries(formValues)
      .filter(([, value]) => value !== null)
      .map(([key]) => key)
      .filter((key) => !shownFieldKeys.includes(key));
  }, [formValues]);

  return (
    <div className="mt-4 flex flex-col gap-4 pb-4">
      {renderKeys.map((key) => (
        <div key={key}>{renderField(key as keyof VacuumsFilters)}</div>
      ))}

      <AdvancedFiltersSelectionDialog form={form} />
    </div>
  );
};

const AdvancedFiltersSelectionDialog = ({ form }: { form: UseFormReturn<VacuumsFilters> }) => {
  const [query, setQuery] = useState("");
  const formValues = useWatch({ control: form.control });

  const handleAddFilter = useCallback(
    (key: keyof VacuumsFilters) => {
      console.log("key", key);
      const valueTypeFromTypings = getVacuumFilterType(key);
      console.log("valueTypeFromTypings", valueTypeFromTypings);
      const defaultValue = valueTypeFromTypings === "boolean" ? false : valueTypeFromTypings === "number" ? 0 : "";
      form.setValue(key, defaultValue);
    },
    [form]
  );

  const handleRemoveFilter = useCallback(
    (key: keyof VacuumsFilters) => {
      form.setValue(key, null);
    },
    [form]
  );

  const isSet = useCallback((key: keyof VacuumsFilters) => formValues[key] !== null, [formValues]);
  const handleFieldOptionClick = useCallback(
    (key: keyof VacuumsFilters) => {
      if (isSet(key)) {
        handleRemoveFilter(key);
      } else {
        handleAddFilter(key);
      }
    },
    [handleAddFilter, handleRemoveFilter, isSet]
  );

  const baseFieldKeys = useMemo(() => {
    return Object.entries(formValues)
      .map(([key]) => {
        return key as keyof VacuumsFilters;
      })
      .filter((key) => !shownFieldKeys.includes(key));
  }, [formValues]);

  const fieldKeys = useMemo(() => {
    return baseFieldKeys.filter((key) => {
      const label = FilterKeyToLabel[key];
      return fuzzySearch(query)(label);
    });
  }, [baseFieldKeys, query]);

  return (
    <Combobox
      value={undefined}
      onChange={(value) => {
        if (value) {
          handleFieldOptionClick(value as keyof VacuumsFilters);
        }
      }}
      onClose={() => setQuery("")}
      immediate
    >
      <div className="relative">
        <ComboboxButton className="flex items-center gap-2 w-full bg-background border border-border rounded focus:border-accent focus-within:border-accent">
          <ComboboxInput
            className="w-full px-3 py-2 outline-0!"
            placeholder="Add/Remove Filters"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <BiChevronDown className="w-5 h-5 text-primary group-hover:text-primary-dark" />
        </ComboboxButton>
      </div>

      <ComboboxOptions
        anchor="bottom start"
        transition
        className="w-[calc(100vw-16px)] md:w-[18rem] border border-border bg-background-alt rounded-xl p-2 h-84 overflow-y-scroll [--anchor-gap:var(--spacing-1)] z-20 -ml-1 md:-ml-[1.5rem]"
      >
        {fieldKeys.map((key) => (
          <ComboboxOption key={key} value={key} onClick={() => handleFieldOptionClick(key)}>
            <button className="w-full text-left">
              <span className="text-sm font-semibold">{FilterKeyToLabel[key as keyof VacuumsFilters]}</span>
            </button>
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
};

const FilterKeyToLabel: Record<keyof VacuumsFilters, string> = {
  brand: "Brand",
  budget: "Budget",
  mappingTechnology: "Mapping Technology",
  numPets: "Number of Pets",
  hasMoppingFeature: "Mop Feature",
  batteryLifeInMinutes: "Battery Life (minutes)",
  suctionPowerInPascals: "Suction Power (Pascals)",
  noiseLevelInDecibels: "Noise Level (dB)",
  waterTankCapacityInLiters: "Water Tank Capacity (liters)",
  dustbinCapacityInLiters: "Dustbin Capacity (liters)",
  hasSelfEmptyingFeature: "Self-emptying Feature",
  hasZoneCleaningFeature: "Zone Cleaning Feature",
  hasMultiFloorMappingFeature: "Multi-floor Mapping Feature",
  hasVirtualWallsFeature: "Virtual Walls Feature",
  hasSmartHomeIntegrationFeature: "Smart Home Integration Feature",
  hasAppControlFeature: "App Control Feature",
  hasManualControlFeature: "Manual Control Feature",
  hasChildLockFeature: "Child Lock Feature",
  hasVoiceControlFeature: "Voice Control Feature",
  region: "Region",
  currency: "Currency",
};
