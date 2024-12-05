import { useEffect, useState } from "react";
import API from "../API/API";
import NavHeader from "../components/NavHeader";
import UploadModal from "../components/UploadModal";
import "../styles/UploadList.scss";
import { Upload } from "../utils/interfaces";
import { capitalizeFirstLetter } from "../utils/utils";

const UploadsList = () => {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [openUploadForm, setOpenUploadForm] = useState<boolean>(false);

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
      console.log("Received upload data:", response);
      if (!response) {
        console.warn("No files found in the response.");
        alert("Error in the download");
        return;
      }

      try {
        const binaryString = atob(response.data);

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

  const handleDeleteUpload = async (uploadId: number) => {
    try {
      await API.deleteUpload(uploadId);
      await retrieveUploads();
    } catch (err) {
      console.error("Error deleting upload: " + err);
    }
  };

  return (
    <>
      <NavHeader />
      {uploads !== null ? (
        <table>
          <thead>
            <th>Title</th>
            <th>Type</th>
            <th>Actions</th>
          </thead>
          <tbody>
            {uploads.map((upload) => (
              <tr key={upload.id}>
                <td>{upload.title}</td>
                <td>{capitalizeFirstLetter(upload.type).replace("_", " ")}</td>

                <td className="upload-actions">
                  <button onClick={() => handleDownloadById(upload.id!)}>
                    Download
                  </button>
                  <button
                    onClick={() =>
                      upload.id !== undefined && handleDeleteUpload(upload.id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h2>Trying to retrieve all the uploaded files</h2>
      )}
      <button onClick={() => setOpenUploadForm(true)}>
        Add new Original Resource
      </button>
      {openUploadForm && (
        <UploadModal
          setOpenUploadForm={setOpenUploadForm}
          retrieveUploads={retrieveUploads}
        />
      )}
    </>
  );
};

export default UploadsList;
