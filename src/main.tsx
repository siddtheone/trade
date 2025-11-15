import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ComponentProvider from "./ComponentProvider";

async function enableMocksAndRender() {
  const shouldEnableMocks =
    import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW === "true";
  if (shouldEnableMocks) {
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
