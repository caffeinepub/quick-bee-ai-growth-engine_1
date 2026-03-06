/**
 * localStorage-backed store utilities for leads and services.
 * Used as the primary persistence layer since the app bypasses authentication.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StoredLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "new" | "contacted" | "qualified" | "proposal_sent" | "closed_won";
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface StoredPackage {
  name: string;
  price: number;
  features: string[];
}

export interface StoredAddon {
  name: string;
  price: number;
}

export interface StoredService {
  id: string;
  title: string;
  description: string;
  category: string;
  packages: StoredPackage[];
  addons: StoredAddon[];
  imageUrl?: string;
  isVisible: boolean;
  isActive: boolean;
  sortOrder: number;
}

// ─── Keys ─────────────────────────────────────────────────────────────────────

const LEADS_KEY = "qb_leads_v1";
const SERVICES_KEY = "qb_services_v2";
const SERVICES_INITIALIZED_KEY = "qb_services_initialized_v2";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

let _idCounter = 0;
function genId(): string {
  _idCounter += 1;
  return `${Date.now()}${_idCounter.toString().padStart(4, "0")}`;
}

// ─── Lead Store ───────────────────────────────────────────────────────────────

export const leadStore = {
  getAll(): StoredLead[] {
    return readJSON<StoredLead[]>(LEADS_KEY, []);
  },

  getById(id: string): StoredLead | undefined {
    return this.getAll().find((l) => l.id === id);
  },

  create(data: Omit<StoredLead, "id" | "createdAt" | "updatedAt">): StoredLead {
    const leads = this.getAll();
    const id = genId();
    const now = Number.parseInt(id, 10);
    const lead: StoredLead = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    leads.push(lead);
    writeJSON(LEADS_KEY, leads);
    return lead;
  },

  update(
    id: string,
    data: Partial<Omit<StoredLead, "id" | "createdAt">>,
  ): StoredLead | null {
    const leads = this.getAll();
    const idx = leads.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    const updated = { ...leads[idx], ...data, updatedAt: Date.now() };
    leads[idx] = updated;
    writeJSON(LEADS_KEY, leads);
    return updated;
  },

  delete(id: string): boolean {
    const leads = this.getAll();
    const next = leads.filter((l) => l.id !== id);
    if (next.length === leads.length) return false;
    writeJSON(LEADS_KEY, next);
    return true;
  },

  importBulk(
    items: Omit<StoredLead, "id" | "createdAt" | "updatedAt">[],
  ): string[] {
    const leads = this.getAll();
    const ids: string[] = [];
    for (const item of items) {
      const id = genId();
      const ts = Number.parseInt(id, 10);
      leads.push({ ...item, id, createdAt: ts, updatedAt: ts });
      ids.push(id);
    }
    writeJSON(LEADS_KEY, leads);
    return ids;
  },
};

// ─── Service Store ────────────────────────────────────────────────────────────

export const serviceStore = {
  isInitialized(): boolean {
    return localStorage.getItem(SERVICES_INITIALIZED_KEY) === "true";
  },

  markInitialized(): void {
    localStorage.setItem(SERVICES_INITIALIZED_KEY, "true");
  },

  getAll(): StoredService[] {
    return readJSON<StoredService[]>(SERVICES_KEY, []);
  },

  save(services: StoredService[]): void {
    writeJSON(SERVICES_KEY, services);
  },

  create(data: Omit<StoredService, "id" | "sortOrder">): StoredService {
    const services = this.getAll();
    const service: StoredService = {
      ...data,
      id: `custom-${genId()}`,
      sortOrder: services.length,
    };
    services.push(service);
    this.save(services);
    return service;
  },

  update(
    id: string,
    data: Partial<Omit<StoredService, "id">>,
  ): StoredService | null {
    const services = this.getAll();
    const idx = services.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    const updated = { ...services[idx], ...data };
    services[idx] = updated;
    this.save(services);
    return updated;
  },

  delete(id: string): boolean {
    const services = this.getAll();
    const next = services.filter((s) => s.id !== id);
    if (next.length === services.length) return false;
    this.save(next);
    return true;
  },

  duplicate(id: string): StoredService | null {
    const services = this.getAll();
    const original = services.find((s) => s.id === id);
    if (!original) return null;
    const copy: StoredService = {
      ...original,
      id: `custom-${genId()}`,
      title: `${original.title} (Copy)`,
      sortOrder: services.length,
    };
    services.push(copy);
    this.save(services);
    return copy;
  },

  setVisibility(id: string, isVisible: boolean): boolean {
    return !!this.update(id, { isVisible });
  },

  reorder(orderedIds: string[]): void {
    const services = this.getAll();
    const map = new Map(services.map((s) => [s.id, s]));
    const reordered: StoredService[] = [];
    for (const [idx, id] of orderedIds.entries()) {
      const s = map.get(id);
      if (s) reordered.push({ ...s, sortOrder: idx });
    }
    // Append any services not in orderedIds
    for (const s of services) {
      if (!orderedIds.includes(s.id)) {
        reordered.push({ ...s, sortOrder: reordered.length });
      }
    }
    this.save(reordered);
  },
};
