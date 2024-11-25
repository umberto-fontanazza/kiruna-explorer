import dayjs from "dayjs";
import { FC, useEffect, useState } from "react";
import "../styles/DocumentForm.scss";
import {
  Coordinates,
  Document,
  documentFormDefaults,
  DocumentForm as DocumentFormType,
  DocumentType,
  Link,
  Scale,
  ScaleType,
  Stakeholder,
} from "../utils/interfaces";
import { capitalizeFirstLetter } from "../utils/utils";
import LinksTable from "./LinksTable";
import ProgressBar from "./ProgressBar";
import SearchBar from "./SearchBar";

interface DocumentFormProps {
  newPos: Coordinates;
  onClose: () => void;
  onSubmit: (newDocument: DocumentFormType) => void;
  documents: Document[];
  closePositionView: () => void;
  editDocument: Document | null;
}

const stakeholdersOptions = [
  { value: Stakeholder.Lkab, label: "LKAB" },
  { value: Stakeholder.KirunaKommun, label: "Kiruna kommun" },
  { value: Stakeholder.Residents, label: "Residents" },
  { value: Stakeholder.WhiteArkitekter, label: "White Arkitekter" },
];

const DocumentForm: FC<DocumentFormProps> = ({
  newPos,
  onClose,
  onSubmit,
  documents,
  closePositionView,
  editDocument,
}) => {
  const [page, setPage] = useState<number>(1);
  const [document, setDocument] = useState<DocumentFormType>(
    editDocument || { ...documentFormDefaults }
  );
  const [tableLinks, setTableLinks] = useState<Link[]>(document?.links || []);

  useEffect(() => {
    setDocument((prev) => ({
      ...prev,
      coordinates: { latitude: newPos.latitude, longitude: newPos.longitude },
    }));
  }, [newPos]);

  const onCheckboxChange = (event: {
    target: { value: string; checked: boolean };
  }) => {
    const { value, checked } = event.target;

    setDocument(
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
    setDocument((prev) => ({
      ...prev,
      issuanceDate: value ? dayjs(value) : (prev.issuanceDate ?? undefined),
    }));
  };

  const handleFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    onSubmit({
      ...document,
      links: tableLinks,
    });

    resetForm();
  };

  const resetForm = () => {
    setDocument(documentFormDefaults);
    setPage(1);
    closePositionView();
  };

  return (
    <form
      className={`document modal page-${page}`}
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
          setDocument(documentFormDefaults);
          setPage(1);
          onClose();
        }}
      >
        <img src="/x.png" alt="Close" />
      </button>

      <h2>{document.id ? "Update Document" : "New Document Registration"}</h2>

      <ProgressBar currentPage={page} />
      {page === 1 ? (
        <>
          <div className="form-group title">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              placeholder="Enter Document Title"
              value={document.title}
              onChange={(e) =>
                setDocument((prev) => ({ ...prev, title: e.target.value }))
              }
              required
              className="input-title"
            />
          </div>

          <div className="form-group description">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={document.description || ""}
              placeholder="Enter Document Description"
              onChange={(e) =>
                setDocument((prev) => ({
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
              value={document.scale?.type ?? ""}
              onChange={(e) => {
                const scaleType = e.target.value;
                const scaleRatio =
                  scaleType === ScaleType.Ratio ? 1 : undefined;
                setDocument((prev) => ({
                  ...prev,
                  scale: {
                    type: scaleType as ScaleType,
                    ratio: scaleRatio,
                  },
                }));
              }}
              required
            >
              <option disabled selected value="" hidden>
                Please select an option
              </option>
              {Object.values(ScaleType).map((scaleType) => (
                <option key={scaleType} value={scaleType}>
                  {capitalizeFirstLetter(scaleType)}
                </option>
              ))}
            </select>
          </div>

          <div
            className={`form-group ratio ${document.scale?.type === ScaleType.Ratio ? "" : "hidden"}`}
          >
            <label htmlFor="ratio" className="ratio">
              1:{" "}
            </label>
            <input
              id="ratio"
              type="number"
              min="1"
              value={document.scale?.ratio}
              onChange={(e) =>
                setDocument((prev) => ({
                  ...prev,
                  scale: {
                    ...(prev.scale as Scale),
                    ratio: Number(e.target.value),
                  },
                }))
              }
              required={document.scale?.type === ScaleType.Ratio}
            />
          </div>

          <div className="form-group issuance-date">
            <label htmlFor="issuance-date">Issuance Date</label>
            <input
              id="issuance-date"
              type="date"
              value={
                document.issuanceDate
                  ? document.issuanceDate.format("YYYY-MM-DD")
                  : ""
              }
              onChange={onDateChange}
            />
          </div>

          <div className="form-group document-type">
            <label htmlFor="document-type">Type *</label>
            <select
              id="document-type"
              value={document.type ?? ""}
              onChange={(e) =>
                setDocument((prev) => ({
                  ...prev,
                  type: e.target.value as DocumentType,
                }))
              }
              required
            >
              <option disabled selected hidden value="">
                Select type
              </option>
              {Object.values(DocumentType).map((value) => (
                <option value={value}>
                  {capitalizeFirstLetter(value).replace(/_/g, " ")}
                </option>
              ))}
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
                    checked={document.stakeholders?.includes(option.value)}
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
                document.coordinates?.latitude !== null
                  ? document.coordinates?.latitude
                  : ""
              }
              onChange={(e) =>
                setDocument((prev: DocumentFormType) => ({
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
                document.coordinates?.longitude !== null
                  ? document.coordinates?.longitude
                  : ""
              }
              onChange={(e) => {
                setDocument((prev) => ({
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

          <button
            className="primary"
            type="submit"
            // onClick={() => setPage((p) => p + 1)}
          >
            Continue
          </button>
        </>
      ) : (
        <>
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
              {document.id ? "Update Document" : "Add Document"}
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default DocumentForm;
