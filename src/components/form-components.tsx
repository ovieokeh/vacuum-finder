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
import { ControllerFieldState } from "react-hook-form";
import { GoChevronDown } from "react-icons/go";
import { twMerge } from "tailwind-merge";

import ImageUpload from "./image-upload";

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
}

export const FormTextField = <T extends string | number>({
  type = "text",
  icon,
  label,
  labelIcon,
  inputContainerClassName,
  onChange,
  state,
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

  return (
    <Field className="space-y-2">
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
            "w-full block bg-background-alt px-2 py-1 rounded-md border border-border focus:ring-primary focus:border-primary",
            !!error && "border-red-500"
          )}
          onChange={(e) => onChange(e.target.value as T)}
        />
      </div>

      <ErrorRenderer error={error} />
    </Field>
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

export const FormSelectField = <T extends string>({
  label,
  icon,
  options,
  value,
  onChange,
  state,
  labelClassName,
  optionClassName,
}: FormFieldProps<T> & {
  label?: string;
  icon?: React.ReactNode;
  options: T[];
  labelClassName?: string;
  optionClassName?: string;
}) => {
  const error = state?.error?.message;

  return (
    <Listbox value={value} onChange={(value) => onChange(value)}>
      <div className="flex flex-col gap-2">
        {label && (
          <Label className="flex items-center gap-2 text-sm/6 font-medium">
            {icon}
            {label}
          </Label>
        )}
        <ListboxButton
          className={twMerge(
            "flex flex-row items-center justify-between gap-2 text-left px-2! bg-background! border! border-border! capitalize",
            labelClassName
          )}
        >
          {value || <span className="text-text/80 text-sm">Select an option</span>}
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
              key={option + index}
              value={option}
              className={twMerge(
                "group flex gap-2 px-4 py-2 data-[focus]:bg-background-alt cursor-pointer capitalize",
                optionClassName
              )}
            >
              {option}
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
    >
      {label && <Label className="flex items-center gap-2 text-sm/6 font-medium">{label}</Label>}

      <ComboboxInput
        className={twMerge(
          "w-full block bg-background-alt px-2 py-1 rounded-md border border-border focus:ring-primary focus:border-primary",
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
  onChange,
}: FormFieldProps<boolean | undefined> & {
  label?: string;
}) => {
  const VALUE_MAPPING = {
    yes: true,
    no: false,
    unknown: undefined,
  };

  const isValueSelected = (tab: string) => {
    const selectedValue = VALUE_MAPPING[tab as keyof typeof VALUE_MAPPING];
    return value === selectedValue;
  };

  return (
    <Field className="flex flex-col space-y-2">
      {label && <Label className="text-sm/6 font-medium">{label}</Label>}

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
              "flex-1 py-2 text-sm rounded-none!  border-none! bg-background text-text/80 capitalize outline-0!",
              isValueSelected(tab) && "bg-accent text-background"
            )}
            onClick={() => onChange(VALUE_MAPPING[tab as keyof typeof VALUE_MAPPING])}
          >
            {tab}
          </Button>
        ))}
      </div>
    </Field>
  );
};
