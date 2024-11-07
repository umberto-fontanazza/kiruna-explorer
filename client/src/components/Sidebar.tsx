import { FC, useState } from "react";
import { Document, Link } from "../utils/interfaces";
import ModalAddConnection from "../components/ModalAddConnection";

interface SidebarProps {
  document: Document | null;
  documents: Document[];
  loggedIn: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  setDocument: (doc: Document) => void;
  setDocuments: (docs: Document[]) => void;
}

const Sidebar: FC<SidebarProps> = (props) => {
  // State for controlling the modal for adding connections
  const [modalConnectionOpen, setModalConnectionOpen] = useState(false);

  // Function to open modal for adding connections
  const handleModalOpenConnection = () => {
    setModalConnectionOpen(true);
  };

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

  // Utility function to convert coordinates to DMS format
  const convertToDMS = (decimal: number | null): string => {
    if (decimal === null) return "";

    const degrees = Math.floor(decimal);
    const minutesDecimal = Math.abs((decimal - degrees) * 60);
    const minutes = Math.floor(minutesDecimal);
    const seconds = Math.round((minutesDecimal - minutes) * 60 * 1000) / 1000; // Precisione a tre cifre per i secondi

    return `${degrees}° ${minutes}' ${seconds}"`;
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
          <img className="btn-close-img" src="/x.svg" alt="Close" />
        </button>
      </div>
      <div className="content">
        <img
          src={`/document-icon-${props.document?.type}-iconByIcons8.png`}
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
          Scale: <a>{props.document?.scale}</a>
        </h4>
        <h4>
          Issuance Date:{" "}
          <a>{props.document?.issuanceDate?.toLocaleDateString()}</a>
        </h4>
        <h4>
          Type: <a>{props.document?.type}</a>
        </h4>
        <div className="connection-group">
          <h4>
            Connections: <a>{props.document?.connections?.length}</a>
          </h4>
          {props.loggedIn && (
            <button
              className="btn-add-button"
              onClick={handleModalOpenConnection}
            >
              +
            </button>
          )}
        </div>

        <h4>
          Language: <a>{props.document?.language}</a>
        </h4>
        <h4>
          Pages: <a>{props.document?.pages}</a>
        </h4>
        <h4>
          Coordinates:{" "}
          <a>
            {convertToDMS(props.document?.coordinates.latitude ?? null)} |{" "}
            {convertToDMS(props.document?.coordinates.longitude ?? null)}
          </a>
        </h4>
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
