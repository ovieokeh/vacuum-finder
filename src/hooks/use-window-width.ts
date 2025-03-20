import { useLayoutEffect, useState } from "react";
import { useIsClient } from "./use-is-client";

export const useWindowWidth = () => {
  const isClient = useIsClient();
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (isClient) {
      setWidth(window.innerWidth);
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener("DOMContentLoaded", handleResize);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isClient]);

  return Math.min(width, 1400);
};
