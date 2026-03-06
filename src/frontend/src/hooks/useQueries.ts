import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AdCampaign,
  AdPlatform,
  EmailCampaign,
  LandingPage,
  LandingPageStatus,
  PostStatus,
  PublicLead,
  PublicLeadStatus,
  PublicService,
  SEOEntry,
  SocialMediaMetrics,
  SocialMediaPlatform,
  SocialMediaPost,
  Variant_active_sent_draft,
} from "../backend";
import { seedServices } from "../data/seedServices";
import {
  type StoredLead,
  type StoredService,
  leadStore,
  serviceStore,
} from "../utils/localStore";
import { useActor } from "./useActor";

// ─── Re-export Lead type (mapped from StoredLead) ──────────────────────────────

export interface Lead {
  id: bigint;
  name: string;
  email: string;
  phone: string;
  status: string;
  notes: string;
  createdAt: bigint;
  updatedAt: bigint;
}

export enum LeadStatus {
  new = "new",
  contacted = "contacted",
  qualified = "qualified",
  proposal_sent = "proposal_sent",
  closed_won = "closed_won",
}

// ─── Status mapping helpers ────────────────────────────────────────────────────

// Map local LeadStatus string → PublicLeadStatus enum for backend calls
function toPublicLeadStatus(status: string): PublicLeadStatus {
  // Import the enum value at runtime from the backend module.
  // Since we can't import enum values from backend.d.ts (it's a .d.ts),
  // we construct the variant objects matching what the Motoko candid expects.
  const map: Record<string, PublicLeadStatus> = {
    new: "new" as unknown as PublicLeadStatus,
    contacted: "contacted" as unknown as PublicLeadStatus,
    qualified: "qualified" as unknown as PublicLeadStatus,
    proposal_sent: "proposal_sent" as unknown as PublicLeadStatus,
    closed_won: "closed_won" as unknown as PublicLeadStatus,
  };
  return map[status] ?? ("new" as unknown as PublicLeadStatus);
}

// Map PublicLead from backend → local Lead interface
function publicLeadToLead(p: PublicLead): Lead {
  // PublicLeadStatus.new_ has value "new" — read the raw string value
  const rawStatus = p.status as unknown as string;
  return {
    id: p.id,
    name: p.name,
    email: p.email,
    phone: p.phone,
    status: rawStatus === "new_" ? "new" : rawStatus,
    notes: p.notes,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

function storedToLead(s: StoredLead): Lead {
  // id is a numeric string (timestamp+counter), use createdAt as the bigint id for stable matching
  return {
    id: BigInt(s.createdAt),
    name: s.name,
    email: s.email,
    phone: s.phone,
    status: s.status,
    notes: s.notes,
    createdAt: BigInt(s.createdAt),
    updatedAt: BigInt(s.updatedAt),
  };
}

function findStoredLeadById(id: bigint): StoredLead | undefined {
  const all = leadStore.getAll();
  return all.find((l) => BigInt(l.createdAt) === id);
}

// ─── Service types ─────────────────────────────────────────────────────────────

export interface Package {
  name: string;
  price: bigint;
  features: string[];
}

export interface Addon {
  name: string;
  price: bigint;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  packages: Package[];
  addons: Addon[];
  imageUrl?: string;
  isVisible: boolean;
}

// Initialize service store from seedServices if not already done
function ensureServicesInitialized(): void {
  if (!serviceStore.isInitialized()) {
    const seedMapped: StoredService[] = seedServices.map((s, idx) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      category: s.category,
      packages: (s.packages ?? []).map((p) => ({
        name: p.name,
        price: typeof p.price === "number" ? p.price : Number(p.price),
        features: p.features ?? [],
      })),
      addons: (s.addons ?? []).map((a) => ({
        name: a.name,
        price: typeof a.price === "number" ? a.price : Number(a.price),
      })),
      imageUrl: undefined,
      isVisible: s.isVisible,
      isActive: s.isActive,
      sortOrder: idx,
    }));
    serviceStore.save(seedMapped);
    serviceStore.markInitialized();
  }
}

