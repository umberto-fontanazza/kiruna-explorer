import { useContext } from "react";
import { PopupContext } from "../providers/PopupProvider.tsx";

export const usePopupContext = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopupContext must be used within a PopupProvider");
  }
  return context;
};
