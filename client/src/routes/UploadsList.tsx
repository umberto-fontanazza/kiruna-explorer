import { useEffect, useState } from "react";
import API from "../API/API";
import NavHeader from "../components/NavHeader";
import { Upload } from "../utils/interfaces";

const UploadsList = () => {
  const [uploads, setUploads] = useState<Upload[] | null>(null);

  useEffect(() => {
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
    retrieveUploads();
  }, []);

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
                  <button>View upload</button>
                </td>
                <td>
                  <button>Modify links</button>
                </td>
                <td>
                  <button>Delete</button>
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
