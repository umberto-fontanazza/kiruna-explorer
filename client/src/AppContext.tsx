import React, { createContext, ReactNode, useEffect, useState } from "react";
import API from "./API/API";
import { Document } from "./utils/interfaces";

// Definizione del tipo per il contesto
interface AppContextType {
  documents: Document[];
  docSelected: Document | null;
  modalOpen: boolean;
  editDocumentMode: boolean;
  isPopupOpen: boolean;
  editPositionMode: boolean;
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  setDocSelected: React.Dispatch<React.SetStateAction<Document | null>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditDocumentMode: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditPositionMode: React.Dispatch<React.SetStateAction<boolean>>;
  handleEditButton: () => void;
  handleDeleteDocument: () => Promise<void>;
  handleCancelPopup: () => void;
}

// Creazione del contesto
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider del contesto
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [docSelected, setDocSelected] = useState<Document | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editDocumentMode, setEditDocumentMode] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [editPositionMode, setEditPositionMode] = useState<boolean>(false);

  // Effetto per il fetch dei documenti
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

  const handleEditButton = () => {
    setEditDocumentMode(true);
    setModalOpen(true);
  };

  const handleDeleteDocument = async () => {
    if (!docSelected) return;

    try {
      if (docSelected.links && docSelected.links.length > 0) {
        for (const link of docSelected.links) {
          await API.deleteLink(docSelected.id, link.targetDocumentId);
        }
      }
      await API.deleteDocument(docSelected.id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== docSelected.id));
      setDocSelected(null);
      setIsPopupOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelPopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        documents,
        docSelected,
        modalOpen,
        editDocumentMode,
        isPopupOpen,
        editPositionMode,
        setDocuments,
        setDocSelected,
        setModalOpen,
        setEditDocumentMode,
        setIsPopupOpen,
        setEditPositionMode,
        handleEditButton,
        handleDeleteDocument,
        handleCancelPopup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
