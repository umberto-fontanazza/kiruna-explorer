// File in which we define the common interfaces in shared files

import dayjs, { Dayjs } from "dayjs";

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
  scale: string;
  issuanceDate: Dayjs | null;
  type: DocumentType | undefined;
  connections: Link[];
  language: string | undefined;
  pages: number | null;
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

export enum Stakeholder {
  KirunaKommun = "kiruna_kommun",
  Lkab = "lkab",
  Residents = "residents",
  WhiteArkitekter = "white_arkitekter",
}
