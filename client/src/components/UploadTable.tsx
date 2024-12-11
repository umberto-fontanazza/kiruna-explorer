import React, { Dispatch, SetStateAction } from "react";
import "../styles/DocumentFormPagesStyles/ThirdPageModal.scss";
import { Upload } from "../utils/interfaces";

interface UploadTableProps {
  filesToUpload: Upload[];
  setFilesToUpload: Dispatch<SetStateAction<Upload[]>>;
}

const UploadTable: React.FC<UploadTableProps> = ({
  filesToUpload,
  setFilesToUpload,
}) => {
  const handleEditUploadTitle = (index: number, newTitle: string) => {
    setFilesToUpload(
      (prev) =>
        prev?.map((file, i) =>
          i === index ? { ...file, title: newTitle } : file,
        ) || undefined,
    );
  };

  const handleRemoveFile = (index: number) => {
    setFilesToUpload(
      (prev) => prev?.filter((_, i) => i !== index) || undefined,
    );
  };

  return filesToUpload.map((file, index) => (
    <li key={index} className="uploaded-file-item">
      <p>Title:</p>{" "}
      <input
        type="text"
        value={file.title}
        onChange={(e) => handleEditUploadTitle(index, e.target.value)}
      />
      <br />
      <button className="remove-btn" onClick={() => handleRemoveFile(index)}>
        Remove
      </button>
    </li>
  ));
};

export default UploadTable;
