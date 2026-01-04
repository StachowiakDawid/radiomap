import xlsx from "xlsx";
import fs from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { postgis } from "@electric-sql/pglite-postgis";
import { cube } from "@electric-sql/pglite/contrib/cube";
import puppeteer from "puppeteer";
import config from "../../config.ts";
import { RadiomapLayer } from "../../config.interface.ts";
import createCellTowersTablesSql from "../sql/cellTowers/createTables.ts";
import setCellTowersGeometrySql from "../sql/cellTowers/setGeometry.ts";
import createRadiolinesTablesSql from "../sql/radiolines/createTables.ts";
import setRadiolinesGeometrySql from "../sql/radiolines/setGeometry.ts";

const db = await PGlite.create({
  extensions: { postgis, cube },
});
await db.exec(`CREATE EXTENSION IF NOT EXISTS postgis;`);
await db.exec(`CREATE EXTENSION IF NOT EXISTS cube;`);

const browser = await puppeteer.launch();
const page = await browser.newPage();

const getCsvFromUrl = async (url, insert = "") => {
  const workBook = xlsx.read(
    await fetch(url).then((res) => res.arrayBuffer()),
    { type: "buffer" },
  );
  const csv = xlsx.utils
    .sheet_to_csv(workBook.Sheets[workBook.SheetNames[0]], {
      forceQuotes: true,
      FS: ";",
    })
    .split("\n")
    .map((line) =>
      line.endsWith(";") ? line.substring(0, line.length - 1) : line,
    )
    .map((line) => (insert !== "" ? line + ";" + insert : line))
    .join("\n");

  return new Blob([Buffer.from(csv)], {
    type: "text/csv",
  });
};

if (config.layers.includes(RadiomapLayer.Radiolines)) {
  await db.exec(createRadiolinesTablesSql);
  await page.goto(
    "https://bip.uke.gov.pl/pozwolenia-radiowe/wykaz-pozwolen-radiowych-tresci/linie-radiowe,7.html",
  );

  let url = await page.evaluate((sel) => {
    let element = document.querySelector(sel);
    return element?.href;
  }, `a[href$=".xlsx"]`);

  await db.query(
    `COPY radiolinie_tmp FROM '/dev/blob' WITH DELIMITER ';' CSV HEADER QUOTE '"';`,
    [],
    {
      blob: await getCsvFromUrl(url),
    },
  );

  await db.exec(setRadiolinesGeometrySql);
  await db.query(`UPDATE radiolinie SET stan_na_dzien = $1;`, [
    url.match(/(\d{4}-\d{2}-\d{2})/)[0],
  ]);
}

if (config.layers.includes(RadiomapLayer.CellTowers)) {
  await db.exec(createCellTowersTablesSql);
  await page.goto(
    "https://bip.uke.gov.pl/pozwolenia-radiowe/wykaz-pozwolen-radiowych-tresci/stacje-gsm-umts-lte-5gnr-oraz-cdma,12,0.html",
  );

  let urls = await page.evaluate((sel) => {
    let elements = document.querySelectorAll(sel);
    return Array.from(elements).map((element) => element.href);
  }, `a[href$=".xlsx"]`);

  for (const url of urls) {
    await db.query(
      `COPY bts_tmp FROM '/dev/blob' WITH DELIMITER ';' CSV HEADER QUOTE '"';`,
      [],
      {
        blob: await getCsvFromUrl(
          url,
          url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("_-_")).toUpperCase() +
            ";" +
            url.match(/(\d{4}-\d{2}-\d{2})/)[0],
        ),
      },
    );
  }
  await db.exec(setCellTowersGeometrySql);
}

const file = await db.dumpDataDir({ compression: "gzip" });
fs.writeFileSync(
  path.join("../assets", file.name),
  Buffer.from(await file.arrayBuffer()),
);
await browser.close();
