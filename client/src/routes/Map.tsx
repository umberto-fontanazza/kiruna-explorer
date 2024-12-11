import dayjs from "dayjs";
import { FC, useContext, useEffect, useState } from "react";
import API from "../API/API";
import MapComponent from "../components/MapComponents/MapComponent";
import NavHeader from "../components/NavHeader";
import Sidebar from "../components/Sidebar";
import { useAppContext } from "../context/appContext";
import { authContext } from "../context/auth";
import { useDocumentFormContext } from "../context/DocumentFormContext";
import { usePopupContext } from "../context/PopupContext";
import "../styles/Map.scss";
import {
  Document,
  DocumentType,
  ScaleType,
  Stakeholder,
} from "../utils/interfaces";
import { kirunaCoordinates } from "../utils/map";
import { PositionMode } from "../utils/modes";

const HomeMap: FC = (): JSX.Element => {
  const { user } = useContext(authContext);
  const {
    positionMode,
    modalOpen,
    setPositionMode,
    handleEditPositionModeConfirm,
  } = useAppContext();
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
        const documentWithHole: Document = {
          id: 1,
          title: "Area with Hole",
          description:
            "This document defines a polygonal area with an excluded inner area (hole).",
          type: DocumentType.Design,
          scale: {
            type: ScaleType.ArchitecturalScale,
            ratio: 1.0,
          },
          stakeholders: [Stakeholder.KirunaKommun, Stakeholder.Lkab],
          coordinates: kirunaCoordinates,
          area: {
            include: [
              { latitude: 67.8558, longitude: 20.2253 }, // Vertex 1 (Outer polygon)
              { latitude: 67.8582, longitude: 20.2327 }, // Vertex 2
              { latitude: 67.8605, longitude: 20.2259 }, // Vertex 3
              { latitude: 67.8581, longitude: 20.2198 }, // Vertex 4
              { latitude: 67.8558, longitude: 20.2253 }, // Closing the loop
            ],
            exclude: [
              [
                { latitude: 67.857, longitude: 20.2265 }, // Inner hole Vertex 1
                { latitude: 67.8574, longitude: 20.228 }, // Inner hole Vertex 2
                { latitude: 67.858, longitude: 20.2267 }, // Inner hole Vertex 3
                { latitude: 67.8575, longitude: 20.2252 }, // Inner hole Vertex 4
                { latitude: 67.857, longitude: 20.2265 }, // Closing the inner loop
              ],
            ],
          },
          issuanceDate: dayjs(),
          links: [],
        };

        const updateDocs = [...documents, documentWithHole];
        setDocuments(updateDocs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDocuments();
  }, [isDeleted, isSubmit, handleEditPositionModeConfirm]);

  useEffect(() => {
    const fetchDocument = async () => {
      if (docSelected?.id && !isDeleted) {
        // ho aggiunto isDeleted per eliminare lo sfarfallio ed una chiamata inutile al server
        try {
          const doc = await API.getDocumentById(docSelected.id);
          setDocSelected(doc);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchDocument();
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
        {modalOpen && <div className="overlay" />}
        {/* Map Component with overlay button for adding documents */}
        <div className={`map ${sidebarOpen ? "with-sidebar" : ""}`}>
          <MapComponent
            documents={documents}
            docSelected={docSelected}
            setSidebarOpen={setSidebarOpen}
            setdocumentSelected={setDocSelected}
          />
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

export default HomeMap;
