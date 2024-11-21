import dayjs from "dayjs";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import "../styles/ModalAddDocument.scss";
import "../styles/ProgressBar.scss";
import {
  Coordinates,
  createDocumentStateFromExisting,
  createNewDocumentState,
  Document,
  DocumentType,
  Link,
  ScaleType,
  Stakeholder,
} from "../utils/interfaces";
import LinksTable from "./LinksTable";
import ProgressBar from "./ProgressBar";
import SearchBar from "./SearchBar";

interface DocumentFormProps {
  modalOpen: boolean;
  newPos: Coordinates;
  editDocumentMode: boolean;
  onClose: () => void;
  onSubmit: (newDocument: Document) => void;
  documents: Document[];
  closePositionView: () => void;
  docSelected: Document | null;
  setEditDocumentMode: Dispatch<SetStateAction<boolean>>;
}

const stakeholdersOptions = [
  { value: Stakeholder.Lkab, label: "LKAB" },
  { value: Stakeholder.KirunaKommun, label: "Kiruna kommun" },
  { value: Stakeholder.Residents, label: "Residents" },
  { value: Stakeholder.WhiteArkitekter, label: "White Arkitekter" },
];

const DocumentForm: FC<DocumentFormProps> = ({
  modalOpen,
  onClose,
  onSubmit,
  documents,
  newPos,
  closePositionView,
  setEditDocumentMode,
  docSelected,
  editDocumentMode,
}) => {
  const initialDocumentState =
    editDocumentMode && docSelected
      ? createDocumentStateFromExisting(docSelected)
      : createNewDocumentState();
  const [page, setPage] = useState<number>(1);
  const [newDoc, setNewDoc] = useState<Document>(initialDocumentState);
  const [tableLinks, setTableLinks] = useState<Link[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  /////// FILE ATTACHMENT CODE ///////

  /*const [files, setFiles] = useState<File[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selectedFiles);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };*/

  useEffect(() => {
    if (docSelected) {
      setNewDoc(docSelected);
      if (docSelected.links) {
        setTableLinks(docSelected.links);
      }
    }
    setIsInitialized(true);
  }, [newPos, editDocumentMode, docSelected]);

  useEffect(() => {
    setNewDoc((prev) => ({
      ...prev,
      coordinates: { latitude: newPos.latitude, longitude: newPos.longitude },
    }));
  }, [newPos]);

  const handleCheckboxChange = (event: {
    target: { value: string; checked: boolean };
  }) => {
    const { value, checked } = event.target;

    setNewDoc((prev) => {
      const stakeholders = prev.stakeholders || [];
      if (checked) {
        // add option if selected
        return {
          ...prev,
          stakeholders: [...stakeholders, value as Stakeholder],
        };
      } else {
        // remove option if unselected
        return {
          ...prev,
          stakeholders: stakeholders.filter(
            (stake) => stake !== (value as Stakeholder)
          ),
        };
      }
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewDoc((prev) => ({
      ...prev,
      issuanceDate: value ? dayjs(value) : undefined,
    }));
  };

  const handleFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    onSubmit({
      ...newDoc,
      links: tableLinks,
    });

    resetForm();
  };

  const resetForm = () => {
    setNewDoc(initialDocumentState);
    setEditDocumentMode(false);
    setPage(1);
    setTableLinks([]);
    closePositionView();
  };

  // Return early if modal is closed
  if (!modalOpen || !isInitialized) return null;
  if (page === 1) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button
            className="close-button"
            onClick={() => {
              setNewDoc(initialDocumentState);
              onClose();
            }}
          >
            <img src="/x.png" alt="Close" />
          </button>
          <h2>{!editDocumentMode ? "Add New Document" : "Update Document"}</h2>

          <ProgressBar currentPage={page} />

          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              if (page === 1) {
                // Passa alla pagina successiva solo se la validazione è passata
                setPage(2);
              }
            }}
          >
            {/* Title Input */}
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                placeholder="Enter Document Title"
                value={newDoc.title}
                onChange={(e) =>
                  setNewDoc((prev) => ({ ...prev, title: e.target.value }))
                }
                required
                className="input-title"
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={newDoc.description || ""}
                placeholder="Enter Document Description"
                onChange={(e) =>
                  setNewDoc((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
              />
            </div>
            {/* Scale Selection */}
            <div className="line">
              <div className="form-group">
                <label>Scale *</label>
                <select
                  defaultValue={newDoc.scale.type}
                  onChange={(e) => {
                    const scaleType = e.target.value;
                    const scaleRatio =
                      scaleType === ScaleType.Ratio ? 1 : undefined;
                    setNewDoc((prev) => ({
                      ...prev,
                      scale: {
                        type: scaleType as ScaleType,
                        ratio: scaleRatio,
                      },
                    }));
                  }}
                  required
                >
                  {Object.values(ScaleType).map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>

              {/* Numeric Scale Input */}
              <div className="form-group">
                {newDoc.scale.type === ScaleType.Ratio && (
                  <div className="ratio-group">
                    <span className="ratio">1: </span>
                    <input
                      type="number"
                      min="1"
                      id="no-spin"
                      value={newDoc.scale.ratio}
                      onChange={(e) =>
                        setNewDoc((prev) => ({
                          ...prev,
                          scale: {
                            ...prev.scale,
                            ratio: Number(e.target.value),
                          },
                        }))
                      }
                      style={{
                        width: "95%",
                        marginTop: "7.5%",
                        padding: "0.7rem",
                        borderRadius: "8px",
                        fontSize: "1rem",
                      }}
                      required
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="line">
              {/* Issuance Date */}
              <div className="form-group">
                <label>Issuance Date</label>
                <input
                  type="date"
                  value={
                    newDoc.issuanceDate
                      ? newDoc.issuanceDate.format("YYYY-MM-DD")
                      : ""
                  }
                  onChange={handleDateChange}
                />
              </div>
              <div className="form-group">
                <label>Type *</label>
                <select
                  value={newDoc.type}
                  onChange={(e) =>
                    setNewDoc((prev) => ({
                      ...prev,
                      type: e.target.value as DocumentType,
                    }))
                  }
                  required
                >
                  <option value="">Select type</option>
                  <option value={DocumentType.Informative}>
                    Informative Document
                  </option>
                  <option value={DocumentType.Prescriptive}>
                    Prescriptive Document
                  </option>
                  <option value={DocumentType.Design}>Design Document</option>
                  <option value={DocumentType.Technical}>
                    Technical Document
                  </option>
                  <option value={DocumentType.MaterialEffect}>
                    Material effect
                  </option>
                </select>
              </div>
            </div>

            {/* Stakeholders */}
            <div className="form-group">
              <label>Stakeholders *</label>
              <div className="checkbox-group stakeholders">
                {stakeholdersOptions.map((option) => (
                  <label key={option.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={newDoc.stakeholders?.includes(option.value)}
                      onChange={handleCheckboxChange}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
            {/* DO NOT ELIMINATE THIS CODE COMMENTED */}
            {/* <div className="form-group">
                  <label>Pages (optional):</label>
                  <input
                    type="number"
                    id="no-spin"
                    value={newDoc.pages !== null ? newDoc.pages : ""}
                    onChange={(e) => {
                      setNewDoc((prev) => ({
                        ...prev,
                        pages: e.target.value ? Number(e.target.value) : null,
                      }));
                    }}
                  />
                </div> */}
            {/*<div className="form-group">
                <div
                  className="file-upload-area"
                  onDrop={handleFileDrop}
                  onDragOver={handleDragOver}
                  style={{
                    border: "2px dashed #ccc",
                    padding: "20px",
                    borderRadius: "5px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <p>Drag and drop files here, or</p>
                  <label htmlFor="file-upload" className="file-upload-label">
                    <strong>browse</strong>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.png,.jpg"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                  />
                </div>
                
                {files.length > 0 && (
                  <div className="uploaded-files-list">
                    <h4>Files to Upload:</h4>
                    <ul>
                      {files.map((file, index) => (
                        <li key={index}>
                          {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>*/}

            {/* Coordinates */}
            <div className="line">
              {/* Latitude */}
              <div className="form-group">
                <label>Latitude *</label>
                <input
                  type="number"
                  id="no-spin"
                  step="0.00000000000001"
                  name="latitude"
                  min="-90"
                  max="90"
                  value={
                    newDoc.coordinates?.latitude !== null
                      ? newDoc.coordinates?.latitude
                      : ""
                  }
                  onChange={(e) =>
                    setNewDoc((prev: Document) => ({
                      ...prev,
                      coordinates: {
                        latitude: Number(e.target.value),
                        longitude: prev.coordinates?.longitude ?? 0,
                      },
                    }))
                  }
                  placeholder="Es. 34.1234"
                />
              </div>

              {/* Longitude */}
              <div className="form-group">
                <label>Longitude *</label>
                <input
                  lang="en"
                  type="number"
                  step="0.00000000000001"
                  id="no-spin"
                  name="longitude"
                  min="-180"
                  max="180"
                  value={
                    newDoc.coordinates?.longitude !== null
                      ? newDoc.coordinates?.longitude
                      : ""
                  }
                  onChange={(e) => {
                    setNewDoc((prev) => ({
                      ...prev,
                      coordinates: {
                        latitude: prev.coordinates?.latitude ?? 0,
                        longitude: Number(e.target.value),
                      },
                    }));
                  }}
                  placeholder="Es. 20.2253"
                />
              </div>
            </div>
            {/* Form Buttons */}
            <div className="button-group">
              <button type="submit" className="submit-button">
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } else if (page === 2) {
    return (
      <>
        {
          <div className="modal-overlay-2">
            <div className="modal-content-2">
              <button
                className="close-button-2"
                onClick={() => {
                  setNewDoc(initialDocumentState);
                  onClose();
                  setPage(1);
                }}
              >
                <img src="/x.png" alt="Close" />
              </button>
              <h2>
                {!editDocumentMode
                  ? "New Document Registration"
                  : "Update Document"}
              </h2>

              <ProgressBar currentPage={page} />

              {/* Body */}
              <div className="second-page-body">
                <div className="links-table-container">
                  {tableLinks.length != 0 ? (
                    <div className="table-wrapper">
                      <LinksTable
                        tableLinks={tableLinks}
                        setTableLinks={setTableLinks}
                        documents={documents}
                      />
                    </div>
                  ) : (
                    <h3>
                      If you need to add links to other documents, please use
                      the search bar below.
                    </h3>
                  )}
                </div>

                <div className="bottom-group">
                  <SearchBar
                    documents={documents}
                    tableLinks={tableLinks}
                    setTableLinks={setTableLinks}
                  />

                  <div className="button-group-2">
                    <button
                      className="cancel-button-2"
                      onClick={() => setPage(1)}
                    >
                      Back
                    </button>
                    <button
                      className="submit-button-2"
                      onClick={handleFormSubmit}
                    >
                      {!editDocumentMode ? "Add Document" : "Update Document"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </>
    );
  }
};

export default DocumentForm;
