import { useState } from "react";
import { useAppContext } from "../context/appContext";
import { useDocumentFormContext } from "../context/DocumentFormContext";
import "../styles/DocumentForm.scss";
import { documentFormDefaults, Link, Upload } from "../utils/interfaces";
import { PositionMode } from "../utils/modes";
import { validateDate } from "../utils/utils";
import FirstPageModal from "./DocumentFormPages/FirstPageModal";
import SecondPageModal from "./DocumentFormPages/SecondPageModal";
import ThirdPageModal from "./DocumentFormPages/ThirdPageModal";
import ProgressBar from "./ProgressBar";

const DocumentForm = () => {
  const { setModalOpen, setEditDocumentMode, setPositionMode } =
    useAppContext();
  const {
    documentFormSelected,
    setDocumentFormSelected,
    handleAddNewDocument,
    handleUpdateDocument,
  } = useDocumentFormContext();

  const [page, setPage] = useState<number>(1);
  const [tableLinks, setTableLinks] = useState<Link[]>(
    documentFormSelected?.links || [],
  );
  const [filesToUpload, setFilesToUpload] = useState<Upload[] | undefined>(
    undefined,
  );
  const [errors, setErrors] = useState<Record<string, string> | null>(null);

  const validateFirstPage = (): boolean => {
    const errors: Record<string, string> = {};

    if (!validateDate(documentFormSelected.issuanceTime || "")) {
      errors.issuanceTime =
        "Invalid date or invalid date format.<br/>Please use YYYY, YYYY-MM or YYYY-MM-DD.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    // Add document
    if (!documentFormSelected.id) {
      handleAddNewDocument(
        {
          ...documentFormSelected,
          links: tableLinks,
        },
        filesToUpload ?? [],
      );
    }

    // Update document
    if (documentFormSelected.id) {
      handleUpdateDocument(
        { ...documentFormSelected, links: tableLinks },
        documentFormSelected.links,
        filesToUpload,
      );
    }
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
          if (validateFirstPage()) setPage(2);
        } else if (page === 2) setPage(3);
        else handleFormSubmit(ev);
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
          errors={errors}
          setErrors={setErrors}
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
          filesToUpload={filesToUpload}
          goBack={setPage}
          setFilesToUpload={setFilesToUpload}
        />
      )}
    </form>
  );
};

export default DocumentForm;
