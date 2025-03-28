import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { Helmet } from "react-helmet";
import { config } from "dotenv";

config();

import App from "./main";

export function render() {
  const helmet = Helmet.renderStatic();
  const head = `
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
  `;

  const html = renderToString(
    <StrictMode>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </StrictMode>
  );

  return { head, html };
}
