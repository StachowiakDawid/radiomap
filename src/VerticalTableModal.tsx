import { useRef, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { databaseDictionaries } from "./databaseDictionaries.ts";
import { RadiomapLayer } from "../config.interface.ts";

function VerticalTableModal({
  data,
  type,
  handleClose,
}: {
  data: any;
  type: RadiomapLayer;
  handleClose: () => void;
}) {
  const [show, setShow] = useState(false);
  const [modalContent, setModalContent] = useState<any>({});
  const [modalContentCount, setModalContentCount] = useState<number>(0);
  const [modalType, setModalType] = useState<RadiomapLayer>(
    RadiomapLayer.Radiolines,
  );
  const isInitializedRef = useRef<boolean>(false);

  if (!isInitializedRef.current) {
    isInitializedRef.current = true;
    setModalContent(data.rows);
    setModalContentCount(data.rows.length);
    setModalType(type);
    setShow(true);
  }

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

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{show && printModalHeader(modalContentCount)}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="overflow-scroll">
        <Table striped bordered hover>
          <thead>
            <tr>
              {show &&
                Object.keys(modalContent[0]).filter(key => databaseDictionaries[modalType][key]).map((key: string) => (
                  <th key={key}>{databaseDictionaries[modalType][key] || key}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {show &&
              modalContent.map((row: any, index: number) => (
                <tr key={index}>
                  {Object.keys(row).filter(key => databaseDictionaries[modalType][key]).map((key: string) => (
                    <td key={key}>{row[key]}</td>
                  ))}
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
  );
}

export default VerticalTableModal;
