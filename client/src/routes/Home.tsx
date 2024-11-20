import { FC, useContext, useEffect, useState } from "react";
import API from "../API/API";
import MapComponent from "../components/Map";
import ModalForm from "../components/ModalAddDocument";
import NavHeader from "../components/NavHeader";
import Popup from "../components/Popup";
import Sidebar from "../components/Sidebar";
import { authContext } from "../context/auth";
import "../styles/Home.scss";
import { Document } from "../utils/interfaces";

const Home: FC = (): JSX.Element => {
  const { user } = useContext(authContext);
  // State to hold list of documents
  const [documents, setDocuments] = useState<Document[]>([]);
  // State to control sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  // State for selected document
  const [docSelected, setDocSelected] = useState<Document | null>(null);
  // State to control modal for adding documents
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  //State to control modal for edit document selected
  const [editDocument, setEditDocument] = useState(false);
  //State to control the popup to delete a document
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const [visualizeLinks, setVisualizeLinks] = useState<boolean>(false);
  const [insertMode, setInsertMode] = useState<boolean>(false);

  const [newPosition, setNewPosition] = useState<{ lat: number; lng: number }>({
    lat: -1,
    lng: -1,
  });

  // Fetch documents on component mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const documents: Document[] = await API.getDocuments();
        setDocuments(documents);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDocuments();
  }, []);

  const handleEditButton = () => {
    setEditDocument(true);
    setModalOpen(true);
  };

  /*useEffect(() => {
    if (editDocument) {
      setModalOpen(true);
    }
  }, [editDocument]);*/

  // Handle Add Document button click to open modal
  const handleAddButton = () => {
    setInsertMode(true);
    setSidebarOpen(false);
  };

  const closeInsertMode = () => {
    setInsertMode(false);
  };

  // Handle form submission for new document
  const handleAddNewDocument = async (newDocument: Document) => {
    setModalOpen(false);
    if (editDocument) {
      const fetchUpdate = async () => {
        try {
          await API.updateDocument(newDocument);
          newDocument.links?.map(async (link) => {
            await API.putLink(
              newDocument.id,
              link.targetDocumentId,
              link.linkTypes
            );
          });
        } catch (err) {
          console.error(err);
        }
      };
      fetchUpdate();
      setDocuments((oldDocs) => {
        return oldDocs.map((doc) => {
          if (doc.id == newDocument.id) {
            doc = { ...newDocument };
            return doc;
          }
          return doc;
        });
      });
      setDocSelected(newDocument);
    } else {
      const id = await API.addDocument(newDocument);
      newDocument.links?.forEach(async (link) => {
        await API.putLink(link.targetDocumentId, id, link.linkTypes);
        documents.map(async (doc) => {
          if (doc.id === link.targetDocumentId) {
            doc.links = await API.getLinks(doc.id);
          }
        });
      });
      const updatedDocument = { ...newDocument, id: id };
      setDocuments([...documents, updatedDocument]);
    }
  };

  // Handle to delete the document selected
  const handleDeleteDocument = async () => {
    try {
      if (docSelected) {
        await API.deleteDocument(docSelected?.id);
        setSidebarOpen(false);
        setIsPopupOpen(false);
        setDocuments((oldDocs: Document[]) => {
          return oldDocs.filter((doc) => doc.id !== docSelected?.id);
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelPopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      {/* Navigation Header */}
      <NavHeader />

      <div className="body-container">
        {/* Map Component with overlay button for adding documents */}
        <div className="map">
          {
            <MapComponent
              documents={documents}
              documentSelected={docSelected}
              setSidebarOpen={setSidebarOpen}
              setDocSelected={setDocSelected}
              setModalOpen={setModalOpen}
              setNewPos={setNewPosition}
              visualLinks={visualizeLinks}
              insertMode={insertMode}
            />
          }
          {user && (
            <div className="button-overlay">
              <button
                className="doc-btn"
                onClick={!insertMode ? handleAddButton : closeInsertMode}
              >
                {insertMode ? (
                  <div className="add-container">
                    <span className="material-symbols-outlined">
                      arrow_back
                    </span>
                    <h4>Back</h4>
                  </div>
                ) : (
                  <div className="back-container">
                    <span className="material-symbols-outlined">note_add</span>
                    <h4>Add new Document</h4>
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
        <Popup
          isOpen={isPopupOpen}
          document={docSelected}
          onConfirm={handleDeleteDocument}
          onCancel={handleCancelPopup}
        />
        {/* Table to see the list of all documents */}
        {
          // <table className="table-documents">
          //   <thead>
          //     <tr>
          //       <th>Icon</th>
          //       <th>Title</th>
          //       <th>Info</th>
          //     </tr>
          //   </thead>
          //   <tbody>
          //     {documents.map((document) => (
          //       <tr key={document.id}>
          //         <td>
          //           <img
          //             className="doc-icon"
          //             src={`/document-${document.type}-icon.png`}
          //             alt="Document icon"
          //           />
          //         </td>
          //         <td className="doc-title">{document.title}</td>
          //         <td>
          //           <button
          //             className="icon-info"
          //             onClick={() => {
          //               console.log(documents);
          //               setSidebarOpen(true);
          //               setDocSelected(document);
          //             }}
          //           >
          //             Info
          //           </button>
          //         </td>
          //       </tr>
          //     ))}
          //   </tbody>
          // </table>
        }

        {/* Sidebar to show document details */}
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          {
            <Sidebar
              setSidebarOpen={setSidebarOpen}
              document={docSelected}
              documents={documents}
              visualLinks={visualizeLinks}
              setVisualLinks={setVisualizeLinks}
              setDocuments={setDocuments}
              setDocument={setDocSelected}
              toEdit={handleEditButton}
              setPopupOpen={setIsPopupOpen}
            />
          }
        </div>
      </div>

      {/* Modal for adding a new document */}
      <ModalForm
        modalOpen={modalOpen}
        editDocument={editDocument}
        onClose={() => {
          setModalOpen(false);
          setEditDocument(false);
        }}
        onSubmit={handleAddNewDocument}
        documents={documents}
        newPos={newPosition}
        closeInsertMode={closeInsertMode}
        docSelected={docSelected}
      />
    </>
  );
};

export default Home;
