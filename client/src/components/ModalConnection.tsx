import { FC, useState } from "react";
import { Document, Link, LinkType } from "../utils/interfaces";
import API from "../API/API";
import "../styles/ModalConnections.scss";

interface ModalConnectionProps {
  documents: Document[];
  document: Document | null;
  onClose: () => void;
  onSubmit: (newLink: Link) => void;
}

const ModalConnection: FC<ModalConnectionProps> = (props) => {
  const [targetDocumentId, setTargetDocumentId] = useState<number>(-1);
  const handleFormSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    if (props.document?.id === undefined) {
      console.error("Document is null, cannot create a connection.");
      return;
    }
    const newLink: Link = {
      targetDocumentId: targetDocumentId,
      type: [LinkType.Direct],
    };

    props.onSubmit(newLink);
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>New Document Connection</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>Connection *</label>
              <select
                value={targetDocumentId ?? ""}
                onChange={(e) => setTargetDocumentId(Number(e.target.value))}
              >
                <option value="">Select a document to link</option>
                {props.documents.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.title}
                  </option>
                ))}
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
                  props.onClose();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default ModalConnection;
