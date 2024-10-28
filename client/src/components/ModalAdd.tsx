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
            <h2>Add here the information of the new Document</h2>
            <form onSubmit={handleFormSubmit}>
              <label>ID</label>
              <input
                type="text"
                value={newDoc.id}
                onChange={(e) =>
                  setNewDoc((prev) => ({
                    ...prev,
                    id: e.target.value,
                  }))
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
              />
              <label>Description:</label>
              <textarea
                value={newDoc.description || ""}
                onChange={(e) =>
                  setNewDoc((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
              />
              <button className="submit-button" type="submit">
                Add Document
              </button>
              <button className="cancel-button" type="button" onClick={onClose}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      }
    </>
  );
};

export default ModalAdd;
