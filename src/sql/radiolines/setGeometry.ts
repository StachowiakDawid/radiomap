const sql = `
INSERT INTO radiolinie (
    "L.p.",
	dl_geo_tx,
	sz_geo_tx,
	"H_t_Tx [m npm]",
	"Miejscowość Tx",
	"Województwo Tx",
	"Ulica Tx",
	"Opis położenia Tx",
	dl_geo_rx,
	sz_geo_rx,
	"H_t_Rx [m npm]",
	"Miejscowość Rx",
	"Województwo Rx",
	"Ulica Rx",
	"Opis położenia Rx",
	"f [GHz]",
	nr_kan,
	symbol_planu,
	"Szer_kan [MHz]",
	polaryzacja,
	"Rodz_modu-lacji",
	"Przepływność [Mb/s]",
	"EIRP [dBm]",
	"Tłum_ant_odb_Rx [dB]",
	typ_nad,
	prod_nad,
	"Liczba_szum_Rx [dB]",
	"Tłum_ATPC [dB]",
	typ_ant_tx,
	prod_ant_tx,
	"Zysk_ant_Tx [dBi]",
	"H_ant_Tx [m npt]",
	typ_ant_rx,
	prod_ant_rx,
	"Zysk_ant_Rx [dBi]",
	"H_ant_Rx [m npt]",
	"Operator",
	"Nr_pozw/dec",
	rodz_dec,
	data_wydania,
	"Data_ważn_pozw/dec")
SELECT "L.p.",
	dl_geo_tx,
	sz_geo_tx,
	"H_t_Tx [m npm]",
	"Miejscowość Tx",
	"Województwo Tx",
	"Ulica Tx",
	"Opis położenia Tx",
	dl_geo_rx,
	sz_geo_rx,
	"H_t_Rx [m npm]",
	"Miejscowość Rx",
	"Województwo Rx",
	"Ulica Rx",
	"Opis położenia Rx",
	"f [GHz]",
	nr_kan,
	symbol_planu,
	"Szer_kan [MHz]",
	polaryzacja,
	"Rodz_modu-lacji",
	"Przepływność [Mb/s]",
	"EIRP [dBm]",
	"Tłum_ant_odb_Rx [dB]",
	typ_nad,
	prod_nad,
	"Liczba_szum_Rx [dB]",
	"Tłum_ATPC [dB]",
	typ_ant_tx,
	prod_ant_tx,
	"Zysk_ant_Tx [dBi]",
	"H_ant_Tx [m npt]",
	typ_ant_rx,
	prod_ant_rx,
	"Zysk_ant_Rx [dBi]",
	"H_ant_Rx [m npt]",
	"Operator",
	"Nr_pozw/dec",
	rodz_dec,
	data_wydania,
	"Data_ważn_pozw/dec"
FROM radiolinie_tmp;

DROP TABLE radiolinie_tmp;

UPDATE radiolinie t 
        SET tx = ST_Point(
            substring(t."dl_geo_tx", 0, 3)::float+substring(t."dl_geo_tx", 4, 2)::float/60+substring(t."dl_geo_tx", 7, 4)::float/3600,
            substring(t."sz_geo_tx", 0, 3)::float+substring(t."sz_geo_tx", 4, 2)::float/60+substring(t."sz_geo_tx", 7, 4)::float/3600
        );

UPDATE radiolinie t 
        SET rx = ST_Point(
            substring(t."dl_geo_rx", 0, 3)::float+substring(t."dl_geo_rx", 4, 2)::float/60+substring(t."dl_geo_rx", 7, 4)::float/3600,
            substring(t."sz_geo_rx", 0, 3)::float+substring(t."sz_geo_rx", 4, 2)::float/60+substring(t."sz_geo_rx", 7, 4)::float/3600
        );

UPDATE radiolinie t SET line = ST_MakeLine(tx, rx);
UPDATE radiolinie t SET color = cube(array[trunc(random() * 255 + 0), 0, trunc(random() * 255 + 0)]);
ALTER TABLE radiolinie DROP COLUMN tx;
ALTER TABLE radiolinie DROP COLUMN rx;

`;
export default sql;