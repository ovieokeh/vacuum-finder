import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router";

import { config } from "dotenv";

config();

import App from "./main";

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
