import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom";
import ControlledCarousel from "../components/CardCarousel";
import NavHeader from "../components/NavHeader";
import Popup from "../components/Popup";
import { useAppContext } from "../context/appContext";
import "../styles/DocumentsList.scss";
import { Document } from "../utils/interfaces";

const DocumentsList = () => {
  const nav = useNavigate();
  const {
    documents,
    docSelected,
    setDocSelected,
    isPopupOpen,
    handleEditButton,

    setIsPopupOpen,
    handleDeleteDocument,
    handleCancelPopup,
  } = useAppContext();

  function handleRowClick(doc: Document): void {
    setDocSelected(doc);
  }

  return (
    <>
      <NavHeader />
      <div className="doc-lists">
        <h1 className="title">Documents List</h1>
        <ControlledCarousel documents={documents} />
        <Popup
          isOpen={isPopupOpen}
          document={docSelected}
          onCancel={handleCancelPopup}
          onConfirm={handleDeleteDocument}
        />
      </div>
    </>
  );
};

export default DocumentsList;
