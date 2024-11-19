import { FC, useState } from "react";
import "../styles/ModalConnections.scss";
import { Document, Link, LinkType } from "../utils/interfaces";

interface ModalConnectionProps {
  documents: Document[];
  document: Document | null;
  onClose: () => void;
  onSubmit: (newLink: Link) => void;
}

const ModalAddLinks: FC<ModalConnectionProps> = ({
  documents,
  document,
  onClose,
  onSubmit,
}) => {
  // State to manage selected document ID and link type
  const [targetDocumentId, setTargetDocumentId] = useState<number>(-1);
  const [linkType, setLinkType] = useState<LinkType>();

  // Form submission handler
  const handleFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    // Check for a valid source document
    if (!document?.id) {
      console.error("Document is null, cannot create a connection.");
      return;
    }

    // Create a new link object with selected target and link type
    const newLink: Link = {
      targetDocumentId: targetDocumentId,
      type: [linkType || LinkType.Direct],
    };

    onSubmit(newLink); // Trigger onSubmit callback with the new link
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>New Document Connection</h2>

        <form onSubmit={handleFormSubmit}>
          {/* Target Document Selection */}
          <div className="form-group">
            <label>Connection *</label>
            <select
              value={targetDocumentId !== -1 ? targetDocumentId : ""}
              onChange={(e) => setTargetDocumentId(Number(e.target.value))}
              required
            >
              <option value="" hidden>
                Select a document to link
              </option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.title}
                </option>
              ))}
            </select>
          </div>

          <div className="input-wrapper">
            {/* Connection Type Selection */}
            <div className="form-group">
              <label>Connection Type *</label>
              <select
                value={linkType ?? ""}
                onChange={(e) => setLinkType(e.target.value as LinkType)}
                required
              >
                <option value="" disabled>
                  Select the Connection's type
                </option>
                <option value="direct">Direct</option>
                <option value="collateral">Collateral</option>
                <option value="projection">Projection</option>
                <option value="update">Update</option>
              </select>
            </div>

            {/* Form Buttons */}
            <div className="button-group">
              <button className="submit-button" type="submit">
                Add Document
              </button>
              <button className="cancel-button" type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddLinks;
