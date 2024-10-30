import { FC, useState } from "react";
import { Document } from "../utils/interfaces";
import "../styles/ModalAdd.scss";

interface ModalAddProps {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (newDocument: Document) => void;
  documents: Document[];
}

const dmsToDecimal = (
  degrees: number,
  minutes: number,
  seconds: number,
  direction: string
): number => {
  let decimal = degrees + minutes / 60 + seconds / 3600;
  if (direction === "S" || direction === "W") {
    decimal = -decimal;
  }
  return decimal;
};

const ModalAdd: FC<ModalAddProps> = ({
  modalOpen,
  onClose,
  onSubmit,
  documents,
}) => {
  const [newDoc, setNewDoc] = useState<Document>({
    id: "",
    title: "",
    description: "",
    stakeholder: "",
    scale: "",
    issuanceDate: null,
    type: "",
    connections: "",
    language: "",
    pages: null,
    coordinates: [],
  });

  const [latitude, setLatitude] = useState({
    degrees: "",
    minutes: "",
    seconds: "",
    direction: "N",
  });
  const [longitude, setLongitude] = useState({
    degrees: "",
    minutes: "",
    seconds: "",
    direction: "E",
  });

  const handleFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    const latDegrees = parseFloat(latitude.degrees);
    const latMinutes = parseFloat(latitude.minutes);
    const latSeconds = parseFloat(latitude.seconds);
    const lngDegrees = parseFloat(longitude.degrees);
    const lngMinutes = parseFloat(longitude.minutes);
    const lngSeconds = parseFloat(longitude.seconds);

    const latDecimal = dmsToDecimal(
      latDegrees,
      latMinutes,
      latSeconds,
      latitude.direction
    );
    const lngDecimal = dmsToDecimal(
      lngDegrees,
      lngMinutes,
      lngSeconds,
      longitude.direction
    );

    setNewDoc((prevDoc) => ({
      ...prevDoc,
      coordinates: [
        ...(prevDoc.coordinates || []),
        { latitude: latDecimal, longitude: lngDecimal },
      ],
    }));

    setLatitude({ degrees: "", minutes: "", seconds: "", direction: "N" });
    setLongitude({ degrees: "", minutes: "", seconds: "", direction: "E" });

    onSubmit({ ...newDoc, scale: "1:" + newDoc.scale });
    setNewDoc({
      id: "",
      title: "",
      description: "",
      stakeholder: "",
      scale: "",
      issuanceDate: null,
      type: "",
      connections: "",
      language: "",
      pages: null,
      coordinates: [],
    });
  };

  const handleDMSChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, dataset } = e.target;
    const target = dataset.coord as "latitude" | "longitude";

    if (target === "latitude") {
      setLatitude((prev) => ({ ...prev, [name]: value }));
    } else if (target === "longitude") {
      setLongitude((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (!modalOpen) return null;

  return (
    <>
      {
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>New Document Registration</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="test">
                <div className="form-group">
                  <label className="id">Document ID *</label>
                  <input
                    type="text"
                    placeholder="Enter Document ID"
                    value={newDoc.id}
                    onChange={(e) =>
                      setNewDoc((prev) => ({
                        ...prev,
                        id: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="title">Title *</label>
                  <input
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
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
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
              <div className="test">
                <div className="form-group">
                  <label>StakeHolders *</label>
                  <select
                    value={newDoc.stakeholder}
                    onChange={(e) =>
                      setNewDoc((prev) => ({
                        ...prev,
                        stakeholder: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    <option value="LKAB">LKAB</option>
                    <option value="Municipality">Municipality</option>
                    <option value="Regional Authority">
                      Regional Authority
                    </option>
                    <option value="Architecture Firms">
                      Architecture Firms
                    </option>
                    <option value="Citizens">Citizens</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Scale *</label>
                  <div>
                    <span className="scale">1: </span>
                    <input
                      type="text"
                      value={newDoc.scale}
                      onChange={(e) =>
                        setNewDoc((prev) => ({
                          ...prev,
                          scale: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="test">
                <div className="form-group">
                  <label>Issuance Date *</label>
                  <input
                    type="date"
                    value={
                      newDoc.issuanceDate?.toISOString().split("T")[0] || ""
                    }
                    onChange={(e) =>
                      setNewDoc((prev) => ({
                        ...prev,
                        issuanceDate: new Date(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Type *</label>
                  <select
                    value={newDoc.type}
                    onChange={(e) =>
                      setNewDoc((prev) => ({ ...prev, type: e.target.value }))
                    }
                    required
                  >
                    <option value="" disabled>
                      Select type
                    </option>
                    <option value="Informative Document">
                      Informative Document
                    </option>
                    <option value="Prescriptive Document">
                      Prescriptive Document
                    </option>
                    <option value="Design Document">Design Document</option>
                    <option value="Technical Document">
                      Technical Document
                    </option>
                    <option value="Material effect">Material effect</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>
              <div className="test">
                <div className="form-group">
                  <label>Language *</label>
                  <select
                    value={newDoc.language}
                    onChange={(e) =>
                      setNewDoc((prev) => ({
                        ...prev,
                        language: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="" disabled>
                      Select language
                    </option>
                    <option value="English">English</option>
                    <option value="Italian">Italian</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Pages (optional):</label>
                  <input
                    type="number"
                    value={newDoc.pages !== null ? newDoc.pages : ""}
                    onChange={(e) => {
                      setNewDoc((prev) => ({
                        ...prev,
                        pages: e.target.value ? Number(e.target.value) : null,
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Latitudine *</label>
                <input
                  type="number"
                  name="degrees"
                  value={latitude.degrees}
                  data-coord="latitude"
                  onChange={handleDMSChange}
                  placeholder="Gradi"
                  required
                />
                <input
                  type="number"
                  name="minutes"
                  value={latitude.minutes}
                  data-coord="latitude"
                  onChange={handleDMSChange}
                  placeholder="Minuti"
                  required
                />
                <input
                  type="number"
                  name="seconds"
                  value={latitude.seconds}
                  data-coord="latitude"
                  onChange={handleDMSChange}
                  placeholder="Secondi"
                  required
                />
                <select
                  name="direction"
                  value={latitude.direction}
                  data-coord="latitude"
                  onChange={(e) =>
                    setLatitude((prev) => ({
                      ...prev,
                      direction: e.target.value,
                    }))
                  }
                >
                  <option value="N">N</option>
                  <option value="S">S</option>
                </select>
              </div>
              <div className="form-group">
                <label>Longitudine *</label>
                <input
                  type="number"
                  name="degrees"
                  value={longitude.degrees}
                  data-coord="longitude"
                  onChange={handleDMSChange}
                  placeholder="Gradi"
                  required
                />
                <input
                  type="number"
                  name="minutes"
                  value={longitude.minutes}
                  data-coord="longitude"
                  onChange={handleDMSChange}
                  placeholder="Minuti"
                  required
                />
                <input
                  type="number"
                  name="seconds"
                  value={longitude.seconds}
                  data-coord="longitude"
                  onChange={handleDMSChange}
                  placeholder="Secondi"
                  required
                />
                <select
                  name="direction"
                  value={longitude.direction}
                  data-coord="longitude"
                  onChange={(e) =>
                    setLongitude((prev) => ({
                      ...prev,
                      direction: e.target.value,
                    }))
                  }
                >
                  <option value="E">E</option>
                  <option value="W">W</option>
                </select>
              </div>
              <div className="form-group">
                <label>Connection *</label>
                <select
                  value={newDoc.connections}
                  onChange={(e) => {
                    setNewDoc((prev) => ({
                      ...prev,
                      connections: e.target.value,
                    }));
                  }}
                  required
                >
                  <option value="" disabled>
                    Select the Linked Documents
                  </option>
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.title}>
                      {doc.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="button-group">
                <button className="submit-button" type="submit">
                  Add Document
                </button>
                <button
                  className="cancel-button"
                  type="button"
                  onClick={() => {
                    setNewDoc({
                      id: "",
                      title: "",
                      description: "",
                      stakeholder: "",
                      scale: "",
                      issuanceDate: null,
                      type: "",
                      connections: "",
                      language: "",
                      pages: null,
                      coordinates: [],
                    });
                    onClose();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </>
  );
};

export default ModalAdd;
