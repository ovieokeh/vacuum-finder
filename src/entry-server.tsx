import { StrictMode } from "react";
import { renderToString } from "react-dom/server";

import App from "./app";
import { MemoryRouter } from "react-router-dom";

export function render() {
  const html = renderToString(
    <StrictMode>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </StrictMode>
  );
  return { html };
}
