import { FC, useContext, useEffect, useState } from "react";
import API from "../API/API";
import MapComponent from "../components/Map";
import NavHeader from "../components/NavHeader";
import Sidebar from "../components/Sidebar";
import { useAppContext } from "../context/appContext";
import { authContext } from "../context/auth";
import { useDocumentFormContext } from "../context/DocumentFormContext";
import { usePopupContext } from "../context/PopupContext";
import "../styles/Home.scss";
import { Document } from "../utils/interfaces";
import { PositionMode } from "../utils/modes";

const Home: FC = (): JSX.Element => {
  const { user } = useContext(authContext);
  const { positionMode, setPositionMode, handleEditPositionModeConfirm } =
    useAppContext();
  const { isDeleted } = usePopupContext();
  const { isSubmit } = useDocumentFormContext();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [docSelected, setDocSelected] = useState<Document | null>(null);

  // State to control sidebar visibility.
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

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
  }, [isDeleted, isSubmit, handleEditPositionModeConfirm]);

  useEffect(() => {
    if (docSelected?.id) {
      const matchingDoc = documents.find((doc) => doc.id === docSelected.id);
      if (
        matchingDoc &&
        JSON.stringify(matchingDoc) !== JSON.stringify(docSelected)
      ) {
        setDocSelected(matchingDoc);
      }
    }
  }, [documents]);

  // Handle Add Document button click to open modal
  const handleAddButton = () => {
    setPositionMode(PositionMode.Insert);
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
    setPositionMode(PositionMode.Update);
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
            />
          }
          {user && (
            <div className="button-overlay">
              <button
                className="doc-btn"
                onClick={
                  positionMode === PositionMode.None
                    ? handleAddButton
                    : () => setPositionMode(PositionMode.None)
                }
              >
                {positionMode !== PositionMode.None ? (
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
    </>
  );
};

export default Home;
