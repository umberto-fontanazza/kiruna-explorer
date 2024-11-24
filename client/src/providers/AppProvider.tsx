import React, { createContext, ReactNode, useState } from "react";
import API from "../API/API";
import { Coordinates, Document } from "../utils/interfaces";

//const appModes: "default" | "view-links" | "edit-document" = "default";
// Definizione del tipo per il contesto
interface AppContextType {
  modalOpen: boolean;
  editDocumentMode: boolean;
  isPopupOpen: boolean;
  editPositionMode: boolean;
  visualLinks: boolean;
  positionView: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditDocumentMode: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditPositionMode: React.Dispatch<React.SetStateAction<boolean>>;
  setVisualLinks: React.Dispatch<React.SetStateAction<boolean>>;
  setPositionView: React.Dispatch<React.SetStateAction<boolean>>;
  handleEditButton: () => void;
  handleCancelPopup: () => void;
  handleEditPositionModeConfirm: (
    docSelected: Document,
    newPos: Coordinates
  ) => void;
}

// Creazione del contesto
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider del contesto
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editDocumentMode, setEditDocumentMode] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [editPositionMode, setEditPositionMode] = useState<boolean>(false);
  const [positionView, setPositionView] = useState<boolean>(false);
  const [visualLinks, setVisualLinks] = useState<boolean>(false);

  const handleEditButton = () => {
    setEditDocumentMode(true);
    setModalOpen(true);
  };

  const handleCancelPopup = () => {
    setIsPopupOpen(false);
  };

  const handleEditPositionModeConfirm = async (
    docSelected: Document,
    newPos: Coordinates
  ) => {
    if (docSelected) {
      try {
        const updateDocument = {
          ...docSelected,
          coordinates: {
            latitude: newPos.latitude,
            longitude: newPos.longitude,
          },
        };
        await API.updateDocument(updateDocument);
      } catch (err) {
        console.error(err);
      }
    }
    setEditPositionMode(false);
    setPositionView(false);
  };

  return (
    <AppContext.Provider
      value={{
        modalOpen,
        editDocumentMode,
        isPopupOpen,
        editPositionMode,
        visualLinks,
        positionView,
        setModalOpen,
        setEditDocumentMode,
        setIsPopupOpen,
        setEditPositionMode,
        setVisualLinks,
        setPositionView,
        //Functions
        handleEditButton,
        handleCancelPopup,
        handleEditPositionModeConfirm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
