import { FC, useEffect, useState } from "react";
import { Document, Link } from "../utils/interfaces";
import "../styles/ModalAdd.scss";

interface ModalAddProps {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (newDocument: Document) => void;
  documents: Document[];
}

const ModalAdd: FC<ModalAddProps> = ({
  modalOpen,
  onClose,
  onSubmit,
  documents,
}) => {
  const initialDocumentState: Document = {
    id: "",
    title: "",
    description: "",
    stakeholder: "",
    scale: "",
    issuanceDate: null,
    type: "",
    connections: [],
    language: "",
    pages: null,
    coordinates: { latitude: null, longitude: null },
  };
  const [newDoc, setNewDoc] = useState<Document>(initialDocumentState);
  const [targetDocumentId, setTargetDocumentId] = useState<number | null>(null);
  const [newTypeConncection, setNewTypeConnection] = useState("");

  const handleFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    if (targetDocumentId && newTypeConncection) {
      addConnection();
    }

    onSubmit({ ...newDoc, scale: "1:" + newDoc.scale });
    setNewDoc(initialDocumentState);
  };

  const addConnection = () => {
    if (targetDocumentId && newTypeConncection) {
      const newLink: Link = {
        targetDocumentId: targetDocumentId,
        type: [newTypeConncection],
      };
      console.log(newLink);
      setNewDoc((prev) => ({
        ...prev,
        connections: [
          ...(prev.connections || []),
          { targetDocumentId: newLink.targetDocumentId, type: newLink.type },
        ],
      }));
      setTargetDocumentId(null);
      setNewTypeConnection("");
    }
  };

  useEffect(() => {
    console.log(newDoc);
  }, [newDoc]);

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
                  <label className="id">Document ID *</label>
                  <input
                    type="text"
                    placeholder="Enter Document ID"
                    value={newDoc.id}
                    onChange={(e) =>
                      setNewDoc((prev) => ({
                        ...prev,
                        id: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

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
                  <select
                    value={newDoc.stakeholder}
                    onChange={(e) =>
                      setNewDoc((prev) => ({
                        ...prev,
                        stakeholder: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    <option value="LKAB">LKAB</option>
                    <option value="Municipality">Municipality</option>
                    <option value="Regional Authority">
                      Regional Authority
                    </option>
                    <option value="Architecture Firms">
                      Architecture Firms
                    </option>
                    <option value="Citizens">Citizens</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Scale *</label>
                  <div>
                    <span className="scale">1: </span>
                    <input
                      type="text"
                      value={newDoc.scale}
                      onChange={(e) =>
                        setNewDoc((prev) => ({
                          ...prev,
                          scale: e.target.value,
                        }))
                      }
                    />
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
                      setNewDoc((prev) => ({ ...prev, type: e.target.value }))
                    }
                    required
                  >
                    <option value="" disabled>
                      Select type
                    </option>
                    <option value="Informative Document">
                      Informative Document
                    </option>
                    <option value="Prescriptive Document">
                      Prescriptive Document
                    </option>
                    <option value="Design Document">Design Document</option>
                    <option value="Technical Document">
                      Technical Document
                    </option>
                    <option value="Material effect">Material effect</option>
                    <option value="Others">Others</option>
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
                    <option value="English">English</option>
                    <option value="Italian">Italian</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Pages (optional):</label>
                  <input
                    type="number"
                    value={newDoc.pages !== null ? newDoc.pages : ""}
                    onChange={(e) => {
                      setNewDoc((prev) => ({
                        ...prev,
                        pages: e.target.value ? Number(e.target.value) : null,
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Latitude *</label>
                <input
                  type="number"
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
                  placeholder="Es. 34.123456"
                  required
                />
              </div>
              <div className="form-group">
                <label>Longitude *</label>
                <input
                  type="number"
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
                  placeholder="-123.123456"
                  required
                />
              </div>
              <div className="form-group">
                <label>Connection *</label>
                <select
                  value={targetDocumentId ?? ""}
                  onChange={(e) => setTargetDocumentId(Number(e.target.value))}
                >
                  <option value="">Select a document to link</option>
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Connection Type *</label>
                <select
                  value={newTypeConncection}
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
              </div>
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

export default ModalAdd;
