import { useEffect, useState } from "react";
import API from "../API/API";
import NavHeader from "../components/NavHeader";
import "../styles/DocumentsList.scss";
import {
  Document,
  fromDocumentTypeToIcon,
  ScaleType,
  scaleTypeDisplay,
  stakeholderDisplay,
} from "../utils/interfaces";

const DocumentsList = () => {
  const [documentsList, setDocumentsList] = useState<Document[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const documents = await API.getDocuments();
        console.log(documents);
        setDocumentsList(documents);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDocuments();
  }, []);

  return (
    <>
      <NavHeader />
      <h1 className="title">Documents List</h1>
      <div className="table-container">
        <table className="tableDocs">
          <thead>
            <tr>
              <th>Type</th>
              <th>Title</th>
              <th>Description</th>
              <th>Stakeholders</th>
              <th>Scale</th>
              <th>Coordinates</th>
              <th>Issuance Date</th>
              <th>Links</th>
            </tr>
          </thead>
          <tbody>
            {documentsList.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <span
                    className={`material-symbols-outlined color-${fromDocumentTypeToIcon.get(
                      doc.type
                    )} size`}
                  >
                    {fromDocumentTypeToIcon.get(doc.type)}
                  </span>
                </td>
                <td>{doc.title}</td>
                <td>{doc.description}</td>
                <td>
                  {doc.stakeholders ? (
                    doc?.stakeholders?.map((s, index, arr) => (
                      <span key={`${doc?.id}-${index}`}>
                        {stakeholderDisplay[s]}
                        {index < arr.length - 1 ? ", " : ""}
                      </span>
                    ))
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td>
                  <span>
                    {doc?.scale.type &&
                      doc?.scale.type !== ScaleType.Ratio &&
                      scaleTypeDisplay[doc.scale.type]}
                    {doc?.scale.type &&
                      doc?.scale.type === ScaleType.Ratio &&
                      `1:${doc.scale.ratio}`}
                  </span>
                </td>
                <td>
                  {doc.coordinates?.latitude} {doc.coordinates?.longitude}
                </td>
                <td>
                  <span>
                    {doc?.issuanceDate?.isValid()
                      ? doc?.issuanceDate?.format("MMMM D, YYYY")
                      : "-"}
                  </span>
                </td>
                <td>{doc.links?.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DocumentsList;
