import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useEffect, useState } from "react";
import API from "../API/API";
import ControlledCarousel from "../components/CardCarousel";
import NavHeader from "../components/NavHeader";
import "../styles/DocumentsList.scss";
import { Document } from "../utils/interfaces";

const DocumentsList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [docSelected, setDocSelected] = useState<Document | null>(null);

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

  return (
    <div id="document-list">
      <NavHeader />
      <div className="doc-lists">
        <h1 className="title">Documents List</h1>
        <ControlledCarousel documents={documents} />
      </div>
    </div>
  );
};

export default DocumentsList;
