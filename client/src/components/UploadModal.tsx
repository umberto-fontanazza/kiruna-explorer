import { Dispatch, SetStateAction, useState } from "react";
import API from "../API/API";
import "../styles/UploadModal.scss";
import { Upload } from "../utils/interfaces";
import UploadBox from "./UploadBox";
import UploadTable from "./UploadTable";
interface UploadModal {
  setOpenUploadForm: Dispatch<SetStateAction<boolean>>;
  retrieveUploads: () => void;
}

const UploadModal: React.FC<UploadModal> = ({
  setOpenUploadForm,
  retrieveUploads,
}) => {
  const [filesToUpload, setFilesToUpload] = useState<Upload[]>([]);

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
  };

  return (
    <div className="add-modal-overlay">
      <form
        className={"upload-form"}
        onSubmit={(e) => handleUploadFormSubmit(filesToUpload, e)}
      >
        <button className="close" onClick={(e) => handleCloseForm(e)}>
          <img src="/x.png" alt="Close" />
        </button>

        <div className="upload-form-header">
          <h2 className="upload-form-title">New Uploads Registration</h2>
          <div className="form-content">
            <h2>Upload Files</h2>
            <UploadBox setFilesToUpload={setFilesToUpload} />
            {filesToUpload.length > 0 ? (
              <div className="uploaded-files">
                <h3>Uploaded Files:</h3>
                <ul>
                  {filesToUpload.length > 0 && (
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
            <button className="primary" type="submit">
              Add upload
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadModal;
