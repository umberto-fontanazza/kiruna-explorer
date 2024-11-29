import { Dispatch, FC, SetStateAction, useContext } from "react";
import { useAppContext } from "../context/appContext";
import { authContext } from "../context/auth";
import { useDocumentFormContext } from "../context/DocumentFormContext";
import { usePopupContext } from "../context/PopupContext";
import "../styles/CardDocument.scss";

import API from "../API/API";
import {
  Coordinates,
  Document,
  DocumentForm,
  Link,
  ScaleType,
  Upload,
  fromDocumentTypeToIcon,
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
      if (!props.document) {
        throw new Error("Document is null");
      }

      const response: Upload[] = await API.getUploads(
        props.document.id,
        "include",
      );

      if (!response || !response[0].file || !response[0].file.data) {
        throw new Error("File content is missing in response");
      }

      let blob: Blob | null = null;
      response.forEach((upload) => {
        blob = new Blob([new Uint8Array(upload.file.data)], {
          type: "application/octet-stream", // Tipo MIME generico, può essere cambiato se conosci il tipo esatto
        });

        const url = window.URL.createObjectURL(blob); // temporaneous URL for the blob
        const a = document.createElement("a"); // Create invisible element <a> to start download
        a.href = url;
        a.download = upload.title + ".dat"; // File name TODO: set extension according to file type
        a.click(); // Click on <a> to start download
        window.URL.revokeObjectURL(url); // Free memory
      });
    } catch (error) {
      console.error("Download error:", error);
      alert(`Error during the download.`);
    }
  };

  const getDocumentCoordinates = () => {
    if (props.document?.coordinates) {
      props.setMinimapCoord?.(props.document.coordinates);
    }
  };

  const handleEditButton = () => {
    setEditDocumentMode(true);
    setModalOpen(true);
    setDocumentFormSelected(props.document as DocumentForm);
    if (props.document?.coordinates) {
      setCoordinates(props.document.coordinates);
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
                title="Show on the map"
              >
                <span className="material-symbols-outlined">map</span>
              </button>
            )}
            <button
              className="btn-download"
              onClick={handleDownload}
              title="Download original resources"
            >
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
              {capitalizeFirstLetter(s)}
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
            onClick={() => handleEditButton()}
            title="Edit Document"
          >
            <span className="material-symbols-outlined">edit_document</span>
          </button>
          <button
            className="btn-edit pos"
            onClick={() => {
              props.toEditPos();
            }}
            title="Edit Coordinates"
          >
            <span className="material-symbols-outlined">edit_location</span>
          </button>
          <button
            className="btn-edit delete"
            onClick={() => handleDeleteButton()}
            title="Delete Document"
          >
            <span className="material-symbols-outlined ">delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CardDocument;
