// Auto-generated from Engineering Services EN.xlsx

export type ProviderType = "engineering_office" | "specialized_office" | "office_or_individual" | "office_or_insurer";

export interface ServicePackage { slug: string; name: string; description: string; categories: string; }
export interface ServiceCategory { name: string; count: number; }
export interface EngineeringService { id: number; name: string; category: string; provider: string; provider_type: ProviderType; packages: string[]; }

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    "slug": "build-my-villa",
    "name": "Build My Villa",
    "description": "End-to-end path from design to villa handover with supervision",
    "categories": "Design + Permits + Supervision + Inspections + Insurance"
  },
  {
    "slug": "design-to-permit",
    "name": "Design to Permit",
    "description": "Integrated design package ending in a building permit",
    "categories": "Design + Permits + Surveying"
  },
  {
    "slug": "fast-permit",
    "name": "Fast Permit",
    "description": "Quick building-permit issuance on a ready design",
    "categories": "Permits"
  },
  {
    "slug": "renovate-&-expand",
    "name": "Renovate & Expand",
    "description": "Renovate or extend an existing building with required approvals",
    "categories": "Interior design + Renovation/demolition permits + Inspections"
  },
  {
    "slug": "legalize-my-building",
    "name": "Legalize My Building",
    "description": "Regularize a non-compliant building and correct its status",
    "categories": "Surveying + Permit amendment + Safety reports"
  },
  {
    "slug": "design-studio",
    "name": "Design Studio",
    "description": "Interior/architectural design and visual experience services",
    "categories": "Interior + Architectural + Automation + Sustainability"
  }
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    "name": "Design",
    "count": 30
  },
  {
    "name": "Permits & Licensing",
    "count": 19
  },
  {
    "name": "Surveying & Land",
    "count": 11
  },
  {
    "name": "Supervision & Project Management",
    "count": 14
  },
  {
    "name": "Inspections & Technical Reports",
    "count": 15
  },
  {
    "name": "MEP & Specialized Systems",
    "count": 14
  },
  {
    "name": "Insurance & Compliance",
    "count": 9
  },
  {
    "name": "Engineering Studies",
    "count": 22
  },
  {
    "name": "Operations, Maintenance & Facility Management",
    "count": 5
  },
  {
    "name": "Advisory & Engineering Arbitration",
    "count": 8
  }
];

