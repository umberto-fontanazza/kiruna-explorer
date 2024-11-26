import { useContext } from "react";
import { DocumentFormContext } from "../providers/DocumentFormProvider";

export const useDocumentFormContext = () => {
  const context = useContext(DocumentFormContext);
  if (!context) {
    throw new Error(
      "useDocumentFormContext must be used within a DocumentContextProvider",
    );
  }
  return context;
};
