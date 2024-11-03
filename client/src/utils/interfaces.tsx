// File in which we define the common interfaces in shared files

export interface Credentials {
  username: string;
  password: string;
}

export interface Link {
  targetDocumentId: number;
  type: string[];
}

export interface Document {
  id: number;
  title: string;
  description: string | undefined;
  stakeholder: string[] | undefined;
  scale: string;
  issuanceDate: Date | null;
  type: string;
  connections: Link[];
  language: string | undefined;
  pages: number | null;
  coordinates: { latitude: number | null; longitude: number | null };
}
