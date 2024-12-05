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
  PolygonArea,
  ScaleType,
  Upload,
  fromDocumentTypeToIcon,
  stakeholdersOptions,
} from "../utils/interfaces";
import { capitalizeFirstLetter } from "../utils/utils";

interface CardDocumentProps {
  document: Document | null;
  toEditPos: () => void;
  showMapButton: boolean;
  isDocSelected: boolean;
  setMinimapCoord: Dispatch<
    SetStateAction<Coordinates | PolygonArea | null>
  > | null;
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
  const { setDocumentFormSelected } = useDocumentFormContext();

  const handleDownload = async () => {
    try {
      if (!props.document) {
        console.error("Document is null");
        return;
      }

      const response: Upload[] = await API.getUploads(
        props.document.id,
        "include",
      );

      if (!response || response.length === 0) {
        console.warn("No files found in the response.");
        alert("The document does not contain any original resources.");
        return;
      }

      response.forEach((upload) => {
        try {
          const binaryString = atob(upload.data);

          const byteArray = Uint8Array.from(binaryString, (char) =>
            char.charCodeAt(0),
          );

          const blob = new Blob([byteArray], {
            type: "application/octet-stream",
          });

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = upload.title || "download";
          a.click();
          window.URL.revokeObjectURL(url);
        } catch (downloadError) {
          console.error(
            `Error processing file ${upload.title}:`,
            downloadError,
          );
          alert(`Failed to download ${upload.title}.`);
        }
      });
    } catch (error) {
      console.error("Download error:", error);
      alert("An error occurred during the download process. Please try again.");
    }
  };

  const getDocumentCoordinates = () => {
    if (props.document?.coordinates) {
      props.setMinimapCoord?.(props.document.coordinates);
    } else if (props.document?.area) {
      props.setMinimapCoord?.(props.document.area);
    }
  };

  const handleEditButton = () => {
    setEditDocumentMode(true);
    setModalOpen(true);
    setDocumentFormSelected(props.document as DocumentForm);
    if (props.document?.coordinates) {
      //TODO: I have to handle this
      //setCoordinates(props.document.coordinates);
    }
  };

  const handleDeleteButton = () => {
    setIsPopupOpen(true);
    setDocumentToDelete(props.document);
    setIsDeleted(false);
  };

  return (
    <div className="content">
      <div className="header-section">
        <div className="header-content">
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
      </div>

      <div className="middle-section">
        <h3>{props.document?.title}</h3>
        <p>{props.document?.description}</p>
      </div>

      <div className="bottom-section">
        <hr />
        <h4>
          Stakeholders:&nbsp;
          {props.document?.stakeholders &&
          props.document.stakeholders.length > 0 ? (
            props.document.stakeholders.map((s, index, arr) => {
              const stakeholderOption = stakeholdersOptions.find(
                (option) => option.value === s,
              );
              return (
                <span key={`${props.document?.id}-${index}`}>
                  {stakeholderOption
                    ? stakeholderOption.label
                    : capitalizeFirstLetter(s)}
                  {index < arr.length - 1 ? ", " : ""}
                </span>
              );
            })
          ) : (
            <span>-</span>
          )}
        </h4>
        <h4>
          Scale:&nbsp;
          <span>
            {props.document?.scale.type &&
              props.document?.scale.type !== ScaleType.ArchitecturalScale &&
              capitalizeFirstLetter(props.document.scale.type).replace(
                /_/g,
                " ",
              )}
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
    </div>
  );
};

export default CardDocument;
