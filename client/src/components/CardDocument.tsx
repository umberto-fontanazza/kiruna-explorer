import { Dispatch, FC, SetStateAction, useContext, useState } from "react";
import { useAppContext } from "../context/appContext";
import { authContext } from "../context/auth";
import { useDocumentFormContext } from "../context/DocumentFormContext";
import { usePopupContext } from "../context/PopupContext";
import "../styles/CardDocument.scss";

import { useLocation } from "react-router-dom";
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
import { capitalizeFirstLetter, formatDate } from "../utils/utils";

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
    showTooltipUploads,
    visualLinks,
    setVisualLinks,
    setEditDocumentMode,
    setShowTooltipUploads,
  } = useAppContext();
  const { setDocumentToDelete, setIsDeleted } = usePopupContext();
  const { setDocumentFormSelected } = useDocumentFormContext();

  const location = useLocation();

  const [uploadsById, setUploadsByID] = useState<Upload[]>([]);

  const handleShowUploads = async () => {
    if (!showTooltipUploads) {
      try {
        if (!props.document) {
          console.error("Document is null");
          return;
        }
        const response: Upload[] = await API.getUploads(props.document.id);
        setUploadsByID(response);
        setShowTooltipUploads(true);
      } catch (err) {
        console.error("Error fetching all uploads: " + err);
      }
    } else {
      setShowTooltipUploads(false);
      setUploadsByID([]);
    }
  };

  const handleDownload = async (uploadId: number) => {
    try {
      const upload = await API.getUploadById(uploadId);

      if (!upload) {
        console.error("File not found");
        return;
      }

      try {
        const binaryString = atob(upload.file);

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
        console.error(`Error processing file ${upload.title}:`, downloadError);
        alert(`Failed to download ${upload.title}.`);
      }
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
    setShowTooltipUploads(false);
    setEditDocumentMode(true);
    setModalOpen(true);
    setDocumentFormSelected(props.document as DocumentForm);
  };

  const handleDeleteButton = () => {
    setShowTooltipUploads(false);
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
              <div className="btn-download-container">
                <button
                  className="btn-download"
                  onClick={handleShowUploads}
                  title="Download original resources"
                >
                  <span className="material-symbols-outlined">file_save</span>
                </button>
                {showTooltipUploads && (
                  <div className="tooltip">
                    {uploadsById.length > 0 ? (
                      <ul>
                        {uploadsById.map((upload) => (
                          <li key={upload.id}>
                            <button
                              className="tooltip-item"
                              onClick={() =>
                                upload.id !== undefined &&
                                handleDownload(upload.id)
                              }
                            >
                              {upload.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul>
                        <li className="tooltip-no-item">
                          No Original Resources for this Document
                        </li>
                      </ul>
                    )}
                  </div>
                )}
              </div>
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
            {props.document?.issuanceTime
              ? formatDate(props.document.issuanceTime)
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
            Connections:&nbsp;
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
