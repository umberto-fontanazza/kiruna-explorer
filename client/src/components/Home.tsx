import { FC, useEffect, useState } from "react";
import API from "../API/API";
import { Document } from "../utils/interfaces";
import "../styles/Home.scss";
import NavHeader from "./NavHeader";
import ModalAdd from "./ModalForm";
import MapComponent from "./Map";

interface HomeProps {
  login: boolean;
  handleLogout: () => void;
  loggedIn: boolean;
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

  const handleAddDocument = async (newDocument: Document) => {
    setDocuments([...documents, newDocument]);
    setModalOpen(false);
    await API.postDocument(newDocument);
  };

  useEffect(() => {
    console.log(docSelected);
  }, [docSelected]);

  return (
    <>
      <NavHeader logout={props.handleLogout} login={props.login} />

      <div className="body-container">
        {/*<div className="map">
          {<MapComponent apiKey={"AIzaSyB8B_Q-ZvMqmhSvFmZhxi6U1Gv-4uzs-Qc"} />}
          <div className="button-overlay">
            <button className="add-document" onClick={handleAddButton}>
              <img
                className="doc-img"
                src="/public/icons8-documento-50.png"
              ></img>
              Add new Document
            </button>
          </div>
        </div>*/}
        {
          <table className="table-documents">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Title</th>
                <th>Info</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((document) => (
                <tr key={document.id}>
                  <td>
                    <img
                      className="doc-icon"
                      src="/document-icon.png"
                      alt="Document icon"
                    />
                  </td>
                  <td className="doc-title">{document.title}</td>
                  <td>
                    <button
                      className="icon-info"
                      onClick={() => {
                        console.log(documents);
                        setSidebarOpen(true);
                        setDocSelected(document);
                      }}
                    >
                      Info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }

        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          {
            <Sidebar
              setSidebarOpen={setSidebarOpen}
              document={docSelected}
              documents={documents}
            />
          }
        </div>
      </div>

      {/* Button to add a new Document (Description) */}
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
      {/* Modal Add Component */}
      <ModalAdd
        modalOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddDocument}
        documents={documents}
      />

      {/* <div className="diagram">
                Diagram part
            </div> */}
    </>
  );
};

function Sidebar(props: {
  setSidebarOpen: (isOpen: boolean) => void;
  document: Document | null;
  documents: Document[];
}) {
  /*const [showDropDown, setShowDropDown] = useState(false);
  const [newConnection, setNewConnection] = useState("");*/

  return (
    <>
      <div className="container-btns">
        <button
          className="btn-download-sidebar"
          onClick={() => props.setSidebarOpen(false)}
        >
          <img
            className="btn-download-img"
            src="/file-earmark-arrow-down.svg"
            alt="Download"
          />
        </button>
        <button
          className="btn-close-sidebar"
          onClick={() => props.setSidebarOpen(false)}
        >
          <img className="btn-close-img" src="/x.svg" alt="Close" />
        </button>
      </div>
      <div className="content">
        <img src="/icons8-under-construction-50.png" alt="Under Construction" />
        <hr />
        <h3>{props.document?.title}</h3>
        <p>{props.document?.description}</p>
        <hr className="separator" />
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
        <h4>
          Connections: <a>{props.document?.connections?.length}</a>
        </h4>
        {/*<div className="connection-group">
          <h4>
            Connections: <a>{props.document?.connections}</a>
          </h4>
          <button className="btn-add-connection" onClick={toggleDropDown}>
            +
          </button>
          {showDropDown && (
            <div className="drop-down">
              <select
                value={newConnection}
                onChange={(e) => {
                  setNewConnection(e.target.value);
                }}
              >
                <option value="">Choose a new Connection</option>
                {props.documents.map((doc) => (
                  <option key={doc.id} value={doc.title}>
                    {doc.title}
                  </option>
                ))}
              </select>
              {newConnection && (
                <button
                  onClick={handleConfirm}
                  className="btn-confirm-connection"
                >
                  Confirm
                </button>
              )}
            </div>
          )}
        </div>*/}
        <h4>
          Language: <a>{props.document?.language}</a>
        </h4>
        <h4>
          Pages: <a>{props.document?.pages}</a>
        </h4>
        <h4>
          Coordinates:{" "}
          <a>
            {props.document?.coordinates.latitude} |{" "}
            {props.document?.coordinates.longitude}
          </a>
          {/*props.document?.coordinates &&
            props.document.coordinates.length > 0 ? (
            <div>
              {props.document.coordinates.map((coord, index) => (
                <div key={index}>
                  <a>{coord.latitude}</a> | <a>{coord.longitude}</a>
                </div>
              ))}
            </div>
          ) : (
            ""
          )*/}
        </h4>
      </div>
    </>
  );
}

export default Home;
