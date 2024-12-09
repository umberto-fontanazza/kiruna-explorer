import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import API from "../../API/API";
import "../../styles/DocumentFormPagesStyles/ThirdPageModal.scss";
import { DocumentForm, Link, Upload } from "../../utils/interfaces";
import UploadBox from "../UploadBox";
import UploadTable from "../UploadTable";

interface ThirdPageModalProps {
  documentForm: DocumentForm;
  filesToUpload: Upload[];
  tableLinks: Link[];
  goBack: Dispatch<SetStateAction<number>>;
  setFilesToUpload: Dispatch<SetStateAction<Upload[]>>;
}

const ThirdPageModal: React.FC<ThirdPageModalProps> = ({
  documentForm,
  goBack,
  filesToUpload,
  setFilesToUpload,
}) => {
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

  const handleEditUploadOldTitle = async (
    uploadId: number,
    newTitle: string,
  ) => {
    await API.editUpload(uploadId, newTitle);
    setOldUploads((prev) =>
      prev.map((upload) =>
        upload.id === uploadId ? { ...upload, title: newTitle } : upload,
      ),
    );
  };

  const handleRemoveOldFile = async (
    uploadId: number,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    try {
      await API.deleteUpload(uploadId);
      setOldUploads((prev) => prev.filter((upload) => upload.id !== uploadId));
    } catch (error) {
      console.error("Error removing old file:", error);
    }
  };

  return (
    <>
      <div className="form-content">
        <h2>Upload Files</h2>
        <UploadBox setFilesToUpload={setFilesToUpload} />

        {filesToUpload.length > 0 || oldUploads.length > 0 ? (
          <div className="uploaded-files">
            <h3>Uploaded Files:</h3>
            <ul>
              {oldUploads.map((upload) => (
                <li key={upload.id} className="uploaded-file-item">
                  <p>Title:</p>{" "}
                  <input
                    type="text"
                    value={upload.title}
                    onChange={(e) =>
                      upload.id !== undefined &&
                      handleEditUploadOldTitle(upload.id, e.target.value)
                    }
                  />
                  <br />
                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      if (upload.id !== undefined)
                        handleRemoveOldFile(upload.id, e);
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
              {filesToUpload && filesToUpload.length > 0 && (
                <UploadTable
                  filesToUpload={filesToUpload}
                  setFilesToUpload={setFilesToUpload}
                />
              )}
            </ul>
          </div>
        ) : null}
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
