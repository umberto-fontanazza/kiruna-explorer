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
  {
    title: "Gruvstadspark 2, etapp 5, Kyrkan",
    description:
      "The last detailed plan of the second planning phase concerns the area surrounding the Kiruna Church. Situated within a park, the area includes only six buildings, half of which serve religious functions. The plan also specifies that the church will be dismantled between 2025 and 2026 and reassembled at its new site by 2029.",
    issuanceTime: "2021-09-04",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 2000 },
    coordinates: { latitude: 67.8621, longitude: 20.2272 },
  },

  {
    title: "Demolition documentation, Kiruna City Hall",
    description:
      "This document was created to preserve the memory of the symbolic building before its demolition in April 2019. Conducted by the Norrbotten Museum, the detailed 162-page study analyzed the building's materials, both physically and chemically, taking advantage of the demolition to explore aspects that couldn't be examined while it was in use. This meticulous effort reflects a commitment to preserving knowledge of every detail of the structure.",
    issuanceTime: "2020-11-26",
    type: DocumentType.Informative,
    stakeholders: [Stakeholder.Others],
    scale: { type: ScaleType.Text },
    coordinates: { latitude: 67.5057, longitude: 20.1815 },
  },

  {
    title: "Deformation forecast",
    description:
      "The third deformation forecast was published in 2019, five years after the second. The line has not moved; what changes, as in the previous version, are the timing of the interventions and the shape of the areas underlying the deformation zone.",
    issuanceTime: "2019-04",
    type: DocumentType.Technical,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 1500 },
    coordinates: { latitude: 67.8654, longitude: 20.2053 },
  },
  {
    title: "Detailed plan for Gruvstaspark 2, etapp 3, del av SJ-området m m.",
    description:
      "The third Detailed Plan of the second demolition phase covers a narrow, elongated area straddling the old railway. Like all areas within the 'Gruvstadpark 2' zone, its sole designated land use is for mining activities, although it will temporarily be used as a park during an interim phase.",
    issuanceTime: "2018-10",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 1300 },
    coordinates: { latitude: 67.8633, longitude: 20.2061 },
  },

  {
    title: "Vision 2099",
    description:
      "Vision 2099 is to be considered the first project for the new city of Kiruna. It was created by the municipality in response to the letter from LKAB. In these few lines, all the main aspects and expectations of the municipality for the new city are condensed. The document, which despite being a project document is presented anonymously, had the strength to influence the design process. The principles it contains proved to be fundamental in subsequent planning documents.",
    issuanceTime: "2004",
    type: DocumentType.Design,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.Text },
    coordinates: { latitude: 67.8594, longitude: 20.2557 },
  },

  {
    title: "Detail plan for square and commercial street",
    description:
      "This plan, approved in July 2016, is the first detailed plan to be implemented from the new masterplan (Adjusted development plan). The document defines the entire area near the town hall, comprising a total of 9 blocks known for their density. Among these are the 6 buildings that will face the main square. The functions are mixed, both public and private, with residential being prominent, as well as the possibility of incorporating accommodation facilities such as hotels. For all buildings in this plan, the only height limit is imposed by air traffic.",
    issuanceTime: "2016-06-22",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 500 },
    coordinates: { latitude: 67.8485, longitude: 20.2908 },
  },

  {
    title: "Construction of new city hall begins",
    description:
      "The Kiruna Town Hall was the first building to be rebuild in the new town center in 2015. It remained isolated for quite some time due to a slowdown in mining activities.",
    issuanceTime: "2015",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.BlueprintsOrEffect },
    coordinates: { latitude: 67.8488, longitude: 20.3029 },
  },
  {
    title: "Detailed Overview Plan for the Central Area of Kiruna 2014.",
    description:
      "The Detailed Overview Plan is one of the three planning instruments available to Swedish administrations and represents an intermediate scale. Like the Overview Plan, compliance with it is not mandatory, but it serves as a supporting plan for Detailed Plans, sharing the characteristic of regulating a specific area of the Kiruna municipality rather than its entire extent, as the Overview Plan does. This specific plan focuses on the central area of Kiruna and its surroundings, incorporating all the projections of the Development Plan into a prescriptive tool.",
    issuanceTime: "2014-06",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 300 },
    coordinates: { latitude: 67.8353, longitude: 20.2592 },
  },

  {
    title: "Detailed plan for LINBANAN 1.",
    description:
      "This is the first Detailed Plan for the new city center, covering a very small area. It regulates the use of a portion of land that will host a single building. Its boundaries coincide with the outer footprint of the new Town Hall, 'Kristallen,' the first building to be constructed in the new Kiruna.",
    issuanceTime: "2014-03",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.Text },
    coordinates: { latitude: 67.8489, longitude: 20.2967 },
  },

  {
    title: "Mail to Kiruna kommun",
    description:
      "This document is considered the act that initiates the process of relocating Kiruna. The company communicates its intention to construct a new mining level at a depth of 1,365 meters. Along with this, LKAB urges the municipality to begin the necessary planning to relocate the city, referring to a series of meetings held in previous months between the two stakeholders.",
    issuanceTime: "2004-03-19",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.Text },
    coordinates: { latitude: 67.8569, longitude: 20.253 },
  },
  {
    title: "Kiruna Church closes",
    description:
      "On June 2, the Kiruna Church was closed to begin the necessary preparations for its relocation, following a solemn ceremony. The relocation is scheduled for the summer of 2025 and will take two days. Both the new site and the route for the move have already been determined. A significant period will pass between the relocation and the reopening of the church, voted 'Sweden's most beautiful building constructed before 1950.'",
    issuanceTime: "2024-06-02",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.BlueprintsOrEffect },
    coordinates: { latitude: 67.8518, longitude: 20.2331 },
  },
  {
    title: "Construction of Block 1 begins",
    description:
      "Simultaneously with the start of construction on the Aurora Center, work also began on Block 1, another mixed-use building overlooking the main square and the road leading to old Kiruna. These are the first residential buildings in the new town.",
    issuanceTime: "2019-06",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.BlueprintsOrEffect },
    coordinates: { latitude: 67.5054, longitude: 20.1801 },
  },
  {
    title: "Construction of Aurora Center begins",
    description:
      "Shortly after the construction of the Scandic hotel began, work on the Aurora Center also started, a multifunctional complex that includes the municipal library of Kiruna. The two buildings are close to each other and connected by a skywalk, just like in the old town center.",
    issuanceTime: "2019-05",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.BlueprintsOrEffect },
    coordinates: { latitude: 67.5057, longitude: 20.1815 },
  },
  {
    title: "Town Hall demolition",
    description:
      "After the construction of the new town hall was completed, the old building, nicknamed 'The Igloo,' was demolished. The only elements preserved were the door handles, a masterpiece of Sami art made of wood and bone, and the clock tower, which once stood on the roof of the old town hall. The clock tower was relocated to the central square of New Kiruna, in front of the new building.",
    issuanceTime: "2019-04",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.BlueprintsOrEffect },
    coordinates: { latitude: 67.5109, longitude: 20.132 },
  },
  {
    title: "Construction of Scandic Hotel begins",
    description:
      "After two extensions of the land acquisition agreement, necessary because this document in Sweden is valid for only two years, construction of the hotel finally began in 2019.",
    issuanceTime: "2019-04",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.BlueprintsOrEffect },
    coordinates: { latitude: 67.5054, longitude: 20.1817 },
  },
  {
    title: "Detail plan for square and commercial street",
    description:
      "This plan, approved in July 2016, is the first detailed plan to be implemented from the new masterplan (Adjusted development plan). The document defines the entire area near the town hall, comprising a total of 9 blocks known for their density. Among these are the 6 buildings that will face the main square. The functions are mixed, both public and private, with residential being prominent, as well as the possibility of incorporating accommodation facilities such as hotels. For all buildings in this plan, the only height limit is imposed by air traffic.",
    issuanceTime: "2016-06-22",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 1000 },
    coordinates: { latitude: 67.8491, longitude: 20.2873 },
  },
  {
    title: "Adjusted development plan",
    description:
      "This document is the update of the Development Plan, one year after its creation, modifications are made to the general master plan, which is published under the name 'Adjusted Development Plan91,' and still represents the version used today after 10 years. Certainly, there are no drastic differences compared to the previous plan, but upon careful comparison, several modified elements stand out. For example, the central square now takes its final shape, as well as the large school complex just north of it, which appears for the first time.",
    issuanceTime: "2015",
    type: DocumentType.Design,
    stakeholders: [Stakeholder.KirunaKommun, Stakeholder.WhiteArkitekter],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 100 },
    coordinates: { latitude: 67.8523, longitude: 20.2951 },
  },
  {
    title: "Deformation forecast",
    description:
      "The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The document is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project.",
    issuanceTime: "2014-12",
    type: DocumentType.Technical,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 1600 },
    coordinates: { latitude: 67.851, longitude: 20.229 },
  },
  {
    title: "Development Plan",
    description:
      "The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The document is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project.",
    issuanceTime: "2014-03",
    type: DocumentType.Design,
    stakeholders: [Stakeholder.KirunaKommun, Stakeholder.WhiteArkitekter],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 2000 },
    coordinates: { latitude: 67.8508, longitude: 20.305 },
  },
  {
    title: "Detail plan for Bolagsomradet Gruvstadspark",
    description:
      "This is the first of 8 detailed plans located in the old center of Kiruna, aimed at transforming the residential areas into mining industry zones to allow the demolition of buildings. The area includes the town hall, the Ullspiran district, and the A10 highway, and it will be the first to be dismantled. The plan consists, like all detailed plans, of two documents: the area map that regulates it, and a text explaining the reasons that led to the drafting of the plan with these characteristics. The plan gained legal validity in 2012.",
    issuanceTime: "2010-10",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 1400 },
    coordinates: { latitude: 67.8523, longitude: 20.2785 },
  },
  {
    title: "Compilation of responses “So what the people of Kiruna think?",
    description:
      "This document is a compilation of the responses to the survey 'What is your impression of Kiruna?' From the citizens' responses to this last part of the survey, it is evident that certain buildings, such as the Kiruna Church, the Hjalmar Lundbohmsgården, and the Town Hall, are considered of significant value to the population. The municipality views the experience of this survey positively, to the extent that over the years it will propose various consultation opportunities.",
    issuanceTime: "2007",
    type: DocumentType.Informative,
    stakeholders: [Stakeholder.KirunaKommun, Stakeholder.Residents],
    scale: { type: ScaleType.Text },
    coordinates: { latitude: 67.8558, longitude: 20.2253 },
  },
  {
    title: "Renewable Energy Initiative",
    description:
      "This document outlines Kiruna's efforts to shift to renewable energy sources, including solar and wind farms to meet urban energy demands.",
    issuanceTime: "2024-02",
    type: DocumentType.Technical,
    stakeholders: [Stakeholder.KirunaKommun, Stakeholder.Lkab],
    scale: { type: ScaleType.Text },
    coordinates: { latitude: 67.8562, longitude: 20.312 },
  },
  {
    title: "Construction of Hospital Complex",
    description:
      "The hospital complex includes advanced medical facilities, emergency care, and green building features to serve the relocated population.",
    issuanceTime: "2023-11",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 400 },
    coordinates: { latitude: 67.8574, longitude: 20.3172 },
  },
  {
    title: "Public Consultation Summary",
    description:
      "This document summarizes feedback gathered from residents regarding the urban transformation plans and future projects.",
    issuanceTime: "2022-03",
    type: DocumentType.Informative,
    stakeholders: [Stakeholder.Residents, Stakeholder.KirunaKommun],
    scale: { type: ScaleType.Text },
    coordinates: { latitude: 67.8525, longitude: 20.3045 },
  },
  {
    title: "Railway Realignment Proposal",
    description:
      "A detailed proposal for realigning the railway infrastructure to facilitate better transportation access and minimize disruption.",
    issuanceTime: "2024-05",
    type: DocumentType.Design,
    stakeholders: [Stakeholder.Lkab, Stakeholder.KirunaKommun],
    scale: { type: ScaleType.BlueprintsOrEffect },
    coordinates: { latitude: 67.8602, longitude: 20.3205 },
  },
  {
    title: "New Residential Block Design",
    description:
      "This document provides the architectural blueprint for a new residential area with integrated public spaces and amenities.",
    issuanceTime: "2023-08",
    type: DocumentType.Design,
    stakeholders: [Stakeholder.WhiteArkitekter, Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 500 },
    coordinates: { latitude: 67.8556, longitude: 20.2998 },
  },
  {
    title: "Biodiversity Preservation Plan",
    description:
      "Guidelines for protecting biodiversity in Kiruna's green areas during urban and mining developments.",
    issuanceTime: "2021-10",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.Text },
    coordinates: { latitude: 67.8518, longitude: 20.2834 },
  },
  {
    title: "Sustainable Water Management Report",
    description:
      "A technical analysis of sustainable water resource management, including new drainage systems for the relocated city.",
    issuanceTime: "2022-06",
    type: DocumentType.Technical,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.BlueprintsOrEffect },
    coordinates: { latitude: 67.8491, longitude: 20.2913 },
  },
  {
    title: "New Cultural Center Construction",
    description:
      "This document marks the beginning of the cultural center's construction, housing exhibition spaces and public event areas.",
    issuanceTime: "2024-04",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 600 },
    coordinates: { latitude: 67.8568, longitude: 20.2951 },
  },
  {
    title: "Road Infrastructure Expansion Plan",
    description:
      "Design and implementation plan for expanding key roads to accommodate increased traffic in new urban zones.",
    issuanceTime: "2023-02",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 700 },
    coordinates: { latitude: 67.8583, longitude: 20.3092 },
  },
  {
    title: "Affordable Housing Program",
    description:
      "A design initiative to build affordable housing units for low-income residents, ensuring accessibility and sustainability.",
    issuanceTime: "2021-09",
    type: DocumentType.Design,
    stakeholders: [Stakeholder.KirunaKommun, Stakeholder.Residents],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 2000 },
    coordinates: { latitude: 67.8542, longitude: 20.3101 },
  },
  {
    title: "Heritage Building Relocation Plan",
    description:
      "A relocation strategy for heritage buildings, including logistics and timelines for safely moving structures of cultural significance.",
    issuanceTime: "2023-04",
    type: DocumentType.Technical,
    stakeholders: [Stakeholder.WhiteArkitekter, Stakeholder.KirunaKommun],
    scale: { type: ScaleType.BlueprintsOrEffect },
    coordinates: { latitude: 67.855, longitude: 20.2808 },
  },
  {
    title: "Public Park Development",
    description:
      "This plan outlines the design and construction of a large public park with recreational and green areas for the community.",
    issuanceTime: "2024-01",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 100 },
    coordinates: { latitude: 67.859, longitude: 20.3133 },
  },
  {
    title: "Noise Pollution Control Measures",
    description:
      "Technical guidelines for reducing noise pollution in residential and public areas affected by mining activities.",
    issuanceTime: "2023-07",
    type: DocumentType.Technical,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.Text },
    coordinates: { latitude: 67.8505, longitude: 20.2838 },
  },
  {
    title: "Public Safety Improvements",
    description:
      "Prescriptive measures for improving safety standards in public spaces, including lighting and security installations.",
    issuanceTime: "2022-12",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.BlueprintsOrEffect },
    coordinates: { latitude: 67.8577, longitude: 20.3124 },
  },
  {
    title: "Smart Waste Management Plan",
    description:
      "A prescriptive plan introducing a smart waste management system in Kiruna, including automated waste sorting and underground container networks for better efficiency.",
    issuanceTime: "2024-09",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.BlueprintsOrEffect },
    coordinates: { latitude: 67.8548, longitude: 20.3115 },
  },
  {
    title: "Public Wi-Fi Infrastructure Project",
    description:
      "This project outlines the implementation of free public Wi-Fi across key public spaces in the new Kiruna city center, promoting digital accessibility for residents and visitors.",
    issuanceTime: "2023-12",
    type: DocumentType.Technical,
    stakeholders: [Stakeholder.KirunaKommun, Stakeholder.Others],
    scale: { type: ScaleType.Text },
    coordinates: { latitude: 67.8571, longitude: 20.3032 },
  },
  {
    title: "Green Rooftop Initiative",
    description:
      "A design plan promoting the construction of green rooftops on public and residential buildings to improve urban air quality and energy efficiency.",
    issuanceTime: "2024-07",
    type: DocumentType.Design,
    stakeholders: [Stakeholder.WhiteArkitekter, Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 200 },
    coordinates: { latitude: 67.8584, longitude: 20.3097 },
  },
  {
    title: "Renewable Energy Storage Report",
    description:
      "A technical document analyzing energy storage solutions, including battery systems, to support the city's transition to renewable energy sources.",
    issuanceTime: "2023-10",
    type: DocumentType.Technical,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.Text },
    coordinates: { latitude: 67.8502, longitude: 20.2903 },
  },
  {
    title: "Winter Safety Infrastructure Plan",
    description:
      "A prescriptive plan addressing winter safety in Kiruna through improved snow removal techniques, heated pedestrian paths, and anti-slip road materials.",
    issuanceTime: "2024-01",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.BlueprintsOrEffect },
    coordinates: { latitude: 67.8517, longitude: 20.3078 },
  },
];
