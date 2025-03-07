/* eslint-disable react-refresh/only-export-components */
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
import { GoChevronDown } from "react-icons/go";
import {
  FieldComponent,
  FormAsyncValidateOrFn,
  FormValidateOrFn,
  ReactFormExtendedApi,
  createFormHook,
  createFormHookContexts,
} from "@tanstack/react-form";
import clsx from "clsx";
import { ComponentType, PropsWithChildren, useEffect, useState } from "react";
import ImageUpload from "./image-upload";
import { twMerge } from "tailwind-merge";

interface FormError {
  key: string;
  error: string;
}

const ErrorRenderer = ({ name, errors }: { name: string; errors: (FormError | undefined | null)[] }) => {
  const error = errors.find((error) => error?.key === name)?.error;
  if (!error) {
    return null;
  }

  return <div className="text-red-500 text-sm">{error}</div>;
};

const FormTextField = <T extends string | number>({
  type = "text",
  icon,
  label,
  labelIcon,
  inputContainerClassName,
  onChange,
  formErrors = [],
  ...rest
}: {
  value: T;
  onChange: (value: T) => void;
  type?: string;
  label?: string;
  icon?: React.ReactNode;
  labelIcon?: React.ReactNode;
  inputContainerClassName?: string;
  formErrors?: (FormError | undefined | null)[];
  name: string;
}) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type !== "number") {
      onChange(e.target.value as T);
      return;
    }

    const value = e.target.value;
    if (!value) {
      onChange(value as T);
      return;
    }

    if (isNaN(+value)) {
      return;
    }

    onChange(value as T);
  };

  const error = formErrors.find((error) => error?.key === rest.name)?.error;

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
          type="text"
          className={twMerge(
            "w-full block bg-background-alt px-2 py-1 rounded-md border border-border focus:ring-primary focus:border-primary",
            !!error && "border-red-500"
          )}
          onChange={handleOnChange}
        />
      </div>

      <ErrorRenderer name={rest.name} errors={formErrors} />
    </Field>
  );
};

const FormToggleField = ({
  icon,
  label,
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (e: boolean) => void;
  label?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <Field className="flex items-center gap-2">
      <Switch
        checked={checked}
        onChange={(e) => onChange(e)}
        className={clsx(
          `border-border! group relative flex w-10 h-5.5 p-0! cursor-pointer rounded-full! transition-colors duration-200 ease-in-out focus:outline-none! outline-none!`,
          checked ? "bg-blue-100!" : "bg-background/70!"
        )}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none inline-block size-4 translate-y-0.5 translate-x-0.5 rounded-full ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
          style={{
            backgroundColor: checked ? "rgb(59, 130, 246)" : "rgb(229, 231, 235)",
          }}
        />
      </Switch>
      {label && (
        <Label className="flex items-center gap-2 text-sm/6 font-medium">
          {icon}
          {label}
        </Label>
      )}
    </Field>
  );
};

export const FormSelectField = <T extends string>({
  label,
  icon,
  options,
  selectedOption,
  onChange,
}: {
  label?: string;
  icon?: React.ReactNode;
  options: T[];
  selectedOption: T;
  onChange: (value: T) => void;
}) => {
  return (
    <Listbox value={selectedOption} onChange={(value) => onChange(value)}>
      <div className="flex flex-col gap-2">
        {label && (
          <Label className="flex items-center gap-2 text-sm/6 font-medium">
            {icon}
            {label}
          </Label>
        )}
        <ListboxButton className="flex flex-row items-center justify-between gap-2 text-left px-2! bg-background! border! border-border!">
          {selectedOption || <span className="text-text/80 text-sm">Select an option</span>}
          <GoChevronDown className="w-4 h-4" />
        </ListboxButton>
        <ListboxOptions anchor="bottom start" className="bg-background rounded shadow z-10">
          {!!selectedOption && (
            <ListboxOption
              value=""
              className="group flex gap-2 px-4 py-2 data-[focus]:bg-background-alt cursor-pointer text-red-700"
            >
              Clear
            </ListboxOption>
          )}
          {options.map((option, index) => (
            <ListboxOption
              key={option + index}
              value={option}
              className="group flex gap-2 px-4 py-2 data-[focus]:bg-background-alt cursor-pointer"
            >
              {option}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
};

const FormComboboxField = <T extends string>({
  name,
  label,
  options = [],
  selectedOption,
  onChange,
  formErrors = [],
}: {
  label?: string;
  options: T[];
  selectedOption: T;
  onChange: (value: T) => void;
  formErrors?: (FormError | undefined | null)[];
  name: string;
}) => {
  const [query, setQuery] = useState(selectedOption as string);

  useEffect(() => {
    setQuery(selectedOption as string);
  }, [selectedOption]);

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) => {
          return option?.toLowerCase().includes(query?.toLowerCase());
        });

  const error = formErrors.find((error) => error?.key === name)?.error;

  return (
    <Combobox<T>
      value={selectedOption}
      onChange={(newValue) => {
        console.log("Changed: ", newValue);
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

      <ErrorRenderer name={name} errors={formErrors} />

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

const FormSubmitButton = ({
  type = "submit",
  className,
  children,
}: {
  type?: "submit" | "button";
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <Button type={type} className={clsx("bg-background! border! border-border!", className)}>
      {children}
    </Button>
  );
};

const FormImageUploadField = ({
  className,
  value,
  label,
  showPreview,
  onChange,
}: {
  className?: string;
  value?: string;
  label?: React.ReactNode;
  showPreview?: boolean;
  onChange: (value: string) => void;
}) => {
  return (
    <ImageUpload currentUrl={value} label={label} showPreview={showPreview} onUpload={onChange} className={className} />
  );
};

const { fieldContext, formContext } = createFormHookContexts();
export const formInit = {
  fieldComponents: {
    FormTextField,
    FormToggleField,
    FormSelectField,
    FormComboboxField,
    FormImageUploadField,
  },
  formComponents: {
    FormSubmitButton,
  },
  fieldContext,
  formContext,
};

export type AppFieldExtendedReactFormApi<
  TFormData,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  TSubmitMeta,
  TFieldComponents extends Record<string, ComponentType<any>>,
  TFormComponents extends Record<string, ComponentType<any>>
> = ReactFormExtendedApi<
  TFormData,
  TOnMount,
  TOnChange,
  TOnChangeAsync,
  TOnBlur,
  TOnBlurAsync,
  TOnSubmit,
  TOnSubmitAsync,
  TOnServer,
  TSubmitMeta
> &
  TFormComponents & {
    AppField: FieldComponent<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnServer,
      TSubmitMeta,
      NoInfer<TFieldComponents>
    >;
    AppForm: ComponentType<PropsWithChildren>;
  };

export const { useAppForm } = createFormHook(formInit);
