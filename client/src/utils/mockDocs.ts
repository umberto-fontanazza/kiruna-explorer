import dayjs from "dayjs";
import { Document, DocumentType, ScaleType } from "./interfaces";

export const mockDocks: Document[] = [
  {
    id: 1,
    title: "Document 1",
    description: "Description of document 1",
    type: DocumentType.Design,
    scale: {
      type: ScaleType.ArchitecturalScale,
      ratio: 500,
    },
    issuanceDate: dayjs("2024-12-01"),
  },
  {
    id: 2,
    title: "Document 2",
    description: "Description of document 2",
    type: DocumentType.Design,
    scale: {
      type: ScaleType.ArchitecturalScale,
      ratio: 500,
    },
    issuanceDate: dayjs("2024-12-15"),
  },
  {
    id: 3,
    title: "Document 3",
    description: "Description of document 3",
    type: DocumentType.Design,
    scale: {
      type: ScaleType.ArchitecturalScale,
      ratio: 500,
    },
    issuanceDate: dayjs("2024-12-21"),
  },
];
