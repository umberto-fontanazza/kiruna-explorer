import { Dispatch, FC, SetStateAction } from "react";
import "../../styles/DocumentFormPagesStyles/SecondPageModal.scss";
import { DocumentForm, Link } from "../../utils/interfaces";
import LinksTable from "../LinksTable";
import SearchBar from "../SearchBar";

interface SecondPageModalProps {
  documentForm: DocumentForm;
  tableLinks: Link[];
  setTableLinks: Dispatch<SetStateAction<Link[]>>;
  goBack: Dispatch<SetStateAction<number>>;
}

const SecondPageModal: FC<SecondPageModalProps> = ({
  documentForm,
  tableLinks,
  setTableLinks,
  goBack,
}) => {
  return (
    <>
      {tableLinks.length > 0 ? (
        <LinksTable tableLinks={tableLinks} setTableLinks={setTableLinks} />
      ) : (
        <p>
          If you need to add links to other documents, please use the search bar
          below.
        </p>
      )}

      <SearchBar tableLinks={tableLinks} setTableLinks={setTableLinks} />

      <div className="actions">
        <button className="back" onClick={() => goBack((p) => p - 1)}>
          Back
        </button>
        <button className="primary" type="submit">
          {documentForm.id ? "Update Document" : "Add Document"}
        </button>
      </div>
    </>
  );
};

export default SecondPageModal;
