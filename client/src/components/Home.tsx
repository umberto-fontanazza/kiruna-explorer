import { useEffect, useState } from "react";
import API from "../API/API";
import { Document } from "../utils/interfaces";
import "../styles/Home.scss"
import NavHeader from "./NavHeader";


function Home() {

    const [documents, setDocuments] = useState<Document[]>([]);
    const [sideBarOpen, setSideBarOpen] = useState<Boolean>(true);



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
                <ol className="ol-documents">
                    {documents.map((document) => (
                        <li className="li-doc" key={document.id}>
                            <img  className="doc-icon" src="/public/document-icon.png" />
                            <h5 className="doc-title">{document.title}</h5>
                            {document.description ? <p className="doc-description">{document.description}</p> 
                            : <p><button className="btn-add-description">Add description</button></p>}
                        </li>
                    ))}
                </ol>
                <div className="sidebar">
                    {sideBarOpen && <SideBar />}
                </div>
            </div>

            <div className="diagram">
                Diagram part
            </div>
        </>
    )
}


function SideBar() {
    return (
        <>
            <h2>Sidebar</h2>
        </>
    )
}

export default Home;