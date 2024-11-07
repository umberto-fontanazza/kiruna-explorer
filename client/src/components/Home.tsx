import { FC, useEffect, useState } from "react";
import API from "../API/API";
import { Document, Link, LinkType, User } from "../utils/interfaces";
import "../styles/Home.scss";
import NavHeader from "./NavHeader";
import ModalForm from "./ModalForm";
import MapComponent from "./Map";
import ModalConnection from "./ModalConnection";

interface HomeProps {
  loggedIn: boolean;
  user: User;
  handleLogout: () => void;
}

const Home: FC<HomeProps> = (props): JSX.Element => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [docSelected, setDocSelected] = useState<Document | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleAddButton = async () => {
    setModalOpen(true);
  };

  const handleAddNewDocument = async (
    newDocument: Document,
    targetId: number,
    linkType: LinkType
  ) => {
    setModalOpen(false);
    const id = await API.postDocument(newDocument);
    await API.putLink(targetId, [linkType], id);
    console.log(id);
    const updatedDocument = { ...newDocument, id: id };
    setDocuments([...documents, updatedDocument]);
  };

  return (
    <>
      <NavHeader
        logout={props.handleLogout}
        loggedIn={props.loggedIn}
        user={props.user}
      />

      <div className="body-container">
        <div className="map">
          {
            <MapComponent
              documents={documents}
              setSidebarOpen={setSidebarOpen}
              setDocSelected={setDocSelected}
            />
          }
          {props.loggedIn && (
            <div className="button-overlay">
              <button className="add-document" onClick={handleAddButton}>
                <img
                  className="doc-img"
                  src="/public/icons8-documento-50.png"
                ></img>
                Add new Document
              </button>
            </div>
          )}
        </div>
        {
          // <table className="table-documents">
          //   <thead>
          //     <tr>
          //       <th>Icon</th>
          //       <th>Title</th>
          //       <th>Info</th>
          //     </tr>
          //   </thead>
          //   <tbody>
          //     {documents.map((document) => (
          //       <tr key={document.id}>
          //         <td>
          //           <img
          //             className="doc-icon"
          //             src={`/document-icon-${document.type}-iconByIcons8.png`}
          //             alt="Document icon"
          //           />
          //         </td>
          //         <td className="doc-title">{document.title}</td>
          //         <td>
          //           <button
          //             className="icon-info"
          //             onClick={() => {
          //               console.log(documents);
          //               setSidebarOpen(true);
          //               setDocSelected(document);
          //             }}
          //           >
          //             Info
          //           </button>
          //         </td>
          //       </tr>
          //     ))}
          //   </tbody>
          // </table>
        }

        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          {
            <Sidebar
              setSidebarOpen={setSidebarOpen}
              document={docSelected}
              documents={documents}
              loggedIn={props.loggedIn}
              setDocuments={setDocuments}
              setDocument={setDocSelected}
            />
          }
        </div>
      </div>
      <ModalForm
        modalOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddNewDocument}
        documents={documents}
      />
    </>
  );
};

function Sidebar(props: {
  setSidebarOpen: (isOpen: boolean) => void;
  setDocuments: (docs: Document[]) => void;
  setDocument: (doc: Document) => void;
  document: Document | null;
  documents: Document[];
  loggedIn: boolean;
}) {
  const [modalConnectionOpen, setModalConnectionOpen] = useState(false);

  const handleModalOpenConnection = () => {
    setModalConnectionOpen(true);
  };

  const handleAddNewConnection = async (newLink: Link) => {
    if (props.document?.id) {
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
          {props.document?.stakeholder?.map((s, index) => (
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
      {modalConnectionOpen && (
        <ModalConnection
          documents={props.documents}
          document={props.document}
          onClose={() => setModalConnectionOpen(false)}
          onSubmit={handleAddNewConnection}
        ></ModalConnection>
      )}
    </>
  );
}

export default Home;
