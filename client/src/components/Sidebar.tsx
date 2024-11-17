import { FC, useState, useContext } from "react";
import { Document, Link } from "../utils/interfaces";
import ModalAddConnection from "../components/ModalAddConnection";
import "../styles/Sidebar.scss";
import "@material/web/iconbutton/filled-tonal-icon-button.js";
import "@material/web/icon/_icon.scss";
import dayjs from "dayjs";
import { authContext } from "../context/auth";

interface SidebarProps {
  document: Document | null;
  documents: Document[];
  visualLinks: boolean;
  setVisualLinks: (visual: boolean) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setDocument: (doc: Document) => void;
  setDocuments: (docs: Document[]) => void;
}

const Sidebar: FC<SidebarProps> = (props) => {
  const { user } = useContext(authContext);
  // State for controlling the modal for adding connections
  const [modalConnectionOpen, setModalConnectionOpen] = useState(false);

  // Handle adding a new connection link
  const handleAddNewConnection = async (newLink: Link) => {
    if (props.document?.id) {
      // Uncomment this line if you want to save the link via an API call
      /*await API.putLink(
          newLink.targetDocumentId,
          newLink.type,
          props.document?.id
        );*/

      const updateDocument = {
        ...props.document,
        connections: [...props.document.connections, newLink],
      };

      props.setDocument(updateDocument);

      const updatedDocuments = props.documents.map((doc) =>
        doc.id === updateDocument.id ? updateDocument : doc
      );

      props.setDocuments(updatedDocuments);
      setModalConnectionOpen(false);
    } else {
      console.error("No document is selected, so the link cannot be added.");
    }
  };

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
          onClick={() => props.setSidebarOpen(false)}
        >
          <img className="btn-close-img" src="x.png" alt="Close" />
        </button>
      </div>

      {/* Sidebar Content */}
      <div className="content">
        <img
          src={`/document-${props.document?.type}-icon.png`}
          alt="Under Construction"
        />
        <hr />
        <h3>{props.document?.title}</h3>
        <p>{props.document?.description}</p>
        <hr />
        <h4>
          Stakeholders:{" "}
          {props.document?.stakeholders?.map((s, index) => (
            <a key={`${props.document?.id}-${index}`}>{s} </a>
          ))}
        </h4>
        <h4>
          Scale: <a>{props.document?.scale.type}</a>
        </h4>
        <h4>
          Issuance Date:{" "}
          <a>{props.document?.issuanceDate?.format("DD/MM/YYYY")}</a>
        </h4>
        <h4>
          Type: <a>{props.document?.type}</a>
        </h4>
        <div className="connection-group">
          <h4>
            Links: <a>{props.document?.connections?.length || 0}</a>
          </h4>
          {user && (
            <div>
              <button
                className={`see-links ${props.visualLinks ? "fill" : "no-fill"}`}
                onClick={() =>
                  props.visualLinks
                    ? props.setVisualLinks(false)
                    : props.setVisualLinks(true)
                }
              >
                <span
                  className={`material-symbols-outlined dark ${props.visualLinks ? "fill" : "no-fill"}`}
                >
                  visibility
                </span>
              </button>
            </div>
          )}
        </div>
        <button className="btn-edit">Edit Document</button>

        {/* <h4>
          Language: <a>{props.document?.language}</a>
        </h4> */}
        {/* <h4>
          Pages: <a>{props.document?.pages}</a>
        </h4> */}
      </div>
      {/* Modal for adding new connections */}
      {modalConnectionOpen && (
        <ModalAddConnection
          documents={props.documents}
          document={props.document}
          onClose={() => setModalConnectionOpen(false)}
          onSubmit={handleAddNewConnection}
        ></ModalAddConnection>
      )}
    </>
  );
};

export default Sidebar;
