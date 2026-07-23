export type PartnerType = "office" | "individual";

export type PartnerStatus = "available" | "engaged";

export type PartnershipRequest = {
  id: string;
  name: string;
  type: PartnerType;
  specialty: string;
  location?: string;
  email?: string;
  phone?: string;
  receivedAt: string;
};

export type AssignedProject = {
  id: string;
  title: string;
};

export type AgencyPartner = {
  id: string;
  name: string;
  type: PartnerType;
  specialty: string;
  phone?: string;
  email?: string;
  hourlyRate?: number;
  status: PartnerStatus;
  assignedProjects: AssignedProject[];
};

export type ProjectOption = {
  id: string;
  title: string;
};

export type PartnersState = {
  requests: PartnershipRequest[];
  partners: AgencyPartner[];
};

export const DEFAULT_PARTNERS_STATE: PartnersState = {
  requests: [
    {
      id: "req-jeddah",
      name: "Jeddah Innovations",
      type: "office",
      specialty: "Sustainable design · MEP systems",
      location: "Jeddah, Saudi Arabia",
      email: "partnerships@jeddahinnovations.sa",
      receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "req-spm",
      name: "Saudi Project Management",
      type: "office",
      specialty: "Structural Design",
      phone: "+966 11 555 2480",
      receivedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  partners: [
    {
      id: "partner-horizon",
      name: "Horizon Engineering Office",
      type: "office",
      specialty: "Structural Design",
      phone: "+966 11 555 2480",
      hourlyRate: 450,
      status: "engaged",
      assignedProjects: [{ id: "demo-residential", title: "Residential Compound Design" }],
    },
    {
      id: "partner-laila",
      name: "Eng. Laila Al Harbi",
      type: "individual",
      specialty: "BIM Specialist",
      phone: "+966 55 123 4567",
      hourlyRate: 300,
      status: "available",
      assignedProjects: [],
    },
  ],
};

export function partnerStatusFromAssignments(assignedProjects: AssignedProject[]): PartnerStatus {
  return assignedProjects.length > 0 ? "engaged" : "available";
}

export function requestToPartner(request: PartnershipRequest): AgencyPartner {
  return {
    id: `partner-${request.id}`,
    name: request.name,
    type: request.type,
    specialty: request.specialty,
    phone: request.phone,
    email: request.email,
    status: "available",
    assignedProjects: [],
  };
}
