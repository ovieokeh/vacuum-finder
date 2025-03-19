import { useEffect, useState } from "react";
import {
  Field,
  Button,
  Input,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Switch,
  Combobox,
  ComboboxOptions,
  ComboboxOption,
  ComboboxInput,
} from "@headlessui/react";
import { Controller, ControllerFieldState, useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { GoChevronDown } from "react-icons/go";
import { IoMdCloseCircle } from "react-icons/io";

import ImageUpload from "./image-upload";
import { useListBrands } from "../database/hooks";
import { LuMinus, LuPlus } from "react-icons/lu";

const ErrorRenderer = ({ error }: { error?: string }) => {
  if (!error) {
    return null;
  }

  return <div className="text-red-500 text-sm">{error}</div>;
};

interface FormFieldProps<T> {
  value: T;
  onChange: (value: T) => void;
  state?: ControllerFieldState;
  disabled?: boolean;
}

export const FormTextField = <T extends string | number>({
  type = "text",
  icon,
  label,
  labelIcon,
  inputContainerClassName,
  onChange,
  state,
  disabled,
  ...rest
}: FormFieldProps<T> & {
  type?: string;
  label?: string;
  icon?: React.ReactNode;
  labelIcon?: React.ReactNode;
  inputContainerClassName?: string;
  name: string;
}) => {
  const error = state?.error?.message;

  const shouldShowClearButton = () => {
    if (rest.value?.toLocaleString().length > 0) {
      if (!rest.value) {
        return false;
      }
      // is number?
      if (type === "number") {
        return +rest.value > 0;
      }

      return rest.value.toLocaleString().length > 0;
    }
    return false;
  };

  return (
    <Field className="space-y-2 grow">
      {label && (
        <Label className="flex items-center gap-2 text-sm/6 font-medium">
          {labelIcon}
          {label}
        </Label>
      )}

      <div className={twMerge("flex items-center gap-2", inputContainerClassName)}>
        {icon}

        <Input
          {...rest}
          type={type}
          className={twMerge(
            "w-full! block bg-background-alt px-2 py-1 rounded-md border border-border focus:ring-primary focus:border-primary",
            !!error && "border-red-500"
          )}
          onChange={(e) => onChange(e.target.value as T)}
          disabled={disabled}
        />

        {shouldShowClearButton() ? (
          <button
            onClick={() => (type === "text" ? onChange("" as T) : onChange(0 as T))}
            className="flex items-center justify-center bg-background-alt w-fit! p-0!"
            disabled={disabled}
          >
            <IoMdCloseCircle className="size-5 text-text" />
          </button>
        ) : (
          <div className="min-w-[22px]" />
        )}
      </div>

      <ErrorRenderer error={error} />
    </Field>
  );
};

type FormArrayFieldProps = {
  label: string;
  name: string;
  addLabel?: string;
  removeLabel?: string;
};

export const FormArrayField = ({ label, name, addLabel = "Add" }: FormArrayFieldProps) => {
  const { control, getValues, setValue } = useFormContext();
  const values = getValues(name) as string[] | null | undefined;
  const items = values ?? [];

  return (
    <div className="flex flex-col gap-2 mb-6 grow">
      <p className="text-sm/6 font-medium">{label}</p>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Controller
            name={`${name}[${index}]`}
            control={control}
            render={({ field, fieldState }) => (
              <FormTextField
                inputContainerClassName="flex-row-reverse"
                icon={
                  <button
                    type="button"
                    className="outline-0 focus:outline-0 border-0 py-0 px-0 cursor-pointer"
                    onClick={() =>
                      items.length > 1
                        ? setValue(
                            name,
                            items.filter((_, i) => i !== index)
                          )
                        : setValue(name, null)
                    }
                  >
                    <LuMinus className="w-4 h-4" />
                  </button>
                }
                {...field}
                state={fieldState}
              />
            )}
          />
        </div>
      ))}
      <Button
        className="flex items-center gap-2 text-accent border-border w-fit"
        onClick={() => setValue(name, [...items, ""])}
      >
        <LuPlus className="w-4 h-4" />
        {addLabel}
      </Button>
    </div>
  );
};

export const FormToggleField = ({
  icon,
  label,
  value,
  state,
  onChange,
}: FormFieldProps<boolean> & {
  label?: string;
  icon?: React.ReactNode;
}) => {
  const error = state?.error?.message;

  return (
    <Field className="flex flex-col gap-2 py-2">
      {label && (
        <Label className="flex items-center gap-2 text-sm/6 font-medium">
          {icon}
          {label}
        </Label>
      )}

      <Switch
        checked={value}
        onChange={(e) => onChange(e)}
        className={twMerge(
          `border-border! group relative flex w-10 h-5.5 p-0! cursor-pointer rounded-full! transition-colors duration-200 ease-in-out focus:outline-none! outline-none!`,
          value ? "bg-blue-100!" : "bg-background/70!"
        )}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none inline-block size-4 translate-y-0.5 translate-x-0.5 rounded-full ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
          style={{
            backgroundColor: value ? "rgb(59, 130, 246)" : "rgb(229, 231, 235)",
          }}
        />
      </Switch>

      <ErrorRenderer error={error} />
    </Field>
  );
};

