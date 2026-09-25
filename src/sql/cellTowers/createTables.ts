const sql = `
CREATE TABLE IF NOT EXISTS bts_tmp (
	operator varchar(128) NULL,
	nr_decyzji varchar NULL,
	rodz_dec varchar(5) NULL,
	data_waznosci varchar NULL,
	"Dl_geo_stacji" varchar NULL,
	"Szer_geo_stacji" varchar NULL,
	"Miejscowosc" varchar NULL,
	"Lokalizacja" varchar(100) NULL,
	"IdStacji" varchar(20) NULL,
	"TERYT" varchar NULL,
	typ varchar NULL,
	stan_na_dzien varchar NULL
);

CREATE TABLE IF NOT EXISTS bts (
	operator varchar(128) NULL,
	nr_decyzji varchar NULL,
	rodz_dec varchar(5) NULL,
	data_waznosci varchar NULL,
	"Dl_geo_stacji" varchar NULL,
	"Szer_geo_stacji" varchar NULL,
	"Miejscowosc" varchar NULL,
	"Lokalizacja" varchar(100) NULL,
	"IdStacji" varchar(20) NULL,
	"TERYT" varchar NULL,
	typ varchar NULL,
	stan_na_dzien varchar NULL,
	point public.geometry NULL,
	id SERIAL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS bts_point (
	id SERIAL PRIMARY KEY,
	"Dl_geo_stacji" varchar NULL,
	"Szer_geo_stacji" varchar NULL,
	point public.geometry NULL,
	operators _varchar(128) NULL,
	color cube NULL
);

`;

export default sql;