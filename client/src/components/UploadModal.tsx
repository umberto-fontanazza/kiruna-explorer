import { Dispatch, SetStateAction, useState } from "react";
import API from "../API/API";
import "../styles/UploadModal.scss";
import { Upload, UploadType } from "../utils/interfaces";

interface UploadModal {
  setOpenUploadForm: Dispatch<SetStateAction<boolean>>;
  retrieveUploads: () => void;
}

const UploadModal: React.FC<UploadModal> = ({
  setOpenUploadForm,
  retrieveUploads,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<Upload[]>([]);

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

  const handleEditTitle = (index: number, newTitle: string) => {
    setFilesToUpload(
      (prev) =>
        prev?.map((file, i) =>
          i === index ? { ...file, title: newTitle } : file,
        ) || undefined,
    );
  };

  const handleUploadFormSubmit = async (
    uploads: Upload[],
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    try {
      await Promise.all(
        uploads.map((upload) =>
          API.addUpload(upload.title, upload.type, upload.file),
        ),
      );
      retrieveUploads();
      setFilesToUpload([]);
      setOpenUploadForm(false);
    } catch (err) {
      console.error("Upload error: " + err);
    }
  };

  const handleCloseForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpenUploadForm(false);
    return;
  };

  return (
    <>
      <form
        className={"upload-form"}
        onSubmit={(e) => handleUploadFormSubmit(filesToUpload, e)}
      >
        <button className="close" onClick={(e) => handleCloseForm(e)}>
          <img src="/x.png" alt="Close" />
        </button>

        <div className="upload-form-header">
          <h2 className="upload-form-title">New Upload Registration</h2>
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
            <button className="primary" type="submit">
              Add Upload
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default UploadModal;
