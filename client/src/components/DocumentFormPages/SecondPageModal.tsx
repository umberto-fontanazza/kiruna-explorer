import { Dispatch, FC, SetStateAction } from "react";
import "../../styles/DocumentFormPagesStyles/SecondPageModal.scss";
import { DocumentForm, Link } from "../../utils/interfaces";
import LinksTable from "../LinksTable";
import SearchBar from "../SearchBar";

interface SecondPageModalProps {
  document: DocumentForm;
  tableLinks: Link[];
  setTableLinks: Dispatch<SetStateAction<Link[]>>;
  goBack: Dispatch<SetStateAction<number>>;
}

const SecondPageModal: FC<SecondPageModalProps> = (props) => {
  return (
    <>
      {props.tableLinks.length > 0 ? (
        <LinksTable
          tableLinks={props.tableLinks}
          setTableLinks={props.setTableLinks}
        />
      ) : (
        <p>
          If you need to add links to other documents, please use the search bar
          below.
        </p>
      )}

      <SearchBar
        tableLinks={props.tableLinks}
        setTableLinks={props.setTableLinks}
      />

      <div className="actions">
        <button className="back" onClick={() => props.goBack((p) => p - 1)}>
          Back
        </button>
        <button className="primary" type="submit">
          {props.document.id ? "Update Document" : "Add Document"}
        </button>
      </div>
    </>
  );
};

export default SecondPageModal;
