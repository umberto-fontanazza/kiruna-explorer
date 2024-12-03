import React, { Dispatch, SetStateAction, useState } from "react";
import "../../styles/DocumentFormPagesStyles/ThirdPageModal.scss";
import { DocumentForm, Link, UploadForm } from "../../utils/interfaces";

interface ThirdPageModalProps {
  documentForm: DocumentForm;
  filesToUpload: UploadForm[] | null;
  tableLinks: Link[];
  goBack: Dispatch<SetStateAction<number>>;
  setFilesToUpload: Dispatch<SetStateAction<UploadForm[] | null>>;
}

const ThirdPageModal: React.FC<ThirdPageModalProps> = ({
  documentForm,
  goBack,
  filesToUpload,
  setFilesToUpload,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result?.toString().split(",")[1];
      if (base64String) {
        const defaultTitle = file.name;
        setFilesToUpload((prev) => [
          ...(prev || []),
          { title: defaultTitle, data: base64String },
        ]);
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

  const handleRemoveFile = (index: number) => {
    setFilesToUpload((prev) => prev?.filter((_, i) => i !== index) || null);
  };

  const handleEditTitle = (index: number, newTitle: string) => {
    setFilesToUpload(
      (prev) =>
        prev?.map((file, i) =>
          i === index ? { ...file, title: newTitle } : file,
        ) || null,
    );
  };

  return (
    <>
      <div className="form-content">
        <h2>Upload Files</h2>
        <div
          className="upload-box"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p>Drag and drop the original resources here</p>
          <button
            className="upload-btn"
            type="button"
            onClick={handleButtonClick}
          >
            Select File
          </button>
        </div>

        {filesToUpload && filesToUpload.length > 0 && (
          <div className="uploaded-files">
            <h3>Uploaded Files:</h3>
            <ul>
              {filesToUpload.map((file, index) => (
                <li key={index} className="uploaded-file-item">
                  <p>Title:</p>{" "}
                  <input
                    type="text"
                    value={file.title}
                    onChange={(e) => handleEditTitle(index, e.target.value)}
                  />
                  <br />
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFile(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="actions">
        <button className="back" onClick={() => goBack((p) => p - 1)}>
          Back
        </button>
        <button className="primary" type="submit">
          {documentForm.id ? "Update Document" : "Add Document"}
        </button>
      </div>
    </>
  );
};

export default ThirdPageModal;
