import { DocumentType } from "../server/src/model/document";
import { ScaleType } from "../server/src/model/scale";
import { Stakeholder } from "../server/src/model/stakeholder";

export const newDocuments = [
  {
    title: "Urban Development Plan",
    description: "A detailed design for the expansion of central Kiruna.",
    issuanceTime: "2024-11",
    type: DocumentType.Design,
    stakeholders: [Stakeholder.WhiteArkitekter],
    scale: { type: ScaleType.BlueprintsOrEffect },
    coordinates: { latitude: 67.8558, longitude: 20.2253 },
  },
  {
    title: "Mining Impact Study",
    description: "Technical analysis of mining effects on surrounding areas.",
    issuanceTime: "2023",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
      include: [
        { latitude: 67.856, longitude: 20.225 },
        { latitude: 67.8565, longitude: 20.226 },
        { latitude: 67.8555, longitude: 20.2265 },
        { latitude: 67.855, longitude: 20.2255 },
      ],
      exclude: [],
    },
  },
  {
    title: "Public Transportation Proposal",
    description: "Suggestions for sustainable transport options in Kiruna.",
    issuanceTime: "2022-05",
    type: DocumentType.Informative,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.BlueprintsOrEffect },
    coordinates: { latitude: 67.8551, longitude: 20.2233 },
  },
  {
    title: "Cultural Heritage Preservation",
    description:
      "Prescriptive measures for preserving Kiruna's cultural sites.",
    issuanceTime: "2023-08",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.Residents],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
      include: [
        { latitude: 67.857, longitude: 20.2225 },
        { latitude: 67.859, longitude: 20.2255 },
        { latitude: 67.856, longitude: 20.2255 },
      ],
      exclude: [],
    },
  },
  {
    title: "New School Construction",
    description: "Plans for the construction of a new school building.",
    issuanceTime: "2024-01",
    type: DocumentType.Technical,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.BlueprintsOrEffect },
    coordinates: { latitude: 67.8567, longitude: 20.2244 },
  },
  {
    title: "Energy Efficiency Standards",
    description:
      "Technical guidelines for improving energy usage in buildings.",
    issuanceTime: "2021",
    type: DocumentType.Technical,
    stakeholders: [Stakeholder.Others],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
      include: [
        { latitude: 67.857, longitude: 20.2225 },
        { latitude: 67.859, longitude: 20.2255 },
        { latitude: 67.856, longitude: 20.2255 },
      ],
      exclude: [],
    },
  },
  {
    title: "Tourism Strategy Report",
    description: "Informative study to boost tourism in Kiruna.",
    issuanceTime: "2022",
    type: DocumentType.Informative,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.BlueprintsOrEffect },
    coordinates: { latitude: 67.8539, longitude: 20.227 },
  },
  {
    title: "Safety Regulations Update",
    description: "New safety rules for underground mining operations.",
    issuanceTime: "2023-12",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.BlueprintsOrEffect },
    coordinates: { latitude: 67.8545, longitude: 20.2285 },
  },
  {
    title: "Urban Relocation Plan",
    description: "Guidelines for moving parts of the city due to mining.",
    issuanceTime: "2024-06",
    type: DocumentType.Design,
    stakeholders: [Stakeholder.WhiteArkitekter],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
      include: [
        { latitude: 67.757, longitude: 20.1225 },
        { latitude: 67.8599, longitude: 20.1285 },
        { latitude: 67.8597, longitude: 20.1287 },
      ],
      exclude: [],
    },
  },
  {
    title: "Environmental Impact Analysis",
    description: "Analysis of environmental changes in the region.",
    issuanceTime: "2020-09",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.Others],
    scale: { type: ScaleType.Concept },
    coordinates: { latitude: 67.8525, longitude: 20.2295 },
  },
];
