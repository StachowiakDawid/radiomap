const sql = `
INSERT INTO bts (operator,
	nr_decyzji,
	rodz_dec,
	data_waznosci,
	"Dl_geo_stacji",
	"Szer_geo_stacji",
	"Miejscowosc",
	"Lokalizacja",
	"IdStacji",
	"TERYT",
	typ,
	stan_na_dzien)
SELECT operator,
	nr_decyzji,
	rodz_dec,
	data_waznosci,
	"Dl_geo_stacji",
	"Szer_geo_stacji",
	"Miejscowosc",
	"Lokalizacja",
	"IdStacji",
	"TERYT",
	typ,
	stan_na_dzien
FROM bts_tmp;

DROP TABLE bts_tmp;

UPDATE bts t SET point = ST_Point(
	substring(t."Dl_geo_stacji", 1, 2)::float+substring(t."Dl_geo_stacji", 4, 2)::float/60+substring(t."Dl_geo_stacji", 7, 2)::float/3600,
	substring(t."Szer_geo_stacji", 1, 2)::float+substring(t."Szer_geo_stacji", 4, 2)::float/60+substring(t."Szer_geo_stacji", 7, 2)::float/3600
);

INSERT INTO bts_point (point, "Dl_geo_stacji", "Szer_geo_stacji", operators)
SELECT point, "Dl_geo_stacji", "Szer_geo_stacji", array_agg(distinct "operator") FROM bts GROUP BY point, "Dl_geo_stacji", "Szer_geo_stacji";

CREATE TABLE color_tmp AS SELECT DISTINCT operators FROM bts_point;
ALTER TABLE color_tmp ADD COLUMN color cube;
UPDATE color_tmp SET color = cube(array[trunc(random() * 255 + 0), 0, trunc(random() * 255 + 0)]);
UPDATE bts_point bp SET color = ct.color FROM color_tmp ct WHERE bp.operators = ct.operators;
DROP TABLE color_tmp;
ALTER TABLE bts_point DROP COLUMN "operators";

CREATE INDEX bts_point_index ON bts_point USING GIST (point);

`;
export default sql;