import { DocumentType } from "../server/src/model/document";
import { ScaleType } from "../server/src/model/scale";
import { Stakeholder } from "../server/src/model/stakeholder";

export const newDocuments = [
  {
    title: "ok - Urban Development Plan",
    description: "A detailed design for the expansion of central Kiruna.",
    issuanceTime: "2024-11",
    type: DocumentType.Design,
    stakeholders: [Stakeholder.WhiteArkitekter],
    scale: { type: ScaleType.BlueprintsOrEffect },
    coordinates: { latitude: 67.8558, longitude: 20.2253 },
  },
  {
    title: "ok - Mining Impact Study",
    description: "Technical analysis of mining effects on surrounding areas.",
    issuanceTime: "2023",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
      include: [
        { latitude: 67.81153766180255, longitude: 20.11698141313561 },
        { latitude: 67.81818165511771, longitude: 20.118268873462757 },
        { latitude: 67.82511532065992, longitude: 20.111402418384632 },
        { latitude: 67.82738289537109, longitude: 20.103162672290882 },
        { latitude: 67.83376331674228, longitude: 20.095781233081897 },
        { latitude: 67.83661289081104, longitude: 20.08719816423424 },
        { latitude: 67.84729569562282, longitude: 20.091146375904163 },
        { latitude: 67.84807243610571, longitude: 20.09449377275475 },
        { latitude: 67.84943166971553, longitude: 20.11268987871178 },
        { latitude: 67.85257054940699, longitude: 20.14238729692467 },
        { latitude: 67.85147037162167, longitude: 20.148824598560413 },
        { latitude: 67.85043486276479, longitude: 20.160583402881702 },
        { latitude: 67.84859024872529, longitude: 20.170024778614124 },
        { latitude: 67.84509479045816, longitude: 20.17663374162682 },
        { latitude: 67.84305553124362, longitude: 20.176719572315296 },
        { latitude: 67.84095134681081, longitude: 20.174058820972522 },
        { latitude: 67.83994774586475, longitude: 20.168222334156116 },
        { latitude: 67.8369043049138, longitude: 20.163329984912952 },
        { latitude: 67.83362236281303, longitude: 20.16187086320885 },
        { latitude: 67.83077242362778, longitude: 20.1646174452401 },
        { latitude: 67.8284403964033, longitude: 20.16435995317467 },
        { latitude: 67.82406721749328, longitude: 20.155347730884632 },
        { latitude: 67.8188597109039, longitude: 20.153569085647856 },
        { latitude: 67.81095175399086, longitude: 20.15125165705899 },
        { latitude: 67.80599171059966, longitude: 20.13228307490567 },
      ],
      exclude: [],
    },
  },
  {
    title: "ok - Works restart in the mining area",
    description: "After a 4 days of stop the works resterded",
    issuanceTime: "2003-05",
    type: DocumentType.Informative,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
      include: [
        { latitude: 67.81153766180255, longitude: 20.11698141313561 },
        { latitude: 67.81818165511771, longitude: 20.11826887346275 },
        { latitude: 67.82511532065992, longitude: 20.11140241838463 },
        { latitude: 67.82738289537109, longitude: 20.10316267229088 },
        { latitude: 67.83376331674228, longitude: 20.09578123308189 },
        { latitude: 67.83661289081104, longitude: 20.08719816423424 },
        { latitude: 67.84729569562282, longitude: 20.09114637590416 },
        { latitude: 67.84807243610571, longitude: 20.09449377275475 },
        { latitude: 67.84943166971553, longitude: 20.11268987871178 },
        { latitude: 67.85257054940699, longitude: 20.14238729692467 },
        { latitude: 67.85147037162167, longitude: 20.14882459856041 },
        { latitude: 67.85043486276479, longitude: 20.1605834028817 },
        { latitude: 67.84859024872529, longitude: 20.17002477861412 },
        { latitude: 67.84509479045816, longitude: 20.17663374162682 },
        { latitude: 67.84305553124362, longitude: 20.17671957231529 },
        { latitude: 67.84095134681081, longitude: 20.17405882097252 },
        { latitude: 67.83994774586475, longitude: 20.16822233415611 },
        { latitude: 67.8369043049138, longitude: 20.163329984912952 },
        { latitude: 67.83362236281303, longitude: 20.16187086320885 },
        { latitude: 67.83077242362778, longitude: 20.1646174452401 },
        { latitude: 67.8284403964033, longitude: 20.16435995317467 },
        { latitude: 67.82406721749328, longitude: 20.155347730884632 },
        { latitude: 67.8188597109039, longitude: 20.153569085647856 },
        { latitude: 67.81095175399086, longitude: 20.15125165705899 },
        { latitude: 67.80599171059966, longitude: 20.13228307490567 },
      ],
      exclude: [],
    },
  },
  {
    title: "ok - Cultural Heritage Preservation",
    description:
      "Prescriptive measures for preserving Kiruna's cultural sites.",
    issuanceTime: "2023-08",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.Residents],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
      include: [
        { latitude: 67.86762647770166, longitude: 20.205162830300875 },
        { latitude: 67.86860463677212, longitude: 20.207887954660006 },
        { latitude: 67.86853188255222, longitude: 20.21179325098569 },
        { latitude: 67.86793367257614, longitude: 20.21325237268979 },
        { latitude: 67.86699590711392, longitude: 20.213638610787935 },
        { latitude: 67.86617128906109, longitude: 20.21479732508237 },
        { latitude: 67.86496664749936, longitude: 20.212887592263765 },
        { latitude: 67.86470792441062, longitude: 20.21299488062436 },
        { latitude: 67.86436026073744, longitude: 20.211643047280855 },
        { latitude: 67.86387513996843, longitude: 20.212608642526217 },
        { latitude: 67.86296146843729, longitude: 20.21149284357602 },
        { latitude: 67.86368917432978, longitude: 20.209475822396822 },
      ],
      exclude: [],
    },
  },
  {
    title: "ok - New School Construction",
    description: "Plans for the construction of a new school building.",
    issuanceTime: "2024-01",
    type: DocumentType.Technical,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.BlueprintsOrEffect },
    coordinates: { latitude: 67.8567, longitude: 20.2244 },
  },
  {
    title: "ok - Energy Efficiency Standards",
    description:
      "Technical guidelines for improving energy usage in buildings.",
    issuanceTime: "2021",
    type: DocumentType.Technical,
    stakeholders: [Stakeholder.Others],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
      include: [
        { latitude: 67.84883315002244, longitude: 20.18996209059532 },
        { latitude: 67.85048098608428, longitude: 20.18721550856407 },
        { latitude: 67.85112818322777, longitude: 20.18245190535362 },
        { latitude: 67.85175918315123, longitude: 20.18167942915733 },
        { latitude: 67.8553992339756, longitude: 20.19665688429649 },
        { latitude: 67.84907327028522, longitude: 20.19841641341026 },
        { latitude: 67.846856350174, longitude: 20.196613968952253 },
      ],
      exclude: [],
    },
  },
  {
    title: "ok - Tourism Strategy Report",
    description: "Informative study to boost tourism in Kiruna.",
    issuanceTime: "2022",
    type: DocumentType.Informative,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.BlueprintsOrEffect },
    coordinates: { latitude: 67.8539, longitude: 20.227 },
  },
  {
    title: "ok - Safety Regulations Update",
    description: "New safety rules for underground mining operations.",
    issuanceTime: "2023-12",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.BlueprintsOrEffect },
    coordinates: { latitude: 67.8545, longitude: 20.2285 },
  },
  {
    title: "ok - Urban Relocation Plan",
    description: "Guidelines for moving parts of the city due to mining.",
    issuanceTime: "2024-06",
    type: DocumentType.Design,
    stakeholders: [Stakeholder.WhiteArkitekter],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
      include: [
        { latitude: 67.87403468931322, longitude: 20.20156727820997 },
        { latitude: 67.8694113804885, longitude: 20.214012728039073 },
        { latitude: 67.86873235577828, longitude: 20.218132601085948 },
        { latitude: 67.86863535063291, longitude: 20.222252474132823 },
        { latitude: 67.86469013257259, longitude: 20.228518114391612 },
        { latitude: 67.86119708709177, longitude: 20.226715669933604 },
        { latitude: 67.8575417661221, longitude: 20.219763384167003 },
        { latitude: 67.85540653474412, longitude: 20.21856175452833 },
        { latitude: 67.85670063770966, longitude: 20.214184389416026 },
        { latitude: 67.86591904260312, longitude: 20.202768907848643 },
        { latitude: 67.87054304436771, longitude: 20.202425585094737 },
        { latitude: 67.8749398451767, longitude: 20.196417436901378 },
      ],
      exclude: [],
    },
  },
  {
    title: "ok - Environmental Impact Analysis",
    description: "Analysis of environmental changes in the region.",
    issuanceTime: "2020-09",
    type: DocumentType.MaterialEffect,
    stakeholders: [Stakeholder.Others],
    scale: { type: ScaleType.Concept },
    area: {
      include: [
        { latitude: 67.86483119574645, longitude: 20.283756236157238 },
        { latitude: 67.86447544869145, longitude: 20.29148099812013 },
        { latitude: 67.86098237103553, longitude: 20.319461802563488 },
        { latitude: 67.8504999967592, longitude: 20.350189189038097 },
        { latitude: 67.84752266099878, longitude: 20.35508153828126 },
        { latitude: 67.84078989212594, longitude: 20.349073390087902 },
        { latitude: 67.83758467057628, longitude: 20.34812925251466 },
        { latitude: 67.8381998482436, longitude: 20.33843038471681 },
        { latitude: 67.84344438878158, longitude: 20.319547633251965 },
        { latitude: 67.84347675882816, longitude: 20.301609019360363 },
        { latitude: 67.85295924835783, longitude: 20.293283442578137 },
        { latitude: 67.85425348714607, longitude: 20.292900216716532 },
        { latitude: 67.86072360371789, longitude: 20.282085549968485 },
        { latitude: 67.8637962801442, longitude: 20.281570565837626 },
      ],
      exclude: [],
    },
  },
  {
    title: "ok - Gruvstadspark 2, etapp 5, Kyrkan",
    description:
      "The last detailed plan of the second planning phase concerns the area surrounding the Kiruna Church. Situated within a park, the area includes only six buildings, half of which serve religious functions. The plan also specifies that the church will be dismantled between 2025 and 2026 and reassembled at its new site by 2029.",
    issuanceTime: "2021-09-04",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 2000 },
    area: {
      include: [
        { latitude: 67.88012318323153, longitude: 20.161098645019536 },
        { latitude: 67.88361339245219, longitude: 20.176033184814457 },
        { latitude: 67.88477667928173, longitude: 20.19714753417969 },
        { latitude: 67.88270857362512, longitude: 20.217231915283207 },
        { latitude: 67.87960607070767, longitude: 20.230449841308598 },
        { latitude: 67.86835603217598, longitude: 20.231479809570317 },
        { latitude: 67.86395798873623, longitude: 20.24315278320313 },
        { latitude: 67.86356988623047, longitude: 20.257229016113286 },
        { latitude: 67.85891215206298, longitude: 20.278171704101567 },
        { latitude: 67.85386522305183, longitude: 20.30907075195313 },
        { latitude: 67.84713428483691, longitude: 20.319370434570317 },
        { latitude: 67.84337964855365, longitude: 20.308727429199223 },
        { latitude: 67.83237119836456, longitude: 20.30632416992188 },
        { latitude: 67.82576363540026, longitude: 20.292247937011723 },
        { latitude: 67.82200555967694, longitude: 20.264438793945317 },
        { latitude: 67.81759876968103, longitude: 20.24761597900391 },
        { latitude: 67.81046837842769, longitude: 20.23662965087891 },
        { latitude: 67.80424371314075, longitude: 20.21637360839844 },
        { latitude: 67.80541096415635, longitude: 20.181354687500004 },
        { latitude: 67.8100793854116, longitude: 20.15972535400391 },
        { latitude: 67.82990977581507, longitude: 20.139125988769536 },
        { latitude: 67.84350912882985, longitude: 20.139812634277348 },
        { latitude: 67.85192380560808, longitude: 20.145305798339848 },
        { latitude: 67.86331114763632, longitude: 20.14873902587891 },
        { latitude: 67.86822668980359, longitude: 20.15800874023438 },
        { latitude: 67.87779608645016, longitude: 20.161098645019536 },
      ],
      exclude: [
        [
          { latitude: 67.84648697686427, longitude: 20.22049348144531 },
          { latitude: 67.84234378047543, longitude: 20.23525635986328 },
          { latitude: 67.84247326650026, longitude: 20.25379578857422 },
          { latitude: 67.83379611385995, longitude: 20.25242249755859 },
          { latitude: 67.8296506636077, longitude: 20.269416973876957 },
          { latitude: 67.8286141860213, longitude: 20.291904614257817 },
          { latitude: 67.83807033850333, longitude: 20.29980103759766 },
          { latitude: 67.84829939392411, longitude: 20.30014436035156 },
          { latitude: 67.8552888264596, longitude: 20.288471386718754 },
          { latitude: 67.85865336176464, longitude: 20.25345246582031 },
          { latitude: 67.86240553993785, longitude: 20.23834626464844 },
          { latitude: 67.86680387632343, longitude: 20.22735993652344 },
          { latitude: 67.86977875088941, longitude: 20.21328370361328 },
          { latitude: 67.86796800290507, longitude: 20.20229737548828 },
        ],
      ],
    },
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
        { latitude: 67.84948495425536, longitude: 20.309499255600937 },
        { latitude: 67.84799626909546, longitude: 20.30913447517491 },
        { latitude: 67.84827945022069, longitude: 20.297568789902694 },
        { latitude: 67.84929078331835, longitude: 20.297633162919052 },
        { latitude: 67.85023735136862, longitude: 20.301817408982284 },
        { latitude: 67.84879725824473, longitude: 20.304285041275985 },
      ],
      exclude: [],
    },
  },
  // {
  //   title: "Deformation forecast",
  //   description:
  //     "The third deformation forecast was published in 2019, five years after the second. The line has not moved; what changes, as in the previous version, are the timing of the interventions and the shape of the areas underlying the deformation zone.",
  //   issuanceTime: "2019-04",
  //   type: DocumentType.Technical,
  //   stakeholders: [Stakeholder.Lkab],
  //   scale: { type: ScaleType.ArchitecturalScale, ratio: 1500 },
  //   area: {
  //     include: [
  //       { latitude: 67.8653, longitude: 20.2052 },
  //       { latitude: 67.8655, longitude: 20.2054 },
  //       { latitude: 67.8654, longitude: 20.2055 },
  //     ],
  //     exclude: [],
  //   },
  // },
  // {
  //   title: "Detailed plan for Gruvstaspark 2, etapp 3, del av SJ-området m m.",
  //   description:
  //     "The third Detailed Plan of the second demolition phase covers a narrow, elongated area straddling the old railway. Like all areas within the 'Gruvstadpark 2' zone, its sole designated land use is for mining activities, although it will temporarily be used as a park during an interim phase.",
  //   issuanceTime: "2018-10",
  //   type: DocumentType.Prescriptive,
  //   stakeholders: [Stakeholder.KirunaKommun],
  //   scale: { type: ScaleType.ArchitecturalScale, ratio: 1300 },
  //   area: {
  //     include: [
  //       { latitude: 67.8632, longitude: 20.206 },
  //       { latitude: 67.8634, longitude: 20.2062 },
  //       { latitude: 67.8633, longitude: 20.2063 },
  //     ],
  //     exclude: [],
  //   },
  // },
  // {
  //   title: "Vision 2099",
  //   description:
  //     "Vision 2099 is to be considered the first project for the new city of Kiruna. It was created by the municipality in response to the letter from LKAB. In these few lines, all the main aspects and expectations of the municipality for the new city are condensed. The document, which despite being a project document is presented anonymously, had the strength to influence the design process. The principles it contains proved to be fundamental in subsequent planning documents.",
  //   issuanceTime: "2004",
  //   type: DocumentType.Design,
  //   stakeholders: [Stakeholder.KirunaKommun],
  //   scale: { type: ScaleType.Text },
  //   area: {
  //     include: [
  //       { latitude: 67.8593, longitude: 20.2556 },
  //       { latitude: 67.8595, longitude: 20.2558 },
  //       { latitude: 67.8594, longitude: 20.2559 },
  //     ],
  //     exclude: [],
  //   },
  // },
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
        { latitude: 67.84948495425536, longitude: 20.309499255600937 },
        { latitude: 67.84799626909546, longitude: 20.30913447517491 },
        { latitude: 67.84827945022069, longitude: 20.297568789902694 },
        { latitude: 67.84929078331835, longitude: 20.297633162919052 },
        { latitude: 67.85023735136862, longitude: 20.301817408982284 },
        { latitude: 67.84879725824473, longitude: 20.304285041275985 },
      ],
      exclude: [],
    },
  },
  // {
  //   title: "Construction of new city hall begins",
  //   description:
  //     "The Kiruna Town Hall was the first building to be rebuild in the new town center in 2015. It remained isolated for quite some time due to a slowdown in mining activities.",
  //   issuanceTime: "2015",
  //   type: DocumentType.MaterialEffect,
  //   stakeholders: [Stakeholder.Lkab],
  //   scale: { type: ScaleType.BlueprintsOrEffect },
  //   area: {
  //     include: [
  //       { latitude: 67.8487, longitude: 20.3028 },
  //       { latitude: 67.8489, longitude: 20.303 },
  //       { latitude: 67.8488, longitude: 20.3031 },
  //     ],
  //     exclude: [],
  //   },
  // },
  // {
  //   title: "Detailed Overview Plan for the Central Area of Kiruna 2014.",
  //   description:
  //     "The Detailed Overview Plan is one of the three planning instruments available to Swedish administrations and represents an intermediate scale. Like the Overview Plan, compliance with it is not mandatory, but it serves as a supporting plan for Detailed Plans, sharing the characteristic of regulating a specific area of the Kiruna municipality rather than its entire extent, as the Overview Plan does. This specific plan focuses on the central area of Kiruna and its surroundings, incorporating all the projections of the Development Plan into a prescriptive tool.",
  //   issuanceTime: "2014-06",
  //   type: DocumentType.Prescriptive,
  //   stakeholders: [Stakeholder.KirunaKommun],
  //   scale: { type: ScaleType.ArchitecturalScale, ratio: 300 },
  //   area: {
  //     include: [
  //       { latitude: 67.8352, longitude: 20.2591 },
  //       { latitude: 67.8354, longitude: 20.2593 },
  //       { latitude: 67.8353, longitude: 20.2594 },
  //     ],
  //     exclude: [],
  //   },
  // },
  // {
  //   title: "Detailed plan for LINBANAN 1.",
  //   description:
  //     "This is the first Detailed Plan for the new city center, covering a very small area. It regulates the use of a portion of land that will host a single building. Its boundaries coincide with the outer footprint of the new Town Hall, 'Kristallen,' the first building to be constructed in the new Kiruna.",
  //   issuanceTime: "2014-03",
  //   type: DocumentType.Prescriptive,
  //   stakeholders: [Stakeholder.KirunaKommun],
  //   scale: { type: ScaleType.Text },
  //   area: {
  //     include: [
  //       { latitude: 67.8487, longitude: 20.2965 },
  //       { latitude: 67.8491, longitude: 20.2969 },
  //       { latitude: 67.8489, longitude: 20.297 },
  //     ],
  //     exclude: [],
  //   },
  // },
  // {
  //   title: "Mail to Kiruna kommun",
  //   description:
  //     "This document is considered the act that initiates the process of relocating Kiruna. The company communicates its intention to construct a new mining level at a depth of 1,365 meters. Along with this, LKAB urges the municipality to begin the necessary planning to relocate the city, referring to a series of meetings held in previous months between the two stakeholders.",
  //   issuanceTime: "2004-03-19",
  //   type: DocumentType.Prescriptive,
  //   stakeholders: [Stakeholder.Lkab],
  //   scale: { type: ScaleType.Text },
  //   area: {
  //     include: [
  //       { latitude: 67.8567, longitude: 20.2528 },
  //       { latitude: 67.8571, longitude: 20.2532 },
  //       { latitude: 67.8569, longitude: 20.2534 },
  //     ],
  //     exclude: [],
  //   },
  // },
  // {
  //   title: "Kiruna Church closes",
  //   description:
  //     "On June 2, the Kiruna Church was closed to begin the necessary preparations for its relocation, following a solemn ceremony. The relocation is scheduled for the summer of 2025 and will take two days. Both the new site and the route for the move have already been determined. A significant period will pass between the relocation and the reopening of the church, voted 'Sweden's most beautiful building constructed before 1950.'",
  //   issuanceTime: "2024-06-02",
  //   type: DocumentType.MaterialEffect,
  //   stakeholders: [Stakeholder.Lkab],
  //   scale: { type: ScaleType.BlueprintsOrEffect },
  //   area: {
  //     include: [
  //       { latitude: 67.8516, longitude: 20.233 },
  //       { latitude: 67.852, longitude: 20.2332 },
  //       { latitude: 67.8518, longitude: 20.2334 },
  //     ],
  //     exclude: [],
  //   },
  // },
  // {
  //   title: "Construction of Block 1 begins",
  //   description:
  //     "Simultaneously with the start of construction on the Aurora Center, work also began on Block 1, another mixed-use building overlooking the main square and the road leading to old Kiruna. These are the first residential buildings in the new town.",
  //   issuanceTime: "2019-06",
  //   type: DocumentType.MaterialEffect,
  //   stakeholders: [Stakeholder.Lkab],
  //   scale: { type: ScaleType.BlueprintsOrEffect },
  //   area: {
  //     include: [
  //       { latitude: 67.5052, longitude: 20.1798 },
  //       { latitude: 67.5056, longitude: 20.1805 },
  //       { latitude: 67.505, longitude: 20.1802 },
  //     ],
  //     exclude: [],
  //   },
  // },
  // {
  //   title: "Construction of Aurora Center begins",
  //   description:
  //     "Shortly after the construction of the Scandic hotel began, work on the Aurora Center also started, a multifunctional complex that includes the municipal library of Kiruna. The two buildings are close to each other and connected by a skywalk, just like in the old town center.",
  //   issuanceTime: "2019-05",
  //   type: DocumentType.MaterialEffect,
  //   stakeholders: [Stakeholder.Lkab],
  //   scale: { type: ScaleType.BlueprintsOrEffect },
  //   area: {
  //     include: [
  //       { latitude: 67.5055, longitude: 20.181 },
  //       { latitude: 67.506, longitude: 20.182 },
  //       { latitude: 67.5052, longitude: 20.1818 },
  //     ],
  //     exclude: [],
  //   },
  // },
  // {
  //   title: "Town Hall demolition",
  //   description:
  //     "After the construction of the new town hall was completed, the old building, nicknamed 'The Igloo,' was demolished. The only elements preserved were the door handles, a masterpiece of Sami art made of wood and bone, and the clock tower, which once stood on the roof of the old town hall. The clock tower was relocated to the central square of New Kiruna, in front of the new building.",
  //   issuanceTime: "2019-04",
  //   type: DocumentType.MaterialEffect,
  //   stakeholders: [Stakeholder.Lkab],
  //   scale: { type: ScaleType.BlueprintsOrEffect },
  //   area: {
  //     include: [
  //       { latitude: 67.5107, longitude: 20.1315 },
  //       { latitude: 67.5111, longitude: 20.1325 },
  //       { latitude: 67.5105, longitude: 20.132 },
  //     ],
  //     exclude: [],
  //   },
  // },
  // {
  //   title: "Construction of Scandic Hotel begins",
  //   description:
  //     "After two extensions of the land acquisition agreement, necessary because this document in Sweden is valid for only two years, construction of the hotel finally began in 2019.",
  //   issuanceTime: "2019-04",
  //   type: DocumentType.MaterialEffect,
  //   stakeholders: [Stakeholder.Lkab],
  //   scale: { type: ScaleType.BlueprintsOrEffect },
  //   area: {
  //     include: [
  //       { latitude: 67.5052, longitude: 20.1815 },
  //       { latitude: 67.5056, longitude: 20.182 },
  //       { latitude: 67.505, longitude: 20.1818 },
  //     ],
  //     exclude: [],
  //   },
  // },
  // {
  //   title: "Detail plan for square and commercial street",
  //   description:
  //     "This plan, approved in July 2016, is the first detailed plan to be implemented from the new masterplan (Adjusted development plan). The document defines the entire area near the town hall, comprising a total of 9 blocks known for their density. Among these are the 6 buildings that will face the main square. The functions are mixed, both public and private, with residential being prominent, as well as the possibility of incorporating accommodation facilities such as hotels. For all buildings in this plan, the only height limit is imposed by air traffic.",
  //   issuanceTime: "2016-06-22",
  //   type: DocumentType.Prescriptive,
  //   stakeholders: [Stakeholder.KirunaKommun],
  //   scale: { type: ScaleType.ArchitecturalScale, ratio: 1000 },
  //   area: {
  //     include: [
  //       { latitude: 67.849, longitude: 20.287 },
  //       { latitude: 67.8495, longitude: 20.288 },
  //       { latitude: 67.8485, longitude: 20.2875 },
  //     ],
  //     exclude: [],
  //   },
  // },
  // {
  //   title: "Adjusted development plan",
  //   description:
  //     "This document is the update of the Development Plan, one year after its creation, modifications are made to the general master plan, which is published under the name 'Adjusted Development Plan91,' and still represents the version used today after 10 years. Certainly, there are no drastic differences compared to the previous plan, but upon careful comparison, several modified elements stand out. For example, the central square now takes its final shape, as well as the large school complex just north of it, which appears for the first time.",
  //   issuanceTime: "2015",
  //   type: DocumentType.Design,
  //   stakeholders: [Stakeholder.KirunaKommun, Stakeholder.WhiteArkitekter],
  //   scale: { type: ScaleType.ArchitecturalScale, ratio: 100 },
  //   area: {
  //     include: [
  //       { latitude: 67.852, longitude: 20.294 },
  //       { latitude: 67.8525, longitude: 20.2955 },
  //       { latitude: 67.8518, longitude: 20.2945 },
  //     ],
  //     exclude: [],
  //   },
  // },
  // {
  //   title: "Deformation forecast",
  //   description:
  //     "The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The document is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project.",
  //   issuanceTime: "2014-12",
  //   type: DocumentType.Technical,
  //   stakeholders: [Stakeholder.Lkab],
  //   scale: { type: ScaleType.ArchitecturalScale, ratio: 1600 },
  //   area: {
  //     include: [
  //       { latitude: 67.8515, longitude: 20.228 },
  //       { latitude: 67.852, longitude: 20.23 },
  //       { latitude: 67.8505, longitude: 20.229 },
  //     ],
  //     exclude: [],
  //   },
  // },
  // {
  //   title: "Development Plan",
  //   description:
  //     "The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The document is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project.",
  //   issuanceTime: "2014-03",
  //   type: DocumentType.Design,
  //   stakeholders: [Stakeholder.KirunaKommun, Stakeholder.WhiteArkitekter],
  //   scale: { type: ScaleType.ArchitecturalScale, ratio: 2000 },
  //   area: {
  //     include: [
  //       { latitude: 67.8506, longitude: 20.304 },
  //       { latitude: 67.851, longitude: 20.306 },
  //       { latitude: 67.85, longitude: 20.305 },
  //     ],
  //     exclude: [],
  //   },
  // },
  // {
  //   title: "Detail plan for Bolagsomradet Gruvstadspark",
  //   description:
  //     "This is the first of 8 detailed plans located in the old center of Kiruna, aimed at transforming the residential areas into mining industry zones to allow the demolition of buildings. The area includes the town hall, the Ullspiran district, and the A10 highway, and it will be the first to be dismantled. The plan consists, like all detailed plans, of two documents: the area map that regulates it, and a text explaining the reasons that led to the drafting of the plan with these characteristics. The plan gained legal validity in 2012.",
  //   issuanceTime: "2010-10",
  //   type: DocumentType.Prescriptive,
  //   stakeholders: [Stakeholder.KirunaKommun],
  //   scale: { type: ScaleType.ArchitecturalScale, ratio: 1400 },
  //   area: {
  //     include: [
  //       { latitude: 67.8525, longitude: 20.2775 },
  //       { latitude: 67.8527, longitude: 20.2795 },
  //       { latitude: 67.8519, longitude: 20.278 },
  //     ],
  //     exclude: [],
  //   },
  // },
  // {
  //   title: "Compilation of responses “So what the people of Kiruna think?",
  //   description:
  //     "This document is a compilation of the responses to the survey 'What is your impression of Kiruna?' From the citizens' responses to this last part of the survey, it is evident that certain buildings, such as the Kiruna Church, the Hjalmar Lundbohmsgården, and the Town Hall, are considered of significant value to the population. The municipality views the experience of this survey positively, to the extent that over the years it will propose various consultation opportunities.",
  //   issuanceTime: "2007",
  //   type: DocumentType.Informative,
  //   stakeholders: [Stakeholder.KirunaKommun, Stakeholder.Residents],
  //   scale: { type: ScaleType.Text },
  //   area: {
  //     include: [
  //       { latitude: 67.8555, longitude: 20.225 },
  //       { latitude: 67.856, longitude: 20.2258 },
  //       { latitude: 67.8557, longitude: 20.2262 },
  //       { latitude: 67.8553, longitude: 20.2256 },
  //     ],
  //     exclude: [
  //       [
  //         { latitude: 67.8556, longitude: 20.2255 },
  //         { latitude: 67.8558, longitude: 20.2257 },
  //         { latitude: 67.8557, longitude: 20.2256 },
  //       ],
  //     ],
  //   },
  // },
  // {
  //   title: "Renewable Energy Initiative",
  //   description:
  //     "This document outlines Kiruna's efforts to shift to renewable energy sources, including solar and wind farms to meet urban energy demands.",
  //   issuanceTime: "2024-02",
  //   type: DocumentType.Technical,
  //   stakeholders: [Stakeholder.KirunaKommun, Stakeholder.Lkab],
  //   scale: { type: ScaleType.Text },
  //   area: {
  //     include: [
  //       { latitude: 67.856, longitude: 20.3115 },
  //       { latitude: 67.8565, longitude: 20.3125 },
  //       { latitude: 67.857, longitude: 20.3118 },
  //       { latitude: 67.8563, longitude: 20.3112 },
  //     ],
  //     exclude: [
  //       [
  //         { latitude: 67.8562, longitude: 20.3116 },
  //         { latitude: 67.8564, longitude: 20.3119 },
  //         { latitude: 67.8563, longitude: 20.3117 },
  //       ],
  //     ],
  //   },
  // },
  // {
  //   title: "Construction of Hospital Complex",
  //   description:
  //     "The hospital complex includes advanced medical facilities, emergency care, and green building features to serve the relocated population.",
  //   issuanceTime: "2023-11",
  //   type: DocumentType.MaterialEffect,
  //   stakeholders: [Stakeholder.KirunaKommun],
  //   scale: { type: ScaleType.ArchitecturalScale, ratio: 400 },
  //   area: {
  //     include: [
  //       { latitude: 67.8572, longitude: 20.3165 },
  //       { latitude: 67.8576, longitude: 20.318 },
  //       { latitude: 67.858, longitude: 20.3175 },
  //       { latitude: 67.8574, longitude: 20.3168 },
  //     ],
  //     exclude: [
  //       [
  //         { latitude: 67.8574, longitude: 20.317 },
  //         { latitude: 67.8575, longitude: 20.3174 },
  //         { latitude: 67.8573, longitude: 20.3173 },
  //       ],
  //     ],
  //   },
  // },
  // {
  //   title: "Public Consultation Summary",
  //   description:
  //     "This document summarizes feedback gathered from residents regarding the urban transformation plans and future projects.",
  //   issuanceTime: "2022-03",
  //   type: DocumentType.Informative,
  //   stakeholders: [Stakeholder.Residents, Stakeholder.KirunaKommun],
  //   scale: { type: ScaleType.Text },
  //   area: {
  //     include: [
  //       { latitude: 67.8523, longitude: 20.3035 },
  //       { latitude: 67.853, longitude: 20.3055 },
  //       { latitude: 67.8527, longitude: 20.306 },
  //       { latitude: 67.852, longitude: 20.304 },
  //     ],
  //     exclude: [
  //       [
  //         { latitude: 67.8524, longitude: 20.3042 },
  //         { latitude: 67.8526, longitude: 20.3048 },
  //         { latitude: 67.8525, longitude: 20.305 },
  //         { latitude: 67.8523, longitude: 20.3045 },
  //       ],
  //     ],
  //   },
  // },
  // {
  //   title: "Railway Realignment Proposal",
  //   description:
  //     "A detailed proposal for realigning the railway infrastructure to facilitate better transportation access and minimize disruption.",
  //   issuanceTime: "2024-05",
  //   type: DocumentType.Design,
  //   stakeholders: [Stakeholder.Lkab, Stakeholder.KirunaKommun],
  //   scale: { type: ScaleType.BlueprintsOrEffect },
  //   area: {
  //     include: [
  //       { latitude: 67.8598, longitude: 20.3195 },
  //       { latitude: 67.8606, longitude: 20.321 },
  //       { latitude: 67.8604, longitude: 20.322 },
  //       { latitude: 67.8596, longitude: 20.3215 },
  //       { latitude: 67.8598, longitude: 20.3195 },
  //     ],
  //     exclude: [
  //       [
  //         { latitude: 67.86, longitude: 20.32 },
  //         { latitude: 67.8603, longitude: 20.3206 },
  //         { latitude: 67.8601, longitude: 20.3208 },
  //         { latitude: 67.86, longitude: 20.32 },
  //       ],
  //     ],
  //   },
  // },
  // {
  //   title: "New Residential Block Design",
  //   description:
  //     "This document provides the architectural blueprint for a new residential area with integrated public spaces and amenities.",
  //   issuanceTime: "2023-08",
  //   type: DocumentType.Design,
  //   stakeholders: [Stakeholder.WhiteArkitekter, Stakeholder.KirunaKommun],
  //   scale: { type: ScaleType.ArchitecturalScale, ratio: 500 },
  //   area: {
  //     include: [
  //       { latitude: 67.8555, longitude: 20.2988 },
  //       { latitude: 67.856, longitude: 20.3005 },
  //       { latitude: 67.8552, longitude: 20.3008 },
  //       { latitude: 67.8549, longitude: 20.2995 },
  //       { latitude: 67.8555, longitude: 20.2988 },
  //     ],
  //     exclude: [
  //       [
  //         { latitude: 67.8554, longitude: 20.2993 },
  //         { latitude: 67.8556, longitude: 20.2996 },
  //         { latitude: 67.8553, longitude: 20.2997 },
  //         { latitude: 67.8554, longitude: 20.2993 },
  //       ],
  //     ],
  //   },
  // },
  // {
  //   title: "Biodiversity Preservation Plan",
  //   description:
  //     "Guidelines for protecting biodiversity in Kiruna's green areas during urban and mining developments.",
  //   issuanceTime: "2021-10",
  //   type: DocumentType.Prescriptive,
  //   stakeholders: [Stakeholder.KirunaKommun],
  //   scale: { type: ScaleType.Text },
  //   area: {
  //     include: [
  //       { latitude: 67.8515, longitude: 20.2825 },
  //       { latitude: 67.852, longitude: 20.284 },
  //       { latitude: 67.851, longitude: 20.2845 },
  //       { latitude: 67.8505, longitude: 20.283 },
  //       { latitude: 67.8515, longitude: 20.2825 },
  //     ],
  //     exclude: [
  //       [
  //         { latitude: 67.8513, longitude: 20.283 },
  //         { latitude: 67.8516, longitude: 20.2833 },
  //         { latitude: 67.8514, longitude: 20.2835 },
  //         { latitude: 67.8513, longitude: 20.283 },
  //       ],
  //     ],
  //   },
  // },
  // {
  //   title: "Sustainable Water Management Report",
  //   description:
  //     "A technical analysis of sustainable water resource management, including new drainage systems for the relocated city.",
  //   issuanceTime: "2022-06",
  //   type: DocumentType.Technical,
  //   stakeholders: [Stakeholder.KirunaKommun],
  //   scale: { type: ScaleType.BlueprintsOrEffect },
  //   area: {
  //     include: [
  //       { latitude: 67.8485, longitude: 20.2905 },
  //       { latitude: 67.8498, longitude: 20.292 },
  //       { latitude: 67.849, longitude: 20.293 },
  //       { latitude: 67.8478, longitude: 20.2915 },
  //       { latitude: 67.8485, longitude: 20.2905 },
  //     ],
  //     exclude: [
  //       [
  //         { latitude: 67.8489, longitude: 20.291 },
  //         { latitude: 67.8492, longitude: 20.2913 },
  //         { latitude: 67.849, longitude: 20.2915 },
  //         { latitude: 67.8489, longitude: 20.291 },
  //       ],
  //     ],
  //   },
  // },
  // {
  //   title: "New Cultural Center Construction",
  //   description:
  //     "This document marks the beginning of the cultural center's construction, housing exhibition spaces and public event areas.",
  //   issuanceTime: "2024-04",
  //   type: DocumentType.MaterialEffect,
  //   stakeholders: [Stakeholder.Lkab],
  //   scale: { type: ScaleType.ArchitecturalScale, ratio: 600 },
  //   area: {
  //     include: [
  //       { latitude: 67.8565, longitude: 20.2945 },
  //       { latitude: 67.857, longitude: 20.296 },
  //       { latitude: 67.8562, longitude: 20.297 },
  //       { latitude: 67.8558, longitude: 20.2958 },
  //       { latitude: 67.8565, longitude: 20.2945 },
  //     ],
  //     exclude: [
  //       [
  //         { latitude: 67.8566, longitude: 20.2952 },
  //         { latitude: 67.8568, longitude: 20.2954 },
  //         { latitude: 67.8567, longitude: 20.295 },
  //         { latitude: 67.8566, longitude: 20.2952 },
  //       ],
  //     ],
  //   },
  // },
  // {
  //40
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
        { latitude: 67.85040290496156, longitude: 20.22620590795398 },
        { latitude: 67.85143841523734, longitude: 20.225819669855834 },
        { latitude: 67.85174582349991, longitude: 20.22740753759265 },
        { latitude: 67.85270038122525, longitude: 20.229553304804565 },
        { latitude: 67.85295923760278, longitude: 20.23268612493396 },
        { latitude: 67.85206940676726, longitude: 20.234788976801635 },
        { latitude: 67.85181054051256, longitude: 20.237320982111694 },
        { latitude: 67.84985277142708, longitude: 20.23470314611316 },
        { latitude: 67.84933498683509, longitude: 20.232771955622436 },
        { latitude: 67.8494482531968, longitude: 20.22745045293689 },
      ],
      exclude: [
        [
          { latitude: 67.85118531146645, longitude: 20.229882825932627 },
          { latitude: 67.8506271063625, longitude: 20.233358968815928 },
          { latitude: 67.85202663884309, longitude: 20.23408852966798 },
          { latitude: 67.85263334648099, longitude: 20.230354894719248 },
        ],
      ],
    },
  },
  //41
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
        { latitude: 67.84987665152228, longitude: 20.182680432329402 },
        { latitude: 67.8562185734983, longitude: 20.19499713612579 },
        { latitude: 67.8555715176158, longitude: 20.19748622609161 },
        { latitude: 67.8544876587844, longitude: 20.197099987993465 },
        { latitude: 67.85223889544942, longitude: 20.197314564714656 },
        { latitude: 67.85037824387096, longitude: 20.197400395403132 },
        { latitude: 67.8490676088743, longitude: 20.198559109697566 },
        { latitude: 67.84764362565288, longitude: 20.197572056780086 },
        { latitude: 67.84714197449387, longitude: 20.193538014421687 },
        { latitude: 67.84986047094434, longitude: 20.183109585771785 },
      ],
      exclude: [
        [
          { latitude: 67.85189712845792, longitude: 20.19039244927797 },
          { latitude: 67.85063511900312, longitude: 20.19185157098207 },
          { latitude: 67.85121759339106, longitude: 20.194769814390273 },
          { latitude: 67.85225306749581, longitude: 20.19335360803041 },
          { latitude: 67.85181623246439, longitude: 20.191465332883926 },
          { latitude: 67.85204274053912, longitude: 20.190950348753066 },
          { latitude: 67.85201038237741, longitude: 20.190478279966445 },
        ],
      ],
    },
  },
  //42
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
        { latitude: 67.85452760216266, longitude: 20.262670359239685 },
        { latitude: 67.85472981810761, longitude: 20.263635954485046 },
        { latitude: 67.85472981810761, longitude: 20.264901957140076 },
        { latitude: 67.85479452683971, longitude: 20.26556714497577 },
        { latitude: 67.85461657739448, longitude: 20.26606067143451 },
        { latitude: 67.85421214178677, longitude: 20.266146502122986 },
        { latitude: 67.85352458515524, longitude: 20.266146502122986 },
        { latitude: 67.85324955682633, longitude: 20.2652667375661 },
        { latitude: 67.85263477589172, longitude: 20.264966330156433 },
        { latitude: 67.85273184764306, longitude: 20.264344057664978 },
        { latitude: 67.85282082972685, longitude: 20.26256307087909 },
        { latitude: 67.8531120414455, longitude: 20.261683306322205 },
        { latitude: 67.85414743143862, longitude: 20.261661848650085 },
      ],
      exclude: [
        [
          { latitude: 67.85292850101874, longitude: 20.26257197647095 },
          { latitude: 67.85287996560285, longitude: 20.26390235214234 },
          { latitude: 67.85314690914021, longitude: 20.26388089447022 },
          { latitude: 67.85319544400053, longitude: 20.262529061126713 },
        ],
      ],
    },
  },
  //43
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
        { latitude: 67.8499868054724, longitude: 20.268718544002382 },
        { latitude: 67.85086053588583, longitude: 20.271121803279726 },
        { latitude: 67.85042367477058, longitude: 20.277473274226992 },
        { latitude: 67.84929103377051, longitude: 20.276915374751894 },
        { latitude: 67.84909686121918, longitude: 20.275070014949648 },
        { latitude: 67.84932339570527, longitude: 20.269834342952578 },
      ],
      exclude: [
        [
          { latitude: 67.84995097181232, longitude: 20.27321487669084 },
          { latitude: 67.8499833328314, longitude: 20.274116098919844 },
          { latitude: 67.85016940781985, longitude: 20.274062454739546 },
          { latitude: 67.8502867152018, longitude: 20.27442723516557 },
          { latitude: 67.85022199396057, longitude: 20.275038778820967 },
          { latitude: 67.85036357144249, longitude: 20.27522116903398 },
          { latitude: 67.85042020219461, longitude: 20.2741804719362 },
          { latitude: 67.85052941825681, longitude: 20.271905958691573 },
          { latitude: 67.8501734529118, longitude: 20.271594822445845 },
          { latitude: 67.85008041561927, longitude: 20.272925198117232 },
        ],
      ],
    },
  },
  //44
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
        { latitude: 67.84962565527675, longitude: 20.245489935811296 },
        { latitude: 67.8494153046243, longitude: 20.246777396138445 },
        { latitude: 67.8483473412781, longitude: 20.24810777180983 },
        { latitude: 67.84736024076348, longitude: 20.244030814107195 },
        { latitude: 67.84915640890931, longitude: 20.24192796223952 },
      ],
      exclude: [
        [
          { latitude: 67.84859349239242, longitude: 20.245099246720336 },
          { latitude: 67.84824558835413, longitude: 20.245807349900268 },
          { latitude: 67.84842763181209, longitude: 20.246440351227783 },
          { latitude: 67.84871080770053, longitude: 20.24554985783484 },
        ],
      ],
    },
  },
  //45
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
        { latitude: 67.84494057849872, longitude: 20.278526003663536 },
        { latitude: 67.84615434666841, longitude: 20.2834183529067 },
        { latitude: 67.84678548115987, longitude: 20.287280733888146 },
        { latitude: 67.8460248810724, longitude: 20.288053210084435 },
        { latitude: 67.84581449794646, longitude: 20.28719490319967 },
        { latitude: 67.84524807240771, longitude: 20.28788154870748 },
        { latitude: 67.84424465626532, longitude: 20.285049135987755 },
        { latitude: 67.84508623401348, longitude: 20.28371876031637 },
        { latitude: 67.84382385600681, longitude: 20.278740580384728 },
        { latitude: 67.84485965837538, longitude: 20.27698105127096 },
      ],
      exclude: [
        [
          { latitude: 67.84627744626354, longitude: 20.28487004156938 },
          { latitude: 67.84569484849759, longitude: 20.282230747898726 },
          { latitude: 67.8450272706701, longitude: 20.283271444996505 },
          { latitude: 67.84566652740203, longitude: 20.285814179142623 },
          { latitude: 67.84626935472755, longitude: 20.284945143421798 },
        ],
      ],
    },
  },
  //46
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
        { latitude: 67.84707709867558, longitude: 20.264701576459107 },
        { latitude: 67.84591192853563, longitude: 20.26459428809851 },
        { latitude: 67.84582292009063, longitude: 20.258242817151245 },
        { latitude: 67.84583910346952, longitude: 20.256719322430786 },
        { latitude: 67.84652688669507, longitude: 20.25590393089026 },
        { latitude: 67.84684245103571, longitude: 20.257191391217408 },
        { latitude: 67.84710137243465, longitude: 20.2578565790531 },
      ],
      exclude: [
        [
          { latitude: 67.84686825711366, longitude: 20.25811782855961 },
          { latitude: 67.84627353680196, longitude: 20.25811782855961 },
          { latitude: 67.84629376563306, longitude: 20.25982371349308 },
          { latitude: 67.84690062240988, longitude: 20.25983444232914 },
        ],
      ],
    },
  },
  //47
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
        { latitude: 67.85007965050973, longitude: 20.30067266259144 },
        { latitude: 67.85078348865999, longitude: 20.30374110970448 },
        { latitude: 67.85127697170745, longitude: 20.30644477639149 },
        { latitude: 67.85045988755056, longitude: 20.307775152062877 },
        { latitude: 67.84936770065772, longitude: 20.30923427376698 },
        { latitude: 67.84914116660194, longitude: 20.30747474465321 },
        { latitude: 67.84878518006902, longitude: 20.30419172081898 },
        { latitude: 67.84828355345998, longitude: 20.30367673668812 },
        { latitude: 67.84828355345998, longitude: 20.300071847772106 },
        { latitude: 67.84841300652086, longitude: 20.29749692711781 },
        { latitude: 67.84925443390486, longitude: 20.297668588494762 },
      ],
      exclude: [
        [
          { latitude: 67.84939728586292, longitude: 20.30329863815308 },
          { latitude: 67.84882690199171, longitude: 20.304253504562382 },
          { latitude: 67.84909389192316, longitude: 20.305691168594365 },
          { latitude: 67.84995552040104, longitude: 20.304392979431157 },
          { latitude: 67.85054205678951, longitude: 20.303234265136723 },
          { latitude: 67.85031148907215, longitude: 20.302000448989872 },
        ],
      ],
    },
  },
  //48
  {
    title: "ok - Green Rooftop Initiative",
    description:
      "A design plan promoting the construction of green rooftops on public and residential buildings to improve urban air quality and energy efficiency.",
    issuanceTime: "2024-07",
    type: DocumentType.Design,
    stakeholders: [Stakeholder.WhiteArkitekter, Stakeholder.KirunaKommun],
    scale: { type: ScaleType.ArchitecturalScale, ratio: 200 },
    area: {
      include: [
        { latitude: 67.85007965050973, longitude: 20.30067266259144 },
        { latitude: 67.85078348865999, longitude: 20.30374110970448 },
        { latitude: 67.85127697170745, longitude: 20.30644477639149 },
        { latitude: 67.85045988755056, longitude: 20.307775152062877 },
        { latitude: 67.84936770065772, longitude: 20.30923427376698 },
        { latitude: 67.84914116660194, longitude: 20.30747474465321 },
        { latitude: 67.84878518006902, longitude: 20.30419172081898 },
        { latitude: 67.84828355345998, longitude: 20.30367673668812 },
        { latitude: 67.84828355345998, longitude: 20.300071847772106 },
        { latitude: 67.84841300652086, longitude: 20.29749692711781 },
        { latitude: 67.84925443390486, longitude: 20.297668588494762 },
      ],
      exclude: [
        [
          { latitude: 67.84939728586292, longitude: 20.30329863815308 },
          { latitude: 67.84882690199171, longitude: 20.304253504562382 },
          { latitude: 67.84909389192316, longitude: 20.305691168594365 },
          { latitude: 67.84995552040104, longitude: 20.304392979431157 },
          { latitude: 67.85054205678951, longitude: 20.303234265136723 },
          { latitude: 67.85031148907215, longitude: 20.302000448989872 },
        ],
      ],
    },
  },
  //49
  {
    title: "ok - Renewable Energy Storage Report",
    description:
      "A technical document analyzing energy storage solutions, including battery systems, to support the city's transition to renewable energy sources.",
    issuanceTime: "2023-10",
    type: DocumentType.Technical,
    stakeholders: [Stakeholder.Lkab],
    scale: { type: ScaleType.Text },
    area: {
      include: [
        { latitude: 67.85653094347411, longitude: 20.22260423897432 },
        { latitude: 67.85740442873059, longitude: 20.222990477072464 },
        { latitude: 67.85771175835312, longitude: 20.2235912918918 },
        { latitude: 67.85716179721962, longitude: 20.226423704611527 },
        { latitude: 67.8568544603476, longitude: 20.228912794577347 },
        { latitude: 67.85742060407489, longitude: 20.229256117331254 },
        { latitude: 67.85740442873059, longitude: 20.229942762839066 },
        { latitude: 67.85615889352012, longitude: 20.231959784018265 },
        { latitude: 67.85497799999416, longitude: 20.233933889853226 },
        { latitude: 67.85465445708404, longitude: 20.23084398506807 },
        { latitude: 67.85484858336883, longitude: 20.227539503561722 },
        { latitude: 67.85518830047843, longitude: 20.225973093497025 },
        { latitude: 67.85547139428904, longitude: 20.22412773369478 },
        { latitude: 67.85572213165108, longitude: 20.222754442679154 },
      ],
      exclude: [
        [
          { latitude: 67.85571472847796, longitude: 20.226416403669557 },
          { latitude: 67.8552375161909, longitude: 20.226201826948365 },
          { latitude: 67.85510001253297, longitude: 20.227017218488893 },
          { latitude: 67.85490588834138, longitude: 20.227939898390016 },
          { latitude: 67.85536693065762, longitude: 20.228218848127565 },
          { latitude: 67.85601399221748, longitude: 20.22834759416028 },
          { latitude: 67.85611913802492, longitude: 20.226695353407106 },
        ],
      ],
    },
  },
  {
    //50
    title: "ok - Winter Safety Infrastructure Plan",
    description:
      "A prescriptive plan addressing winter safety in Kiruna through improved snow removal techniques, heated pedestrian paths, and anti-slip road materials.",
    issuanceTime: "2024-01",
    type: DocumentType.Prescriptive,
    stakeholders: [Stakeholder.KirunaKommun],
    scale: { type: ScaleType.BlueprintsOrEffect },
    area: {
      include: [
        { latitude: 67.85406978031554, longitude: 20.27381399495136 },
        { latitude: 67.85341457574474, longitude: 20.274650844164007 },
        { latitude: 67.85268654907459, longitude: 20.275680812425726 },
        { latitude: 67.8526299238254, longitude: 20.273191722459906 },
        { latitude: 67.85268654907459, longitude: 20.27130344731342 },
        { latitude: 67.85368151316251, longitude: 20.27108887059223 },
        { latitude: 67.85453892783366, longitude: 20.271432193346136 },
        { latitude: 67.85472496647725, longitude: 20.27332046849262 },
      ],
      exclude: [
        [
          { latitude: 67.85337371339556, longitude: 20.27273432213429 },
          { latitude: 67.8527023106606, longitude: 20.272863068167005 },
          { latitude: 67.85272657856605, longitude: 20.27372137505177 },
          { latitude: 67.853365624321, longitude: 20.273420967642103 },
        ],
      ],
    },
  },
];