function storedToService(s: StoredService): Service {
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    category: s.category,
    packages: s.packages.map((p) => ({
      name: p.name,
      price: BigInt(Math.round(p.price)),
      features: p.features,
    })),
    addons: s.addons.map((a) => ({
      name: a.name,
      price: BigInt(Math.round(a.price)),
    })),
    imageUrl: s.imageUrl,
    isVisible: s.isVisible,
  };
}

// Map PublicService from backend → local Service interface
function publicServiceToService(p: PublicService): Service {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    packages: p.packages.map((pkg) => ({
      name: pkg.name,
      price: pkg.price,
      features: pkg.features,
    })),
    addons: p.addons.map((a) => ({
      name: a.name,
      price: a.price,
    })),
    imageUrl: p.imageUrl || undefined,
    isVisible: p.isVisible,
  };
}

const BACKEND_SERVICES_SEEDED_KEY = "qb_services_seeded_to_backend";

// Seed backend with localStorage services if not already seeded
async function seedBackendServicesIfNeeded(actor: {
  publicSeedServices: (items: PublicService[]) => Promise<bigint>;
}): Promise<void> {
  if (localStorage.getItem(BACKEND_SERVICES_SEEDED_KEY)) return;
  ensureServicesInitialized();
  const stored = serviceStore
    .getAll()
    .sort((a, b) => a.sortOrder - b.sortOrder);
  if (stored.length === 0) return;
  const items: PublicService[] = stored.map((s, idx) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    category: s.category,
    packages: s.packages.map((p) => ({
      name: p.name,
      price: BigInt(Math.round(p.price)),
      features: p.features,
    })),
    addons: s.addons.map((a) => ({
      name: a.name,
      price: BigInt(Math.round(a.price)),
    })),
    imageUrl: s.imageUrl ?? "",
    isVisible: s.isVisible,
    sortOrder: BigInt(s.sortOrder ?? idx),
  }));
  try {
    await actor.publicSeedServices(items);
    localStorage.setItem(BACKEND_SERVICES_SEEDED_KEY, "1");
  } catch {
    // Silently ignore seed errors
  }
}

// ─── Leads (backend — public endpoints, no auth required) ─────────────────────

export function useGetAllLeads() {
  const { actor } = useActor();
  return useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: async () => {
      // Fallback to localStorage while actor loads
      if (!actor) {
        return leadStore.getAll().map(storedToLead);
      }
      try {
        const results = await actor.publicGetAllLeads();
        return results.map(publicLeadToLead);
      } catch {
        // Fallback on error
        return leadStore.getAll().map(storedToLead);
      }
    },
    staleTime: 0,
    refetchInterval: 15000,
  });
}

export const useLeads = useGetAllLeads;

