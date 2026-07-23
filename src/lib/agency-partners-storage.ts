import { DEFAULT_PARTNERS_STATE, type PartnersState } from "@/lib/agency-partners";

const STORAGE_KEY = "enga-agency-partners";

export function loadPartnersState(): PartnersState {
  if (typeof window === "undefined") return DEFAULT_PARTNERS_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PARTNERS_STATE;
    return JSON.parse(raw) as PartnersState;
  } catch {
    return DEFAULT_PARTNERS_STATE;
  }
}

export function savePartnersState(state: PartnersState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
