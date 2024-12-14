import { Dispatch, SetStateAction, useRef, useState } from "react";
import { AlertType } from "../utils/alertType";
import { Upload, UploadType } from "../utils/interfaces";
import Alert, { AlertHandle } from "./Alert";

interface UploadBoxProps {
  setFilesToUpload: Dispatch<SetStateAction<Upload[]>>;
}

const UploadBox: React.FC<UploadBoxProps> = ({ setFilesToUpload }) => {
  const setDragActive = useState(false)[1];

  const alertRef = useRef<AlertHandle>(null);

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
    if (e.dataTransfer.files?.[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleButtonClick = () => {
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files?.[0]) {
        handleFileUpload(target.files[0]);
      }
    };
    inputElement.click();
  };

  const handleFileUpload = (file: File) => {
    // Checks if file is not larger than 10mb
    if (file.size > 1024 * 1024 * 10) {
      alertRef.current?.showAlert(
        `Error uploading file: "${file.name}". \nThe file is too large (max 10mb). Please reduce its size.`,
        AlertType.Error,
      );
      return;
    }

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

  return (
    <>
      <Alert ref={alertRef} timeout={5000} />
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
    </>
  );
};

export default UploadBox;
