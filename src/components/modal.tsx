import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const Modal = ({
  title,
  isOpen,
  children,
  close,
  panelClassName,
  childrenClassName,
}: {
  title: string;
  isOpen: boolean;
  close: () => void;
  children: ReactNode;
  panelClassName?: string;
  childrenClassName?: string;
}) => {
  return (
    <Dialog open={isOpen} onClose={close} className="fixed inset-0 z-50">
      <div className="fixed inset-0 z-10 w-screen h-full md:h-auto overflow-hidden md:overflow-y-auto md:bg-black/50 transition-all">
        <div className="flex min-h-full items-center justify-center md:p-4">
          <DialogPanel
            className={twMerge(
              "w-full h-screen md:max-h-[90svh] flex flex-col md:max-w-md md:rounded-lg bg-background-alt p-4 md:pt-0 space-y-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0",
              panelClassName
            )}
            transition
          >
            <DialogTitle as="h3" className="flex justify-between items-center md:h-18">
              <span className="font-semibold">{title}</span>
              <Button onClick={close} className="bg-transparent! p-1!">
                <IoMdClose className="size-5 md:size-6" />
              </Button>
            </DialogTitle>

            <div
              className={twMerge(
                "grow max-h-[calc(100svh-4rem)] md:max-h-[calc(100svh-2rem)] overflow-y-scroll pb-8 md:pb-0",
                childrenClassName
              )}
            >
              {children}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
