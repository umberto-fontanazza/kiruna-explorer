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
      ratio: 500,
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
      ratio: 500,
    },
    issuanceDate: dayjs("2024-12-21"),
    links: [{ targetDocumentId: 2, linkTypes: [LinkType.Projection] }],
  },
];
