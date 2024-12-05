import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import API from "../../API/API";
import "../../styles/DocumentFormPagesStyles/ThirdPageModal.scss";
import { DocumentForm, Link, Upload, UploadType } from "../../utils/interfaces";

interface ThirdPageModalProps {
  documentForm: DocumentForm;
  filesToUpload: Upload[] | undefined;
  tableLinks: Link[];
  goBack: Dispatch<SetStateAction<number>>;
  setFilesToUpload: Dispatch<SetStateAction<Upload[] | undefined>>;
}

const ThirdPageModal: React.FC<ThirdPageModalProps> = ({
  documentForm,
  goBack,
  filesToUpload,
  setFilesToUpload,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const [oldUploads, setOldUploads] = useState<Upload[]>([]);

  useEffect(() => {
    const fetchUploads = async () => {
      if (documentForm?.id) {
        try {
          const uploads = await API.getUploads(documentForm.id);
          const formattedUploads = uploads.map((upload) => ({
            id: upload.id,
            title: upload.title,
            type: upload.type,
            file: "",
          }));
          setOldUploads(formattedUploads);
        } catch (error) {
          console.error("Error fetching uploads:", error);
        }
      }
    };

    fetchUploads();
  }, [documentForm.id]);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result?.toString().split(",")[1];
      if (base64String) {
        const defaultTitle = file.name;
        setFilesToUpload((prev) => [
          ...(prev || []),
          {
            id: undefined,
            title: defaultTitle,
            type: UploadType.OriginalResource,
            file: base64String,
          },
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
    setFilesToUpload(
      (prev) => prev?.filter((_, i) => i !== index) || undefined,
    );
  };

  const handleRemoveOldFile = async (
    uploadId: number,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    try {
      await API.deleteUpload(uploadId);
      setOldUploads((prev) => prev.filter((file) => file.id !== uploadId));
    } catch (error) {
      console.error("Error removing old file:", error);
    }
  };

  const handleEditTitle = (index: number, newTitle: string) => {
    setFilesToUpload(
      (prev) =>
        prev?.map((file, i) =>
          i === index ? { ...file, title: newTitle } : file,
        ) || undefined,
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

        <div className="uploaded-files">
          <h3>Uploaded Files:</h3>
          <ul>
            {oldUploads.map((file) => (
              <li key={file.id} className="uploaded-file-item">
                <p>Title:</p>{" "}
                <input
                  type="text"
                  value={file.title}
                  onChange={(e) =>
                    file.id !== undefined &&
                    handleEditTitle(file.id, e.target.value)
                  }
                />
                <br />
                <button
                  className="remove-btn"
                  onClick={(e) => {
                    if (file.id !== undefined) handleRemoveOldFile(file.id, e);
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
            {filesToUpload &&
              filesToUpload.length > 0 &&
              filesToUpload.map((file, index) => (
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
