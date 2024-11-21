import NavHeader from "../components/NavHeader";
import Popup from "../components/Popup";
import { useAppContext } from "../context/appContext";
import "../styles/DocumentsList.scss";
import {
  Document,
  fromDocumentTypeToIcon,
  ScaleType,
  scaleTypeDisplay,
  stakeholderDisplay,
} from "../utils/interfaces";

const DocumentsList = () => {
  const {
    documents,
    docSelected,
    setDocSelected,
    handleEditButton,
    isPopupOpen,
    setIsPopupOpen,
    handleDeleteDocument,
    handleCancelPopup,
  } = useAppContext();

  function handleRowClick(doc: Document): void {
    setDocSelected(doc);
  }

  return (
    <>
      <NavHeader />
      <div className="doc-lists">
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  className={`${docSelected?.id === doc.id ? "selected-row" : ""}`}
                  onClick={() => handleRowClick(doc)}
                >
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
                  {
                    <td className="actions-group">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditButton()}
                      >
                        <span className="material-symbols-outlined">
                          edit_document
                        </span>
                      </button>
                      <button
                        className="btn-edit pos"
                        onClick={() => {
                          //props.toEditPos();
                        }}
                      >
                        <span className="material-symbols-outlined">
                          edit_location
                        </span>
                      </button>
                      <button
                        className="btn-edit delete"
                        onClick={() => setIsPopupOpen(true)}
                      >
                        <span className="material-symbols-outlined ">
                          delete
                        </span>
                      </button>
                    </td>
                  }
                </tr>
              ))}
            </tbody>
          </table>
          <Popup
            isOpen={isPopupOpen}
            document={docSelected}
            onCancel={handleCancelPopup}
            onConfirm={handleDeleteDocument}
          />
        </div>
      </div>
    </>
  );
};

export default DocumentsList;
