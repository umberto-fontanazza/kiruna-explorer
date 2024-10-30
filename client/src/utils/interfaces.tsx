// File in which we define the common interfaces in shared files

export interface Credentials {
  username: string;
  password: string;
}

export interface Document {
  id: number | string;
  title: string;
  description: string | null;
  stakeholder: string | undefined;
  scale: string | undefined;
  issuanceDate: Date | null;
  type: string | undefined;
  connections: string | undefined;
  language: string | undefined;
  pages: number | null;
  coordinates: { latitude: number | null; longitude: number | null };
}
