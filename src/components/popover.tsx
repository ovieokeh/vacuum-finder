import { Popover as PopoverHeadless, PopoverButton, PopoverPanel } from "@headlessui/react";
import { twMerge } from "tailwind-merge";

interface PopoverProps {
  title?: string;
  trigger: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  panelClassName?: string;
  children: React.ReactNode;
}
export const Popover = ({
  title,
  trigger,
  className = "",
  triggerClassName = "",
  panelClassName = "",
  children,
}: PopoverProps) => {
  return (
    <>
      {title && <p className="text-sm/6 font-semibold text-text/90">{title}</p>}
      <PopoverHeadless className={className}>
        <PopoverButton
          className={twMerge(
            "block text-sm/6 font-semibold text-text/90 focus:outline-none data-[active]:text-background-alt data-[hover]:text-background-alt data-[focus]:outline-1 data-[focus]:outline-background-alt",
            triggerClassName
          )}
        >
          {trigger}
        </PopoverButton>
        <PopoverPanel
          transition
          anchor="bottom"
          className={twMerge(
            "divide-y divide-background/5 rounded-xl bg-background/5 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0",
            panelClassName
          )}
        >
          {children}
        </PopoverPanel>
      </PopoverHeadless>
    </>
  );
};
