interface UploadDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const UploadDeleteModal = ({
  open,
  onClose,
  onConfirm,
}: UploadDeleteModalProps) => {
  if (!open) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-content">
        <h3>Are you sure you want to delete this upload?</h3>
        <div className="delete-modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-btn" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDeleteModal;
