import { PGlite } from "@electric-sql/pglite";
import { postgis } from "@electric-sql/pglite-postgis";
import { live } from "@electric-sql/pglite/live";
import { cube } from "@electric-sql/pglite/contrib/cube";
import dataUrl from "./assets/pgdata.tar.gz";
import { worker } from "@electric-sql/pglite/worker";

worker({
  async init() {
    return PGlite.create({
      extensions: { live, postgis, cube },
      loadDataDir: await fetch(dataUrl).then((response) => response.blob()),
    });
  },
});
