import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../API/API";
import ControlledCarousel from "../components/CardCarousel";
import NavHeader from "../components/NavHeader";
import Popup from "../components/Popup";
import { useAppContext } from "../context/appContext";
import "../styles/DocumentsList.scss";
import { Document } from "../utils/interfaces";

const DocumentsList = () => {
  const nav = useNavigate();
  const {
    docSelected,
    setDocSelected,
    isPopupOpen,
    handleEditButton,

    setIsPopupOpen,
    handleDeleteDocument,
    handleCancelPopup,
  } = useAppContext();

  const [documents, setDocuments] = useState<Document[]>([]);

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
