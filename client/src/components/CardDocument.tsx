import { Dispatch, FC, SetStateAction, useContext } from "react";
import { useAppContext } from "../context/appContext";
import { authContext } from "../context/auth";
import { useDocumentFormContext } from "../context/DocumentFormContext";
import { usePopupContext } from "../context/PopupContext";
import "../styles/CardDocument.scss";
import {
  Coordinates,
  Document,
  fromDocumentTypeToIcon,
  Link,
  ScaleType,
  stakeholderDisplay,
} from "../utils/interfaces";
import { capitalizeFirstLetter } from "../utils/utils";

interface CardDocumentProps {
  document: Document | null;
  toEditPos: () => void;
  showMapButton: boolean;
  isDocSelected: boolean;
  setMinimapCoord: Dispatch<SetStateAction<Coordinates>> | null;
}

const CardDocument: FC<CardDocumentProps> = (props) => {
  const { user } = useContext(authContext);
  const {
    setIsPopupOpen,
    setModalOpen,
    visualLinks,
    setVisualLinks,
    setEditDocumentMode,
  } = useAppContext();
  const { setDocumentToDelete, setIsDeleted } = usePopupContext();
  const { setDocumentFormSelected, setCoordinates } = useDocumentFormContext();

  const handleDownload = async () => {
    try {
      // Simuliamo un file JSON come risposta API
      const simulatedFileContent = JSON.stringify({
        id: "12345",
        name: "Test Document",
        content: "Questo è un file di prova per il download.",
      });

      // Creiamo un Blob con il contenuto simulato
      const blob = new Blob([simulatedFileContent], {
        type: "application/json",
      });

      // Crea un URL temporaneo per il Blob
      const url = window.URL.createObjectURL(blob);

      // Crea un elemento <a> invisibile per avviare il download
      const a = document.createElement("a");
      a.href = url;

      // Nome del file per il download
      a.download = "documento-di-prova.json";

      // Simula il click per avviare il download
      a.click();

      // Libera la memoria per l'URL creato
      window.URL.revokeObjectURL(url);

      console.log("Download completato con successo!");
    } catch (error) {
      console.error("Errore durante il download:", error);
      alert("Si è verificato un errore durante il download del file.");
    }
  };

  const getDocumentCoordinates = () => {
    if (props.document?.coordinates) {
      props.setMinimapCoord?.(props.document.coordinates);
    }
  };

  const handleDeleteButton = () => {
    setIsPopupOpen(true);
    setDocumentToDelete(props.document);
    setIsDeleted(false);
  };

  return (
    <div className="content">
      <div className="header">
        <span
          className={`material-symbols-outlined color-${fromDocumentTypeToIcon.get(props.document?.type)} size`}
        >
          {fromDocumentTypeToIcon.get(props.document?.type)}
        </span>
        {props.isDocSelected && (
          <div className="header-btns">
            {props.showMapButton && (
              <button
                className="btn-map"
                onClick={() => getDocumentCoordinates()}
              >
                <span className="material-symbols-outlined">map</span>
              </button>
            )}
            <button className="btn-download" onClick={handleDownload}>
              <span className="material-symbols-outlined">file_save</span>
            </button>
          </div>
        )}
      </div>

      <hr />
      <h3>{props.document?.title}</h3>
      <p>{props.document?.description}</p>
      <hr />
      <h4>
        Stakeholders:&nbsp;
        {props.document?.stakeholders ? (
          props.document?.stakeholders?.map((s, index, arr) => (
            <span key={`${props.document?.id}-${index}`}>
              {stakeholderDisplay[s]}
              {index < arr.length - 1 ? ", " : ""}
            </span>
          ))
        ) : (
          <span>-</span>
        )}
      </h4>
      <h4>
        Scale:&nbsp;
        <span>
          {props.document?.scale.type &&
            props.document?.scale.type !== ScaleType.ArchitecturalScale &&
            capitalizeFirstLetter(props.document.scale.type)}
          {props.document?.scale.type &&
            props.document?.scale.type === ScaleType.ArchitecturalScale &&
            `1:${props.document.scale.ratio}`}
        </span>
      </h4>

      <h4>
        Issuance Date:&nbsp;
        <span>
          {props.document?.issuanceDate?.isValid()
            ? props.document?.issuanceDate?.format("MMMM D, YYYY")
            : "-"}
        </span>
      </h4>
      <h4>
        Type:{" "}
        <span>
          {props.document?.type &&
            capitalizeFirstLetter(props.document?.type).replace(/_/g, " ")}
        </span>
      </h4>
      <div className="connection-group">
        <h4>
          Links:&nbsp;
          <span>
            {props.document?.links?.reduce(
              (acc: number, link: Link) => acc + link.linkTypes.length,
              0,
            ) || 0}
          </span>
        </h4>
        {props.document?.links && props.document?.links.length > 0 && (
          <button
            className={`see-links ${visualLinks ? "fill" : "no-fill"}`}
            onClick={() =>
              visualLinks ? setVisualLinks(false) : setVisualLinks(true)
            }
          >
            <span
              className={`material-symbols-outlined dark ${visualLinks ? "fill" : "no-fill"}`}
            >
              visibility
            </span>
          </button>
        )}
      </div>
      {user && props.isDocSelected && (
        <div className="btn-group">
          <button
            className="btn-edit"
            onClick={() => {
              setEditDocumentMode(true);
              setModalOpen(true);
              setDocumentFormSelected(props.document);
              if (props.document?.coordinates) {
                setCoordinates(props.document.coordinates);
              }
            }}
          >
            <span className="material-symbols-outlined">edit_document</span>
          </button>
          <button
            className="btn-edit pos"
            onClick={() => {
              props.toEditPos();
            }}
          >
            <span className="material-symbols-outlined">edit_location</span>
          </button>
          <button
            className="btn-edit delete"
            onClick={() => handleDeleteButton()}
          >
            <span className="material-symbols-outlined ">delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CardDocument;
