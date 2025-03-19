import { useEffect } from "react";

export const useDisableNumberInputScroll = () => {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const handleWheel = () => {
      const target = document.activeElement as HTMLInputElement;
      if (target?.type === "number") {
        target?.blur();
      }
    };
    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);
};