export function useCreateLead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      status: LeadStatus | string;
      notes: string;
    }) => {
      if (!actor) {
        // Fallback to localStorage
        const stored = leadStore.create({
          name: data.name,
          email: data.email,
          phone: data.phone,
          status: (data.status as StoredLead["status"]) || "open",
          notes: data.notes,
        });
        return storedToLead(stored);
      }
      const publicStatus = toPublicLeadStatus(data.status as string);
      const result = await actor.publicCreateLead(
        data.name,
        data.email,
        data.phone,
        publicStatus,
        data.notes,
      );
      return publicLeadToLead(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useUpdateLead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      email: string;
      phone: string;
      status: LeadStatus | string;
      notes: string;
    }) => {
      if (!actor) {
        // Fallback to localStorage
        const found = findStoredLeadById(data.id);
        if (!found) throw new Error("Lead not found");
        const updated = leadStore.update(found.id, {
          name: data.name,
          email: data.email,
          phone: data.phone,
          status: (data.status as StoredLead["status"]) || "open",
          notes: data.notes,
        });
        if (!updated) throw new Error("Lead not found");
        return storedToLead(updated);
      }
      const publicStatus = toPublicLeadStatus(data.status as string);
      const result = await actor.publicUpdateLead(
        data.id,
        data.name,
        data.email,
        data.phone,
        publicStatus,
        data.notes,
      );
      return publicLeadToLead(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useDeleteLead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) {
        // Fallback to localStorage
        const found = findStoredLeadById(id);
        if (!found) throw new Error("Lead not found");
        leadStore.delete(found.id);
        return;
      }
      await actor.publicDeleteLead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useImportLeads() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      importedLeads: Array<{
        name: string;
        email: string;
        phone: string;
        status: LeadStatus | string;
        notes: string;
      }>,
    ) => {
      if (!actor) {
        // Fallback to localStorage
        const ids = leadStore.importBulk(
          importedLeads.map((l) => ({
            name: l.name,
            email: l.email,
            phone: l.phone,
            status: (l.status as StoredLead["status"]) || "open",
            notes: l.notes,
          })),
        );
        return ids.map((_id) => BigInt(0));
      }
      const items = importedLeads.map((l) => ({
        name: l.name,
        email: l.email,
        phone: l.phone,
        status: toPublicLeadStatus(l.status as string),
        notes: l.notes,
      }));
      return actor.publicImportLeads(items);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

// ─── Services (backend — public endpoints, no auth required) ──────────────────

export function useServices() {
  const { actor, isFetching } = useActor();
  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async (): Promise<Service[]> => {
      if (!actor) {
        // Fallback to localStorage while actor loads
        ensureServicesInitialized();
        return serviceStore
          .getAll()
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map(storedToService);
      }
      try {
        let results = await actor.publicGetAllServices();
        // If backend is empty, seed from localStorage once
        if (results.length === 0) {
          await seedBackendServicesIfNeeded(actor);
          results = await actor.publicGetAllServices();
        }
        if (results.length === 0) {
          // Still empty — fallback to localStorage
          ensureServicesInitialized();
          return serviceStore
            .getAll()
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map(storedToService);
        }
        return results
          .slice()
          .sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder))
          .map(publicServiceToService);
      } catch {
        // Fallback on error
        ensureServicesInitialized();
        return serviceStore
          .getAll()
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map(storedToService);
      }
    },
    staleTime: 0,
    refetchInterval: 15000,
    enabled: !isFetching,
  });
}

