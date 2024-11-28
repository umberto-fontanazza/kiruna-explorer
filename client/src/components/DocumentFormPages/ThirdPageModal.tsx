import React, { Dispatch, SetStateAction, useState } from "react";
import { useDocumentFormContext } from "../../context/DocumentFormContext";
import { useAppContext } from "../../context/appContext";
import "../../styles/DocumentFormPagesStyles/ThirdPageModal.scss";
import {
  DocumentForm,
  documentFormDefaults,
  Link,
} from "../../utils/interfaces";
import { PositionMode } from "../../utils/modes";

interface ThirdPageModalProps {
  doc: DocumentForm;
  tableLinks: Link[];
  goBack: Dispatch<SetStateAction<number>>;
  setDocument: Dispatch<SetStateAction<DocumentForm>>;
  setPage: Dispatch<SetStateAction<number>>;
}

const ThirdPageModal: React.FC<ThirdPageModalProps> = ({
  doc,
  tableLinks,
  setDocument,
  goBack,
  setPage,
}) => {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const { setModalOpen, setPositionMode } = useAppContext();
  const { handleAddNewDocument } = useDocumentFormContext();

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result?.toString().split(",")[1];
      if (base64String) {
        setUploadedFile(base64String);
        console.log("File uploaded and converted to Base64:", base64String);
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

  const handleFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (uploadedFile) {
      handleAddNewDocument(
        {
          ...doc,
          links: tableLinks,
        },
        uploadedFile,
      );
      resetForm();
    }
  };

  const resetForm = () => {
    setDocument(documentFormDefaults);
    setPage(1);
    setPositionMode(PositionMode.None);
    setModalOpen(false);
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
          <strong>Uploaded File (Base64):</strong>{" "}
          {uploadedFile.substring(0, 30)}...
        </div>
      )}
      <div className="actions">
        <button className="back" onClick={() => goBack((p) => p - 1)}>
          Back
        </button>
        <button
          className="primary"
          type="button"
          onClick={(e) => handleFormSubmit(e)}
        >
          {doc.id ? "Update Document" : "Add Document"}
        </button>
      </div>
    </div>
  );
};

export default ThirdPageModal;
