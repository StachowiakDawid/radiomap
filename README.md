# Radiomap

An application showing a map of radiolines and cell towers in Poland. 

Data sources: https://bip.uke.gov.pl/pozwolenia-radiowe/wykaz-pozwolen-radiowych/

Demo: https://radiomap.s3.waw.io.cloud.ovh.net/index.html

# How to use

1. Build PGLite with PostGIS from https://github.com/electric-sql/pglite/pull/807 and provide `.tgz` files.
2. Copy `config.sample.ts` to `config.ts` and adjust values.
3. Go to `src/scripts/` and run `node load.mjs`.
4. Go to root folder and run `npm run dev`.