// File in which we define the common interfaces in shared files

export interface User {
  email: string;
  name: string;
  surname: string;
  role: UserRole;
}

export enum UserRole {
  Developer = "DEVELOPER",
  Planner = "PLANNER",
  Resident = "RESIDENT",
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
  stakeholder: string[];
  scale: string;
  issuanceDate: Date | null;
  type: DocumentType | undefined;
  connections: Link[];
  language: string | undefined;
  pages: number | null;
  coordinates: { latitude: number | null; longitude: number | null };
}

export enum LinkType {
  Direct = "DIRECT",
  Collateral = "COLLATERAL",
  Projection = "PROJECTION",
  Update = "UPDATE",
}

export enum DocumentType {
  Informative = "INFORMATIVE",
  Prescriptive = "PRESCRIPTIVE",
  Design = "DESIGN",
  Technical = "TECHNICAL",
  Material = "MATERIAL",
  Others = "OTHERS",
}
