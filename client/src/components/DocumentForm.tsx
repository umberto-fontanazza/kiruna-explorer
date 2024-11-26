import { useEffect, useState } from "react";
import { useAppContext } from "../context/appContext";
import { useDocumentFormContext } from "../context/DocumentFormContext";
import "../styles/DocumentForm.scss";
import {
  documentFormDefaults,
  DocumentForm as DocumentFormType,
  Link,
} from "../utils/interfaces";
import { PositionMode } from "../utils/modes";
import FirstPageModal from "./DocumentFormPages/FirstPageModal";
import SecondPageModal from "./DocumentFormPages/SecondPageModal";
import ThirdPageModal from "./DocumentFormPages/ThirdPageModal";
import ProgressBar from "./ProgressBar";

const DocumentForm = () => {
  const { setModalOpen, setEditDocumentMode, setPositionMode } =
    useAppContext();
  const {
    coordinates,
    documentFormSelected,
    setDocumentFormSelected,
    handleAddNewDocument,
  } = useDocumentFormContext();
  const [page, setPage] = useState<number>(1);
  const [document, setDocument] = useState<DocumentFormType>(
    documentFormSelected || { ...documentFormDefaults },
  );
  const [tableLinks, setTableLinks] = useState<Link[]>(document?.links || []);

  useEffect(() => {
    setDocument((prev) => ({
      ...prev,
      coordinates: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
    }));
  }, [coordinates]);

  const handleFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    handleAddNewDocument({
      ...document,
      links: tableLinks,
    });
    resetForm();
  };

  const resetForm = () => {
    setDocument(documentFormDefaults);
    setPage(1);
    setPositionMode(PositionMode.None);
    setModalOpen(false);
  };

  return (
    <form
      className={`document modal page-${page}`}
      onSubmit={(ev) => {
        ev.preventDefault();
        if (page === 1) {
          // Passa alla pagina successiva solo se la validazione è passata
          setPage(2);
        }
        if (page === 2) {
          setPage(3);
        }
      }}
    >
      <button
        className="close"
        onClick={() => {
          setDocument(documentFormDefaults);
          setPage(1);
          setModalOpen(false);
          setEditDocumentMode(false);
          setDocumentFormSelected(null);
        }}
      >
        <img src="/x.png" alt="Close" />
      </button>

      <h2>{document.id ? "Update Document" : "New Document Registration"}</h2>

      <ProgressBar currentPage={page} />
      {page === 1 && (
        <FirstPageModal document={document} setDocument={setDocument} />
      )}
      {page === 2 && (
        <SecondPageModal
          document={document}
          tableLinks={tableLinks}
          setTableLinks={setTableLinks}
          goBack={setPage}
        />
      )}
      {page === 3 && (
        <ThirdPageModal
          document={document}
          onSubmit={handleFormSubmit}
          goBack={setPage}
        />
      )}
    </form>
  );
};

export default DocumentForm;

//onClick={handleFormSubmit}
