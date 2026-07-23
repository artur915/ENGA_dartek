/**
 * ENGA design system — accent tokens for categories, packages, workflow stages, and roles.
 * Use these helpers instead of hardcoding colors in components.
 */

export type AccentToken =
  | "blue"
  | "teal"
  | "green"
  | "orange"
  | "purple"
  | "yellow"
  | "sky"
  | "indigo"
  | "amber"
  | "rose"
  | "emerald";

export interface AccentStyle {
  /** Soft tinted background */
  bg: string;
  /** Icon / emphasis background */
  iconBg: string;
  /** Primary text on light surfaces */
  text: string;
  /** Border tint */
  border: string;
  /** Hover border */
  hoverBorder: string;
  /** Badge / pill on white */
  badge: string;
}

const accentStyles: Record<AccentToken, AccentStyle> = {
  blue: {
    bg: "bg-accent-blue/8",
    iconBg: "bg-accent-blue/12 text-accent-blue",
    text: "text-accent-blue",
    border: "border-accent-blue/20",
    hoverBorder: "hover:border-accent-blue/35",
    badge: "bg-accent-blue/10 text-accent-blue ring-accent-blue/15",
  },
  teal: {
    bg: "bg-accent-teal/8",
    iconBg: "bg-accent-teal/12 text-accent-teal",
    text: "text-accent-teal",
    border: "border-accent-teal/20",
    hoverBorder: "hover:border-accent-teal/35",
    badge: "bg-accent-teal/10 text-accent-teal ring-accent-teal/15",
  },
  green: {
    bg: "bg-accent-green/8",
    iconBg: "bg-accent-green/12 text-accent-green",
    text: "text-accent-green",
    border: "border-accent-green/20",
    hoverBorder: "hover:border-accent-green/35",
    badge: "bg-accent-green/10 text-accent-green ring-accent-green/15",
  },
  orange: {
    bg: "bg-accent-orange/8",
    iconBg: "bg-accent-orange/12 text-accent-orange",
    text: "text-accent-orange",
    border: "border-accent-orange/20",
    hoverBorder: "hover:border-accent-orange/35",
    badge: "bg-accent-orange/10 text-accent-orange ring-accent-orange/15",
  },
  purple: {
    bg: "bg-accent-purple/8",
    iconBg: "bg-accent-purple/12 text-accent-purple",
    text: "text-accent-purple",
    border: "border-accent-purple/20",
    hoverBorder: "hover:border-accent-purple/35",
    badge: "bg-accent-purple/10 text-accent-purple ring-accent-purple/15",
  },
  yellow: {
    bg: "bg-accent-yellow/10",
    iconBg: "bg-accent-yellow/15 text-accent-yellow",
    text: "text-accent-yellow",
    border: "border-accent-yellow/25",
    hoverBorder: "hover:border-accent-yellow/40",
    badge: "bg-accent-yellow/12 text-accent-yellow ring-accent-yellow/20",
  },
  sky: {
    bg: "bg-accent-sky/8",
    iconBg: "bg-accent-sky/12 text-accent-sky",
    text: "text-accent-sky",
    border: "border-accent-sky/20",
    hoverBorder: "hover:border-accent-sky/35",
    badge: "bg-accent-sky/10 text-accent-sky ring-accent-sky/15",
  },
  indigo: {
    bg: "bg-accent-indigo/8",
    iconBg: "bg-accent-indigo/12 text-accent-indigo",
    text: "text-accent-indigo",
    border: "border-accent-indigo/20",
    hoverBorder: "hover:border-accent-indigo/35",
    badge: "bg-accent-indigo/10 text-accent-indigo ring-accent-indigo/15",
  },
  amber: {
    bg: "bg-accent-amber/8",
    iconBg: "bg-accent-amber/12 text-accent-amber",
    text: "text-accent-amber",
    border: "border-accent-amber/20",
    hoverBorder: "hover:border-accent-amber/35",
    badge: "bg-accent-amber/10 text-accent-amber ring-accent-amber/15",
  },
  rose: {
    bg: "bg-accent-rose/8",
    iconBg: "bg-accent-rose/12 text-accent-rose",
    text: "text-accent-rose",
    border: "border-accent-rose/20",
    hoverBorder: "hover:border-accent-rose/35",
    badge: "bg-accent-rose/10 text-accent-rose ring-accent-rose/15",
  },
  emerald: {
    bg: "bg-accent-emerald/8",
    iconBg: "bg-accent-emerald/12 text-accent-emerald",
    text: "text-accent-emerald",
    border: "border-accent-emerald/20",
    hoverBorder: "hover:border-accent-emerald/35",
    badge: "bg-accent-emerald/10 text-accent-emerald ring-accent-emerald/15",
  },
};

/** Consistent category → accent mapping (English catalog names) */
export const CATEGORY_ACCENT: Record<string, AccentToken> = {
  Design: "blue",
  "Permits & Licensing": "purple",
  "Surveying & Land": "teal",
  "Supervision & Project Management": "orange",
  "Inspections & Technical Reports": "green",
  "MEP & Specialized Systems": "sky",
  "Engineering Studies": "indigo",
  "Insurance & Compliance": "amber",
  "Operations, Maintenance & Facility Management": "emerald",
  "Advisory & Engineering Arbitration": "rose",
};

/** Service package slugs → accent */
export const PACKAGE_ACCENT: Record<string, AccentToken> = {
  "build-my-villa": "blue",
  "design-to-permit": "teal",
  "fast-permit": "purple",
  "renovate-&-expand": "orange",
  "legalize-my-building": "amber",
  "design-studio": "indigo",
};

/** Workflow stage keys → accent */
export const WORKFLOW_STAGE_ACCENT: Record<string, AccentToken> = {
  submit: "blue",
  compare: "teal",
  execute: "orange",
  complete: "green",
};

/** Quotation status → semantic accent */
export const QUOTATION_STATUS_ACCENT: Record<string, AccentToken | "muted"> = {
  draft: "sky",
  submitted: "blue",
  revised: "purple",
  accepted: "green",
  expired: "amber",
  withdrawn: "rose",
};

/** Payment status → semantic */
export const PAYMENT_STATUS_ACCENT: Record<string, AccentToken> = {
  pending: "amber",
  processing: "blue",
  confirmed: "green",
  failed: "rose",
};

/** Project traffic-light statuses */
export const PROJECT_STATUS_STYLE = {
  on_track: { variant: "success" as const, accent: "green" as AccentToken },
  attention: { variant: "warning" as const, accent: "amber" as AccentToken },
  delayed: { variant: "danger" as const, accent: "rose" as AccentToken },
};

export function getAccentStyle(token: AccentToken): AccentStyle {
  return accentStyles[token];
}

export function getCategoryAccent(categoryName: string): AccentStyle {
  const token = CATEGORY_ACCENT[categoryName] ?? "blue";
  return accentStyles[token];
}

export function getPackageAccent(slug: string): AccentStyle {
  const token = PACKAGE_ACCENT[slug] ?? "blue";
  return accentStyles[token];
}

export function getWorkflowStageAccent(stageKey: string): AccentStyle {
  const token = WORKFLOW_STAGE_ACCENT[stageKey] ?? "blue";
  return accentStyles[token];
}

/** Card shell classes for tinted category/package cards */
export function accentCardClasses(token: AccentToken): string {
  const s = accentStyles[token];
  return `${s.bg} ${s.border} ${s.hoverBorder}`;
}
