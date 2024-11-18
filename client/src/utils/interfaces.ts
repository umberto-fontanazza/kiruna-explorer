import { Dayjs } from "dayjs";

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

export interface LoginErrors {
  login?: string;
}

export interface Link {
  targetDocumentId: number;
  type: LinkType[];
}

export interface Document {
  id: number;
  title: string;
  description: string | undefined;
  stakeholders: Stakeholder[];
  scale: Scale;
  issuanceDate: Dayjs | null;
  type: DocumentType;
  links: Link[];
  coordinates: { latitude: number | null; longitude: number | null };
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

export const documentTypeDisplay: { [key in DocumentType]: string } = {
  [DocumentType.Design]: "Design",
  [DocumentType.Informative]: "Informative",
  [DocumentType.MaterialEffect]: "Material effect",
  [DocumentType.Prescriptive]: "Prescriptive",
  [DocumentType.Technical]: "Technical",
};

export const fromDocumentTypeToIcon = new Map<DocumentType | undefined, string>(
  [
    [DocumentType.Design, "design_services"],
    [DocumentType.Informative, "info"],
    [DocumentType.MaterialEffect, "construction"],
    [DocumentType.Prescriptive, "find_in_page"],
    [DocumentType.Technical, "settings"],
  ]
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
  Text = "text",
  Ratio = "ratio",
}

export const scaleTypeDisplay: { [key in ScaleType]: string } = {
  [ScaleType.BlueprintsOrEffect]: "Blueprints/effects",
  [ScaleType.Text]: "Text",
  [ScaleType.Ratio]: "Ratio",
};
