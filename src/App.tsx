import { usePGlite } from "@electric-sql/pglite-react";
import { useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import Radiolines from "./Radiolines";
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import CellTowers from "./CellTowers";
import config from "../config";
import { DetailsDisplayMode, RadiomapLayer } from "../config.interface.ts";
import * as Icon from "react-bootstrap-icons";
import HorizontalTableModal from "./HorizontalTableModal.tsx";
import VerticalTableModal from "./VerticalTableModal.tsx";

function App() {
  const db = usePGlite();
  const initializedRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [modalContent, setModalContent] = useState<any>({});
  const [modalType, setModalType] = useState<RadiomapLayer>(
    RadiomapLayer.Radiolines,
  );

  if (!initializedRef.current) {
    initializedRef.current = true;
    db.waitReady.then(() => {
      setIsLoaded(true);
    });
  }

  const showModalWithData = (data: any, type: RadiomapLayer) => {
    setModalContent(data);
    setModalType(type);
    setShow(true);
  };

  return isLoaded ? (
    <>
      <MapContainer
        center={[52.069245, 19.480193]}
        zoom={13}
        scrollWheelZoom={true}
        style={{
          height: "auto",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
        }}
        preferCanvas={true}
        zoomAnimation={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {config.layers.includes(RadiomapLayer.Radiolines) && (
          <Radiolines sendData={showModalWithData} />
        )}
        {config.layers.includes(RadiomapLayer.CellTowers) && (
          <CellTowers sendData={showModalWithData} />
        )}
      </MapContainer>
      {show &&
        (config.detailsDisplayMode[modalType] === DetailsDisplayMode.Horizontal ? (
          <HorizontalTableModal
            data={modalContent}
            type={modalType}
            handleClose={handleClose}
          />
        ) : (
          <VerticalTableModal
            data={modalContent}
            type={modalType}
            handleClose={handleClose}
          />
        ))}
      <div className="fixed-bottom">
        <div className="bg-white ms-3" style={{ width: "fit-content" }}>
          <a href="https://github.com/stachowiakdawid/radiomap">
            <Icon.Github /> GitHub
          </a>
        </div>
      </div>
    </>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Ładowanie</span>
      </Spinner>
    </div>
  );
}

export default App;
