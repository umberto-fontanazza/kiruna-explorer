import dayjs from "dayjs";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import "../styles/DocumentForm.scss";
import {
  Coordinates,
  createDocumentStateFromExisting,
  createNewDocumentState,
  Document,
  DocumentType,
  Link,
  ScaleType,
  Stakeholder,
} from "../utils/interfaces";
import LinksTable from "./LinksTable";
import ProgressBar from "./ProgressBar";
import SearchBar from "./SearchBar";

interface DocumentFormProps {
  modalOpen: boolean;
  newPos: Coordinates;
  editDocumentMode: boolean;
  onClose: () => void;
  onSubmit: (newDocument: Document) => void;
  documents: Document[];
  closePositionView: () => void;
  docSelected: Document | null;
  setEditDocumentMode: Dispatch<SetStateAction<boolean>>;
}

const stakeholdersOptions = [
  { value: Stakeholder.Lkab, label: "LKAB" },
  { value: Stakeholder.KirunaKommun, label: "Kiruna kommun" },
  { value: Stakeholder.Residents, label: "Residents" },
  { value: Stakeholder.WhiteArkitekter, label: "White Arkitekter" },
];

const DocumentForm: FC<DocumentFormProps> = ({
  modalOpen,
  onClose,
  onSubmit,
  documents,
  newPos,
  closePositionView,
  setEditDocumentMode,
  docSelected,
  editDocumentMode,
}) => {
  const initialDocumentState =
    editDocumentMode && docSelected
      ? createDocumentStateFromExisting(docSelected)
      : createNewDocumentState();
  const [page, setPage] = useState<number>(1);
  const [newDoc, setNewDoc] = useState<Document>(initialDocumentState);
  const [tableLinks, setTableLinks] = useState<Link[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (docSelected) {
      setNewDoc(docSelected);
      if (docSelected.links) {
        setTableLinks(docSelected.links);
      }
    }
    setIsInitialized(true);
  }, [newPos, editDocumentMode, docSelected]);

  useEffect(() => {
    setNewDoc((prev) => ({
      ...prev,
      coordinates: { latitude: newPos.latitude, longitude: newPos.longitude },
    }));
  }, [newPos]);

  const onCheckboxChange = (event: {
    target: { value: string; checked: boolean };
  }) => {
    const { value, checked } = event.target;

    setNewDoc(
      (previousDoc) =>
        ({
          ...previousDoc,
          stakeholders: checked
            ? [...(previousDoc.stakeholders ?? []), value]
            : previousDoc.stakeholders?.filter((sh) => sh != value) || [],
        }) as Document
    );
  };

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewDoc((prev) => ({
      ...prev,
      issuanceDate: value ? dayjs(value) : (prev.issuanceDate ?? undefined),
    }));
  };

  const handleFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    onSubmit({
      ...newDoc,
      links: tableLinks,
    });

    resetForm();
  };

  const resetForm = () => {
    setNewDoc(initialDocumentState);
    setEditDocumentMode(false);
    setPage(1);
    setTableLinks([]);
    closePositionView();
  };

  // Return early if modal is closed
  if (!modalOpen || !isInitialized) return null;
  if (page === 1) {
    return (
      <form
        className="document modal"
        onSubmit={(ev) => {
          ev.preventDefault();
          if (page === 1) {
            // Passa alla pagina successiva solo se la validazione è passata
            setPage(2);
          }
        }}
      >
        <button
          className="close"
          onClick={() => {
            setNewDoc(initialDocumentState);
            onClose();
          }}
        >
          <img src="/x.png" alt="Close" />
        </button>

        <h2>{!editDocumentMode ? "Add New Document" : "Update Document"}</h2>

        <ProgressBar currentPage={page} />

        <div className="form-group title">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            placeholder="Enter Document Title"
            value={newDoc.title}
            onChange={(e) =>
              setNewDoc((prev) => ({ ...prev, title: e.target.value }))
            }
            required
            className="input-title"
          />
        </div>

        <div className="form-group description">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={newDoc.description || ""}
            placeholder="Enter Document Description"
            onChange={(e) =>
              setNewDoc((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            required
          />
        </div>

        <div className="form-group scale-type">
          <label htmlFor="scale-type">Scale *</label>
          <select
            id="scale-type"
            defaultValue={newDoc.scale.type}
            onChange={(e) => {
              const scaleType = e.target.value;
              const scaleRatio = scaleType === ScaleType.Ratio ? 1 : undefined;
              setNewDoc((prev) => ({
                ...prev,
                scale: {
                  type: scaleType as ScaleType,
                  ratio: scaleRatio,
                },
              }));
            }}
            required
          >
            {Object.values(ScaleType).map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>

        <div
          className={`form-group ratio ${newDoc.scale.type === ScaleType.Ratio ? "" : "hidden"}`}
        >
          <label htmlFor="ratio" className="ratio">
            1:{" "}
          </label>
          <input
            id="ratio"
            type="number"
            min="1"
            value={newDoc.scale.ratio}
            onChange={(e) =>
              setNewDoc((prev) => ({
                ...prev,
                scale: {
                  ...prev.scale,
                  ratio: Number(e.target.value),
                },
              }))
            }
            required
          />
        </div>

        <div className="form-group issuance-date">
          <label htmlFor="issuance-date">Issuance Date</label>
          <input
            id="issuance-date"
            type="date"
            value={
              newDoc.issuanceDate
                ? newDoc.issuanceDate.format("YYYY-MM-DD")
                : ""
            }
            onChange={onDateChange}
          />
        </div>

        <div className="form-group document-type">
          <label htmlFor="document-type">Type *</label>
          <select
            id="document-type"
            value={newDoc.type}
            onChange={(e) =>
              setNewDoc((prev) => ({
                ...prev,
                type: e.target.value as DocumentType,
              }))
            }
            required
          >
            <option value="">Select type</option>
            <option value={DocumentType.Informative}>
              Informative Document
            </option>
            <option value={DocumentType.Prescriptive}>
              Prescriptive Document
            </option>
            <option value={DocumentType.Design}>Design Document</option>
            <option value={DocumentType.Technical}>Technical Document</option>
            <option value={DocumentType.MaterialEffect}>Material effect</option>
          </select>
        </div>

        <div className="form-group stakeholders">
          <label>Stakeholders *</label>
          <div className="checkbox-group stakeholders">
            {stakeholdersOptions.map((option) => (
              <label key={option.value} className="checkbox-label">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={newDoc.stakeholders?.includes(option.value)}
                  onChange={onCheckboxChange}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group latitude">
          <label>Latitude *</label>
          <input
            type="number"
            id="no-spin"
            step="0.00000000000001"
            name="latitude"
            min="-90"
            max="90"
            value={
              newDoc.coordinates?.latitude !== null
                ? newDoc.coordinates?.latitude
                : ""
            }
            onChange={(e) =>
              setNewDoc((prev: Document) => ({
                ...prev,
                coordinates: {
                  latitude: Number(e.target.value),
                  longitude: prev.coordinates?.longitude ?? 0,
                },
              }))
            }
            placeholder="Es. 34.1234"
          />
        </div>

        <div className="form-group longitude">
          <label>Longitude *</label>
          <input
            lang="en"
            type="number"
            step="0.00000000000001"
            id="no-spin"
            name="longitude"
            min="-180"
            max="180"
            value={
              newDoc.coordinates?.longitude !== null
                ? newDoc.coordinates?.longitude
                : ""
            }
            onChange={(e) => {
              setNewDoc((prev) => ({
                ...prev,
                coordinates: {
                  latitude: prev.coordinates?.latitude ?? 0,
                  longitude: Number(e.target.value),
                },
              }));
            }}
            placeholder="Es. 20.2253"
          />
        </div>

        <button type="submit" onClick={() => setPage((p) => p + 1)}>
          Continue
        </button>
      </form>
    );
  } else if (page === 2) {
    return (
      <form className="modal document page-2">
        <button
          className="close"
          onClick={() => {
            setNewDoc(initialDocumentState);
            onClose();
            setPage(1);
          }}
        >
          <img src="/x.png" alt="Close" />
        </button>
        <h2>
          {!editDocumentMode ? "New Document Registration" : "Update Document"}
        </h2>

        <ProgressBar currentPage={page} />

        {tableLinks.length > 0 ? (
          <LinksTable
            tableLinks={tableLinks}
            setTableLinks={setTableLinks}
            documents={documents}
          />
        ) : (
          <p>
            If you need to add links to other documents, please use the search
            bar below.
          </p>
        )}

        <SearchBar
          documents={documents}
          tableLinks={tableLinks}
          setTableLinks={setTableLinks}
        />

        <div className="actions">
          <button className="back" onClick={() => setPage((p) => p - 1)}>
            Back
          </button>
          <button className="primary" onClick={handleFormSubmit}>
            {!editDocumentMode ? "Add Document" : "Update Document"}
          </button>
        </div>
      </form>
    );
  }
};

export default DocumentForm;
