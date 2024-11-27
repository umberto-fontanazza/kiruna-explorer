import { DocumentType, ScaleType, Stakeholder } from "./interfaces";

export const scaleTypeDisplay: { [key in ScaleType]: string } = {
  [ScaleType.BlueprintsOrEffect]: "Blueprints/effects",
  [ScaleType.Text]: "Text",
  [ScaleType.Ratio]: "Ratio",
};

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
  ],
);

export const stakeholderDisplay: { [key in Stakeholder]: string } = {
  [Stakeholder.KirunaKommun]: "Kiruna kommun",
  [Stakeholder.Lkab]: "LKAB",
  [Stakeholder.Residents]: "Residents",
  [Stakeholder.WhiteArkitekter]: "White Arkitekter",
};
