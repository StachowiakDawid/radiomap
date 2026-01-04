import { RadiomapLayer } from "../config.interface";

const radiolineDatabaseDictionary: { [key: string]: string } = {
  "L.p.": "L.p.",
  "dl_geo_tx": "Długość geograficzna nadajnika", 
  "sz_geo_tx": "Szerokość geograficzna nadajnika",
  "H_t_Tx [m npm]": "Wysokość nadajnika nad poziomem morza [m]",
  "Miejscowość Tx": "Miejscowość nadajnika",
  "Województwo Tx": "Województwo nadajnika",
  "Ulica Tx": "Ulica nadajnika",
  "Opis położenia Tx": "Opis położenia nadajnika",
  "dl_geo_rx": "Długość geograficzna odbiornika",
  "sz_geo_rx": "Szerokość geograficzna odbiornika",
  "H_t_Rx [m npm]": "Wysokość odbiornika nad poziomem morza [m]",
  "Miejscowość Rx": "Miejscowość odbiornika",
  "Województwo Rx": "Województwo odbiornika",
  "Ulica Rx": "Ulica odbiornika",
  "Opis położenia Rx": "Opis położenia odbiornika",
  "f [GHz]:": "Częstotliwość [GHz]",
  "nr_kan": "Numer kanału",
  "symbol_planu": "Symbol planu",
  "Szer_kan [MHz]": "Szerokość kanału [MHz]",
  "polaryzacja": "Polaryzacja",
  "Rodz_modu-lacji": "Rodzaj modulacji",
  "Przepływność [Mb/s]": "Przepływność [Mb/s]",
  "EIRP [dBm]": "EIRP [dBm]",
  "Tłum_ant_odb_Rx [dB]": "Tłumienie anteny odbiorczej [dB]",
  "typ_nad": "Typ nadajnika",
  "prod_nad": "Producent nadajnika",
  "Liczba_szum_Rx [dB]:": "Liczba szumów odbiornika [dB]",
  "Tłum_ATPC [dB]": "Tłumienie ATPC [dB]",
  "typ_ant_tx": "Typ anteny nadawczej",
  "prod_ant_tx": "Producent anteny nadawczej",
  "Zysk_ant_Tx [dBi]": "Zysk anteny nadawczej [dBi]",
  "H_ant_Tx [m npt]:": "Wysokość anteny nadawczej nad poziomem terenu [m]",
  "typ_ant_rx": "Typ anteny odbiorczej",
  "prod_ant_rx": "Producent anteny odbiorczej",
  "Zysk_ant_Rx [dBi]": "Zysk anteny odbiorczej [dBi]",
  "H_ant_Rx [m npt]:": "Wysokość anteny odbiorczej nad poziomem terenu [m]",
  "Operator": "Operator",
  "Nr_pozw/dec": "Numer pozwolenia/decyzji",
  "rodz_dec": "Rodzaj decyzji",
  "data_wydania": "Data wydania",
  "Data_ważn_pozw/dec": "Data ważności pozwolenia/decyzji",
  "stan_na_dzien": "Stan na dzień"
};

export { radiolineDatabaseDictionary };

const cellTowersDatabaseDictionary: { [key: string]: string } = {
  "operator": "Operator",
  "nr_decyzji": "Numer decyzji",
  "rodz_dec": "Rodzaj decyzji",
  "data_waznosci": "Data ważności",
  "Dl_geo_stacji": "Długość geograficzna stacji",
  "Szer_geo_stacji": "Szerokość geograficzna stacji",
  "Miejscowosc": "Miejscowość",
  "Lokalizacja": "Lokalizacja",
  "IdStacji": "Identyfikator stacji",
  "TERYT": "TERYT",
  "typ": "Typ",
  "stan_na_dzien": "Stan na dzień"
};

export { cellTowersDatabaseDictionary };

const databaseDictionaries: { [key in RadiomapLayer]: object } = {
  [RadiomapLayer.Radiolines]: radiolineDatabaseDictionary,
  [RadiomapLayer.CellTowers]: cellTowersDatabaseDictionary
};

export { databaseDictionaries };