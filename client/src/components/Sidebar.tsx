import { FC, useState, useContext } from "react";
import {
  Document,
  documentTypeDisplay,
  fromDocumentTypeToIcon,
  Link,
  ScaleType,
  scaleTypeDisplay,
  stakeholderDisplay,
} from "../utils/interfaces";
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
        <span
          className={`material-symbols-outlined color-${fromDocumentTypeToIcon.get(props.document?.type)} size`}
        >
          {fromDocumentTypeToIcon.get(props.document?.type)}
        </span>
        <hr />
        <h3>{props.document?.title}</h3>
        <p>{props.document?.description}</p>
        <hr />
        <h4>
          Stakeholders:&nbsp;
          {props.document?.stakeholders ? (
            props.document?.stakeholders?.map((s, index, arr) => (
              <span key={`${props.document?.id}-${index}`}>
                {stakeholderDisplay[s]}
                {index < arr.length - 1 ? ", " : ""}
              </span>
            ))
          ) : (
            <span>-</span>
          )}
        </h4>
        <h4>
          Scale:&nbsp;
          <span>
            {props.document?.scale.type &&
              props.document?.scale.type !== ScaleType.Ratio &&
              scaleTypeDisplay[props.document.scale.type]}
            {props.document?.scale.type &&
              props.document?.scale.type === ScaleType.Ratio &&
              `1:${props.document.scale.ratio}`}
          </span>
        </h4>

        <h4>
          Issuance Date:&nbsp;
          <span>
            {props.document?.issuanceDate?.isValid()
              ? props.document?.issuanceDate?.format("MMMM D, YYYY")
              : "-"}
          </span>
        </h4>
        <h4>
          Type:{" "}
          <span>
            {props.document?.type && documentTypeDisplay[props.document?.type]}
          </span>
        </h4>
        <div className="connection-group">
          <h4>
            Links: <span>{props.document?.connections?.length || 0}</span>
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
          Language: <span>{props.document?.language}</span>
        </h4> */}
        {/* <h4>
          Pages: <span>{props.document?.pages}</span>
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
