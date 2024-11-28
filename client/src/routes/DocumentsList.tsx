import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useEffect, useState } from "react";
import API from "../API/API";
import ControlledCarousel from "../components/CardCarousel";
import FiltersList from "../components/FiltersList";
import Minimap from "../components/MapComponents/Minimap";
import NavHeader from "../components/NavHeader";
import { useDocumentFormContext } from "../context/DocumentFormContext";
import { usePopupContext } from "../context/PopupContext";
import "../styles/DocumentsList.scss";
import { Coordinates, Document, Filters } from "../utils/interfaces";

const DocumentsList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentCoordinates, setDocumentCoordinates] = useState<Coordinates>({
    latitude: -1,
    longitude: -1,
  });
  const [filters, setFilters] = useState<Filters>({
    type: undefined,
    scaleType: undefined,
    maxIssuanceDate: undefined,
    minIssuanceDate: undefined,
  });
  const { isDeleted } = usePopupContext();
  const { isSubmit } = useDocumentFormContext();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const documents: Document[] = await API.getDocuments(filters);
        setDocuments(documents);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDocuments();
  }, [isDeleted, isSubmit, filters]);

  const handleCloseMap = () => {
    setDocumentCoordinates({
      latitude: -1,
      longitude: -1,
    });
  };

  return (
    <div id="document-list">
      <NavHeader />
      <div className="doc-lists">
        <div className="header">
          <h1 className="title">Documents List</h1>
          <div className="searchbar-container">
            <input type="text" className="searchbar" placeholder="Search..." />
            <button className="search-button">
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
          <FiltersList setFilters={setFilters} />
        </div>
        <ControlledCarousel
          documents={documents}
          setCoordinates={setDocumentCoordinates}
        />
      </div>
      {documentCoordinates && documentCoordinates.latitude !== -1 && (
        <Minimap
          coordinates={documentCoordinates}
          onClose={() => handleCloseMap()}
        />
      )}
    </div>
  );
};

export default DocumentsList;
