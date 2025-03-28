import React, { useState, useEffect, Fragment, useCallback } from "react";
import { Dialog, DialogBackdrop, Transition, TransitionChild } from "@headlessui/react";
import { LuX } from "react-icons/lu";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "react-router";

interface EmailCaptureProps {
  onSubmit?: (email: string) => void;
}
export const EmailCapture = ({ onSubmit }: EmailCaptureProps) => {
  const [email, setEmail] = useState("");
  const submitMutation = useMutation({
    mutationKey: ["submitEmail"],
    mutationFn: async (email: string) => {
      return fetch(`/api/email-capture?email=${email}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            throw new Error(res.error.message);
          }

          onSubmit?.(email);
          setEmail("");
        });
    },
  });

  const handleSubmit = useCallback(
    (email: string) => {
      submitMutation.mutate(email);
    },
    [submitMutation]
  );

  return (
    <div className="p-8 bg-background rounded shadow">
      <h2 className="text-xl font-bold mb-2">Don't miss out!</h2>
      <p className="mb-4">
        Get notified when new vacuums are added to the site and when prices are updated. No spam, we promise.
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="border border-border rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={submitMutation.isPending}
      />
      <button
        onClick={() => handleSubmit(email)}
        className="w-full bg-background-alt text-text py-2 rounded hover:bg-background transition"
        disabled={submitMutation.isPending}
      >
        {submitMutation.isPending ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

type EmailCapturePopupProps = {
  handleSubmit?: (email: string) => void;
};

export const EmailCapturePopup: React.FC<EmailCapturePopupProps> = ({ handleSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const canShowPopup = useCallback(() => {
    // Don't show if email already captured.
    if (localStorage.getItem("emailCaptured")) return false;
    const rootPath = location.pathname.split("/")[1];
    const lastPopupShown = localStorage.getItem(`lastPopupShown-${rootPath}`);
    const now = Date.now();
    // Show if never shown or more than 24 hours have passed.
    return !lastPopupShown || now - parseInt(lastPopupShown) > 24 * 60 * 60 * 1000;
  }, [location.pathname]);

  const openPopup = useCallback(() => {
    if (canShowPopup()) {
      setIsOpen(true);
      const rootPath = location.pathname.split("/")[1];
      localStorage.setItem(`lastPopupShown-${rootPath}`, Date.now().toString());
    }
  }, [canShowPopup, location.pathname]);

  // Open after 10 seconds on index page.
  useEffect(() => {
    if (!canShowPopup()) return;
    const timer = setTimeout(() => {
      openPopup();
    }, 10000);
    return () => clearTimeout(timer);
  }, [openPopup, canShowPopup]);

  // Open on exit intent (cursor leaving viewport).
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && canShowPopup()) {
        openPopup();
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [openPopup, canShowPopup]);

  const handleEmailSubmit = (email: string) => {
    if (handleSubmit) {
      handleSubmit(email);
    }
    localStorage.setItem("emailCaptured", "true");
    setIsOpen(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={() => setIsOpen(false)}>
        <div className="min-h-screen px-4 text-center">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogBackdrop className="fixed inset-0 bg-background-alt/90" />
          </TransitionChild>
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md pt-12 my-8 overflow-hidden text-left align-middle transition-all transform bg-background shadow-xl rounded-2xl">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-0 right-0 p-2 m-2 text-text hover:text-accent"
              >
                <LuX className="w-6 h-6" />
              </button>
              <EmailCapture onSubmit={handleEmailSubmit} />
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
