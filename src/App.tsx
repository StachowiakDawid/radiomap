import { usePGlite } from "@electric-sql/pglite-react";
import { useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import Radiolines from "./Radiolines";
import { Button, Modal, Spinner, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { databaseDictionaries } from "./databaseDictionaries.ts";
import CellTowers from "./CellTowers";
import config from "../config";
import { RadiomapLayer } from "../config.interface.ts";
import * as Icon from "react-bootstrap-icons";

function App() {
  const db = usePGlite();
  const initializedRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [modalContent, setModalContent] = useState<any>({});
  const [modalContentCount, setModalContentCount] = useState<number>(0);
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
    const tableData: {
      [key in keyof typeof databaseDictionaries]: {
        [key: string]: { id: number; value: string }[];
      };
    } = {
      Radiolines: {},
      CellTowers: {},
    };
    if (data.rows.length > 0) {
      for (const key in databaseDictionaries[type]) {
        tableData[type][key] = data.rows.map((row: any) => ({
          id: row.id,
          value: row[key] ?? "",
        }));
      }
      setModalContent(tableData[type]);
      setModalContentCount(data.rows.length);
      setModalType(type);
      handleShow();
    }
  };

  const printModalHeader = (resultsCount: number) => {
    const rest = resultsCount % 10;
    if (rest === 1 && resultsCount !== 11) {
      return `${resultsCount} wynik`;
    } else if (
      rest >= 2 &&
      rest <= 4 &&
      !(resultsCount >= 12 && resultsCount <= 14)
    ) {
      return `${resultsCount} wyniki`;
    } else {
      return `${resultsCount} wyników`;
    }
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
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {show && printModalHeader(modalContentCount)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="overflow-scroll">
          <Table striped bordered hover>
            <tbody>
              {show &&
                Object.keys(databaseDictionaries[modalType]).map((key) => (
                  <tr key={modalType + databaseDictionaries[modalType][key]}>
                    <td>
                      <b>{databaseDictionaries[modalType][key]}</b>
                    </td>
                    {modalContent[key].map(
                      (value: { id: number; value: string }) => (
                        <td
                          key={
                            modalType +
                            databaseDictionaries[modalType][key] +
                            value.id
                          }
                        >
                          {value.value}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Zamknij
          </Button>
        </Modal.Footer>
      </Modal>
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
