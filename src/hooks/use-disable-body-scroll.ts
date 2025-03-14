import { useLayoutEffect } from "react";

export const useContentScroll = (scroll = true) => {
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const bodyAttributes = scroll ? "overflow-y: hidden" : "";
      const contentAttributes = scroll ? "overflow-y: scroll" : "overflow-y: hidden";
      const bodyResetAttributes = "overflow-y: scroll";
      const contentResetAttributes = "overflow-y: scroll";

      const body = document.body;
      body.setAttribute("style", bodyAttributes);
      const contentContainer = document.getElementById("content");
      if (contentContainer) {
        contentContainer.setAttribute("style", contentAttributes);
      }

      return () => {
        body.setAttribute("style", bodyResetAttributes);
        if (contentContainer) {
          contentContainer.setAttribute("style", contentResetAttributes);
        }
      };
    }
  }, [scroll]);
};
