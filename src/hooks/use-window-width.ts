import { useLayoutEffect, useState } from "react";

export const useWindowWidth = () => {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener("DOMContentLoaded", handleResize);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return Math.min(width, 1240);
};
