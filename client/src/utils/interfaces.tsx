// File in which we define the common interfaces in shared files

export interface Credentials {
  username: string;
  password: string;
}

export interface Document {
  id: number | string;
  title: string;
  description: string | null;
  //coordinates: string;
}
