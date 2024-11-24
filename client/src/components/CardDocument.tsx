import { FC, useContext } from "react";
import { useAppContext } from "../context/appContext";
import { authContext } from "../context/auth";
import { usePopupContext } from "../context/PopupContext";
import "../styles/CardDocument.scss";
import {
  Document,
  documentTypeDisplay,
  fromDocumentTypeToIcon,
  Link,
  ScaleType,
  scaleTypeDisplay,
  stakeholderDisplay,
} from "../utils/interfaces";

interface CardDocumentProps {
  document: Document | null;
  toEdit: () => void;
  toEditPos: () => void;
}

const CardDocument: FC<CardDocumentProps> = (props) => {
  const { user } = useContext(authContext);
  const {
    setIsPopupOpen,
    setModalOpen,
    visualLinks,
    setVisualLinks,
    setEditDocumentMode,
  } = useAppContext();
  const { setDocumentToDelete } = usePopupContext();
  return (
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
          Links:&nbsp;
          <span>
            {props.document?.links?.reduce(
              (acc: number, link: Link) => acc + link.linkTypes.length,
              0
            ) || 0}
          </span>
        </h4>
        {props.document?.links && props.document?.links.length > 0 && (
          <button
            className={`see-links ${visualLinks ? "fill" : "no-fill"}`}
            onClick={() =>
              visualLinks ? setVisualLinks(false) : setVisualLinks(true)
            }
          >
            <span
              className={`material-symbols-outlined dark ${visualLinks ? "fill" : "no-fill"}`}
            >
              visibility
            </span>
          </button>
        )}
      </div>
      {user && (
        <div className="btn-group">
          <button
            className="btn-edit"
            onClick={() => {
              setEditDocumentMode(true);
              setModalOpen(true);
            }}
          >
            <span className="material-symbols-outlined">edit_document</span>
          </button>
          <button
            className="btn-edit pos"
            onClick={() => {
              props.toEditPos();
            }}
          >
            <span className="material-symbols-outlined">edit_location</span>
          </button>
          <button
            className="btn-edit delete"
            onClick={() => {
              setIsPopupOpen(true);
              setDocumentToDelete(props.document);
            }}
          >
            <span className="material-symbols-outlined ">delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CardDocument;
