import { useEffect, useState } from "react";
import { useAppContext } from "../context/appContext";
import { useDocumentFormContext } from "../context/DocumentFormContext";
import "../styles/DocumentForm.scss";
import { documentFormDefaults, Link } from "../utils/interfaces";
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
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

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
      uploadedFile ?? "",
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
          console.log("aaaa");
          handleFormSubmit(ev);
        }
      }}
    >
      <button className="close" onClick={() => resetForm(true)}>
        <img src="/x.png" alt="Close" />
      </button>

      <h2>
        {documentFormSelected.id
          ? "Update Document"
          : "New Document Registration"}
      </h2>

      <ProgressBar currentPage={page} />
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
          fileToUpload={uploadedFile}
          goBack={setPage}
          setFileToUpload={setUploadedFile}
        />
      )}
    </form>
  );
};

export default DocumentForm;

//onClick={handleFormSubmit}
