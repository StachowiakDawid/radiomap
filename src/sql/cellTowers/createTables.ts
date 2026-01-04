const sql = `
CREATE TABLE IF NOT EXISTS bts_tmp (
	operator varchar(128) NULL,
	nr_decyzji varchar(50) NULL,
	rodz_dec varchar(5) NULL,
	data_waznosci varchar(10) NULL,
	"Dl_geo_stacji" varchar(10) NULL,
	"Szer_geo_stacji" varchar(10) NULL,
	"Miejscowosc" varchar(50) NULL,
	"Lokalizacja" varchar(100) NULL,
	"IdStacji" varchar(20) NULL,
	"TERYT" varchar(10) NULL,
	typ varchar(10) NULL,
	stan_na_dzien varchar(14) NULL
);

CREATE TABLE IF NOT EXISTS bts (
	operator varchar(128) NULL,
	nr_decyzji varchar(50) NULL,
	rodz_dec varchar(5) NULL,
	data_waznosci varchar(10) NULL,
	"Dl_geo_stacji" varchar(10) NULL,
	"Szer_geo_stacji" varchar(10) NULL,
	"Miejscowosc" varchar(50) NULL,
	"Lokalizacja" varchar(100) NULL,
	"IdStacji" varchar(20) NULL,
	"TERYT" varchar(10) NULL,
	typ varchar(10) NULL,
	stan_na_dzien varchar(14) NULL,
	point public.geometry NULL,
	id SERIAL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS bts_point (
	id SERIAL PRIMARY KEY,
	"Dl_geo_stacji" varchar(10) NULL,
	"Szer_geo_stacji" varchar(10) NULL,
	point public.geometry NULL,
	operators _varchar(128) NULL,
	color cube NULL
);

`;

export default sql;