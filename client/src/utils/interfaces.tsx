// File in which we define the common interfaces in shared files

export interface Credentials {
  username: string;
  password: string;
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
  Informative = "Informative",
  Prescriptive = "Prescriptive",
  Design = "Design",
  Technical = "Technical",
  Material = "Material",
  Others = "Others",
}
