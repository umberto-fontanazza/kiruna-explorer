import dayjs, { Dayjs } from "dayjs";
import { kirunaCoordinates } from "./map";

export interface User {
  email: string;
  name: string;
  surname: string;
  role: UserRole;
}

export enum UserRole {
  Developer = "developer",
  Planner = "planner",
  Resident = "resident",
  Visitor = "visitor",
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LoginErrors {
  login?: string;
}

export interface Link {
  targetDocumentId: number;
  linkTypes: LinkType[];
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

export enum LinkType {
  Direct = "direct",
  Collateral = "collateral",
  Projection = "projection",
  Update = "update",
}

export enum DocumentType {
  Design = "design",
  Informative = "informative",
  MaterialEffect = "material_effect",
  Prescriptive = "prescriptive",
  Technical = "technical",
}

export const fromDocumentTypeToIcon = new Map<DocumentType | undefined, string>(
  [
    [DocumentType.Design, "design_services"],
    [DocumentType.Informative, "info"],
    [DocumentType.MaterialEffect, "construction"],
    [DocumentType.Prescriptive, "find_in_page"],
    [DocumentType.Technical, "settings"],
  ],
);

export enum Stakeholder {
  KirunaKommun = "kiruna_kommun",
  Lkab = "lkab",
  Residents = "residents",
  WhiteArkitekter = "white_arkitekter",
}

export const stakeholderDisplay: { [key in Stakeholder]: string } = {
  [Stakeholder.KirunaKommun]: "Kiruna kommun",
  [Stakeholder.Lkab]: "LKAB",
  [Stakeholder.Residents]: "Residents",
  [Stakeholder.WhiteArkitekter]: "White Arkitekter",
};

export interface Scale {
  type: ScaleType;
  ratio?: number;
}

export enum ScaleType {
  BlueprintsOrEffect = "blueprints/effects",
  Concept = "concept",
  Text = "text",
  ArchitecturalScale = "architectural_scale",
}

export interface DocumentForm extends Omit<Document, "id" | "scale" | "type"> {
  id: number | null;
  scale: Scale | null;
  type: DocumentType | null;
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
