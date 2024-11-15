import { FC, useEffect, useState } from "react";
import API from "../API/API";
import { Document, LinkType, User } from "../utils/interfaces";
import "../styles/Home.scss";
import NavHeader from "./NavHeader";
import ModalForm from "./ModalAddDocument";
import MapComponent from "./Map";
import Sidebar from "./Sidebar";

interface HomeProps {
  loggedIn: boolean;
  user: User;
  handleLogout: () => void;
}

const Home: FC<HomeProps> = (props): JSX.Element => {
  // State to hold list of documents
  const [documents, setDocuments] = useState<Document[]>([]);
  // State to control sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  // State for selected document
  const [docSelected, setDocSelected] = useState<Document | null>(null);
  // State to control modal for adding documents
  const [modalOpen, setModalOpen] = useState<boolean>(false);

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
        console.log(documents);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDocuments();
  }, []);

  // Handle Add Document button click to open modal
  const handleAddButton = async () => {
    setInsertMode(true);
  };

  const closeInsertMode = () => {
    setInsertMode(false);
  };

  // Handle form submission for new document
  const handleAddNewDocument = async (
    newDocument: Document,
    targetId: number,
    linkType: LinkType
  ) => {
    setModalOpen(false);
    const id = await API.addDocument(newDocument);
    //await API.putLink(targetId, [linkType], id);
    console.log(id);
    const updatedDocument = { ...newDocument, id: id };
    setDocuments([...documents, updatedDocument]);
  };

  return (
    <>
      {/* Navigation Header */}
      <NavHeader
        logout={props.handleLogout}
        loggedIn={props.loggedIn}
        user={props.user}
      />

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
          {props.loggedIn && (
            <div className="button-overlay">
              <button
                className="doc-btn"
                onClick={!insertMode ? handleAddButton : closeInsertMode}
              >
                <>
                  {insertMode ? (
                    <div className="add-container">
                      <span className="material-symbols-outlined">
                        arrow_back
                      </span>
                      <h4>Back</h4>
                    </div>
                  ) : (
                    <div className="back-container">
                      <span className="material-symbols-outlined">
                        note_add
                      </span>
                      <h4>Add new Document</h4>
                    </div>
                  )}
                </>
              </button>
            </div>
          )}
        </div>
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
              loggedIn={props.loggedIn}
              setDocuments={setDocuments}
              setDocument={setDocSelected}
            />
          }
        </div>
      </div>

      {/* Modal for adding a new document */}
      <ModalForm
        modalOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddNewDocument}
        documents={documents}
        newPos={newPosition}
      />
    </>
  );
};

export default Home;
