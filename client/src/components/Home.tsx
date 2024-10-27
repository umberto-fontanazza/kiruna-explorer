import { useEffect, useState } from "react";
import API from "../API/API";
import { Document } from "../utils/interfaces";
import "../styles/Home.scss"
import NavHeader from "./NavHeader";
import "../styles/global.scss"


function Home() {

    const [documents, setDocuments] = useState<Document[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState<Boolean>(false);
    const [docSelected, setDocSelected] = useState<Document | null>(null);


    useEffect(() => {
        const fetchDocuments = async () => {
            try{
                const documents  = await API.getDocuments();
                setDocuments(documents);
            }catch(err){
                console.error(err);
            }
        }
        fetchDocuments();
    }, []);

    return (
        <>  
            <NavHeader logout={function (): void {
                throw new Error("Function not implemented.");
            } } />

            <div className="body-container">
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
                <td><img className="doc-icon" src="/document-icon.png" alt="Document icon" /></td>
                <td className="doc-title">{document.title}</td>
                <td>
                  <button
                    className="icon-info"
                    onClick={() => { 
                      setSidebarOpen(true);
                      setDocSelected(document);
                    }} 
                  >Info</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

                <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                    {<Sidebar setSidebarOpen={setSidebarOpen} document={docSelected}/>}
                </div>

            </div>

            {/* <div className="diagram">
                Diagram part
            </div> */}
        </>
    )
}


function Sidebar(props: { setSidebarOpen: (isOpen: boolean) => void; document: Document | null; }) {

  
    return (
        <>
        <div className="container-btns">
            <button className="btn-download-sidebar" onClick={() => props.setSidebarOpen(false)}>
                <img className="btn-download-img" src="/file-earmark-arrow-down.svg" />
            </button>
            <button className="btn-close-sidebar" onClick={() => props.setSidebarOpen(false)}>
                <img className="btn-close-img" src="/x.svg" />
            </button>
        </div>
        <div className="content">
            <div >
                <h3>{props.document?.title}</h3>
                <p>{props.document?.description}</p>
            </div>
        </div>
        </>
      
    );
  };
  
export default Home;