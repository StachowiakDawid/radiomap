import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { PGlite } from "@electric-sql/pglite";
import { postgis } from "@electric-sql/pglite-postgis";
import { PGliteProvider } from "@electric-sql/pglite-react";
import { live } from "@electric-sql/pglite/live";
import { cube } from "@electric-sql/pglite/contrib/cube";
import dataUrl from "./assets/pgdata.tar.gz";

const db = await PGlite.create({
  extensions: { live, postgis, cube },
  loadDataDir: await fetch(dataUrl).then((response) => response.blob()),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PGliteProvider db={db}>
      <App />
    </PGliteProvider>
  </StrictMode>
);
