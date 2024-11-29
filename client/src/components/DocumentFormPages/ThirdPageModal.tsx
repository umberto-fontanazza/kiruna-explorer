import React, { Dispatch, SetStateAction, useState } from "react";
import "../../styles/DocumentFormPagesStyles/ThirdPageModal.scss";
import { DocumentForm, Link } from "../../utils/interfaces";

interface ThirdPageModalProps {
  documentForm: DocumentForm;
  fileToUpload: string | null;
  tableLinks: Link[];
  goBack: Dispatch<SetStateAction<number>>;
  setFileToUpload: Dispatch<SetStateAction<string | null>>;
}

const ThirdPageModal: React.FC<ThirdPageModalProps> = ({
  fileToUpload,
  documentForm,
  goBack,
  setFileToUpload,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result?.toString().split(",")[1];
      if (base64String) {
        setFileToUpload(base64String);
      }
    };
    reader.onerror = (error) => {
      console.error("Error converting file to Base64:", error);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleButtonClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        handleFileUpload(target.files[0]);
      }
    };
    input.click();
  };

  return (
    <div className="third-page">
      <h2>Upload File</h2>
      <div
        className="upload-box"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p>Drag and drop your file here or use the button below to upload.</p>
        <button
          className="upload-btn"
          type="button"
          onClick={handleButtonClick}
        >
          Select File
        </button>
      </div>

      {fileToUpload && (
        <div className="uploaded-file">
          <strong>Uploaded File (Base64):</strong>{" "}
          {fileToUpload.substring(0, 30)}...
        </div>
      )}
      <div className="actions">
        <button className="back" onClick={() => goBack((p) => p - 1)}>
          Back
        </button>
        <button className="primary" type="submit">
          {documentForm.id ? "Update Document" : "Add Document"}
        </button>
      </div>
    </div>
  );
};

export default ThirdPageModal;
