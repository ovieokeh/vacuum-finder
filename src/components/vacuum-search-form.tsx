import { useMemo, useState } from "react";
import { Controller, UseFormReturn, useWatch } from "react-hook-form";
import { Button } from "@headlessui/react";
import { BiTrash, BiWallet } from "react-icons/bi";
import { MdNoiseAware, MdPets } from "react-icons/md";
import { GiSoap, GiVacuumCleaner, GiWaterTank } from "react-icons/gi";
import { CiEdit } from "react-icons/ci";
import { IoFilterOutline } from "react-icons/io5";
import { TbBuilding, TbEyeSearch } from "react-icons/tb";
import { FaBatteryHalf } from "react-icons/fa";

import { useSiteConfig } from "../providers/site-config";
import { CurrencySymbolMapping, VacuumsFilters } from "../types";
import { Modal } from "./modal";
import { useListBrands } from "../database/hooks";
import {
  FormConnectedMappingTechnologySelect,
  FormNumberSliderField,
  FormSelectField,
  FormTabField,
} from "./form-components";

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
  const { locale, currency } = useSiteConfig();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const brandsQuery = useListBrands();
  const brands = brandsQuery.data;
  const isFormDirty = form.formState.isDirty;

  const brandOptions = useMemo(() => brands?.map((brand) => ({ label: brand, value: brand })), [brands]);

  // --- Simple Filters ---
  const simpleFilters = useMemo(
    () => (
      <div className="flex flex-col gap-8 pb-4">
        <Controller
          name="hasMoppingFeature"
          render={({ field, fieldState }) => (
            <FormTabField
              label="Mop feature"
              unknownLabel="Don't care"
              labelIcon={<GiSoap className="w-4 h-4 text-primary" />}
              state={fieldState}
              {...field}
            />
          )}
        />

        <Controller
          name="budget"
          render={({ field, fieldState }) => (
            <FormNumberSliderField
              label="Budget"
              labelIcon={<BiWallet className="w-4 h-4 text-primary" />}
              state={fieldState}
              step={50}
              valueFormatter={(value) => {
                const formatted = new Intl.NumberFormat(locale, { style: "currency", currency: currency }).format(
                  value
                );
                return formatted;
              }}
              {...field}
            />
          )}
        />

        <Controller
          name="numPets"
          render={({ field, fieldState }) => (
            <FormNumberSliderField
              label="Number of pets"
              labelIcon={<MdPets className="w-4 h-4 text-primary" />}
              state={fieldState}
              step={1}
              max={10}
              valueFormatter={(value) => `${value} ${value === 1 ? "pet" : "pets"}`}
              {...field}
            />
          )}
        />

        <Controller
          name="brand"
          render={({ field, fieldState }) => (
            <FormSelectField
              label="Brand"
              labelIcon={<TbBuilding className="w-4 h-4 text-primary" />}
              options={brandOptions || []}
              state={fieldState}
              {...field}
            />
          )}
        />

        <Controller
          name="mappingTechnology"
          render={({ field, fieldState }) => (
            <FormConnectedMappingTechnologySelect
              label="Mapping Technology"
              labelIcon={<TbEyeSearch className="w-4 h-4 text-primary" />}
              state={fieldState}
              {...field}
            />
          )}
        />
      </div>
    ),
    [brandOptions, currency, locale]
  );

  // --- Advanced Filters (all keys from VacuumBase) ---
  const advancedFilters = useMemo(
    () => (
      <div className="mt-4 flex flex-col gap-8 pb-4">
        <Controller
          name="batteryLifeInMinutes"
          render={({ field, fieldState }) => (
            <FormNumberSliderField
              label="Min Battery Life"
              labelIcon={<FaBatteryHalf className="w-4 h-4 text-primary" />}
              state={fieldState}
              step={10}
              max={600}
              valueFormatter={(value) => `${value} minutes`}
              {...field}
            />
          )}
        />
        <Controller
          name="suctionPowerInPascals"
          render={({ field, fieldState }) => (
            <FormNumberSliderField
              label="Min Suction Power"
              labelIcon={<GiVacuumCleaner className="w-4 h-4 text-primary" />}
              state={fieldState}
              step={100}
              max={5000}
              valueFormatter={(value) => `${value} Pa`}
              {...field}
            />
          )}
        />
        <Controller
          name="noiseLevelInDecibels"
          render={({ field, fieldState }) => (
            <FormNumberSliderField
              label="Max Noise Level"
              labelIcon={<MdNoiseAware className="w-4 h-4 text-primary" />}
              state={fieldState}
              step={1}
              max={100}
              valueFormatter={(value) => `${value} dB`}
              {...field}
            />
          )}
        />
        <Controller
          name="waterTankCapacityInLiters"
          render={({ field, fieldState }) => (
            <FormNumberSliderField
              label="Min Water Tank Capacity"
              labelIcon={<GiWaterTank className="w-4 h-4 text-primary" />}
              state={fieldState}
              step={0.1}
              max={5}
              valueFormatter={(value) => `${value} liters`}
              {...field}
            />
          )}
        />
        <Controller
          name="dustbinCapacityInLiters"
          render={({ field, fieldState }) => (
            <FormNumberSliderField
              label="Min Dustbin Capacity"
              labelIcon={<BiTrash className="w-4 h-4 text-primary" />}
              state={fieldState}
              step={0.1}
              max={5}
              valueFormatter={(value) => `${value} liters`}
              {...field}
            />
          )}
        />
        <Controller
          name="hasSelfEmptyingFeature"
          render={({ field, fieldState }) => (
            <FormTabField unknownLabel="Don't care" label="Self-emptying" state={fieldState} {...field} />
          )}
        />
        <Controller
          name="hasZoneCleaningFeature"
          render={({ field, fieldState }) => (
            <FormTabField unknownLabel="Don't care" label="Zone cleaning" state={fieldState} {...field} />
          )}
        />
        <Controller
          name="hasMultiFloorMappingFeature"
          render={({ field, fieldState }) => (
            <FormTabField unknownLabel="Don't care" label="Multi-floor mapping" state={fieldState} {...field} />
          )}
        />

        <Controller
          name="hasVirtualWallsFeature"
          render={({ field, fieldState }) => (
            <FormTabField unknownLabel="Don't care" label="Virtual walls" state={fieldState} {...field} />
          )}
        />
        <Controller
          name="hasSmartHomeIntegrationFeature"
          render={({ field, fieldState }) => (
            <FormTabField unknownLabel="Don't care" label="Smart home integration" state={fieldState} {...field} />
          )}
        />

        <Controller
          name="hasAppControlFeature"
          render={({ field, fieldState }) => (
            <FormTabField unknownLabel="Don't care" label="App control" state={fieldState} {...field} />
          )}
        />

        <Controller
          name="hasManualControlFeature"
          render={({ field, fieldState }) => (
            <FormTabField unknownLabel="Don't care" label="Manual control" state={fieldState} {...field} />
          )}
        />
      </div>
    ),
    []
  );

  const advancedFiltersToggle = useMemo(
    () => (
      <Button
        type="button"
        onClick={() => setShowAdvanced((prev) => !prev)}
        className="my-4 p-0! text-sm text-primary underline outline-0! focus:outline-0! border-0!"
      >
        {showAdvanced ? "Hide Advanced Filters" : "Show Advanced Filters"}
      </Button>
    ),
    [showAdvanced]
  );

  // --- Desktop & Mobile Filters ---
  const desktopFilters = (
    <div className="hidden md:block">
      <div
        className={`overflow-y-scroll space-y-2 p-4`}
        style={{
          height: `calc(${filtersContainerHeight - navHeight - 68}px)`,
          overflow: "hidden",
          overflowY: "scroll",
        }}
      >
        {simpleFilters}
        {advancedFiltersToggle}
        {showAdvanced && advancedFilters}
      </div>

      <div className="p-4">
        {isFormDirty && (
          <Button
            type="button"
            onClick={() => resetFilters()}
            className="w-full bg-red-500/10 border! border-red-500! px-3! py-2!"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );

  const mobileFilters = (
    <MobileFiltersDialog
      className="block md:hidden"
      form={form}
      handleSubmit={handleSubmit}
      resetFilters={resetFilters}
    >
      <div className="flex flex-col gap-4">
        {simpleFilters}
        {advancedFiltersToggle}
        {showAdvanced && advancedFilters}
      </div>
    </MobileFiltersDialog>
  );

  return (
    <form
      className="px-4 py-2 md:p-0 flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
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
