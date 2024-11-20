import { FC } from "react";
import "../styles/Popup.scss";
import { Document } from "../utils/interfaces";

interface PopupProps {
  isOpen: boolean;
  document: Document | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const Popup: FC<PopupProps> = (props) => {
  if (!props.isOpen) return null;

  return (
    <div className="overlay">
      <div className="popup">
        <h2>Confirm deletion</h2>
        <p>
          Are you sure you want to delete the document{" "}
          <strong>{props.document?.title || "selected"}</strong>? This action is
          not reversible.
        </p>
        <div className="btn-group">
          <button className="cancel-btn" onClick={() => props.onCancel()}>
            Cancel
          </button>
          <button className="delete-btn" onClick={() => props.onConfirm()}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
