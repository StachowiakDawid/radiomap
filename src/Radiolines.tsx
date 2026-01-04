import {
  useLiveQuery,
  usePGlite,
} from "@electric-sql/pglite-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import { useEventHandlers } from "@react-leaflet/core";
import type { Feature, GeoJsonObject } from "geojson";
import { RadiomapLayer } from "../config.interface";
import config from "../config";

function Radiolines({ sendData }: { sendData: (data: any, type: RadiomapLayer) => void }) {
  const db = usePGlite();
  const parentMap = useMap();
  const [minX, setMinX] = useState<number | null>(null);
  const [minY, setMinY] = useState<number | null>(null);
  const [maxX, setMaxX] = useState<number | null>(null);
  const [maxY, setMaxY] = useState<number | null>(null);
  const [zoom, setZoom] = useState<number>(13);

  const items = useLiveQuery(
    `
    SELECT ST_AsGeoJSON(r.*, id_column => 'id')::json AS feature, r.id AS id FROM radiolinie r
    WHERE $1 AND ST_Intersects(r.line, ST_MakeEnvelope($2, $3, $4, $5))
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
        const lines = await db.query(
          `SELECT * FROM radiolinie WHERE (dl_geo_tx = $1 AND sz_geo_tx = $2 AND dl_geo_rx = $3 AND sz_geo_rx = $4) 
          OR (dl_geo_tx = $3 AND sz_geo_tx = $4 AND dl_geo_rx = $1 AND sz_geo_rx = $2)`,
          [
            feature.properties?.dl_geo_tx,
            feature.properties?.sz_geo_tx,
            feature.properties?.dl_geo_rx,
            feature.properties?.sz_geo_rx,
          ],
        );
        sendData(lines, RadiomapLayer.Radiolines);
      },
    });
  };

  return (
    zoom >= 11 && (items?.rows?.length ?? 0) < config.maxElements[RadiomapLayer.Radiolines] && (
      <>
        {items?.rows.map((i) => (
          <GeoJSON
            data={i.feature as GeoJsonObject}
            key={i.id as number}
            style={styleFunction(i.feature as Feature)}
            onEachFeature={onEachFeature}
          />
        ))}
      </>
    )
  );
}

export default Radiolines;
