import { Dispatch, FC, SetStateAction } from "react";
import { useAppContext } from "../context/appContext";
import "../styles/Sidebar.scss";
import { Document } from "../utils/interfaces";
import CardDocument from "./CardDocument";

interface SidebarProps {
  document: Document | null;
  documents: Document[];
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  setDocument: (doc: Document | null) => void;
  setDocuments: Dispatch<SetStateAction<Document[]>>;
  toEditPos: () => void;
}

const Sidebar: FC<SidebarProps> = (props) => {
  const { setVisualLinks } = useAppContext();
  return (
    <>
      <div className="container-btns">
        {/* Close sidebar button */}
        <button
          className="btn-close-sidebar"
          onClick={() => {
            setVisualLinks(false);
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
        toEditPos={() => props.toEditPos()}
        showMapButton={false}
        isDocSelected={true} // always true here
        setMinimapCoord={null} // no need here
      />
    </>
  );
};

export default Sidebar;
