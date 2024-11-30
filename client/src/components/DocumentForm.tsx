import { useEffect, useState } from "react";
import { useAppContext } from "../context/appContext";
import { useDocumentFormContext } from "../context/DocumentFormContext";
import "../styles/DocumentForm.scss";
import { documentFormDefaults, Link, UploadForm } from "../utils/interfaces";
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
  const [tableLinks, setTableLinks] = useState<Link[]>(
    documentFormSelected?.links || [],
  );
  const [uploadedFiles, setUploadedFiles] = useState<UploadForm[] | null>(null);

  useEffect(() => {
    setDocumentFormSelected((prev) => ({
      ...prev,
      coordinates: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
    }));
  }, [coordinates]);

  const handleFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    handleAddNewDocument(
      {
        ...documentFormSelected,
        links: tableLinks,
      },
      uploadedFiles ?? undefined,
    );
    resetForm(false);
  };

  const resetForm = (isClosed: boolean) => {
    setDocumentFormSelected(documentFormDefaults);
    setPage(1);
    if (isClosed) {
      setEditDocumentMode(false);
    } else {
      setPositionMode(PositionMode.None);
    }
    setModalOpen(false);
  };

  return (
    <form
      className={`document modal page-${page}`}
      onSubmit={(ev) => {
        ev.preventDefault();
        if (page === 1) {
          setPage(2);
        } else if (page === 2) {
          setPage(3);
        } else {
          handleFormSubmit(ev);
        }
      }}
    >
      <button className="close" onClick={() => resetForm(true)}>
        <img src="/x.png" alt="Close" />
      </button>

      <div className="form-header">
        <h2 className="form-title">
          {documentFormSelected.id
            ? "Update Document"
            : "New Document Registration"}
        </h2>

        <ProgressBar currentPage={page} />
      </div>

      {page === 1 && (
        <FirstPageModal
          documentForm={documentFormSelected}
          setDocumentForm={setDocumentFormSelected}
        />
      )}
      {page === 2 && (
        <SecondPageModal
          documentForm={documentFormSelected}
          tableLinks={tableLinks}
          setTableLinks={setTableLinks}
          goBack={setPage}
        />
      )}
      {page === 3 && (
        <ThirdPageModal
          documentForm={documentFormSelected}
          tableLinks={tableLinks}
          filesToUpload={uploadedFiles}
          goBack={setPage}
          setFilesToUpload={setUploadedFiles}
        />
      )}
    </form>
  );
};

export default DocumentForm;

//onClick={handleFormSubmit}
