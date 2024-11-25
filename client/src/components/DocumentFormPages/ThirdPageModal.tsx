import React, { useState } from "react";
import "../../styles/DocumentFormPagesStyles/ThirdPageModal.scss";
import { DocumentForm } from "../../utils/interfaces";

interface ThirdPageModalProps {
  onSubmit: (ev: React.FormEvent) => void;
  document: DocumentForm;
}

const ThirdPageModal: React.FC<ThirdPageModalProps> = (props) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    console.log("File uploaded:", file);
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
    // Simula un clic su un elemento input nascosto per aprire il file picker
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

      {uploadedFile && (
        <div className="uploaded-file">
          <strong>Uploaded File:</strong> {uploadedFile.name}
        </div>
      )}
      <div className="actions">
        <button className="back" onClick={(e) => props.onSubmit(e)}>
          Back
        </button>
        <button className="primary" type="submit">
          {props.document.id ? "Update Document" : "Add Document"}
        </button>
      </div>
    </div>
  );
};

export default ThirdPageModal;
