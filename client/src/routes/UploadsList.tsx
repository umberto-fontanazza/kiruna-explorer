import { useContext, useEffect, useState } from "react";
import API from "../API/API";
import NavHeader from "../components/NavHeader";
import UploadDeleteModal from "../components/UploadDeleteModal";
import UploadEditModal from "../components/UploadEditModal";
import UploadModal from "../components/UploadModal";
import { authContext } from "../context/auth";
import "../styles/UploadList.scss";
import { Upload } from "../utils/interfaces";
import { capitalizeFirstLetter } from "../utils/utils";

const UploadsList = () => {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [openUploadForm, setOpenUploadForm] = useState<boolean>(false);
  const [openEditForm, setOpenEditForm] = useState<{
    open: boolean;
    uploadId: number;
  }>({ open: false, uploadId: -2 });
  const [showUploadDeleteModal, setShowUploadDeleteModal] =
    useState<boolean>(false);
  const [deleteUploadId, setDeleteUploadId] = useState<number | null>(null);

  const { user } = useContext(authContext);

  const retrieveUploads = async () => {
    try {
      const uploads = await API.getUploads();
      setUploads(uploads);
    } catch (err) {
      console.error("Unable to fetch uploads: " + err);
    }
  };

  useEffect(() => {
    retrieveUploads();
  }, []);

  const handleDownloadById = async (uploadId: number) => {
    try {
      const response: Upload = await API.getUploadById(uploadId);
      if (!response) {
        console.warn("No files found in the response.");
        alert("Error in the download");
        return;
      }

      try {
        const binaryString = atob(response.file);
        const byteArray = Uint8Array.from(binaryString, (char) =>
          char.charCodeAt(0),
        );
        const blob = new Blob([byteArray], {
          type: "application/octet-stream",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = response.title || "download";
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (downloadError) {
        console.error(
          `Error processing file ${response.title}:`,
          downloadError,
        );
        alert(`Failed to download ${response.title}.`);
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("An error occurred during the download process. Please try again.");
    }
  };

  const handleEdit = (
    e: React.MouseEvent<HTMLButtonElement>,
    uploadId: number,
  ) => {
    e.preventDefault();
    setOpenEditForm({ open: true, uploadId });
  };

  const handleDeleteUpload = async (uploadId: number) => {
    try {
      await API.deleteUpload(uploadId);
      setShowUploadDeleteModal(false);
      setDeleteUploadId(null);
      await retrieveUploads();
    } catch (err) {
      console.error("Error deleting upload: " + err);
    }
  };

  const openUploadDeleteModal = (uploadId: number) => {
    setDeleteUploadId(uploadId);
    setShowUploadDeleteModal(true);
  };

  return (
    <>
      <NavHeader />
      <div className="upload-container">
        {uploads !== null ? (
          <table className="upload-table">
            <thead>
              <tr>
                <th>TITLE</th>
                <th>TYPE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((upload) => (
                <tr key={upload.id}>
                  <td>{upload.title}</td>
                  <td>
                    {capitalizeFirstLetter(upload.type).replace(/_/, " ")}
                  </td>

                  <td className="upload-actions">
                    <button
                      onClick={() =>
                        upload.id !== undefined && handleDownloadById(upload.id)
                      }
                    >
                      Download
                    </button>
                    {user && (
                      <button
                        onClick={(e) =>
                          upload.id !== undefined && handleEdit(e, upload.id)
                        }
                      >
                        Edit linked Documents
                      </button>
                    )}
                    {user && (
                      <button
                        onClick={() =>
                          upload.id !== undefined &&
                          openUploadDeleteModal(upload.id)
                        }
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h2>Trying to retrieve all the uploaded files</h2>
        )}
        {user && (
          <button
            className="add-upload"
            onClick={() => setOpenUploadForm(true)}
          >
            Add new Original Resource
          </button>
        )}
        {openUploadForm && (
          <UploadModal
            setOpenUploadForm={setOpenUploadForm}
            retrieveUploads={retrieveUploads}
          />
        )}
        {openEditForm.open && (
          <UploadEditModal
            openEditForm={openEditForm}
            setOpenEditForm={setOpenEditForm}
          />
        )}
        <UploadDeleteModal
          open={showUploadDeleteModal}
          onClose={() => setShowUploadDeleteModal(false)}
          onConfirm={() => deleteUploadId && handleDeleteUpload(deleteUploadId)}
        />
      </div>
    </>
  );
};

export default UploadsList;