interface FormSelectFieldProps {
  onChange: (value: string) => void;
  state?: ControllerFieldState;
  value: string;
  label?: string;
  labelIcon?: React.ReactNode;
  options: SelectOption[];
  className?: string;
  labelClassName?: string;
  optionClassName?: string;
  required?: boolean;
}

export const FormConnectedBrandsSelect = (props: Omit<FormSelectFieldProps, "options">) => {
  const brandsQuery = useListBrands();
  const brands = brandsQuery.data ?? [];
  return (
    <FormSelectField
      {...props}
      options={brands.map((brand) => ({
        label: brand,
        value: brand,
      }))}
    />
  );
};

export const FormConnectedMappingTechnologySelect = (props: Omit<FormSelectFieldProps, "options">) => {
  return (
    <FormSelectField
      {...props}
      options={["laser", "camera", "laser + camera"].map((tech) => ({
        label: tech,
        value: tech,
      }))}
    />
  );
};

interface SelectOption {
  label: string;
  value: string;
}
export const FormSelectField = ({
  label,
  labelIcon,
  options,
  value,
  onChange,
  state,
  className,
  labelClassName,
  optionClassName,
  required = false,
}: FormSelectFieldProps) => {
  const error = state?.error?.message;

  const selectedOption = options.find((option) => option.value === value);

  return (
    <Listbox value={value} onChange={(value) => onChange(value)}>
      <div className={twMerge("flex flex-col gap-2", className)}>
        {label && (
          <Label className="flex items-center gap-2 text-sm/6 font-medium">
            {labelIcon}
            {label}
          </Label>
        )}
        <ListboxButton
          className={twMerge(
            "flex flex-row items-center justify-between gap-2 text-left px-2! bg-background! border! border-border! capitalize",
            labelClassName
          )}
        >
          {selectedOption?.label || (
            <span className="text-text/80 text-sm">{`Select an option${required ? " *" : " (or leave empty)"}`}</span>
          )}
          <GoChevronDown className="w-4 h-4" />
        </ListboxButton>
        <ListboxOptions anchor="bottom start" className="bg-background rounded shadow z-10">
          {!!value && (
            <ListboxOption
              value=""
              className="group flex gap-2 px-4 py-2 data-[focus]:bg-background-alt cursor-pointer text-red-700 dark:text-red-300"
            >
              Clear
            </ListboxOption>
          )}
          {options.map((option, index) => (
            <ListboxOption
              key={option.value + index}
              value={option.value}
              className={twMerge(
                "group flex gap-2 px-4 py-2 data-[focus]:bg-background-alt cursor-pointer capitalize",
                optionClassName
              )}
            >
              {option.label}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>

      <ErrorRenderer error={error} />
    </Listbox>
  );
};

export const FormComboboxField = <T extends string>({
  label,
  options = [],
  value,
  onChange,
  state,
}: FormFieldProps<T> & {
  label?: string;
  options: T[];
}) => {
  const [query, setQuery] = useState(value as string);

  useEffect(() => {
    setQuery(value as string);
  }, [value]);

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) => {
          return option?.toLowerCase().includes(query?.toLowerCase());
        });

  const error = state?.error?.message;

  return (
    <Combobox<T>
      value={value}
      onChange={(newValue) => {
        if (!newValue) {
          return;
        }

        setQuery(newValue as string);
        onChange(newValue as T);
      }}
      onClose={() => {
        const matchOption = options.find((option) => option.toLowerCase().trim() === query.toLowerCase().trim());
        if (matchOption) {
          onChange(matchOption as T);
        }
      }}
    >
      {label && <Label className="flex items-center gap-2 text-sm/6 font-medium">{label}</Label>}

      <ComboboxInput
        className={twMerge(
          "block bg-background-alt px-2 py-1 rounded-md border border-border focus:ring-primary focus:border-primary",
          !!error && "border-red-500"
        )}
        aria-label={label}
        displayValue={(value) => value as string}
        onChange={(event) => setQuery(event.target.value)}
      />

      <ErrorRenderer error={error} />

      <ComboboxOptions anchor="bottom start" className="w-[300px] border bg-background empty:invisible p-2 rounded">
        {!!query && query.length > 0 && (
          <ComboboxOption
            value={query}
            className="px-2 py-4 data-[focus]:bg-background-alt"
            onSelect={() => {
              onChange(query as T);
            }}
          >
            Create <span className="font-bold">"{query}"</span>
          </ComboboxOption>
        )}
        {filteredOptions.map((option, index) => (
          <ComboboxOption
            key={option + index}
            value={option}
            className="cursor-pointer px-2 py-4 data-[focus]:bg-background-alt"
          >
            {option}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
};

export const FormSubmitButton = ({
  type = "submit",
  className,
  children,
}: {
  type?: "submit" | "button";
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <Button type={type} className={twMerge("bg-background! border! border-border!", className)}>
      {children}
    </Button>
  );
};

export const FormImageUploadField = ({
  className,
  value,
  label,
  showPreview,
  onChange,
}: FormFieldProps<string> & {
  className?: string;
  label?: React.ReactNode;
  showPreview?: boolean;
}) => {
  return (
    <ImageUpload currentUrl={value} label={label} showPreview={showPreview} onUpload={onChange} className={className} />
  );
};

export const FormTabField = ({
  label,
  value,
  labelIcon,
  unknownLabel = "Unknown",
  state,
  onChange,
}: FormFieldProps<boolean | null> & {
  labelIcon?: React.ReactNode;
  label?: string;
  unknownLabel?: string;
}) => {
  const VALUE_MAPPING = {
    yes: true,
    no: false,
    unknown: null,
  };

  const isValueSelected = (tab: string) => {
    const selectedValue = VALUE_MAPPING[tab as keyof typeof VALUE_MAPPING];
    if (tab === "unknown") {
      if (typeof value === "boolean") {
        return false;
      }
      return !value;
    }
    return value === selectedValue;
  };

  const error = state?.error?.message;

  return (
    <Field className="flex flex-col space-y-2">
      {label && (
        <Label className="flex items-center gap-2 text-sm/6 font-medium">
          {labelIcon}
          {label}
        </Label>
      )}

      <div
        className="flex border border-accent bg-accent rounded overflow-hidden"
        style={{
          gap: "1px",
        }}
      >
        {Object.keys(VALUE_MAPPING).map((tab, index) => (
          <Button
            key={index}
            className={twMerge(
              "w-fit! grow shrink! rounded-none! border-none! bg-background! text-sm! text-text/80! capitalize outline-0!",
              isValueSelected(tab) && "bg-accent! text-background!"
            )}
            onClick={() => onChange(VALUE_MAPPING[tab as keyof typeof VALUE_MAPPING])}
          >
            {tab === "unknown" ? unknownLabel : tab}
          </Button>
        ))}
      </div>

      <ErrorRenderer error={error} />
    </Field>
  );
};

export const FormNumberSliderField = ({
  label,
  labelIcon,
  value = 0,
  onChange,
  state,
  max = 100000,
  step = 100,
  valueFormatter,
}: FormFieldProps<number> & {
  onChange: (value: number) => void;
  label?: string;
  labelIcon?: React.ReactNode;
  max?: number;
  step?: number;
  valueFormatter?: (value: number) => string;
}) => {
  const [sliderValue, setSliderValue] = useState(value);

  // Debounce onChange call so it fires only after the user stops dragging
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(Math.min(sliderValue, max));
    }, 300);
    return () => clearTimeout(timer);
  }, [sliderValue, onChange, max]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue)) {
      setSliderValue(newValue);
    }
  };

  const error = state?.error?.message;
  const displayedValue = valueFormatter ? valueFormatter(sliderValue) : sliderValue.toString();

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <p className="flex items-center gap-2 text-sm/6 font-medium">
          {labelIcon}
          {label}
        </p>
      )}
      <div className="flex justify-between items-center gap-2">
        <input
          type="range"
          min={0}
          max={max || Infinity}
          step={step || 1}
          value={sliderValue.toString()}
          onChange={handleChange}
          className="w-full h-5 bg-gray-200 rounded-full cursor-pointer"
        />

        <input
          type="number"
          value={sliderValue}
          onChange={handleChange}
          className="w-20 text-center bg-background-alt px-2 py-1 rounded-md border border-border focus:ring-primary focus:border-primary"
          step={step}
          max={max}
          min={0}
        />
      </div>
      <p className="p-2 bg-accent/10 rounded text-sm">{displayedValue}</p>
      <ErrorRenderer error={error} />
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const REGION_OPTIONS = ["americas", "europe", "asia", "africa", "australia"].map((region) => ({
  value: region,
  label: region,
}));

// eslint-disable-next-line react-refresh/only-export-components
export const CURRENCY_OPTIONS = ["usd", "eur", "gbp", "cad", "aud"].map((currency) => ({
  value: currency,
  label: currency.toUpperCase(),
}));

// eslint-disable-next-line react-refresh/only-export-components
export const MAPPING_TECHNOLOGY_OPTIONS = ["laser", "camera"].map((tech) => ({
  value: tech,
  label: tech,
}));
