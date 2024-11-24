import { FC, useCallback, useContext, useEffect, useState } from "react";
import API from "../API/API";
import DocumentForm from "../components/DocumentForm";
import MapComponent from "../components/Map";
import NavHeader from "../components/NavHeader";
import Sidebar from "../components/Sidebar";
import { useAppContext } from "../context/appContext";
import { authContext } from "../context/auth";
import { usePopupContext } from "../context/PopupContext";
import "../styles/Home.scss";
import {
  Coordinates,
  Document,
  DocumentForm as DocumentFormType,
} from "../utils/interfaces";

const Home: FC = (): JSX.Element => {
  const { user } = useContext(authContext);
  const {
    modalOpen,
    setModalOpen,
    editDocumentMode,
    positionView,
    setPositionView,
    setEditPositionMode,
    handleEditPositionModeConfirm,
    closePositionView,
  } = useAppContext();
  const { isDeleted } = usePopupContext();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [docSelected, setDocSelected] = useState<Document | null>(null);

  // State to control sidebar visibility.
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const [newPosition, setNewPosition] = useState<Coordinates>({
    latitude: -1,
    longitude: -1,
  });

  const handleAddNewDocument = useCallback(
    async (newDocument: DocumentFormType) => {
      setModalOpen(false);
      if (newDocument.id) {
        const fetchUpdate = async () => {
          try {
            await API.updateDocument(newDocument as Document);
            newDocument.links?.map(async (link: any) => {
              await API.putLink(
                newDocument.id!,
                link.targetDocumentId,
                link.linkTypes
              );
            });
          } catch (err) {
            console.error(err);
          }
        };
        await fetchUpdate();
        setDocuments((oldDocs) =>
          oldDocs.map((doc) =>
            doc.id === newDocument.id ? { ...(newDocument as Document) } : doc
          )
        );
        setDocSelected(newDocument as Document);
      } else {
        const id = await API.addDocument(newDocument as Document);
        newDocument.links?.forEach(async (link) => {
          await API.putLink(link.targetDocumentId, id, link.linkTypes);
          documents.map(async (doc) => {
            if (doc.id === link.targetDocumentId) {
              doc.links = await API.getLinks(doc.id);
            }
          });
        });
      }
    },
    [setModalOpen, API, setDocuments, setDocSelected]
  );

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
  }, [isDeleted, handleEditPositionModeConfirm, handleAddNewDocument]);

  // Handle Add Document button click to open modal
  const handleAddButton = () => {
    setPositionView(true);
    setSidebarOpen(false);
  };

  useEffect(() => {
    if (isDeleted) {
      setSidebarOpen(false);
    }
  }, [isDeleted]);

  //Handle to edit the position of the document selected
  const handleEditPositionMode = () => {
    setSidebarOpen(false);
    setPositionView(true);
    setEditPositionMode(true);
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
              setdocumentSelected={setDocSelected}
              setNewPosition={setNewPosition}
            />
          }
          {user && (
            <div className="button-overlay">
              <button
                className="doc-btn"
                onClick={!positionView ? handleAddButton : closePositionView}
              >
                {positionView ? (
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

        {/* Sidebar to show document details */}
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          {
            <Sidebar
              setSidebarOpen={setSidebarOpen}
              document={docSelected}
              documents={documents}
              setDocuments={setDocuments}
              setDocument={setDocSelected}
              toEditPos={handleEditPositionMode}
            />
          }
        </div>
      </div>

      {modalOpen && (
        <DocumentForm
          newPos={newPosition}
          onSubmit={handleAddNewDocument}
          documents={documents}
          editDocument={(editDocumentMode && docSelected) || null}
        />
      )}
    </>
  );
};

export default Home;
