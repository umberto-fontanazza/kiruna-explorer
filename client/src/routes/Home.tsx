import { FC, useContext, useEffect, useState } from "react";
import API from "../API/API";
import MapComponent from "../components/Map";
import ModalForm from "../components/ModalAddDocument";
import NavHeader from "../components/NavHeader";
import Sidebar from "../components/Sidebar";
import { useAppContext } from "../context/appContext";
import { authContext } from "../context/auth";
import { usePopupContext } from "../context/PopupContext";
import "../styles/Home.scss";
import { Coordinates, Document } from "../utils/interfaces";

const Home: FC = (): JSX.Element => {
  const { user } = useContext(authContext);
  const {
    modalOpen,
    setModalOpen,
    editDocumentMode,
    setEditDocumentMode,
    isPopupOpen,
    setIsPopupOpen,
    editPositionMode,
    setEditPositionMode,
    handleEditButton,
    handleCancelPopup,
  } = useAppContext();
  const { isDeleted } = usePopupContext();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [docSelected, setDocSelected] = useState<Document | null>(null);

  // State to control sidebar visibility.
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  //States to handle to insertion and modification of the position of a document.
  const [positionView, setPositionView] = useState<boolean>(false);

  // State to handle the visualization of the links, highlighting the markers on the map.
  const [visualizeLinks, setVisualizeLinks] = useState<boolean>(false);

  const [newPosition, setNewPosition] = useState<Coordinates>({
    latitude: -1,
    longitude: -1,
  });

  // Effetto per il fetch dei documenti
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
  }, [isDeleted]);

  // Handle Add Document button click to open modal
  const handleAddButton = () => {
    setPositionView(true);
    setSidebarOpen(false);
  };

  const closePositionView = () => {
    setPositionView(false);
  };

  // Handle form submission for new document
  const handleAddNewDocument = async (newDocument: Document) => {
    setModalOpen(false);
    if (editDocumentMode) {
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

  const handleEditPositionModeConfirm = async (newPos: Coordinates) => {
    if (docSelected) {
      try {
        const updateDocument = {
          ...docSelected,
          coordinates: {
            latitude: newPos.latitude,
            longitude: newPos.longitude,
          },
        };
        await API.updateDocument(updateDocument);
        setDocuments([
          ...documents.filter((doc) => doc.id !== updateDocument.id),
          updateDocument,
        ]);
      } catch (err) {
        console.error(err);
      }
    }
    setEditPositionMode(false);
    setPositionView(false);
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
              setModalOpen={setModalOpen}
              visualLinks={visualizeLinks}
              positionView={positionView}
              editPositionMode={editPositionMode}
              editDocumentMode={editDocumentMode}
              onEditPos={handleEditPositionModeConfirm}
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
              visualLinks={visualizeLinks}
              setVisualLinks={setVisualizeLinks}
              setDocuments={setDocuments}
              setDocument={setDocSelected}
              toEdit={handleEditButton}
              setPopupOpen={setIsPopupOpen}
              toEditPos={handleEditPositionMode}
            />
          }
        </div>
      </div>

      {/* Modal for adding a new document */}
      <ModalForm
        modalOpen={modalOpen}
        editDocumentMode={editDocumentMode}
        setEditDocumentMode={setEditDocumentMode}
        onClose={() => {
          setModalOpen(false);
          setEditDocumentMode(false);
        }}
        onSubmit={handleAddNewDocument}
        documents={documents}
        newPos={newPosition}
        closePositionView={closePositionView}
        docSelected={docSelected}
      />
    </>
  );
};

export default Home;
