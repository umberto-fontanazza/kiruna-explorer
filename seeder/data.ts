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
    area: {
        include: [
            { latitude: 67.8620, longitude: 20.2271 },
            { latitude: 67.8622, longitude: 20.2273 },
            { latitude: 67.8621, longitude: 20.2274 }
        ],
        exclude: []
    }
},
{
    title: "Demolition documentation, Kiruna City Hall",
    description:
      "This document was created to preserve the memory of the symbolic building before its demolition in April 2019. Conducted by the Norrbotten Museum, the detailed 162-page study analyzed the building's materials, both physically and chemically, taking advantage of the demolition to explore aspects that couldn't be examined while it was in use. This meticulous effort reflects a commitment to preserving knowledge of every detail of the structure.",
    issuanceTime: "2020-11-26",
    type: DocumentType.Informative,
    stakeholders: [Stakeholder.Others],
    scale: { type: ScaleType.Text },
    area: {
        include: [
            { latitude: 67.5056, longitude: 20.1814 },
            { latitude: 67.5058, longitude: 20.1816 },
            { latitude: 67.5057, longitude: 20.1817 }
        ],
        exclude: []
    }
},
{
    title: "Deformation forecast",
    description:
      "The third deformation forecast was published in 2019, five years after the second. The line has not moved; what changes, as in the previous version, are the timing of the interventions and the shape of the areas underlying the deformation zone.",
    issuanceTime: "2019-04",
    type: DocumentType.Technical,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 1500 },
    area: {
        include: [
            { latitude: 67.8653, longitude: 20.2052 },
            { latitude: 67.8655, longitude: 20.2054 },
            { latitude: 67.8654, longitude: 20.2055 }
        ],
        exclude: []
    }
},
{
    title: "Detailed plan for Gruvstaspark 2, etapp 3, del av SJ-området m m.",
    description:
      "The third Detailed Plan of the second demolition phase covers a narrow, elongated area straddling the old railway. Like all areas within the 'Gruvstadpark 2' zone, its sole designated land use is for mining activities, although it will temporarily be used as a park during an interim phase.",
    issuanceTime: "2018-10",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 1300 },
    area: {
        include: [
            { latitude: 67.8632, longitude: 20.2060 },
            { latitude: 67.8634, longitude: 20.2062 },
            { latitude: 67.8633, longitude: 20.2063 }
        ],
        exclude: []
    }
}


  {
    title: "Vision 2099",
    description:
      "Vision 2099 is to be considered the first project for the new city of Kiruna. It was created by the municipality in response to the letter from LKAB. In these few lines, all the main aspects and expectations of the municipality for the new city are condensed. The document, which despite being a project document is presented anonymously, had the strength to influence the design process. The principles it contains proved to be fundamental in subsequent planning documents.",
    issuanceTime: "2004",
    type: DocumentType.Design,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.Text },
    area: {
        include: [
            { latitude: 67.8593, longitude: 20.2556 },
            { latitude: 67.8595, longitude: 20.2558 },
            { latitude: 67.8594, longitude: 20.2559 }
        ],
        exclude: []
    }
},
{
    title: "Detail plan for square and commercial street",
    description:
      "This plan, approved in July 2016, is the first detailed plan to be implemented from the new masterplan (Adjusted development plan). The document defines the entire area near the town hall, comprising a total of 9 blocks known for their density. Among these are the 6 buildings that will face the main square. The functions are mixed, both public and private, with residential being prominent, as well as the possibility of incorporating accommodation facilities such as hotels. For all buildings in this plan, the only height limit is imposed by air traffic.",
    issuanceTime: "2016-06-22",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 500 },
    area: {
        include: [
            { latitude: 67.8484, longitude: 20.2907 },
            { latitude: 67.8486, longitude: 20.2909 },
            { latitude: 67.8485, longitude: 20.2910 }
        ],
        exclude: []
    }
},
{
    title: "Construction of new city hall begins",
    description:
      "The Kiruna Town Hall was the first building to be rebuild in the new town center in 2015. It remained isolated for quite some time due to a slowdown in mining activities.",
    issuanceTime: "2015",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
        include: [
            { latitude: 67.8487, longitude: 20.3028 },
            { latitude: 67.8489, longitude: 20.3030 },
            { latitude: 67.8488, longitude: 20.3031 }
        ],
        exclude: []
    }
},
{
    title: "Detailed Overview Plan for the Central Area of Kiruna 2014.",
    description:
      "The Detailed Overview Plan is one of the three planning instruments available to Swedish administrations and represents an intermediate scale. Like the Overview Plan, compliance with it is not mandatory, but it serves as a supporting plan for Detailed Plans, sharing the characteristic of regulating a specific area of the Kiruna municipality rather than its entire extent, as the Overview Plan does. This specific plan focuses on the central area of Kiruna and its surroundings, incorporating all the projections of the Development Plan into a prescriptive tool.",
    issuanceTime: "2014-06",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 300 },
    area: {
        include: [
            { latitude: 67.8352, longitude: 20.2591 },
            { latitude: 67.8354, longitude: 20.2593 },
            { latitude: 67.8353, longitude: 20.2594 }
        ],
        exclude: []
    }
}


  {
    title: "Detailed plan for LINBANAN 1.",
    description:
      "This is the first Detailed Plan for the new city center, covering a very small area. It regulates the use of a portion of land that will host a single building. Its boundaries coincide with the outer footprint of the new Town Hall, 'Kristallen,' the first building to be constructed in the new Kiruna.",
    issuanceTime: "2014-03",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.Text },
    area: {
        include: [
            { latitude: 67.8487, longitude: 20.2965 },
            { latitude: 67.8491, longitude: 20.2969 },
            { latitude: 67.8489, longitude: 20.2970 }
        ],
        exclude: []
    }
},
{
    title: "Mail to Kiruna kommun",
    description:
      "This document is considered the act that initiates the process of relocating Kiruna. The company communicates its intention to construct a new mining level at a depth of 1,365 meters. Along with this, LKAB urges the municipality to begin the necessary planning to relocate the city, referring to a series of meetings held in previous months between the two stakeholders.",
    issuanceTime: "2004-03-19",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.Text },
    area: {
        include: [
            { latitude: 67.8567, longitude: 20.2528 },
            { latitude: 67.8571, longitude: 20.2532 },
            { latitude: 67.8569, longitude: 20.2534 }
        ],
        exclude: []
    }
},
{
    title: "Kiruna Church closes",
    description:
      "On June 2, the Kiruna Church was closed to begin the necessary preparations for its relocation, following a solemn ceremony. The relocation is scheduled for the summer of 2025 and will take two days. Both the new site and the route for the move have already been determined. A significant period will pass between the relocation and the reopening of the church, voted 'Sweden's most beautiful building constructed before 1950.'",
    issuanceTime: "2024-06-02",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
        include: [
            { latitude: 67.8516, longitude: 20.2330 },
            { latitude: 67.8520, longitude: 20.2332 },
            { latitude: 67.8518, longitude: 20.2334 }
        ],
        exclude: []
    }
}

  {
    title: "Construction of Block 1 begins",
    description:
      "Simultaneously with the start of construction on the Aurora Center, work also began on Block 1, another mixed-use building overlooking the main square and the road leading to old Kiruna. These are the first residential buildings in the new town.",
    issuanceTime: "2019-06",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
        include: [
            { latitude: 67.5052, longitude: 20.1798 },
            { latitude: 67.5056, longitude: 20.1805 },
            { latitude: 67.5050, longitude: 20.1802 }
        ],
        exclude: []
    }
},
{
    title: "Construction of Aurora Center begins",
    description:
      "Shortly after the construction of the Scandic hotel began, work on the Aurora Center also started, a multifunctional complex that includes the municipal library of Kiruna. The two buildings are close to each other and connected by a skywalk, just like in the old town center.",
    issuanceTime: "2019-05",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
        include: [
            { latitude: 67.5055, longitude: 20.1810 },
            { latitude: 67.5060, longitude: 20.1820 },
            { latitude: 67.5052, longitude: 20.1818 }
        ],
        exclude: []
    }
},
{
    title: "Town Hall demolition",
    description:
      "After the construction of the new town hall was completed, the old building, nicknamed 'The Igloo,' was demolished. The only elements preserved were the door handles, a masterpiece of Sami art made of wood and bone, and the clock tower, which once stood on the roof of the old town hall. The clock tower was relocated to the central square of New Kiruna, in front of the new building.",
    issuanceTime: "2019-04",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
        include: [
            { latitude: 67.5107, longitude: 20.1315 },
            { latitude: 67.5111, longitude: 20.1325 },
            { latitude: 67.5105, longitude: 20.1320 }
        ],
        exclude: []
    }
},
{
    title: "Construction of Scandic Hotel begins",
    description:
      "After two extensions of the land acquisition agreement, necessary because this document in Sweden is valid for only two years, construction of the hotel finally began in 2019.",
    issuanceTime: "2019-04",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
        include: [
            { latitude: 67.5052, longitude: 20.1815 },
            { latitude: 67.5056, longitude: 20.1820 },
            { latitude: 67.5050, longitude: 20.1818 }
        ],
        exclude: []
    }
},
{
    title: "Detail plan for square and commercial street",
    description:
      "This plan, approved in July 2016, is the first detailed plan to be implemented from the new masterplan (Adjusted development plan). The document defines the entire area near the town hall, comprising a total of 9 blocks known for their density. Among these are the 6 buildings that will face the main square. The functions are mixed, both public and private, with residential being prominent, as well as the possibility of incorporating accommodation facilities such as hotels. For all buildings in this plan, the only height limit is imposed by air traffic.",
    issuanceTime: "2016-06-22",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 1000 },
    area: {
        include: [
            { latitude: 67.8490, longitude: 20.2870 },
            { latitude: 67.8495, longitude: 20.2880 },
            { latitude: 67.8485, longitude: 20.2875 }
        ],
        exclude: []
    }
},
{
    title: "Adjusted development plan",
    description:
      "This document is the update of the Development Plan, one year after its creation, modifications are made to the general master plan, which is published under the name 'Adjusted Development Plan91,' and still represents the version used today after 10 years. Certainly, there are no drastic differences compared to the previous plan, but upon careful comparison, several modified elements stand out. For example, the central square now takes its final shape, as well as the large school complex just north of it, which appears for the first time.",
    issuanceTime: "2015",
    type: DocumentType.Design,
    stakeholders: [Stakeholder.KirunaKommun, Stakeholder.WhiteArkitekter],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 100 },
    area: {
        include: [
            { latitude: 67.8520, longitude: 20.2940 },
            { latitude: 67.8525, longitude: 20.2955 },
            { latitude: 67.8518, longitude: 20.2945 }
        ],
        exclude: []
    }
}

  {
    title: "Deformation forecast",
    description:
      "The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The document is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project.",
    issuanceTime: "2014-12",
    type: DocumentType.Technical,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 1600 },
    area: {
        include: [
            { latitude: 67.8515, longitude: 20.2280 },
            { latitude: 67.8520, longitude: 20.2300 },
            { latitude: 67.8505, longitude: 20.2290 }
        ],
        exclude: []
    }
},
{
    title: "Development Plan",
    description:
      "The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The document is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project.",
    issuanceTime: "2014-03",
    type: DocumentType.Design,
    stakeholders: [Stakeholder.KirunaKommun, Stakeholder.WhiteArkitekter],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 2000 },
    area: {
        include: [
            { latitude: 67.8506, longitude: 20.3040 },
            { latitude: 67.8510, longitude: 20.3060 },
            { latitude: 67.8500, longitude: 20.3050 }
        ],
        exclude: []
    }
},
{
    title: "Detail plan for Bolagsomradet Gruvstadspark",
    description:
      "This is the first of 8 detailed plans located in the old center of Kiruna, aimed at transforming the residential areas into mining industry zones to allow the demolition of buildings. The area includes the town hall, the Ullspiran district, and the A10 highway, and it will be the first to be dismantled. The plan consists, like all detailed plans, of two documents: the area map that regulates it, and a text explaining the reasons that led to the drafting of the plan with these characteristics. The plan gained legal validity in 2012.",
    issuanceTime: "2010-10",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 1400 },
    area: {
        include: [
            { latitude: 67.8525, longitude: 20.2775 },
            { latitude: 67.8527, longitude: 20.2795 },
            { latitude: 67.8519, longitude: 20.2780 }
        ],
        exclude: []
    }
}

  {
    title: "Compilation of responses “So what the people of Kiruna think?",
    description:
      "This document is a compilation of the responses to the survey 'What is your impression of Kiruna?' From the citizens' responses to this last part of the survey, it is evident that certain buildings, such as the Kiruna Church, the Hjalmar Lundbohmsgården, and the Town Hall, are considered of significant value to the population. The municipality views the experience of this survey positively, to the extent that over the years it will propose various consultation opportunities.",
    issuanceTime: "2007",
    type: DocumentType.Informative,
    stakeholders: [Stakeholder.KirunaKommun, Stakeholder.Residents],
    scale: { type: ScaleType.Text },
    area: {
      include: [
        { latitude: 67.8555, longitude: 20.2250 },
        { latitude: 67.8560, longitude: 20.2258 },
        { latitude: 67.8557, longitude: 20.2262 },
        { latitude: 67.8553, longitude: 20.2256 }
      ],
      exclude: [
        [
          { latitude: 67.8556, longitude: 20.2255 },
          { latitude: 67.8558, longitude: 20.2257 },
          { latitude: 67.8557, longitude: 20.2256 }
        ]
      ]
    }
  }
  
  {
    title: "Renewable Energy Initiative",
    description:
      "This document outlines Kiruna's efforts to shift to renewable energy sources, including solar and wind farms to meet urban energy demands.",
    issuanceTime: "2024-02",
    type: DocumentType.Technical,
    stakeholders: [Stakeholder.KirunaKommun, Stakeholder.Lkab],
    scale: { type: ScaleType.Text },
    area: {
      include: [
        { latitude: 67.8560, longitude: 20.3115 },
        { latitude: 67.8565, longitude: 20.3125 },
        { latitude: 67.8570, longitude: 20.3118 },
        { latitude: 67.8563, longitude: 20.3112 }
      ],
      exclude: [
        [
          { latitude: 67.8562, longitude: 20.3116 },
          { latitude: 67.8564, longitude: 20.3119 },
          { latitude: 67.8563, longitude: 20.3117 }
        ]
      ]
    }
  }
  
  {
    title: "Construction of Hospital Complex",
    description:
      "The hospital complex includes advanced medical facilities, emergency care, and green building features to serve the relocated population.",
    issuanceTime: "2023-11",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 400 },
    area: {
      include: [
        { latitude: 67.8572, longitude: 20.3165 },
        { latitude: 67.8576, longitude: 20.3180 },
        { latitude: 67.8580, longitude: 20.3175 },
        { latitude: 67.8574, longitude: 20.3168 }
      ],
      exclude: [
        [
          { latitude: 67.8574, longitude: 20.3170 },
          { latitude: 67.8575, longitude: 20.3174 },
          { latitude: 67.8573, longitude: 20.3173 }
        ]
      ]
    }
  }
  
  {
    title: "Public Consultation Summary",
    description:
      "This document summarizes feedback gathered from residents regarding the urban transformation plans and future projects.",
    issuanceTime: "2022-03",
    type: DocumentType.Informative,
    stakeholders: [Stakeholder.Residents, Stakeholder.KirunaKommun],
    scale: { type: ScaleType.Text },
    area: {
      include: [
        { latitude: 67.8523, longitude: 20.3035 },
        { latitude: 67.8530, longitude: 20.3055 },
        { latitude: 67.8527, longitude: 20.3060 },
        { latitude: 67.8520, longitude: 20.3040 }
      ],
      exclude: [
        [
          { latitude: 67.8524, longitude: 20.3042 },
          { latitude: 67.8526, longitude: 20.3048 },
          { latitude: 67.8525, longitude: 20.3050 },
          { latitude: 67.8523, longitude: 20.3045 }
        ]
      ]
    }
  }
  
  {
    title: "Railway Realignment Proposal",
    description:
      "A detailed proposal for realigning the railway infrastructure to facilitate better transportation access and minimize disruption.",
    issuanceTime: "2024-05",
    type: DocumentType.Design,
    stakeholders: [Stakeholder.Lkab, Stakeholder.KirunaKommun],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
      include: [
        { latitude: 67.8598, longitude: 20.3195 },
        { latitude: 67.8606, longitude: 20.3210 },
        { latitude: 67.8604, longitude: 20.3220 },
        { latitude: 67.8596, longitude: 20.3215 },
        { latitude: 67.8598, longitude: 20.3195 }
      ],
      exclude: [
        [
          { latitude: 67.8600, longitude: 20.3200 },
          { latitude: 67.8603, longitude: 20.3206 },
          { latitude: 67.8601, longitude: 20.3208 },
          { latitude: 67.8600, longitude: 20.3200 }
        ]
      ]
    }
  }
  
  {
    title: "New Residential Block Design",
    description:
      "This document provides the architectural blueprint for a new residential area with integrated public spaces and amenities.",
    issuanceTime: "2023-08",
    type: DocumentType.Design,
    stakeholders: [Stakeholder.WhiteArkitekter, Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 500 },
    area: {
      include: [
        { latitude: 67.8555, longitude: 20.2988 },
        { latitude: 67.8560, longitude: 20.3005 },
        { latitude: 67.8552, longitude: 20.3008 },
        { latitude: 67.8549, longitude: 20.2995 },
        { latitude: 67.8555, longitude: 20.2988 }
      ],
      exclude: [
        [
          { latitude: 67.8554, longitude: 20.2993 },
          { latitude: 67.8556, longitude: 20.2996 },
          { latitude: 67.8553, longitude: 20.2997 },
          { latitude: 67.8554, longitude: 20.2993 }
        ]
      ]
    }
  }
  
  {
    title: "Biodiversity Preservation Plan",
    description:
      "Guidelines for protecting biodiversity in Kiruna's green areas during urban and mining developments.",
    issuanceTime: "2021-10",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.Text },
    area: {
      include: [
        { latitude: 67.8515, longitude: 20.2825 },
        { latitude: 67.8520, longitude: 20.2840 },
        { latitude: 67.8510, longitude: 20.2845 },
        { latitude: 67.8505, longitude: 20.2830 },
        { latitude: 67.8515, longitude: 20.2825 }
      ],
      exclude: [
        [
          { latitude: 67.8513, longitude: 20.2830 },
          { latitude: 67.8516, longitude: 20.2833 },
          { latitude: 67.8514, longitude: 20.2835 },
          { latitude: 67.8513, longitude: 20.2830 }
        ]
      ]
    }
  }
  
  {
    title: "Sustainable Water Management Report",
    description:
      "A technical analysis of sustainable water resource management, including new drainage systems for the relocated city.",
    issuanceTime: "2022-06",
    type: DocumentType.Technical,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
      include: [
        { latitude: 67.8485, longitude: 20.2905 },
        { latitude: 67.8498, longitude: 20.2920 },
        { latitude: 67.8490, longitude: 20.2930 },
        { latitude: 67.8478, longitude: 20.2915 },
        { latitude: 67.8485, longitude: 20.2905 }
      ],
      exclude: [
        [
          { latitude: 67.8489, longitude: 20.2910 },
          { latitude: 67.8492, longitude: 20.2913 },
          { latitude: 67.8490, longitude: 20.2915 },
          { latitude: 67.8489, longitude: 20.2910 }
        ]
      ]
    }
  }
  
  {
    title: "New Cultural Center Construction",
    description:
      "This document marks the beginning of the cultural center's construction, housing exhibition spaces and public event areas.",
    issuanceTime: "2024-04",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 600 },
    area: {
      include: [
        { latitude: 67.8565, longitude: 20.2945 },
        { latitude: 67.8570, longitude: 20.2960 },
        { latitude: 67.8562, longitude: 20.2970 },
        { latitude: 67.8558, longitude: 20.2958 },
        { latitude: 67.8565, longitude: 20.2945 }
      ],
      exclude: [
        [
          { latitude: 67.8566, longitude: 20.2952 },
          { latitude: 67.8568, longitude: 20.2954 },
          { latitude: 67.8567, longitude: 20.2950 },
          { latitude: 67.8566, longitude: 20.2952 }
        ]
      ]
    }
  }
  
  {
    title: "Road Infrastructure Expansion Plan",
    description:
      "Design and implementation plan for expanding key roads to accommodate increased traffic in new urban zones.",
    issuanceTime: "2023-02",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 700 },
    area: {
      include: [
        { latitude: 67.8580, longitude: 20.3085 },
        { latitude: 67.8590, longitude: 20.3100 },
        { latitude: 67.8575, longitude: 20.3110 },
        { latitude: 67.8565, longitude: 20.3095 },
        { latitude: 67.8580, longitude: 20.3085 }
      ],
      exclude: [
        [
          { latitude: 67.8577, longitude: 20.3090 },
          { latitude: 67.8579, longitude: 20.3093 },
          { latitude: 67.8578, longitude: 20.3088 },
          { latitude: 67.8577, longitude: 20.3090 }
        ],
        [
          { latitude: 67.8582, longitude: 20.3100 },
          { latitude: 67.8584, longitude: 20.3103 },
          { latitude: 67.8583, longitude: 20.3098 },
          { latitude: 67.8582, longitude: 20.3100 }
        ]
      ]
    }
  }
  
  {
    title: "Affordable Housing Program",
    description:
      "A design initiative to build affordable housing units for low-income residents, ensuring accessibility and sustainability.",
    issuanceTime: "2021-09",
    type: DocumentType.Design,
    stakeholders: [Stakeholder.KirunaKommun, Stakeholder.Residents],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 2000 },
    area: {
      include: [
        { latitude: 67.8540, longitude: 20.3095 },
        { latitude: 67.8550, longitude: 20.3110 },
        { latitude: 67.8545, longitude: 20.3120 },
        { latitude: 67.8535, longitude: 20.3115 },
        { latitude: 67.8540, longitude: 20.3095 }, 
      ],
      exclude: [
        [
          { latitude: 67.8544, longitude: 20.3102 },
          { latitude: 67.8546, longitude: 20.3104 },
          { latitude: 67.8545, longitude: 20.3100 },
          { latitude: 67.8544, longitude: 20.3102 }, 
        ],
        [
          { latitude: 67.8548, longitude: 20.3110 },
          { latitude: 67.8550, longitude: 20.3112 },
          { latitude: 67.8549, longitude: 20.3108 },
          { latitude: 67.8548, longitude: 20.3110 }, 
        ],
      ],
    },
  },
  
  {
    title: "Heritage Building Relocation Plan",
    description:
      "A relocation strategy for heritage buildings, including logistics and timelines for safely moving structures of cultural significance.",
    issuanceTime: "2023-04",
    type: DocumentType.Technical,
    stakeholders: [Stakeholder.WhiteArkitekter, Stakeholder.KirunaKommun],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
      include: [
        { latitude: 67.8545, longitude: 20.2800 },
        { latitude: 67.8560, longitude: 20.2815 },
        { latitude: 67.8555, longitude: 20.2830 },
        { latitude: 67.8540, longitude: 20.2820 },
        { latitude: 67.8545, longitude: 20.2800 },
      ],
      exclude: [
        [
          { latitude: 67.8550, longitude: 20.2810 },
          { latitude: 67.8552, longitude: 20.2812 },
          { latitude: 67.8551, longitude: 20.2808 },
          { latitude: 67.8550, longitude: 20.2810 }, 
        ],
        [
          { latitude: 67.8548, longitude: 20.2825 },
          { latitude: 67.8550, longitude: 20.2827 },
          { latitude: 67.8549, longitude: 20.2823 },
          { latitude: 67.8548, longitude: 20.2825 }, 
        ],
      ],
    },
  },
  
  {
    title: "Public Park Development",
    description:
      "This plan outlines the design and construction of a large public park with recreational and green areas for the community.",
    issuanceTime: "2024-01",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 100 },
    area: {
      include: [
        { latitude: 67.8585, longitude: 20.3125 },
        { latitude: 67.8595, longitude: 20.3145 },
        { latitude: 67.8600, longitude: 20.3130 },
        { latitude: 67.8590, longitude: 20.3115 },
        { latitude: 67.8585, longitude: 20.3125 }, 
      ],
      exclude: [
        [
          { latitude: 67.8592, longitude: 20.3130 },
          { latitude: 67.8594, longitude: 20.3132 },
          { latitude: 67.8593, longitude: 20.3128 },
          { latitude: 67.8592, longitude: 20.3130 }, 
        ],
        [
          { latitude: 67.8596, longitude: 20.3140 },
          { latitude: 67.8598, longitude: 20.3142 },
          { latitude: 67.8597, longitude: 20.3138 },
          { latitude: 67.8596, longitude: 20.3140 }, 
        ],
      ],
    },
  },
  
  {
    title: "Noise Pollution Control Measures",
    description:
      "Technical guidelines for reducing noise pollution in residential and public areas affected by mining activities.",
    issuanceTime: "2023-07",
    type: DocumentType.Technical,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.Text },
    area: {
      include: [
        { latitude: 67.8500, longitude: 20.2830 },
        { latitude: 67.8510, longitude: 20.2840 },
        { latitude: 67.8508, longitude: 20.2850 },
        { latitude: 67.8495, longitude: 20.2845 },
        { latitude: 67.8500, longitude: 20.2830 }, 
      ]
      exclude: [
        [
          { latitude: 67.8503, longitude: 20.2835 },
          { latitude: 67.8504, longitude: 20.2837 },
          { latitude: 67.8502, longitude: 20.2836 },
          { latitude: 67.8503, longitude: 20.2835 },
        ],
        [
          { latitude: 67.8506, longitude: 20.2842 },
          { latitude: 67.8507, longitude: 20.2844 },
          { latitude: 67.8505, longitude: 20.2843 },
          { latitude: 67.8506, longitude: 20.2842 }, 
        ],
      ],
    },
  },
  
  {
    title: "Public Safety Improvements",
    description:
      "Prescriptive measures for improving safety standards in public spaces, including lighting and security installations.",
    issuanceTime: "2022-12",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
      include: [
        { latitude: 67.8575, longitude: 20.3120 },
        { latitude: 67.8580, longitude: 20.3130 },
        { latitude: 67.8578, longitude: 20.3135 },
        { latitude: 67.8570, longitude: 20.3132 },
        { latitude: 67.8575, longitude: 20.3120 }, 
      ],
      exclude: [
        [
          { latitude: 67.8576, longitude: 20.3124 },
          { latitude: 67.8577, longitude: 20.3126 },
          { latitude: 67.8575, longitude: 20.3125 },
          { latitude: 67.8576, longitude: 20.3124 }, 
        ],
        [
          { latitude: 67.8579, longitude: 20.3129 },
          { latitude: 67.8580, longitude: 20.3131 },
          { latitude: 67.8578, longitude: 20.3130 },
          { latitude: 67.8579, longitude: 20.3129 }, 
        ],
      ],
    },
  },
  
  {
    title: "Smart Waste Management Plan",
    description:
      "A prescriptive plan introducing a smart waste management system in Kiruna, including automated waste sorting and underground container networks for better efficiency.",
    issuanceTime: "2024-09",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
      include: [
        { latitude: 67.8550, longitude: 20.3110 },
        { latitude: 67.8560, longitude: 20.3120 },
        { latitude: 67.8545, longitude: 20.3130 },
        { latitude: 67.8540, longitude: 20.3110 },
        { latitude: 67.8550, longitude: 20.3110 }, 
      ],
      exclude: [
        [
          { latitude: 67.8553, longitude: 20.3112 },
          { latitude: 67.8555, longitude: 20.3117 },
          { latitude: 67.8552, longitude: 20.3116 },
          { latitude: 67.8553, longitude: 20.3112 }, 
        ],
        [
          { latitude: 67.8547, longitude: 20.3125 },
          { latitude: 67.8549, longitude: 20.3128 },
          { latitude: 67.8546, longitude: 20.3127 },
          { latitude: 67.8547, longitude: 20.3125 }, 
        ],
      ],
    },
  },
  
  {
    title: "Public Wi-Fi Infrastructure Project",
    description:
      "This project outlines the implementation of free public Wi-Fi across key public spaces in the new Kiruna city center, promoting digital accessibility for residents and visitors.",
    issuanceTime: "2023-12",
    type: DocumentType.Technical,
    stakeholders: [Stakeholder.KirunaKommun, Stakeholder.Others],
    scale: { type: ScaleType.Text },
    area: {
      include: [
        { latitude: 67.8575, longitude: 20.3025 },
        { latitude: 67.8580, longitude: 20.3040 },
        { latitude: 67.8565, longitude: 20.3045 },
        { latitude: 67.8560, longitude: 20.3020 },
        { latitude: 67.8575, longitude: 20.3025 },
      ],
      exclude: [
        [
          { latitude: 67.8576, longitude: 20.3030 },
          { latitude: 67.8578, longitude: 20.3036 },
          { latitude: 67.8574, longitude: 20.3035 },
          { latitude: 67.8576, longitude: 20.3030 }, 
        ],
        [
          { latitude: 67.8567, longitude: 20.3038 },
          { latitude: 67.8569, longitude: 20.3042 },
          { latitude: 67.8566, longitude: 20.3040 },
          { latitude: 67.8567, longitude: 20.3038 }, 
        ],
      ],
    },
  },
  
  {
    title: "Green Rooftop Initiative",
    description:
      "A design plan promoting the construction of green rooftops on public and residential buildings to improve urban air quality and energy efficiency.",
    issuanceTime: "2024-07",
    type: DocumentType.Design,
    stakeholders: [Stakeholder.WhiteArkitekter, Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 200 },
    area: {
      include: [
        { latitude: 67.8586, longitude: 20.3085 },
        { latitude: 67.8590, longitude: 20.3105 },
        { latitude: 67.8575, longitude: 20.3110 },
        { latitude: 67.8570, longitude: 20.3090 },
        { latitude: 67.8586, longitude: 20.3085 }
      ],
      exclude: [
        [
          { latitude: 67.8582, longitude: 20.3092 },
          { latitude: 67.8584, longitude: 20.3100 },
          { latitude: 67.8578, longitude: 20.3102 },
          { latitude: 67.8576, longitude: 20.3094 },
          { latitude: 67.8582, longitude: 20.3092 }
        ]
      ]
    }
  },  
  {
    title: "Renewable Energy Storage Report",
    description:
      "A technical document analyzing energy storage solutions, including battery systems, to support the city's transition to renewable energy sources.",
    issuanceTime: "2023-10",
    type: DocumentType.Technical,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.Text },
    area: {
      include: [
        { latitude: 67.8500, longitude: 20.2900 },
        { latitude: 67.8510, longitude: 20.2910 },
        { latitude: 67.8505, longitude: 20.2920 },
        { latitude: 67.8495, longitude: 20.2915 },
        { latitude: 67.8500, longitude: 20.2900 }, 
      ],
      exclude: [
        [
          { latitude: 67.8503, longitude: 20.2905 },
          { latitude: 67.8504, longitude: 20.2907 },
          { latitude: 67.8502, longitude: 20.2906 },
          { latitude: 67.8503, longitude: 20.2905 }, 
        ],
        [
          { latitude: 67.8508, longitude: 20.2912 },
          { latitude: 67.8510, longitude: 20.2914 },
          { latitude: 67.8509, longitude: 20.2913 },
          { latitude: 67.8508, longitude: 20.2912 }, 
        ],
      ],
    },
  },
  
  {
    title: "Winter Safety Infrastructure Plan",
    description:
      "A prescriptive plan addressing winter safety in Kiruna through improved snow removal techniques, heated pedestrian paths, and anti-slip road materials.",
    issuanceTime: "2024-01",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
      include: [
        { latitude: 67.8525, longitude: 20.305 },
        { latitude: 67.8535, longitude: 20.31 },
        { latitude: 67.8505, longitude: 20.3105 },
        { latitude: 67.85, longitude: 20.306 },
        { latitude: 67.8525, longitude: 20.305 },
      ],
      exclude: [
        [
          { latitude: 67.852, longitude: 20.307 },
          { latitude: 67.8523, longitude: 20.308 },
          { latitude: 67.8515, longitude: 20.3085 },
          { latitude: 67.8513, longitude: 20.3075 },
          { latitude: 67.852, longitude: 20.307 },
        ],
      ],
    },
  },
];
