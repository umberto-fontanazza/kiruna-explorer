import { useEffect, useState } from "react";
import API from "../API/API";
import "../styles/UploadEditModal.scss";
import { Document } from "../utils/interfaces";

interface UploadEditModal {
  openEditForm: { open: boolean; uploadId: number };
  setOpenEditForm: (form: { open: boolean; uploadId: number }) => void;
}

const UploadEditModal: React.FC<UploadEditModal> = ({
  openEditForm,
  setOpenEditForm,
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [linkedDocs, setLinkedDocs] = useState<number[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const links = await API.getBindedDocuments(openEditForm.uploadId);
        setLinkedDocs(links);
        const res: Document[] = await API.getDocuments();
        setDocuments(res);
      } catch (err) {
        console.error("Error fetching documents: " + err);
      }
    };
    fetchDocuments();
  }, [openEditForm.uploadId]);

  const handleLinkToggle = async (docId: number) => {
    try {
      if (linkedDocs?.includes(docId)) {
        // Unlink document
        await API.updateUploadLinks(openEditForm.uploadId, undefined, [docId]);
        setLinkedDocs((prev) => prev.filter((id) => id !== docId));
      } else {
        // Link document
        await API.updateUploadLinks(openEditForm.uploadId, [docId]);
        setLinkedDocs((prev) =>
          Array.isArray(prev) ? [...prev, docId] : [docId],
        );
      }
    } catch (err) {
      console.error("Error updating linked documents: " + err);
    }
  };

  const handleCloseForm = () => {
    setLinkedDocs([]);
    setOpenEditForm({ open: false, uploadId: -2 });
  };

  return (
    <div className="edit-modal-overlay">
      <div className={`edit-update-modal ${openEditForm.open ? "open" : ""}`}>
        <button className="close" onClick={handleCloseForm}>
          <img src="/x.png" alt="Close" />
        </button>

        <h2 className="upload-form-title">Edit Documents Linked</h2>
        <div className="modal-content">
          <h3>Select documents to link/unlink with the upload.</h3>
          <div className="documents-list">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <div key={doc.id} className="document-item">
                  <span>{doc.title}</span>
                  <button
                    className={`link-btn ${
                      linkedDocs?.includes(doc.id) ? "linked" : ""
                    }`}
                    onClick={() => handleLinkToggle(doc.id)}
                  >
                    {linkedDocs?.includes(doc.id) ? "Linked" : "Link"}
                  </button>
                </div>
              ))
            ) : (
              <p>No documents available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadEditModal;
