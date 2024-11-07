import { FC, useState } from "react";

import { Document, DocumentType, LinkType } from "../utils/interfaces";
import "../styles/ModalAdd.scss";
import ISO6391 from "iso-639-1";

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
  const initialDocumentState: Document = {
    id: -1,
    title: "",
    description: "",
    stakeholder: [],
    scale: "",
    issuanceDate: null,
    type: undefined,
    connections: [],
    language: "",
    pages: null,
    coordinates: { latitude: null, longitude: null },
  };

  const scaleValues = ["Blueprints/Effects", "Text"];
  const languages = ISO6391.getAllNames().sort();

  const [newDoc, setNewDoc] = useState<Document>(initialDocumentState);
  const [targetDocumentId, setTargetDocumentId] = useState<number>(-1);
  const [newTypeConnection, setNewTypeConnection] = useState<
    LinkType | undefined
  >(undefined);
  const [isNumericScale, setIsNumericScale] = useState<boolean>(false);

  const stakeholdersOptions = [
    { value: "LKAB", label: "LKAB" },
    { value: "Municipality", label: "Municipality" },
    { value: "Regional Authority", label: "Regional Authority" },
    { value: "Architecture Firms", label: "Architecture Firms" },
    { value: "Citizens", label: "Citizens" },
    { value: "Others", label: "Others" },
  ];

  const handleCheckboxChange = (event: {
    target: { value: string; checked: boolean };
  }) => {
    const { value, checked } = event.target;

    setNewDoc((prev) => {
      const stakeholders = prev.stakeholder || [];
      if (checked) {
        // add option if selected
        return { ...prev, stakeholder: [...stakeholders, value] };
      } else {
        // remove option if unselected
        return {
          ...prev,
          stakeholder: stakeholders.filter((stake) => stake !== value),
        };
      }
    });
  };

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
    console.log(newDoc);
    setNewDoc(initialDocumentState);
    setNewTypeConnection(LinkType.Direct);
    setTargetDocumentId(-1);
  };

  if (!modalOpen) return null;

  return (
    <>
      {
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>New Document Registration</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="test">
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
              </div>
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
              <div className="test">
                <div className="form-group">
                  <label>StakeHolders *</label>
                  <div className="checkbox-group">
                    {stakeholdersOptions.map((option) => (
                      <label key={option.value} className="checkbox-label">
                        <input
                          type="checkbox"
                          value={option.value}
                          checked={newDoc.stakeholder.includes(option.value)}
                          onChange={handleCheckboxChange}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Scale *</label>
                  <div className="scale">
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
                      {scaleValues.map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                      <option value="numeric">Rateo</option>
                    </select>

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
                          style={{ width: "60%", marginTop: "10px" }}
                          required
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="test">
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
                        issuanceDate: new Date(e.target.value),
                      }))
                    }
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
                    <option value={DocumentType.Material}>
                      Material effect
                    </option>
                    {/* <option value="Others">Others</option> */}
                  </select>
                </div>
              </div>
              <div className="test">
                <div className="form-group">
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
                </div>
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
              </div>
              <div className="form-group">
                <label>Latitude *</label>
                <input
                  type="number"
                  id="no-spin"
                  step="0.000001"
                  name="latitude"
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
              <div className="form-group">
                <label>Longitude *</label>
                <input
                  lang="en"
                  type="number"
                  id="no-spin"
                  name="longitude"
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
                  placeholder="123.1234"
                  required
                />
              </div>
              <div className="form-group">
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
              </div>
              {/* <div className="form-group">
                <label>Connection Type *</label>
                <select
                  value={newTypeConnection}
                  onChange={(e) => setNewTypeConnection(e.target.value)}
                >
                  <option value="" disabled>
                    Select the Connection's type
                  </option>
                  <option value="Direct">DIRECT</option>
                  <option value="Collateral">COLLATERAL</option>
                  <option value="Projection">PROJECTION</option>
                  <option value="Update">UPDATE</option>
                </select>
              </div> */}
              <div className="button-group">
                <button className="submit-button" type="submit">
                  Add Document
                </button>
                <button
                  className="cancel-button"
                  type="button"
                  onClick={() => {
                    setNewDoc(initialDocumentState);
                    onClose();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </>
  );
};

function LongitudeInput() {
  const [newDoc, setNewDoc] = useState({ coordinates: { longitude: "" } });

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sostituisci le virgole con i punti per evitare errori
    const inputValue = e.target.value.replace(",", ".");

    // Verifica che sia un valore valido per la longitudine (numero o vuoto)
    if (/^-?\d*\.?\d*$/.test(inputValue) || inputValue === "") {
      setNewDoc((prev) => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          longitude: inputValue, // Salva come stringa temporaneamente per supportare la digitazione
        },
      }));
    }
  };

  return (
    <div>
      <label>Longitude *</label>
      <input
        lang="en"
        type="text" // Cambia a "text" per controllo completo dell'input
        id="no-spin"
        name="longitude"
        value={newDoc.coordinates.longitude}
        onChange={handleLongitudeChange}
        placeholder="123.1234"
        required
      />
    </div>
  );
}

export default ModalForm;
