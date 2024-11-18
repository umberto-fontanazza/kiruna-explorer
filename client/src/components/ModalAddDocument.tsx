import { FC, useState } from "react";
import LinksTable from "./LinksTable";
import SearchBar from "./SearchBar";

import { Document, DocumentType, Link, Stakeholder } from "../utils/interfaces";
import "../styles/ModalAddDocument.scss";
//import ISO6391 from "iso-639-1";
import dayjs from "dayjs";

//TODO: Fix color of the form

interface ModalAddProps {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (newDocument: Document) => void;
  documents: Document[];
}

const ModalForm: FC<ModalAddProps> = ({
  modalOpen,
  onClose,
  onSubmit,
  documents,
}) => {
  // Initial State for new document
  const initialDocumentState: Document = {
    id: -1,
    title: "",
    description: "",
    stakeholders: [],
    scale: "",
    issuanceDate: null,
    type: undefined,
    links: [],
    language: "",
    pages: null,
    coordinates: { latitude: null, longitude: null },
  };

  ////// OPTIONS AND DATA ///////

  const scaleValues = [
    { value: "blueprints/effects", label: "Blueprints/Effects" },
    { value: "text", label: "Text" },
  ];
  //const languages = ISO6391.getAllNames().sort();

  const stakeholdersOptions = [
    { value: Stakeholder.Lkab, label: "LKAB" },
    { value: Stakeholder.KirunaKommun, label: "Kiruna kommun" },
    { value: Stakeholder.Residents, label: "Residents" },
    { value: Stakeholder.WhiteArkitekter, label: "White Arkitekter" },
  ];

  ////// COMPONENT STATE /////

  const [page, setPage] = useState<number>(1);
  const [newDoc, setNewDoc] = useState<Document>(initialDocumentState);
  const [isNumericScale, setIsNumericScale] = useState<boolean>(false);
  const [tableLinks, setTableLinks] = useState<Link[]>([]);

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

  // Handle Checkbox Change
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

  // Handle Form Submission
  const handleFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (isNumericScale) {
      newDoc.scale = "1:" + newDoc.scale;
    }
    onSubmit({
      ...newDoc,
      links: tableLinks,
    });
    resetForm();
  };

  // Reset Form
  const resetForm = () => {
    setNewDoc(initialDocumentState);
    setPage(1);
    setTableLinks([]);
  };

  // Return early if modal is closed
  if (!modalOpen) return null;
  if (page === 1) {
    return (
      <>
        {
          <div className="modal-overlay">
            <form className="modal-content" onSubmit={handleFormSubmit}>
              <h2>New Document Registration</h2>
              <button
                className="close-button"
                onClick={() => {
                  setNewDoc(initialDocumentState);
                  onClose();
                }}
              >
                <img src="/x.png" alt="Close" />
              </button>

              <ProgressBar currentPage={page} />

              <form onSubmit={handleFormSubmit}>
                {/* Title Input */}
                <div className="form-group">
                  <label className="title">Title *</label>
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
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "numeric") {
                          setIsNumericScale(true);
                          setNewDoc((prev) => ({ ...prev, scale: "" }));
                        } else {
                          setIsNumericScale(false);
                          setNewDoc((prev) => ({ ...prev, scale: value }));
                        }
                      }}
                    >
                      <option value="">Select one option</option>
                      {scaleValues.map((scale) => (
                        <option key={scale.value} value={scale.value}>
                          {scale.label}
                        </option>
                      ))}
                      <option value="numeric">Ratio</option>
                    </select>
                  </div>

                  {/* Numeric Scale Input */}
                  <div className="form-group">
                    {isNumericScale && (
                      <div className="ratio-group">
                        <span className="ratio">1: </span>
                        <input
                          type="number"
                          id="no-spin"
                          value={newDoc.scale}
                          onChange={(e) =>
                            setNewDoc((prev) => ({
                              ...prev,
                              scale: e.target.value,
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
                    <label>Issuance Date *</label>
                    <input
                      type="date"
                      value={
                        newDoc.issuanceDate?.toISOString().split("T")[0] || ""
                      }
                      onChange={(e) =>
                        setNewDoc((prev) => ({
                          ...prev,
                          issuanceDate: dayjs(e.target.value),
                        }))
                      }
                    />
                  </div>

                  {/* Language Selection */}
                  {/*<div className="form-group">
                    <label>Language *</label>
                    <select
                      value={newDoc.language}
                      onChange={(e) =>
                        setNewDoc((prev) => ({
                          ...prev,
                          language: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="" disabled>
                        Select language
                      </option>
                      {languages.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>*/}

                  {/* Document Type */}
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
                      <option value={DocumentType.Design}>
                        Design Document
                      </option>
                      <option value={DocumentType.Technical}>
                        Technical Document
                      </option>
                      <option value={DocumentType.MaterialEffect}>
                        Material effect
                      </option>
                      {/* <option value="Others">Others</option> */}
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
                          checked={newDoc.stakeholders.includes(option.value)}
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
                      step="0.000001"
                      name="latitude"
                      min="-90"
                      max="90"
                      value={
                        newDoc.coordinates?.latitude !== null
                          ? newDoc.coordinates?.latitude
                          : ""
                      }
                      onChange={(e) =>
                        setNewDoc((prev) => ({
                          ...prev,
                          coordinates: {
                            ...prev.coordinates,
                            latitude: Number(e.target.value),
                          },
                        }))
                      }
                      placeholder="Es. 67.8558"
                      required
                    />
                  </div>

                  {/* Longitude */}
                  <div className="form-group">
                    <label>Longitude *</label>
                    <input
                      lang="en"
                      type="number"
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
                            ...prev.coordinates,
                            longitude: Number(e.target.value),
                          },
                        }));
                      }}
                      placeholder="Es. 20.2253"
                      required
                    />
                  </div>
                </div>
                {/* Form Buttons */}
                <div className="button-group">
                  <button className="submit-button" onClick={() => setPage(2)}>
                    Continue
                  </button>
                </div>
              </form>
            </form>
          </div>
        }
      </>
    );
  } else if (page === 2) {
    return (
      <>
        {
          <div className="modal-overlay-2">
            <div className="modal-content-2">
              <h2>New Document Registration</h2>
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

              <ProgressBar currentPage={page} />

              {/* Body */}
              <body>
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
                    <h5>
                      If you need to add links to other documents, please use
                      the search bar below.
                    </h5>
                  )}
                </div>

                <div className="bottom-group">
                  <form>
                    <SearchBar
                      documents={documents}
                      tableLinks={tableLinks}
                      setTableLinks={setTableLinks}
                    />
                  </form>

                  <div className="button-group-2">
                    <button
                      className="cancel-button-2"
                      onClick={() => setPage(1)}
                    >
                      Back
                    </button>
                    <button
                      className="submit-button-2"
                      onClick={(e) => handleFormSubmit(e)}
                    >
                      Add Document
                    </button>
                  </div>
                </div>
              </body>
            </div>
          </div>
        }
      </>
    );
  }
};

const ProgressBar = (props: { currentPage: number }) => {
  const steps = [
    { label: "Mandatory Information", number: 1 },
    { label: "Add Links", number: 2 },
    { label: "Add attachments", number: 3 },
    { label: "Recap", number: 4 },
  ];
  return (
    <div className="progress-bar">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${props.currentPage >= step.number ? "active" : ""} ${
            props.currentPage > step.number ? "completed" : ""
          }`}
        >
          <div className="circle">{step.number}</div>
          <span className="label">{step.label}</span>
          {index < steps.length - 1 && <div className="line"></div>}
        </div>
      ))}
    </div>
  );
};

export default ModalForm;
