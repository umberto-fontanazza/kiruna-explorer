import { FC, useState } from "react";
import { Document } from "../utils/interfaces";
import "../styles/ModalAdd.scss";

interface ModalAddProps {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (newDocument: Document) => void;
}

const ModalAdd: FC<ModalAddProps> = ({ modalOpen, onClose, onSubmit }) => {
  const [newDoc, setNewDoc] = useState<Document>({
    id: "",
    title: "",
    description: "",
    stakeholder: "",
    scale: "",
    issuanceDate: null,
    type: "",
    connections: "",
    language: "",
    pages: 0,
    coordinates: "",
  });

  const handleFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    onSubmit({ ...newDoc, scale: "1:"+newDoc.scale });
    setNewDoc({ id: "", title: "", description: "", stakeholder: "",
                scale: "", issuanceDate: null, type: "", connections: "", language: "",
                pages: 0, coordinates: "", });
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
                  <label>
                    Scale <a>(optional)</a>
                  </label>
                  <div>
                    <span className="scale">1: </span>
                  <input
                    type="text"
                    value={newDoc.scale}
                    onChange={(e) =>
                      setNewDoc((prev) => ({ ...prev, scale:e.target.value }))
                    }
                  />
                  </div>
                </div> 
                </div> 
               <div className="test">
                <div className="form-group">
                  <label>Issuance Date</label>
                  <input
                    type="date"
                    value={newDoc.issuanceDate?.toISOString().split("T")[0] || ""}
                    onChange={(e) =>
                      setNewDoc((prev) => ({
                        ...prev,
                        issuanceDate: new Date(e.target.value),
                      }))
                    }
                  />
                  <label>Type</label>
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
                      <option value="Informative Document">Informative Document</option>
                      <option value="Prescriptive Document">Prescriptive Document</option>
                      <option value="Design Document">Design Document</option>
                      <option value="Technical Document">Technical Document</option>
                      <option value="Material effect">Material effect</option>
                      <option value="Others">Others</option>
                    </select>
                
                </div>
              </div>
              <div className="test">
                <div className="form-group">
                  <label>Language</label>
                  <select
                    value={newDoc.language}
                    onChange={(e) =>
                      setNewDoc((prev) => ({ ...prev, language: e.target.value }))
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
                  <label>Coordinates</label>
                  <input type="number" 
                    placeholder="Enter Coordinates x"
                    value={newDoc.coordinates}
                    onChange={(e) =>
                      setNewDoc((prev) => ({ ...prev, coordinates: e.target.value }))
                    }
                    required
                    className="input-coordinates"
                  />
                  <input type="number" 
                    placeholder="Enter Coordinates y"
                    value={newDoc.coordinates}
                    onChange={(e) =>
                      setNewDoc((prev) => ({ ...prev, coordinates: e.target.value }))
                    }
                    required
                    className="input-coordinates"
                  />
                </div>
              </div>

              {/*<label>Title</label>
              <input
                type="text"
                value={newDoc.title}
                onChange={(e) =>
                  setNewDoc((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
              <label>Title</label>
              <input
                type="text"
                value={newDoc.title}
                onChange={(e) =>
                  setNewDoc((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />*/}
              <div className="button-group">
                <button className="submit-button" type="submit">
                  Add Document
                </button>
                <button
                  className="cancel-button"
                  type="button"
                  onClick={() => {
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