export function useSetServiceVisibility() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      isVisible,
    }: { title: string; isVisible: boolean }) => {
      if (!actor) {
        ensureServicesInitialized();
        const all = serviceStore.getAll();
        const service = all.find((s) => s.title === title);
        if (!service) throw new Error(`Service not found: ${title}`);
        serviceStore.setVisibility(service.id, isVisible);
        return;
      }
      // Find service by title from backend
      const allServices = await actor.publicGetAllServices();
      const found = allServices.find((s) => s.title === title);
      if (!found) throw new Error(`Service not found: ${title}`);
      await actor.publicSetServiceVisibility(found.id, isVisible);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useSetServiceVisibilityById() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      isVisible,
    }: { id: string; isVisible: boolean }) => {
      if (!actor) {
        ensureServicesInitialized();
        serviceStore.setVisibility(id, isVisible);
        return;
      }
      await actor.publicSetServiceVisibility(id, isVisible);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useCreateService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (service: Omit<Service, "id">) => {
      if (!actor) {
        ensureServicesInitialized();
        const stored = serviceStore.create({
          title: service.title,
          description: service.description,
          category: service.category,
          packages: service.packages.map((p) => ({
            name: p.name,
            price: Number(p.price),
            features: p.features,
          })),
          addons: service.addons.map((a) => ({
            name: a.name,
            price: Number(a.price),
          })),
          imageUrl: service.imageUrl,
          isVisible: service.isVisible,
          isActive: true,
        });
        return storedToService(stored);
      }
      const newId = `custom-${Date.now()}`;
      const result = await actor.publicCreateService(
        newId,
        service.title,
        service.category,
        service.description,
        service.packages.map((p) => ({
          name: p.name,
          price: p.price,
          features: p.features,
        })),
        service.addons.map((a) => ({
          name: a.name,
          price: a.price,
        })),
        service.imageUrl ?? "",
        service.isVisible,
        BigInt(Date.now()),
      );
      return publicServiceToService(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useUpdateService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (service: Service) => {
      if (!actor) {
        ensureServicesInitialized();
        const updated = serviceStore.update(service.id, {
          title: service.title,
          description: service.description,
          category: service.category,
          packages: service.packages.map((p) => ({
            name: p.name,
            price: Number(p.price),
            features: p.features,
          })),
          addons: service.addons.map((a) => ({
            name: a.name,
            price: Number(a.price),
          })),
          imageUrl: service.imageUrl,
          isVisible: service.isVisible,
        });
        if (!updated) throw new Error("Service not found");
        return storedToService(updated);
      }
      const result = await actor.publicUpdateService(
        service.id,
        service.title,
        service.category,
        service.description,
        service.packages.map((p) => ({
          name: p.name,
          price: p.price,
          features: p.features,
        })),
        service.addons.map((a) => ({
          name: a.name,
          price: a.price,
        })),
        service.imageUrl ?? "",
        service.isVisible,
        BigInt(Date.now()),
      );
      return publicServiceToService(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useDeleteService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) {
        ensureServicesInitialized();
        const ok = serviceStore.delete(id);
        if (!ok) throw new Error("Service not found");
        return;
      }
      await actor.publicDeleteService(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useDuplicateService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) {
        ensureServicesInitialized();
        const copy = serviceStore.duplicate(id);
        if (!copy) throw new Error("Service not found");
        return storedToService(copy);
      }
      const allServices = await actor.publicGetAllServices();
      const original = allServices.find((s) => s.id === id);
      if (!original) throw new Error("Service not found");
      const newId = `custom-${Date.now()}`;
      const result = await actor.publicCreateService(
        newId,
        `${original.title} (Copy)`,
        original.category,
        original.description,
        original.packages,
        original.addons,
        original.imageUrl,
        original.isVisible,
        BigInt(Date.now()),
      );
      return publicServiceToService(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useReorderServices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (serviceIds: string[]) => {
      ensureServicesInitialized();
      serviceStore.reorder(serviceIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

// ─── Export Data ──────────────────────────────────────────────────────────────

export function useExportData() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["exportData"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.exportData();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Social Media Posts ───────────────────────────────────────────────────────

export function useGetAllPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<SocialMediaPost[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllPosts();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      caption: string;
      platform: SocialMediaPlatform;
      status: PostStatus;
      scheduledDate: bigint | null;
      tags: string[];
      notes: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createPost(
        data.title,
        data.caption,
        data.platform,
        data.status,
        data.scheduledDate,
        data.tags,
        data.notes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      caption: string;
      platform: SocialMediaPlatform;
      status: PostStatus;
      scheduledDate: bigint | null;
      tags: string[];
      notes: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updatePost(
        data.id,
        data.title,
        data.caption,
        data.platform,
        data.status,
        data.scheduledDate,
        data.tags,
        data.notes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deletePost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

// ─── Social Media Metrics ─────────────────────────────────────────────────────

export function useGetAllMetrics() {
  const { actor, isFetching } = useActor();
  return useQuery<SocialMediaMetrics[]>({
    queryKey: ["metrics"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllMetrics();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateMetrics() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      platform: SocialMediaPlatform;
      date: bigint;
      followers: bigint;
      impressions: bigint;
      reach: bigint;
      engagements: bigint;
      clicks: bigint;
      postsPublished: bigint;
      notes: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createMetrics(
        data.platform,
        data.date,
        data.followers,
        data.impressions,
        data.reach,
        data.engagements,
        data.clicks,
        data.postsPublished,
        data.notes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}

export function useUpdateMetrics() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      platform: SocialMediaPlatform;
      date: bigint;
      followers: bigint;
      impressions: bigint;
      reach: bigint;
      engagements: bigint;
      clicks: bigint;
      postsPublished: bigint;
      notes: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateMetrics(
        data.id,
        data.platform,
        data.date,
        data.followers,
        data.impressions,
        data.reach,
        data.engagements,
        data.clicks,
        data.postsPublished,
        data.notes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}

export function useDeleteMetrics() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteMetrics(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}

// ─── External Webhooks ────────────────────────────────────────────────────────

export function useGetExternalWebhookLogs() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["webhookLogs"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getExternalWebhookLogs();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export const useGetWebhookLogs = useGetExternalWebhookLogs;

export function useClearExternalWebhookLogs() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      try {
        return await actor.clearExternalWebhookLogs();
      } catch {
        // ignore auth errors
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhookLogs"] });
    },
  });
}

export const useClearWebhookLogs = useClearExternalWebhookLogs;

// ─── Ad Campaigns ─────────────────────────────────────────────────────────────

export function useGetAllAdCampaigns() {
  const { actor, isFetching } = useActor();
  return useQuery<AdCampaign[]>({
    queryKey: ["adCampaigns"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllAdCampaigns();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export const useAdCampaigns = useGetAllAdCampaigns;

export function useCreateAdCampaign() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      campaignName: string;
      platform: AdPlatform;
      budget: number;
      spend: number;
      impressions: bigint;
      clicks: bigint;
      conversions: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createAdCampaign(
        data.campaignName,
        data.platform,
        data.budget,
        data.spend,
        data.impressions,
        data.clicks,
        data.conversions,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adCampaigns"] });
    },
  });
}

export function useUpdateAdCampaign() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      campaignName: string;
      platform: AdPlatform;
      budget: number;
      spend: number;
      impressions: bigint;
      clicks: bigint;
      conversions: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateAdCampaign(
        data.id,
        data.campaignName,
        data.platform,
        data.budget,
        data.spend,
        data.impressions,
        data.clicks,
        data.conversions,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adCampaigns"] });
    },
  });
}

export function useDeleteAdCampaign() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteAdCampaign(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adCampaigns"] });
    },
  });
}

// ─── Email Campaigns ──────────────────────────────────────────────────────────

export function useGetAllEmailCampaigns() {
  const { actor, isFetching } = useActor();
  return useQuery<EmailCampaign[]>({
    queryKey: ["emailCampaigns"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllEmailCampaigns();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export const useEmailCampaigns = useGetAllEmailCampaigns;

export function useCreateEmailCampaign() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      campaignName: string;
      subjectLine: string;
      bodyContent: string;
      targetAudience: string;
      status: Variant_active_sent_draft;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createEmailCampaign(
        data.campaignName,
        data.subjectLine,
        data.bodyContent,
        data.targetAudience,
        data.status,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailCampaigns"] });
    },
  });
}

export function useUpdateEmailCampaign() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      campaignName: string;
      subjectLine: string;
      bodyContent: string;
      targetAudience: string;
      status: Variant_active_sent_draft;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateEmailCampaign(
        data.id,
        data.campaignName,
        data.subjectLine,
        data.bodyContent,
        data.targetAudience,
        data.status,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailCampaigns"] });
    },
  });
}

export function useDeleteEmailCampaign() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteEmailCampaign(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailCampaigns"] });
    },
  });
}

// ─── Landing Pages ────────────────────────────────────────────────────────────

export function useGetAllLandingPages() {
  const { actor, isFetching } = useActor();
  return useQuery<LandingPage[]>({
    queryKey: ["landingPages"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllLandingPages();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export const useLandingPages = useGetAllLandingPages;

export function useCreateLandingPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      url: string;
      associatedCampaign: string;
      conversionGoal: string;
      status: LandingPageStatus;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createLandingPage(
        data.name,
        data.url,
        data.associatedCampaign,
        data.conversionGoal,
        data.status,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landingPages"] });
    },
  });
}

export function useUpdateLandingPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      url: string;
      associatedCampaign: string;
      conversionGoal: string;
      status: LandingPageStatus;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateLandingPage(
        data.id,
        data.name,
        data.url,
        data.associatedCampaign,
        data.conversionGoal,
        data.status,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landingPages"] });
    },
  });
}

export function useDeleteLandingPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteLandingPage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landingPages"] });
    },
  });
}

// ─── SEO Entries ──────────────────────────────────────────────────────────────

export function useGetAllSEOEntries() {
  const { actor, isFetching } = useActor();
  return useQuery<SEOEntry[]>({
    queryKey: ["seoEntries"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllSEOEntries();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSEOEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      pageUrl: string;
      targetKeywords: string[];
      metaTitle: string;
      metaDescription: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createSEOEntry(
        data.pageUrl,
        data.targetKeywords,
        data.metaTitle,
        data.metaDescription,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seoEntries"] });
    },
  });
}

export function useUpdateSEOEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      pageUrl: string;
      targetKeywords: string[];
      metaTitle: string;
      metaDescription: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateSEOEntry(
        data.id,
        data.pageUrl,
        data.targetKeywords,
        data.metaTitle,
        data.metaDescription,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seoEntries"] });
    },
  });
}

export function useDeleteSEOEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteSEOEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seoEntries"] });
    },
  });
}
