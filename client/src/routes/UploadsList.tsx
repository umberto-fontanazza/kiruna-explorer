import { useEffect, useState } from "react";
import API from "../API/API";
import NavHeader from "../components/NavHeader";
import { Upload } from "../utils/interfaces";

const UploadsList = () => {
  const [uploads, setUploads] = useState<Upload[]>([]);

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

  const handleDeleteUpload = async (uploadId: number) => {
    try {
      await API.deleteUpload(uploadId);
      console.log("Upload id " + uploadId + " eliminated");
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
          <tbody>
            {uploads.map((upload, index) => (
              <tr key={index}>
                <td>{upload.title}</td>
                <td>{upload.type}</td>

                <td>
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
    </>
  );
};

export default UploadsList;
