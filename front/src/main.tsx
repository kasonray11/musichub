import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// StrictMode is a development-only helper that intentionally double-invokes
// some functions to help surface bugs early (like effects with missing
// cleanup). It does nothing in production builds - purely a dev safety net.

// getElementById can technically return null (if the element doesn't exist),
// so TypeScript forces us to handle that case before using it - this `if`
// check satisfies that, and would only ever actually trigger if index.html
// were edited to remove the `<div id="root">`.
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found - check index.html for <div id=\"root\">");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
