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
  });

  const [Stakeholder, setStakeholder] = useState("");

  const handleFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    onSubmit(newDoc);
    setNewDoc({ id: "", title: "", description: "" });
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
                    value={Stakeholder}
                    onChange={(e) => setStakeholder(e.target.value)}
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
                  <input
                    type="text"
                    value={newDoc.title}
                    onChange={(e) =>
                      setNewDoc((prev) => ({ ...prev, title: e.target.value }))
                    }
                    required
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
                    setStakeholder("");
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
