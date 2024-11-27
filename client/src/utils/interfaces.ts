import dayjs, { Dayjs } from "dayjs";
import { kirunaCoordinates } from "./map";

/************************** INTERFACES ****************************/
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Document {
  id: number;
  title: string;
  description: string;
  type: DocumentType;
  scale: Scale;
  // optional fields below
  stakeholders?: Stakeholder[];
  coordinates?: Coordinates;
  issuanceDate?: Dayjs;
  links?: Link[];
}

export interface DocumentForm extends Omit<Document, "id" | "scale" | "type"> {
  id: number | null;
  scale: Scale | null;
  type: DocumentType | null;
}

export interface Link {
  targetDocumentId: number;
  linkTypes: LinkType[];
}

export interface LoginErrors {
  login?: string;
}

export interface Scale {
  type: ScaleType;
  ratio?: number;
}

export interface Upload {
  id: number;
  title: string;
  type: UploadType;
  file: string;
}

export interface User {
  email: string;
  name: string;
  surname: string;
  role: UserRole;
}

/************************ ENUM ***************************/

export enum DocumentType {
  Design = "design",
  Informative = "informative",
  MaterialEffect = "material_effect",
  Prescriptive = "prescriptive",
  Technical = "technical",
}

export enum LinkType {
  Direct = "direct",
  Collateral = "collateral",
  Projection = "projection",
  Update = "update",
}

export enum ScaleType {
  BlueprintsOrEffect = "blueprints/effects",
  Text = "text",
  Ratio = "ratio",
}

export enum Stakeholder {
  KirunaKommun = "kiruna_kommun",
  Lkab = "lkab",
  Residents = "residents",
  WhiteArkitekter = "white_arkitekter",
}

export enum UploadType {
  OriginalResource = "original_resource",
  Attachment = "attachment",
}

export enum UserRole {
  Developer = "developer",
  Planner = "planner",
  Resident = "resident",
  Visitor = "visitor",
}

export const documentFormDefaults: DocumentForm = {
  id: null,
  title: "",
  description: "",
  stakeholders: [],
  scale: null,
  type: null,
  issuanceDate: undefined,
  links: [],
  coordinates: kirunaCoordinates,
};

export const createDocumentStateFromExisting = (
  docSelected: Document,
): Document => ({
  id: docSelected.id,
  title: docSelected.title,
  description: docSelected.description,
  stakeholders: docSelected.stakeholders,
  scale: {
    type: docSelected.scale?.type,
    ratio: docSelected.scale?.ratio,
  },
  type: docSelected.type,
  issuanceDate: dayjs(docSelected.issuanceDate),
  links: docSelected.links,
  coordinates: docSelected.coordinates,
});
