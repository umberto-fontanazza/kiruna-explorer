import dayjs from "dayjs";
import { Document, DocumentType, LinkType, ScaleType } from "./interfaces";

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
    links: [
      {
        targetDocumentId: 2,
        linkTypes: [LinkType.Collateral, LinkType.Direct],
      },
    ],
  },
  {
    id: 2,
    title: "Document 2",
    description: "Description of document 2",
    type: DocumentType.Design,
    scale: {
      type: ScaleType.ArchitecturalScale,
      ratio: 450,
    },
    issuanceDate: dayjs("2024-12-15"),
    links: [
      {
        targetDocumentId: 1,
        linkTypes: [LinkType.Collateral, LinkType.Direct],
      },
      { targetDocumentId: 3, linkTypes: [LinkType.Projection] },
    ],
  },
  {
    id: 3,
    title: "Document 3",
    description: "Description of document 3",
    type: DocumentType.Design,
    scale: {
      type: ScaleType.ArchitecturalScale,
      ratio: 470,
    },
    issuanceDate: dayjs("2024-12-21"),
    links: [{ targetDocumentId: 2, linkTypes: [LinkType.Projection] }],
  },
  {
    id: 4,
    title: "Document 4",
    description: "Description of document 4",
    type: DocumentType.Design,
    scale: {
      type: ScaleType.ArchitecturalScale,
      ratio: 100,
    },
    issuanceDate: dayjs("2024-12-21"),
  },
  {
    id: 5,
    title: "Document 5",
    description: "Description of document 5",
    type: DocumentType.Design,
    scale: {
      type: ScaleType.Text,
    },
    issuanceDate: dayjs("2024-12-21"),
  },
  {
    id: 6,
    title: "Document 6",
    description: "Description of document 6",
    type: DocumentType.Design,
    scale: {
      type: ScaleType.BlueprintsOrEffect,
    },
    issuanceDate: dayjs("2024-12-21"),
  },
  {
    id: 7,
    title: "Document 7",
    description: "Description of document 7",
    type: DocumentType.Design,
    scale: {
      type: ScaleType.Concept,
    },
    issuanceDate: dayjs("2024-12-21"),
  },
];
