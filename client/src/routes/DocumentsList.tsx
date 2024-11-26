import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useEffect, useState } from "react";
import API from "../API/API";
import ControlledCarousel from "../components/CardCarousel";
import FiltersList from "../components/FiltersList";
import NavHeader from "../components/NavHeader";
import "../styles/DocumentsList.scss";
import { Document, Filters } from "../utils/interfaces";

const DocumentsList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [docSelected, setDocSelected] = useState<Document | null>(null);
  const [filters, setFilters] = useState<Filters>({
    documentType: undefined,
    scaleType: undefined,
    startDate: undefined,
    endDate: undefined,
  });

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

  const handleFiltersSubmit = () => {
    const fetchDocumentsFiltered = async (filters: Filters) => {
      try {
        // const documentsFiltered = API.getDocumentsFilterd(filters);
        // setDocuments(documentsFiltered);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDocumentsFiltered(filters);
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
          <FiltersList
            filters={filters}
            setFilters={setFilters}
            handleFilters={handleFiltersSubmit}
          />
        </div>
        <ControlledCarousel documents={documents} />
      </div>
    </div>
  );
};

export default DocumentsList;
