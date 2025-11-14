import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ComponentProvider from "./ComponentProvider";

async function enableMocksAndRender() {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");
    await worker.start();
  }
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ComponentProvider>
        <App />
      </ComponentProvider>
    </StrictMode>
  );
}

enableMocksAndRender();