export const ENGINEERING_SERVICES: EngineeringService[] = [
  {
    "id": 1,
    "name": "Concept / schematic design",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Design to Permit",
      "Design Studio"
    ]
  },
  {
    "id": 2,
    "name": "Architectural design",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Design to Permit",
      "Design Studio"
    ]
  },
  {
    "id": 3,
    "name": "Facade design",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Design Studio"
    ]
  },
  {
    "id": 4,
    "name": "Working drawings",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Design to Permit"
    ]
  },
  {
    "id": 5,
    "name": "Structural design",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Design to Permit"
    ]
  },
  {
    "id": 6,
    "name": "Electrical systems design",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Design to Permit"
    ]
  },
  {
    "id": 7,
    "name": "Plumbing, drainage & water-supply design",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Design to Permit"
    ]
  },
  {
    "id": 8,
    "name": "Interior design & décor",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Renovate & Expand",
      "Design Studio"
    ]
  },
  {
    "id": 9,
    "name": "Landscape design",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Design Studio"
    ]
  },
  {
    "id": 10,
    "name": "Lighting design",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Design Studio"
    ]
  },
  {
    "id": 11,
    "name": "Acoustic design",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Design Studio",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 12,
    "name": "Kitchen & cabinetry design",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Renovate & Expand",
      "Design Studio"
    ]
  },
  {
    "id": 13,
    "name": "Furniture & joinery design",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Design Studio"
    ]
  },
  {
    "id": 14,
    "name": "Swimming-pool design",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Design Studio",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 15,
    "name": "3D architectural rendering",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Design to Permit",
      "Design Studio"
    ]
  },
  {
    "id": 16,
    "name": "BIM modeling & quantity take-off",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 17,
    "name": "Value engineering",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 18,
    "name": "Shop-drawings review",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 19,
    "name": "As-built drawings",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Legalize My Building"
    ]
  },
  {
    "id": 20,
    "name": "Deep foundations & piling design",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa"
    ]
  },
  {
    "id": 21,
    "name": "Shoring / excavation-support design",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa"
    ]
  },
  {
    "id": 22,
    "name": "Retaining-wall design",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa"
    ]
  },
  {
    "id": 23,
    "name": "Dewatering design",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa"
    ]
  },
  {
    "id": 24,
    "name": "Roads & internal pavement design",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 25,
    "name": "Site infrastructure design",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 26,
    "name": "External water & sewage network design",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 27,
    "name": "Street-lighting design",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 28,
    "name": "Heritage building restoration design",
    "category": "Design",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Renovate & Expand",
      "Legalize My Building",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 29,
    "name": "Digital twin of the building",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 30,
    "name": "Virtual walkthroughs (VR/AR)",
    "category": "Design",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Design Studio",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 31,
    "name": "Building permit issuance (Balady)",
    "category": "Permits & Licensing",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Build My Villa",
      "Design to Permit",
      "Fast Permit"
    ]
  },
  {
    "id": 32,
    "name": "Demolition permit",
    "category": "Permits & Licensing",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Renovate & Expand",
      "Legalize My Building"
    ]
  },
  {
    "id": 33,
    "name": "Fencing permit",
    "category": "Permits & Licensing",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 34,
    "name": "Renovation & modification permit",
    "category": "Permits & Licensing",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Renovate & Expand"
    ]
  },
  {
    "id": 35,
    "name": "Excavation permit",
    "category": "Permits & Licensing",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 36,
    "name": "Construction completion certificate",
    "category": "Permits & Licensing",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Build My Villa"
    ]
  },
  {
    "id": 37,
    "name": "Permit amendment / renewal",
    "category": "Permits & Licensing",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Legalize My Building"
    ]
  },
  {
    "id": 38,
    "name": "Change of use (residential/commercial)",
    "category": "Permits & Licensing",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Legalize My Building",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 39,
    "name": "Signage & advertising permits",
    "category": "Permits & Licensing",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 40,
    "name": "Utility connection permits (power/water)",
    "category": "Permits & Licensing",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 41,
    "name": "Civil Defense (safety) approval",
    "category": "Permits & Licensing",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 42,
    "name": "Environmental permits",
    "category": "Permits & Licensing",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 43,
    "name": "Subdivision approval / plot sketch",
    "category": "Permits & Licensing",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 44,
    "name": "Sidewalk-cut / road-occupancy permit",
    "category": "Permits & Licensing",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 45,
    "name": "Objections & exemptions handling",
    "category": "Permits & Licensing",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Legalize My Building",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 46,
    "name": "GACA height clearance",
    "category": "Permits & Licensing",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 47,
    "name": "Heritage Commission approval",
    "category": "Permits & Licensing",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Renovate & Expand",
      "Legalize My Building",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 48,
    "name": "Drawing attestation & stamping",
    "category": "Permits & Licensing",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Build My Villa",
      "Design to Permit",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 49,
    "name": "No-objection certificate (NOC)",
    "category": "Permits & Licensing",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 50,
    "name": "Topographic survey",
    "category": "Surveying & Land",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Design to Permit"
    ]
  },
  {
    "id": 51,
    "name": "Coordinates & boundary determination",
    "category": "Surveying & Land",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Legalize My Building"
    ]
  },
  {
    "id": 52,
    "name": "Setbacks & levels determination",
    "category": "Surveying & Land",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Design to Permit"
    ]
  },
  {
    "id": 53,
    "name": "Deed transfer / merge / subdivision",
    "category": "Surveying & Land",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 54,
    "name": "Cadastral survey",
    "category": "Surveying & Land",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Legalize My Building",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 55,
    "name": "Verification survey of buildings",
    "category": "Surveying & Land",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Legalize My Building"
    ]
  },
  {
    "id": 56,
    "name": "Earthwork (cut & fill) calculations",
    "category": "Surveying & Land",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 57,
    "name": "Aerial (drone) survey",
    "category": "Surveying & Land",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 58,
    "name": "Deed-correction support",
    "category": "Surveying & Land",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Legalize My Building",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 59,
    "name": "GIS services",
    "category": "Surveying & Land",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 60,
    "name": "3D laser scanning (Scan-to-BIM)",
    "category": "Surveying & Land",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Legalize My Building",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 61,
    "name": "Construction supervision",
    "category": "Supervision & Project Management",
    "provider": "Engineering office",
    "provider_type": "engineering_office",
    "packages": [
      "Build My Villa"
    ]
  },
  {
    "id": 62,
    "name": "Construction project management (PM)",
    "category": "Supervision & Project Management",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa"
    ]
  },
  {
    "id": 63,
    "name": "Resident engineer",
    "category": "Supervision & Project Management",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa"
    ]
  },
  {
    "id": 64,
    "name": "Quality control & compliance",
    "category": "Supervision & Project Management",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa"
    ]
  },
  {
    "id": 65,
    "name": "Quantity surveying (QS)",
    "category": "Supervision & Project Management",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Design to Permit",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 66,
    "name": "Contract management & contractor follow-up",
    "category": "Supervision & Project Management",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa"
    ]
  },
  {
    "id": 67,
    "name": "Scheduling & planning",
    "category": "Supervision & Project Management",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 68,
    "name": "Tender management & contractor selection",
    "category": "Supervision & Project Management",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 69,
    "name": "Site safety supervision",
    "category": "Supervision & Project Management",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Build My Villa"
    ]
  },
  {
    "id": 70,
    "name": "Handover & snagging inspection",
    "category": "Supervision & Project Management",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Renovate & Expand"
    ]
  },
  {
    "id": 71,
    "name": "Periodic progress reports",
    "category": "Supervision & Project Management",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa"
    ]
  },
  {
    "id": 72,
    "name": "Commissioning",
    "category": "Supervision & Project Management",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Build My Villa"
    ]
  },
  {
    "id": 73,
    "name": "O&M manuals preparation",
    "category": "Supervision & Project Management",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 74,
    "name": "Tender documents & BoQ preparation",
    "category": "Supervision & Project Management",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Design to Permit",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 75,
    "name": "Soil investigation & geotechnical boring",
    "category": "Inspections & Technical Reports",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Build My Villa",
      "Design to Permit"
    ]
  },
  {
    "id": 76,
    "name": "Concrete & materials testing",
    "category": "Inspections & Technical Reports",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Build My Villa"
    ]
  },
  {
    "id": 77,
    "name": "Non-destructive testing (NDT)",
    "category": "Inspections & Technical Reports",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Legalize My Building",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 78,
    "name": "Structural safety assessment",
    "category": "Inspections & Technical Reports",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Renovate & Expand",
      "Legalize My Building"
    ]
  },
  {
    "id": 79,
    "name": "Retrofit / strengthening assessment",
    "category": "Inspections & Technical Reports",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Renovate & Expand",
      "Legalize My Building"
    ]
  },
  {
    "id": 80,
    "name": "Crack & settlement monitoring",
    "category": "Inspections & Technical Reports",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Legalize My Building",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 81,
    "name": "Leak & waterproofing detection",
    "category": "Inspections & Technical Reports",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Renovate & Expand",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 82,
    "name": "Thermal imaging",
    "category": "Inspections & Technical Reports",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 83,
    "name": "Pre-purchase property inspection",
    "category": "Inspections & Technical Reports",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 84,
    "name": "Facade inspection",
    "category": "Inspections & Technical Reports",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 85,
    "name": "Periodic elevator inspection",
    "category": "Inspections & Technical Reports",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 86,
    "name": "Fire & safety systems inspection",
    "category": "Inspections & Technical Reports",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 87,
    "name": "Technical damage / dispute reports (expert)",
    "category": "Inspections & Technical Reports",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 88,
    "name": "Energy audit",
    "category": "Inspections & Technical Reports",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 89,
    "name": "Asset condition assessment",
    "category": "Inspections & Technical Reports",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Renovate & Expand",
      "Legalize My Building",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 90,
    "name": "HVAC design",
    "category": "MEP & Specialized Systems",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Design Studio"
    ]
  },
  {
    "id": 91,
    "name": "Central AC systems",
    "category": "MEP & Specialized Systems",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Design Studio"
    ]
  },
  {
    "id": 92,
    "name": "Fire-fighting & safety systems design",
    "category": "MEP & Specialized Systems",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Build My Villa"
    ]
  },
  {
    "id": 93,
    "name": "Electrical load studies & connection",
    "category": "MEP & Specialized Systems",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa"
    ]
  },
  {
    "id": 94,
    "name": "Solar energy systems",
    "category": "MEP & Specialized Systems",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 95,
    "name": "Generators & backup power",
    "category": "MEP & Specialized Systems",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 96,
    "name": "Extra-low-voltage (ELV) systems",
    "category": "MEP & Specialized Systems",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Design Studio"
    ]
  },
  {
    "id": 97,
    "name": "Surveillance & security systems (CCTV)",
    "category": "MEP & Specialized Systems",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Design Studio",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 98,
    "name": "Automation & smart building (BMS)",
    "category": "MEP & Specialized Systems",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Design Studio",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 99,
    "name": "Elevators & vertical-transport engineering",
    "category": "MEP & Specialized Systems",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 100,
    "name": "Water-treatment systems",
    "category": "MEP & Specialized Systems",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 101,
    "name": "Irrigation systems",
    "category": "MEP & Specialized Systems",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Design Studio",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 102,
    "name": "Central gas systems",
    "category": "MEP & Specialized Systems",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 103,
    "name": "Pumping & sewage-treatment stations",
    "category": "MEP & Specialized Systems",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 104,
    "name": "Latent-defects insurance",
    "category": "Insurance & Compliance",
    "provider": "Office / insurer",
    "provider_type": "office_or_insurer",
    "packages": [
      "Build My Villa"
    ]
  },
  {
    "id": 105,
    "name": "Contractor all-risks insurance (CAR)",
    "category": "Insurance & Compliance",
    "provider": "Office / insurer",
    "provider_type": "office_or_insurer",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 106,
    "name": "Saudi Building Code (SBC) compliance check",
    "category": "Insurance & Compliance",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Design to Permit"
    ]
  },
  {
    "id": 107,
    "name": "Green building certification (Mostadam)",
    "category": "Insurance & Compliance",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Design Studio",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 108,
    "name": "LEED consultancy",
    "category": "Insurance & Compliance",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 109,
    "name": "Sustainability & energy-efficiency consulting",
    "category": "Insurance & Compliance",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Design Studio",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 110,
    "name": "Universal accessibility compliance",
    "category": "Insurance & Compliance",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 111,
    "name": "Municipal compliance audit",
    "category": "Insurance & Compliance",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Legalize My Building",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 112,
    "name": "Warranties & handover documentation",
    "category": "Insurance & Compliance",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa"
    ]
  },
  {
    "id": 113,
    "name": "Economic feasibility study",
    "category": "Engineering Studies",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 114,
    "name": "Technical feasibility study",
    "category": "Engineering Studies",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 115,
    "name": "Highest & best use study",
    "category": "Engineering Studies",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 116,
    "name": "Site-selection study",
    "category": "Engineering Studies",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 117,
    "name": "Project brief & pre-design study",
    "category": "Engineering Studies",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Design to Permit",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 118,
    "name": "Geotechnical & soil-mechanics study",
    "category": "Engineering Studies",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Build My Villa",
      "Design to Permit"
    ]
  },
  {
    "id": 119,
    "name": "Structural analysis study",
    "category": "Engineering Studies",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Design to Permit"
    ]
  },
  {
    "id": 120,
    "name": "Seismic study",
    "category": "Engineering Studies",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 121,
    "name": "Thermal-load & energy-efficiency study",
    "category": "Engineering Studies",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Design Studio"
    ]
  },
  {
    "id": 122,
    "name": "Daylighting study",
    "category": "Engineering Studies",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Design Studio",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 123,
    "name": "Acoustic & noise study",
    "category": "Engineering Studies",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Design Studio",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 124,
    "name": "Environmental impact assessment (EIA)",
    "category": "Engineering Studies",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 125,
    "name": "Hydrology & flood-mitigation study",
    "category": "Engineering Studies",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 126,
    "name": "Stormwater drainage study",
    "category": "Engineering Studies",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 127,
    "name": "Traffic impact study",
    "category": "Engineering Studies",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 128,
    "name": "Vertical-transport (elevator) study",
    "category": "Engineering Studies",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 129,
    "name": "Construction-waste management study",
    "category": "Engineering Studies",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 130,
    "name": "Cost & budget estimation study",
    "category": "Engineering Studies",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Design to Permit",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 131,
    "name": "Risk assessment study",
    "category": "Engineering Studies",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 132,
    "name": "Sustainability & green-building study",
    "category": "Engineering Studies",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Design Studio",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 133,
    "name": "Corrosion-protection study",
    "category": "Engineering Studies",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 134,
    "name": "Wind-load study",
    "category": "Engineering Studies",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 135,
    "name": "Facility management (FM)",
    "category": "Operations, Maintenance & Facility Management",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 136,
    "name": "Preventive maintenance planning",
    "category": "Operations, Maintenance & Facility Management",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 137,
    "name": "MEP operations & maintenance",
    "category": "Operations, Maintenance & Facility Management",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 138,
    "name": "Building performance optimization",
    "category": "Operations, Maintenance & Facility Management",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 139,
    "name": "Energy & water consumption management",
    "category": "Operations, Maintenance & Facility Management",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 140,
    "name": "Engineering arbitration",
    "category": "Advisory & Engineering Arbitration",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 141,
    "name": "Expert witness / court testimony",
    "category": "Advisory & Engineering Arbitration",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 142,
    "name": "Independent design review (peer review)",
    "category": "Advisory & Engineering Arbitration",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 143,
    "name": "Engineering contract drafting & review",
    "category": "Advisory & Engineering Arbitration",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 144,
    "name": "Construction claims & variations management",
    "category": "Advisory & Engineering Arbitration",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Build My Villa",
      "Standalone / Add-on"
    ]
  },
  {
    "id": 145,
    "name": "General technical advisory",
    "category": "Advisory & Engineering Arbitration",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 146,
    "name": "Second technical opinion",
    "category": "Advisory & Engineering Arbitration",
    "provider": "Office + individual engineer",
    "provider_type": "office_or_individual",
    "packages": [
      "Standalone / Add-on"
    ]
  },
  {
    "id": 147,
    "name": "Property valuation",
    "category": "Advisory & Engineering Arbitration",
    "provider": "Specialized office",
    "provider_type": "specialized_office",
    "packages": [
      "Standalone / Add-on"
    ]
  }
];
