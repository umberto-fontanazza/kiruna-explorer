import { FC, SetStateAction, useState } from "react";

import {
  Document,
  DocumentType,
  Link,
  LinkType,
  Stakeholder,
} from "../utils/interfaces";
import "../styles/ModalAddDocument.scss";
import ISO6391 from "iso-639-1";
import dayjs from "dayjs";

//TODO: Fix color of the form

interface ModalAddProps {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (
    newDocument: Document,
    targetId: number,
    linkType: LinkType
  ) => void;
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
    connections: [],
    language: "",
    pages: null,
    coordinates: { latitude: null, longitude: null },
  };

  ////// OPTIONS AND DATA ///////

  const scaleValues = [
    { value: "blueprints/effects", label: "Blueprints/Effects" },
    { value: "text", label: "Text" },
  ];
  const languages = ISO6391.getAllNames().sort();

  const stakeholdersOptions = [
    { value: Stakeholder.Lkab, label: "LKAB" },
    { value: Stakeholder.KirunaKommun, label: "Kiruna kommun" },
    { value: Stakeholder.Residents, label: "Residents" },
    { value: Stakeholder.WhiteArkitekter, label: "White Arkitekter" },
  ];

  ////// COMPONENT STATE /////

  const [page, setPage] = useState<number>(1);
  const [newDoc, setNewDoc] = useState<Document>(initialDocumentState);
  const [targetDocumentId, setTargetDocumentId] = useState<number>(-1);
  const [newTypeConnection, setNewTypeConnection] = useState<
    LinkType | undefined
  >(undefined);
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
    onSubmit(
      {
        ...newDoc,
        connections: [
          {
            targetDocumentId: targetDocumentId,
            type: newTypeConnection ? [newTypeConnection] : [],
          },
        ],
      },
      targetDocumentId,
      newTypeConnection ? LinkType.Direct : LinkType.Collateral
    );
    resetForm();
  };

  // Reset Form
  const resetForm = () => {
    setNewDoc(initialDocumentState);
    setNewTypeConnection(LinkType.Direct);
    setTargetDocumentId(-1);
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
                <img src="/x.svg" alt="Close" />
              </button>
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
                      <div>
                        <span>1: </span>
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
                      placeholder="Es. 34.1234"
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
                      placeholder="Es. 123.1234"
                      required
                    />
                  </div>
                </div>

                {/* Connections */}

                {/* Target Document ID */}
                {/*<div className="form-group">
                  <label>Connection *</label>
                  <select
                    value={targetDocumentId ?? ""}
                    onChange={(e) => setTargetDocumentId(Number(e.target.value))}
                  >
                    <option value="" hidden selected>
                      Select a document to link
                    </option>
                    {documents.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.title}
                      </option>
                    ))}
                  </select>
                </div>*/}

                {/* Connection Type */}
                {/*<div className="form-group">
                  <label>Connection Type *</label>
                  <select
                    value={newTypeConnection}
                    onChange={(e) =>
                      setNewTypeConnection(e.target.value as LinkType)
                    }
                  >
                    <option value="" disabled>
                      Select the Connection's type
                    </option>
                    <option value="DIRECT">Direct</option>
                    <option value="COLLATERAL">Collateral</option>
                    <option value="PROJECTION">Projection</option>
                    <option value="UPDATE">Update</option>
                  </select>
                </div>*/}
                {/* Connection Type */}
                {/*<div className="form-group">
                <label>Connection Type *</label>
                <select
                  value={newTypeConnection}
                  onChange={(e) =>
                    setNewTypeConnection(e.target.value as LinkType)
                  }
                >
                  <option value="" disabled>
                    Select the Connection's type
                  </option>
                  <option value="direct">Direct</option>
                  <option value="collateral">Collateral</option>
                  <option value="projection">Projection</option>
                  <option value="update">Update</option>
                </select>
              </div>*/}

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
              <h2>Add Links</h2>
              <button
                className="close-button-2"
                onClick={() => {
                  setNewDoc(initialDocumentState);
                  onClose();
                }}
              >
                <img src="/x.svg" alt="Close" />
              </button>

              {/* Body */}

              <LinksTable
                tableLinks={tableLinks}
                setTableLinks={setTableLinks}
                documents={documents}
              />

              <form>
                <SearchBar
                  documents={documents}
                  setTableLinks={setTableLinks}
                />

                <div className="button-group-2">
                  <button
                    className="cancel-button-2"
                    onClick={() => setPage(1)}
                  >
                    Back
                  </button>
                  <button className="submit-button-2" type="submit">
                    Add Document
                  </button>
                </div>
              </form>
            </div>
          </div>
        }
      </>
    );
  }
};

