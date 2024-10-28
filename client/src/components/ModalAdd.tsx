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
    id: 0,
    title: "",
    description: "",
  });

  const handleFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    onSubmit(newDoc);
    setNewDoc({ id: 0, title: "", description: "" });
  };

  if (!modalOpen) return null;

  return (
    <>
      {
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleFormSubmit}>
              <label>
                ID:
                <input
                  type="text"
                  value={newDoc.id}
                  onChange={(e) =>
                    setNewDoc((prev) => ({
                      ...prev,
                      id: Number(e.target.value),
                    }))
                  }
                  required
                />
              </label>
              <label>
                Title:
                <input
                  type="text"
                  value={newDoc.title}
                  onChange={(e) =>
                    setNewDoc((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </label>
              <label>
                Description:
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
              </label>
              <button type="submit">Add Document</button>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
            </form>
            <button onClick={onClose} className="modal-close-button">
              X
            </button>
          </div>
        </div>
      }
    </>
  );
};

export default ModalAdd;
