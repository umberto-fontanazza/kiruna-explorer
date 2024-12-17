import { useEffect, useState } from "react";
import API from "../API/API";
import ControlledCarousel from "../components/CardCarousel";
import FiltersList from "../components/FiltersList";
import Minimap from "../components/MapComponents/Minimap";
import NavHeader from "../components/NavHeader";
import SearchBar from "../components/SearchBar";
import { useAppContext } from "../context/appContext";
import { useDocumentFormContext } from "../context/DocumentFormContext";
import { usePopupContext } from "../context/PopupContext";
import "../styles/DocumentsList.scss";
import {
  Coordinates,
  Document,
  Filters,
  PolygonArea,
} from "../utils/interfaces";

const DocumentsList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [docSelected, setDocSelected] = useState<Document | undefined>(
    undefined,
  );
  const [searchBarDocument, setSearchBarDocument] = useState<
    Document | undefined
  >(undefined);
  const [documentLocation, setDocumentLocation] = useState<
    Coordinates | PolygonArea | null
  >(null);
  const [filters, setFilters] = useState<Filters>({
    type: undefined,
    scaleType: undefined,
    maxIssuanceDate: undefined,
    minIssuanceDate: undefined,
  });
  const { isDeleted } = usePopupContext();
  const { isSubmit } = useDocumentFormContext();
  const { handleEditPositionModeConfirm, modalOpen } = useAppContext();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const documents: Document[] = await API.getDocuments(filters);
        const sortedDocuments = documents.sort((a, b) =>
          a.title.localeCompare(b.title, undefined, {
            sensitivity: "base",
          }),
        );
        setDocuments(sortedDocuments);
      } catch (err) {
        console.error(err);
      }
    };

    if (!searchBarDocument) {
      fetchDocuments();
    } else {
      setDocSelected(searchBarDocument);
      setDocuments([searchBarDocument]);
    }
  }, [
    isDeleted,
    isSubmit,
    filters,
    handleEditPositionModeConfirm,
    searchBarDocument,
  ]);

  const handleCloseMap = () => {
    setDocumentLocation(null);
  };

  return (
    <div id="document-list">
      {modalOpen && <div className="overlay" />}
      <NavHeader />
      <div className="doc-lists">
        <div className="header">
          <h1 className="title">Documents List</h1>
          <SearchBar setSelectedSuggestion={setSearchBarDocument} />
          <FiltersList setFilters={setFilters} />
        </div>
        <ControlledCarousel
          docSelected={docSelected}
          setDocSelected={setDocSelected}
          documents={documents}
          setLocation={setDocumentLocation}
        />
      </div>
      {documentLocation && docSelected && (
        <Minimap
          documentSelected={docSelected}
          documentLocation={documentLocation}
          onClose={handleCloseMap}
        />
      )}
    </div>
  );
};

export default DocumentsList;
