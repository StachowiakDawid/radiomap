import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { PGliteProvider } from "@electric-sql/pglite-react";
import { live, type PGliteWithLive } from "@electric-sql/pglite/live";
import { PGliteWorker } from "@electric-sql/pglite/worker";

const db = new PGliteWorker(
  new Worker(new URL("./pgliteWorker.ts", import.meta.url), {
    type: "module",
  }),
  {
    extensions: {
      live,
    },
  },
) as unknown as PGliteWithLive;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PGliteProvider db={db}>
      <App />
    </PGliteProvider>
  </StrictMode>,
);
