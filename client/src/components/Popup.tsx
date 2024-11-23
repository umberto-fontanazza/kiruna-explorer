import { FC } from "react";
import API from "../API/API";
import { useAppContext } from "../context/appContext";
import { usePopupContext } from "../context/PopupContext";
import "../styles/Popup.scss";

interface PopupProps {
  isOpen: boolean;
}

const Popup: FC<PopupProps> = (props) => {
  const { documentToDelete, setIsDeleted } = usePopupContext();
  const { setIsPopupOpen } = useAppContext();

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;

    try {
      if (documentToDelete.links && documentToDelete.links.length > 0) {
        for (const link of documentToDelete.links) {
          await API.deleteLink(documentToDelete.id, link.targetDocumentId);
        }
      }
      await API.deleteDocument(documentToDelete.id);
      //setDocuments((prev) => prev.filter((doc) => doc.id !== documentToDelete.id));
      setIsPopupOpen(false);
      setIsDeleted(true);
    } catch (err) {
      console.error(err);
    }
  };
  if (!props.isOpen) return null;

  return (
    <div className="overlay">
      <div className="popup">
        <h2>Confirmation to delete</h2>
        <p>
          Are you sure you want to delete the document{" "}
          <strong>{documentToDelete?.title || "selected"}</strong>? This action
          is not reversible.
        </p>
        <div className="btn-group">
          <button className="cancel-btn" onClick={() => setIsPopupOpen(false)}>
            Cancel
          </button>
          <button className="delete-btn" onClick={() => handleDeleteDocument()}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
