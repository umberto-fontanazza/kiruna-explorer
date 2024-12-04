import { useEffect, useState } from "react";
import API from "../API/API";
import NavHeader from "../components/NavHeader";
import { Upload } from "../utils/interfaces";

const UploadsList = () => {
  const [uploads, setUploads] = useState<Upload[] | null>(null);

  const retrieveUploads = async () => {
    try {
      let res: Upload[] = [];
      const docs = await API.getDocuments();
      for (const doc of docs) {
        const uploads = await API.getUploads(doc.id);
        res = res.concat(uploads);
      }
      setUploads(res);
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
                  <button>Download</button>
                </td>
                <td>
                  <button>Modify links</button>
                </td>
                <td>
                  <button onClick={() => handleDeleteUpload(upload.id)}>
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
