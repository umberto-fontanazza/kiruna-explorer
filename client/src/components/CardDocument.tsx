import { Dispatch, FC, SetStateAction, useContext } from "react";
import { authContext } from "../context/auth";
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
  visualLinks: boolean;
  setVisualLinks: Dispatch<SetStateAction<boolean>>;
  toEdit: () => void;
  toEditPos: () => void;
  setPopupOpen: Dispatch<SetStateAction<boolean>>;
}

const CardDocument: FC<CardDocumentProps> = (props) => {
  const { user } = useContext(authContext);
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
        )}
      </div>
      {user && (
        <div className="btn-group">
          <button className="btn-edit" onClick={() => props.toEdit()}>
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
              console.log("aaaaa");
              props.setPopupOpen(true);
            }}
          >
            <span className="material-symbols-outlined ">delete</span>
          </button>
        </div>
      )}
      {/* <h4>
          Language: <span>{props.document?.language}</span>
        </h4> */}
      {/* <h4>
          Pages: <span>{props.document?.pages}</span>
        </h4> */}
    </div>
  );
};

export default CardDocument;
