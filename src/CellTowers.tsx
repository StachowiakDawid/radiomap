import { useLiveQuery, usePGlite } from "@electric-sql/pglite-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import { useEventHandlers } from "@react-leaflet/core";
import type { Feature, GeoJsonObject } from "geojson";
import config from "../config";
import { RadiomapLayer } from "../config.interface";
import L from "leaflet";

function CellTowers({
  sendData,
}: {
  sendData: (data: any, type: RadiomapLayer) => void;
}) {
  const db = usePGlite();
  const parentMap = useMap();
  const [minX, setMinX] = useState<number | null>(null);
  const [minY, setMinY] = useState<number | null>(null);
  const [maxX, setMaxX] = useState<number | null>(null);
  const [maxY, setMaxY] = useState<number | null>(null);
  const [zoom, setZoom] = useState<number>(13);

  const items = useLiveQuery(
    `
    SELECT ST_AsGeoJSON(r.*, id_column => 'id')::json AS feature, r.point, r.id AS id FROM bts_point r 
    WHERE $1 AND r.point && ST_MakeEnvelope($2, $3, $4, $5)
  `,
    [zoom >= 11, minX, minY, maxX, maxY],
  );
  const initializedRef = useRef(false);

  const onChange = useCallback(() => {
    setMinX(parentMap.getBounds().getWest());
    setMinY(parentMap.getBounds().getSouth());
    setMaxX(parentMap.getBounds().getEast());
    setMaxY(parentMap.getBounds().getNorth());
    setZoom(parentMap.getZoom());
  }, [parentMap]);

  if (!initializedRef.current) {
    initializedRef.current = true;
    onChange();
  }

  const handlers = useMemo(
    () => ({ moveend: onChange, zoomend: onChange }),
    [],
  );
  useEventHandlers({ instance: parentMap } as any, handlers);

  const styleFunction = (feature: Feature) => {
    return {
      color: "rgb" + feature?.properties?.color,
    };
  };

  const onEachFeature = (feature: Feature, layer: any) => {
    layer.on({
      click: async () => {
        const cellTowers = await db.query(
          `SELECT * FROM bts WHERE ("Dl_geo_stacji" = $1 AND "Szer_geo_stacji" = $2)`,
          [
            feature.properties?.Dl_geo_stacji,
            feature.properties?.Szer_geo_stacji,
          ],
        );
        sendData(cellTowers, RadiomapLayer.CellTowers);
      },
    });
  };

  const pointToLayer = (feature: Feature, latlng: any) => {
    return L.circleMarker(latlng, {
      radius: 5,
      fillColor: "rgb" + feature?.properties?.color,
      color: "rgb" + feature?.properties?.color,
    });
  }

  return (
    zoom >= 11 &&
    (items?.rows?.length ?? 0) <
      config.maxElements[RadiomapLayer.CellTowers] && (
      <>
        {items?.rows.map((i) => (
          <GeoJSON
            data={i.feature as GeoJsonObject}
            key={i.id as number}
            style={styleFunction(i.feature as Feature)}
            onEachFeature={onEachFeature}
            pointToLayer={pointToLayer}
          />
        ))}{" "}
      </>
    )
  );
}

export default CellTowers;
