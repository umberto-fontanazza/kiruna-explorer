import { FC, useState } from "react";
import { Document } from "../utils/interfaces";
import API from "../API/API";

interface ModalConnectionProps {
  documents: Document[];
  document: Document | null;
  onClose: () => void;
}

const ModalConnection: FC<ModalConnectionProps> = (props) => {
  const [targetDocumentId, setTargetDocumentId] = useState<number>(-1);
  const handleFormSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    if (props.document?.id === undefined) {
      console.error("Document is null, cannot create a connection.");
      return;
    }
    await API.putLink(targetDocumentId, "Direct", props.document?.id);
    //TODO: perform the attachment of the new Connection in the frontend part in order to see instantly the change of the connections number. In addition, do we want to put also the connection type?
    //Also the SCSS has to be set up.
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
