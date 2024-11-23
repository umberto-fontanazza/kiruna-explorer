import "@material/web/icon/_icon.scss";
import "@material/web/iconbutton/filled-tonal-icon-button.js";
import { Dispatch, FC, SetStateAction } from "react";
import "../styles/Sidebar.scss";
import { Document } from "../utils/interfaces";
import CardDocument from "./CardDocument";

interface SidebarProps {
  document: Document | null;
  documents: Document[];
  visualLinks: boolean;
  setVisualLinks: Dispatch<SetStateAction<boolean>>;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  setDocument: (doc: Document | null) => void;
  setDocuments: Dispatch<SetStateAction<Document[]>>;
  toEdit: () => void;
  toEditPos: () => void;
  setPopupOpen: Dispatch<SetStateAction<boolean>>;
}

const Sidebar: FC<SidebarProps> = (props) => {
  return (
    <>
      <div className="container-btns">
        {/* Download Relative Document button */}
        {/* <button
            className="btn-download-sidebar"
            onClick={() => props.setSidebarOpen(false)}
          >
            <img
              className="btn-download-img"
              src="/file-earmark-arrow-down.svg"
              alt="Download"
            />
          </button> */}

        {/* Close sidebar button */}
        <button
          className="btn-close-sidebar"
          onClick={() => {
            props.setVisualLinks(false);
            props.setSidebarOpen(false);
            props.setDocument(null);
          }}
        >
          <img className="btn-close-img" src="x.png" alt="Close" />
        </button>
      </div>

      {/* Sidebar Content */}
      <CardDocument
        document={props.document}
        toEdit={() => props.toEdit()}
        toEditPos={() => props.toEditPos()}
        setPopupOpen={props.setPopupOpen}
        setVisualLinks={props.setVisualLinks}
        visualLinks={props.visualLinks}
      />
    </>
  );
};

export default Sidebar;
