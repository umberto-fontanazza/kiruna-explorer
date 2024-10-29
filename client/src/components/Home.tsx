import { FC, useEffect, useState } from "react";
import API from "../API/API";
import { Document } from "../utils/interfaces";
import "../styles/Home.scss";
import NavHeader from "./NavHeader";
import ModalAdd from "./ModalAdd";
import MapComponent from "./Map";

interface HomeProps {
  login: boolean;
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

  const handleAddDocument = (newDocument: Document) => {
    setDocuments([...documents, newDocument]);
    setModalOpen(false);
  };

  return (
    <>
      <NavHeader logout={props.handleLogout} login={props.login} />

      <div className="body-container">
        {/*<MapComponent apiKey={""} />*/}
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
          {<Sidebar setSidebarOpen={setSidebarOpen} document={docSelected} />}
        </div>
      </div>

      {/* Button to add a new Document (Description) */}
      <div>
        <button className="add-document" onClick={handleAddButton}>
          Add new Document
        </button>
      </div>

      {/* Modal Add Component */}
      <ModalAdd
        modalOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddDocument}
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
}) {
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
          />
        </button>
        <button
          className="btn-close-sidebar"
          onClick={() => props.setSidebarOpen(false)}
        >
          <img className="btn-close-img" src="/x.svg" />
        </button>
      </div>
      <div className="content">
        <img src="/icons8-under-construction-50.png"></img>
        <hr />
        <h3>{props.document?.title}</h3>
        <p>{props.document?.description}</p>
        <hr className="separator" />
        <h6>
          Stakeholders: <a>{props.document?.stakeholder}</a>
        </h6>
        <h6>
          Scale: <a>{props.document?.scale}</a>
        </h6>
        <h6>
          Issuance Date:{" "}
          <a>{props.document?.issuanceDate?.toLocaleDateString()}</a>
        </h6>
        <h6>
          Type: <a>{props.document?.type}</a>
        </h6>
        <h6>
          Connections: <a></a>
        </h6>
        <h6>
          Language: <a>{props.document?.language}</a>
        </h6>
        <h6>
          Pages: <a>{props.document?.pages}</a>
        </h6>
        <h6>
          Coordinates: <a>{props.document?.coordinates}</a>
        </h6>
      </div>
    </>
  );
}

export default Home;
