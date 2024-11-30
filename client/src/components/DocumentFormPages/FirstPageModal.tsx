import dayjs from "dayjs";
import { Dispatch, FC, SetStateAction } from "react";
import {
  Document,
  DocumentForm,
  DocumentType,
  Scale,
  ScaleType,
  stakeholdersOptions,
} from "../../utils/interfaces";

import { capitalizeFirstLetter } from "../../utils/utils";

interface FirstPageModalProps {
  documentForm: DocumentForm;
  setDocumentForm: Dispatch<SetStateAction<DocumentForm>>;
}

const FirstPageModal: FC<FirstPageModalProps> = ({
  documentForm,
  setDocumentForm,
}) => {
  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDocumentForm((prev) => ({
      ...prev,
      issuanceDate: value ? dayjs(value) : (prev.issuanceDate ?? undefined),
    }));
  };

  const onCheckboxChange = (event: {
    target: { value: string; checked: boolean };
  }) => {
    const { value, checked } = event.target;

    setDocumentForm(
      (previousDoc) =>
        ({
          ...previousDoc,
          stakeholders: checked
            ? [...(previousDoc.stakeholders ?? []), value]
            : previousDoc.stakeholders?.filter((sh) => sh != value) || [],
        }) as Document,
    );
  };
  return (
    <>
      <div className="form-content">
        <div className="form-group title">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            placeholder="Enter Document Title"
            value={documentForm.title}
            onChange={(e) =>
              setDocumentForm((prev) => ({ ...prev, title: e.target.value }))
            }
            required
            className="input-title"
          />
        </div>

        <div className="form-group description">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={documentForm.description || ""}
            placeholder="Enter Document Description"
            onChange={(e) =>
              setDocumentForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            required
          />
        </div>

        <div className="form-group scale-type">
          <label htmlFor="scale-type">Scale *</label>

          <div className="scale-group">
            <select
              className="scale-type"
              id="scale-type"
              value={documentForm.scale?.type || ""}
              onChange={(e) => {
                const scaleType = e.target.value;
                const scaleRatio =
                  scaleType === ScaleType.ArchitecturalScale ? 1 : undefined;
                setDocumentForm((prev) => ({
                  ...prev,
                  scale: {
                    type: scaleType as ScaleType,
                    ratio: scaleRatio,
                  },
                }));
              }}
              required
            >
              <option disabled value="" hidden>
                Please select an option
              </option>
              {Object.values(ScaleType).map((val) => (
                <option key={val} value={val}>
                  {capitalizeFirstLetter(val).replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <div
              className={`ratio ${documentForm.scale?.type === ScaleType.ArchitecturalScale ? "" : "hidden"}`}
            >
              <label htmlFor="ratio">1: </label>
              <input
                id="ratio"
                type="number"
                min="1"
                value={documentForm.scale?.ratio}
                onChange={(e) =>
                  setDocumentForm((prev) => ({
                    ...prev,
                    scale: {
                      ...(prev.scale as Scale),
                      ratio: Number(e.target.value),
                    },
                  }))
                }
                required={
                  documentForm.scale?.type === ScaleType.ArchitecturalScale
                }
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group issuance-date">
            <label htmlFor="issuance-date">Issuance Date</label>
            <input
              id="issuance-date"
              type="date"
              value={
                documentForm.issuanceDate
                  ? documentForm.issuanceDate?.format("YYYY-MM-DD")
                  : ""
              }
              onChange={onDateChange}
            />
          </div>

          <div className="form-group document-type">
            <label htmlFor="document-type">Type *</label>
            <select
              id="document-type"
              value={documentForm.type || ""}
              onChange={(e) =>
                setDocumentForm((prev) => ({
                  ...prev,
                  type: e.target.value as DocumentType,
                }))
              }
              required
            >
              <option disabled hidden value="">
                Select type
              </option>
              {Object.values(DocumentType).map((value) => (
                <option key={value} value={value}>
                  {capitalizeFirstLetter(value).replace(/_/, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group stakeholders">
          <label>Stakeholders *</label>
          <div className="checkbox-group">
            {stakeholdersOptions.map((option) => (
              <label key={option.value} className="checkbox-label">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={documentForm.stakeholders?.includes(option.value)}
                  onChange={onCheckboxChange}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group latitude">
            <label>Latitude *</label>
            <input
              type="number"
              id="latitude"
              step="0.00000000000001"
              name="latitude"
              min="-90"
              max="90"
              value={
                documentForm.coordinates?.latitude !== null
                  ? documentForm.coordinates?.latitude
                  : ""
              }
              onChange={(e) =>
                setDocumentForm((prev: DocumentForm) => ({
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
              id="longitude"
              name="longitude"
              min="-180"
              max="180"
              value={
                documentForm.coordinates?.longitude !== null
                  ? documentForm.coordinates?.longitude
                  : ""
              }
              onChange={(e) => {
                setDocumentForm((prev) => ({
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
        </div>
      </div>

      <button className="primary" type="submit">
        Continue
      </button>
    </>
  );
};

export default FirstPageModal;