function SearchBar(props: {
  documents: Document[];
  setTableLinks: React.Dispatch<React.SetStateAction<Link[]>>;
}) {
  // Stato per gestire l'input e i suggerimenti filtrati
  const [query, setQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<Document>();
  const [type, setType] = useState(LinkType.Direct);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Document[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Funzione per aggiornare l'input e i suggerimenti filtrati
  const handleChange = (e: { target: { value: string } }) => {
    const userInput = e.target.value;
    setQuery(userInput);

    // Filtra le opzioni in base all'input
    const filtered = props.documents.filter((document) =>
      document.title.toLowerCase().includes(userInput.toLowerCase())
    );
    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
  };

  // Funzione per selezionare un suggerimento
  const selectSuggestion = async (suggestion: Document) => {
    console.log(suggestion);
    setQuery(suggestion.title);
    await setSelectedDocument(suggestion);
    console.log(selectedDocument);
    setShowSuggestions(false);
  };

  interface HandleAddLinkEvent {
    preventDefault: () => void;
  }

  const handleAddLink = (e: HandleAddLinkEvent) => {
    e.preventDefault();
    if (selectedDocument?.id !== undefined) {
      props.setTableLinks((prev: Link[]) => {
        return [
          ...prev,
          { targetDocumentId: selectedDocument.id - 1, type: [type] },
        ];
      });
    }
  };

  return (
    <div
      className="search-container"
      style={{ position: "relative", width: "50%" }}
    >
      <input
        type="text"
        className="search-input"
        placeholder="Search for a document"
        value={query}
        onChange={handleChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Ritardo per permettere il click
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          //boxSizing: "border-box",
          //border: "1px solid #ddd",
        }}
      />

      {/* Mostra i suggerimenti solo se sono presenti e se è attivo showSuggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          className="form-group"
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            right: "0",
            border: "1px solid #ddd",
            backgroundColor: "green",
            zIndex: "1000",
            maxHeight: "150px",
            overflowY: "auto",
          }}
        >
          {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
            <div
              key={index}
              onClick={() => selectSuggestion(suggestion)}
              className="suggestion-item"
              style={{
                padding: "10px",
                cursor: "pointer",
              }}
              onMouseDown={(e) => e.preventDefault()} // Previene la perdita di focus
            >
              {suggestion.title}
            </div>
          ))}
        </div>
      )}
      <select
        onChange={(e) => {
          setType(e.target.value as LinkType);
        }}
      >
        <option value={LinkType.Direct}>Direct</option>
        <option value={LinkType.Collateral}>Collateral</option>
        <option value={LinkType.Projection}>Projection</option>
        <option value={LinkType.Update}>Update</option>
      </select>
      <button onClick={(e) => handleAddLink(e)}>Add Link</button>
    </div>
  );
}

// interface LinksTableProps {
//   tableLinks: Link[];
//   setTableLinks: SetStateAction<Link[]>;
//   documents: Document[];
// }

function LinksTable(props: {
  tableLinks: Link[];
  setTableLinks: (arg0: (prev: Link[]) => Link[]) => void;
  documents: Document[];
}) {
  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>, link: Link) => {
    e.preventDefault();
    props.setTableLinks((prev: Link[]) => {
      return prev.filter((l) => l !== link);
    });
  };

  return (
    <table className="links-table">
      <thead>
        <tr>
          <th>Icon</th>
          <th>Title</th>
          <th>Link Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {props.tableLinks.map((link, index) => (
          <tr key={index}>
            <td>
              <img
                className="doc-icon"
                src={`/document-${props.documents[link.targetDocumentId].type}-icon.png`}
                alt="Document icon"
              />
            </td>
            <td className="doc-title">
              {props.documents[link.targetDocumentId].title}
            </td>
            <td>
              {link.type.map((type) => (
                <span key={type} className="link-type">
                  {type}
                </span>
              ))}
            </td>
            <td>
              <button
                className="remove-link"
                onClick={(e) => handleRemove(e, link)}
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ModalForm;
